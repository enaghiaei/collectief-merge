"""The Collectief Interface module handles all the Hub Core tasks which do not involve Sphensor Gateway.
It is responsible to manage MQTT messages published on "collectief" topic and to handle all the entities different from
sphensor ones"""
import subprocess
from datetime import datetime, timedelta, timezone
from json import JSONDecodeError
from logging import getLogger
import sys
from modules.configuration.cfg_abstract import AbstractConfig, ConfigManager
from modules.configuration.collectief import CollectiefConfig
from modules.database.measure import Measure
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity, GenericEntity, ControlEntity, EntityStatus
from modules.hub_core_message import HubCoreMessage, MessageStatus, HubCoreMsgResult
from modules.mqtt.brig_mqtt import MqttClient
from modules.mqtt.payload import HubCoreError, ResponsePayload, Head, HubCoreException, \
    try_getting_uuid_from_malformed_message, RequestPayload
from modules.periodic_task_scheduler import PeriodicTaskScheduler, Task
from modules.registry import Registry
from modules.threadpool.thread_pool_with_list import ThreadPoolWithList, ThreadPoolItem
from modules.mqtt.topic import HubCoreTopic
from modules.diagnostic import Diagnostic
from modules.database.entity_creator import EntityCreator
from traceback import format_exc

class CollectiefItf:
    """This class is an interface handling all the Hub Core tasks which do not involve Sphensor Gateway"""
    mqtt_topic_list = [
        'collectief/%s/+/+/+/req',
        'collectief/any/+/+/+/req'
    ]  # TODO: da cfg

    def __init__(self):
        self._hubcore_pool = ThreadPoolWithList(_remove_criteria)
        self._poll_sched = PeriodicTaskScheduler()
        self._cfg = CollectiefConfig()
        self._mqtt = None
        self._reg = None
        self._diag = None

    def activate(self):
        """Start the polling scheduler and automatically adds all the polling tasks from entity list"""
        self._mqtt = MqttClient.get_instance()
        self._reg = Registry.get_instance()
        self._diag = Diagnostic.get_instance()
        self._hubcore_pool.start()
        self._poll_sched.start()
        self._configure_polling()
        for topic in CollectiefItf.mqtt_topic_list:
            t = topic
            if topic.find("%") > 0:  # Fill topic with hub core serial
                t = topic % self._mqtt.name
            self._mqtt.set_custom_msg_callback(t, self.handle_request)

    def deactivate(self):
        """Stop the polling scheduler"""
        self._poll_sched.stop()

    def handle_request(self, client, userdata, request):
        """This method handles MQTT messages under 'collectief' topic"""
        rsp = ResponsePayload()
        rsp_callback = None
        try:
            topic = HubCoreTopic.create_from_string(request.topic)  # check topic
            try:
                req = RequestPayload.create_from_bytes(request.payload)  # check payload
                rsp.head.uuid = req.head.uuid
                rsp.head.res, rsp.head.message, rsp.res_body, rsp_callback = self.collectief_handler(topic, req)
            except JSONDecodeError as json_err:
                rsp.head.uuid = try_getting_uuid_from_malformed_message(request.payload)
                rsp.head.res = HubCoreError.JSON_MALFORMED
                rsp.head.message = f"reason: {json_err.args[0]}"
            # Response
            if rsp.head.res is not None:
                self.send_answer(topic, rsp, rsp_callback)
        except BaseException as exc:
            getLogger().error(f"Unhandled exception ({type(exc).__name__} - {exc.args[0]})")
            getLogger().error(f"topic: {request.topic}\npayload: {request.payload}")
            # TODO: posso inviare un messaggio di diagnostica generale?

    def send_answer(self, topic: HubCoreTopic, payload: ResponsePayload, on_publish_callback=None):
        """Send answer Hub Core message over MQTT and configure on_publish callback if needed"""
        topic["trig"] = "ans"            
        mid = self._mqtt.publish(topic.convert_to_str(), payload.to_json_dict())
        if on_publish_callback:
            self._mqtt.add_on_publish_callback(mid, on_publish_callback)

    # @measuretime
    def collectief_handler(self, topic: HubCoreTopic, payload):
        """Handle Collectief message classes"""
        response = HubCoreError.SUCCESS
        message = body = callback = None
        try:
            getLogger().debug(f"Received {topic['class']} request ({topic.convert_to_str()})")
            if topic["class"] == "registry":
                body = self.handle_registry_request(payload.action, payload.params)
            elif topic["class"] == "system":
                body, callback = self.handle_system_request(payload.action, topic["entity"], payload.params)
            elif topic["class"] == "diag":
                body = self.handle_diagnostic_request(payload.action, payload.params)
            elif topic["class"] == "config":
                body = self.handle_cfg_request(payload.action, payload.params)
            elif topic["class"] == "cmd":
                response, message, body = self.handle_hubcore_cmd(topic, payload)
            elif topic["class"] == "data":
                message = "NOT IMPLEMENTED"
            else:
                raise HubCoreException(HubCoreError.INV_PARAM, f"Unhandled class: {topic['class']}")
        except HubCoreException as exc:
            response = exc.error_type
            message = exc.msg
            getLogger().warning(f"{exc.error_type}: {exc.msg}")
        except BaseException as exc:
            response = HubCoreError.GENERIC_ERROR
            message = f"{type(exc).__name__}: {exc.args[0]}"
            getLogger().error(message)
            getLogger().error("Extended Exception reason: \n" + format_exc())
        return response, message, body, callback

    def handle_registry_request(self, action, parameters):
        """Handle Hub Core Registry messages"""
        resp_body, entities, alerts = self._reg.msg_handler(action, parameters)
        if alerts.get("added") or alerts.get("updated"):
            ent_tuples = [(ent.field_id, ent.driver) for ent in entities]
            self._diag.remove_from_unregistered(ent_tuples)
        if "removed" in alerts:
            rmv_buids = resp_body.get("buid")
            if rmv_buids:
                buids = [int(buid) for buid in rmv_buids]
                # Removing pending messages related to deleted entities
                removed = self._garbage_collector(buids)
                getLogger().warning(f"Removed {removed} items by garbage collector because entities have"
                                    f" been deleted (buids: {buids})")
        if "update_polling" in alerts:
            entities_with_polling = [ent for ent in entities if ent.use_polling]
            for ent in entities_with_polling:
                if len(ent.active_polling_task) > 0:
                    self._poll_sched.remove_tasks(ent.active_polling_task)
                    ent.active_polling_task = []
                if "removed" not in alerts:
                    for meas in ent.measures:
                        if meas.additional_cfg.get("polling"):
                            period = meas.additional_cfg.get("polling_period")
                            if period is None or period <= 0:
                                period = ent.DEFAULT_POLLING_PERIOD
                            polling_item = HubCoreMessage(ent, drv_ctx=meas)
                            task = Task(period, self._polling_request, item=polling_item,
                                        item_func=self.read_and_save_measure)
                            self._poll_sched.add_task(task)
                            getLogger().debug(f"Polling configured ({str(ent)}, {str(meas)})")
                            ent.active_polling_task.append(task)
        return resp_body

    def handle_system_request(self, action, target, parameters):
        """Handle Hub Core System messages"""
        callback = None
        if action == "en":
            if "buid" in parameters and "status" in parameters:
                resp_body = self._reg.registry_enable(parameters["buid"], int(parameters["status"]))
                modified_buids = resp_body.get("buid")
                if modified_buids is not None and bool(parameters["status"]) is False:  # one or more disabled ent
                    buids = [int(buid) for buid in modified_buids]
                    # Removing pending messages related to disabled entity
                    removed = self._garbage_collector(buids)
                    getLogger().warning(f"Removed {removed} items by garbage collector because entities have"
                                        f" been disabled (buids: {buids})")
            else:
                raise HubCoreException(HubCoreError.INV_PARAM, "'buid' and/or 'status' not found in params")
        elif action == "reset":
            resp_body = None
            # 'callback' will be called only after the response ack
            if target == "brig_mb":
                callback = restart_mosquitto
            elif target == "brig_hc":
                callback = self.restart_hubcore
            elif target == "brig_sg":
                self._mqtt.publish(f"sphensor/{self._mqtt.name}/hub/reboot", b"")
                getLogger().warning("sphensor gateway has been restarted")
            elif target == "brig_ig":
                pass  # TODO: serve?
            elif target == "brig_db":
                subprocess.Popen(['systemctl', 'restart', 'mariadb'])
                getLogger().warning("mariadb database has been restarted")
                # TODO implementare un controllo sul sitema operativo... se non è Linux rispondo con errore
                # TODO possibile miglioramento: leggo lo status e data di avvio prima e dopo per verificare che si sia effetivamente resettato
            elif target == "brig_ng":
                pass  # TODO: serve?
            elif target == "brig":
                callback = self.reboot_system
            else:
                msg = f"No '{target}' target found for system request"
                getLogger().warning(msg)
                raise HubCoreException(HubCoreError.INV_PARAM, msg)
        else:
            msg = f"No '{action}' action found for system request"
            getLogger().warning(msg)
            raise HubCoreException(HubCoreError.INV_PARAM, msg)
        return resp_body, callback

    def handle_diagnostic_request(self, action, parameters):
        """Handle commands related to Diagnostic"""
        resp_body = None
        if action == "force":
            Diagnostic.get_instance().force_diag_run()
        elif action == "get":
            resp_body = Diagnostic.get_instance().get_current("json")
        else:
            msg = f"No '{action}' action found for diag/req topic"
            getLogger().warning(msg)
            raise HubCoreException(HubCoreError.INV_PARAM, msg)
        return resp_body

    def handle_cfg_request(self, action, parameters):
        """Handle commands related to Configuration"""
        file_name = parameters.get("file_name")
        # if file_name is None:
        #     raise HubCoreException(HubCoreError.INV_PARAM, f"'file_name' field is mandatory")
        if action == "get polling":
            resp_body = {"polling_cfg": self.get_polling_task_info()}
        elif action == "get":
            resp = AbstractConfig.load_json_from_file(f"config/{file_name}")
            if resp is None:
                raise HubCoreException(HubCoreError.INV_PARAM, f"'{file_name}' not found under 'config' directory")
            resp_body = {"cfg": resp}
        elif action == "set":
            new_cfg = parameters.get("cfg")
            if new_cfg is None:
                raise HubCoreException(HubCoreError.INV_PARAM, f"'cfg' field is mandatory")
            resp, msg = ConfigManager.update_cfg(f"config/{file_name}", new_cfg)
            resp_body = None
            if not resp:
                raise HubCoreException(HubCoreError.INV_PARAM, f"Config update failed with message '{msg}'")
        else:
            raise HubCoreException(HubCoreError.INV_PARAM, f"HubCore configuration: invalid action '{action}'")
        return resp_body

    # TODO: tutti i cmd vengono gestiti con thread pool di default... esistono operazioni gestibili atomicamente?
    def handle_hubcore_cmd(self, topic, payload):
        """Handle commands related to 'Cmd' class"""
        # Get entity
        response = message = body = None
        if not topic["entity"].startswith("field_"):
            raise HubCoreException(HubCoreError.INV_PARAM, f"Invalid entity topic: {topic['entity']}")
        driver = topic["entity"].replace("field_", "")

        if topic['id'] == 'driver':  # command directed to the driver, not to a specific entity
            target = EntityCreator.get_class_from_driver(driver)
            append_crit = _append_criteria_drv
        else:
            target = self._reg.get_entity(driver, topic["id"])  # type: GenericEntity
            append_crit = _append_criteria_ent
            if target is None:
                msg = f"No registered entity with field_id '{topic['id']}' and driver '{driver}'"
                raise HubCoreException(HubCoreError.NOT_FOUND, msg)

        # Send command to the entity
        if payload.action == "output" or payload.action == "drv cmd":  # TODO: TOGLIERE ACTION = OUTPUT da applicativo di test!
            if isinstance(target, GenericEntity) and not target.enabled:
                raise (HubCoreError.NOT_PERM, f"Entity is disabled ({str(target)})")
            # Prepare message for pool
            hub_core_msg = HubCoreMessage(target, msg_ctx=(topic, payload), drv_ctx=payload.params,
                                          prio=payload.head.priority)
            try:
                # Try to add msg and its handler to the execution pool
                res = self._hubcore_pool.add_item(hub_core_msg, self.send_command_handler, append_crit)
                # type: HubCoreMsgResult
            except MemoryError:
                raise HubCoreException(HubCoreError.QUEUE_FULL)
            if res.msg_status == MessageStatus.ADD:
                response = None  # MQTT response not sent now!
            elif res.msg_status == MessageStatus.DISCARD:
                raise HubCoreException(HubCoreError.GENERIC_ERROR, res.msg)
            elif res.msg_status == MessageStatus.OVERWRITE:
                # Send MQTT response for each overwritten item
                for item in res.remove_list:
                    head = Head(uuid=item.body.msg_context[1].head.uuid,
                                message=f"Command overwritten for entity '{item.body.target.buid}'",
                                res=HubCoreError.GENERIC_ERROR)
                    resp_payload = ResponsePayload(head)
                    self.send_answer(topic=item.body.msg_context[0], payload=resp_payload)
        elif payload.action == "abort":
            target.status = EntityStatus.ABORTED
            removed = self._garbage_collector([target.buid])
            response = HubCoreError.SUCCESS
            getLogger().warning(f"Aborted {removed} items ({str(target)})")
        else:
            raise(HubCoreError.INV_PARAM, f"Unrecognized '{payload.action}' action")
        return response, message, body

    def send_command_handler(self, message: HubCoreMessage):
        """Handle command sending to a Control Entity"""
        result = HubCoreError.SUCCESS
        target = message.target
        try:
            # send command according to entity driver...
            if is_an_entity(target):
                target.req_msg += 1
                resp_msg = target.send_ent_cmd(message.drv_context)
                target.resp_msg += 1
                target.status = EntityStatus.ALIVE
            else:
                resp_msg = target.send_drv_cmd(message.drv_context)
            done = True
        except HubCoreException as exc:
            # if target does not respond...
            if is_an_entity(target):
                target.errors += 1
            if exc.error_type == HubCoreError.NO_ANSW_ENT:
                if is_an_entity(target):
                    result, resp_msg = self._retry_handler(target, message, self.send_command_handler)
                    done = False if result is None else True
                else:
                    done = True
                    resp_msg = f"{type(exc).__name__}: {exc.msg}"
            # other unhandled HubCore errors...
            else:
                done = True
                result = exc.error_type
                resp_msg = f"{type(exc).__name__}: {exc.msg}"
        # generic unhandled error
        except BaseException as exc:
            if is_an_entity(target):
                target.errors += 1
            done = True
            result = HubCoreError.GENERIC_ERROR
            resp_msg = f"{type(exc).__name__}: {exc.args[0]}"
        # if done, send the MQTT response
        if done:
            if is_an_entity(target):
                target.retries = 0  # Reset entity retry counter
            res_payload = ResponsePayload(Head(uuid=message.msg_context[1].head.uuid, res=result, message=resp_msg))
            self.send_answer(topic=message.msg_context[0], payload=res_payload)

    def read_and_save_measure(self, message: HubCoreMessage):
        """Read data from a Measure Entity"""
        entity = message.target  # type: MeasureEntity
        meas = message.drv_context  # type: Measure
        try:
            entity.req_msg += 1
            meas_data = entity.read_measure(meas)  # type: HubCoreMeasureData
            entity.status = EntityStatus.ALIVE
            entity.resp_msg += 1
            if meas_data.dt != meas.last_dt:
                meas.last_dt = meas_data.dt
                self._reg.save_new_measure_data(meas_data)
                getLogger().debug(f"Saved measure '{meas.tag}' into db ({str(entity)})")
                if self._cfg.send_saved_msg:
                    topic = self._cfg.send_msg_topic % (self._mqtt.name, entity.driver, entity.field_id)
                    msg = meas_data.to_dict()
                    msg["tag"] = meas.tag
                    self._mqtt.publish(topic, msg)
            else:
                getLogger().debug(f"Ignoring duplicated measure '{meas.tag}' ({str(entity)})")
        except HubCoreException as exc:
            # if entity does not respond...
            entity.errors += 1
            if exc.error_type == HubCoreError.NO_ANSW_ENT:
                self._retry_handler(entity, message, self.send_command_handler)
            # other unhandled HubCore errors...
            else:  # TODO: rivedere -> come dovrei gestire questi errori? quando si verificano?
                getLogger().warning(f"Read failed: {exc.msg} ({str(entity)})")
        except BaseException as exc:
            entity.errors += 1
            # TODO: diagnostica MQTT -> forse è più error che warning...
            getLogger().warning(f"Error in getting new measure! {type(exc).__name__}: {exc.args[0]}"
                                f" - Entity: {str(entity)} - Meas: {str(meas)}")

    def _retry_handler(self, entity, message, func):
        result = None
        max_retries = entity.retry_ctx.max_retries
        # check if retry is allowed
        if entity.retry_ctx.retries < max_retries and entity.status != EntityStatus.ABORTED:
            # prepare a new try...
            entity.status = EntityStatus.UNREACHABLE
            wait_time = entity.retry_ctx.get_wait_time()
            entity.retry_ctx.next_try_ts = datetime.now(timezone.utc) + timedelta(minutes=wait_time)
            entity.retry_ctx.retries += 1
            getLogger().warning(f"Entity with buid '{entity.buid}' not responding. Retry "
                                f"{entity.retry_ctx.retries}/{max_retries} in {wait_time} minutes")
            # TODO: qua dovrei genere un messaggio MQTT...
            try:
                # add the retry item to the pool
                item = self._hubcore_pool.add_item(message, func, _append_criteria_ent)  # type: HubCoreMsgResult
            except MemoryError:
                item = HubCoreMsgResult(MessageStatus.DISCARD, msg="Item queue full")
            if item.msg_status != MessageStatus.ADD:
                # if item can not be added, the retry is aborted
                message = f"Retry failed because message has been discarded with message '{item.msg}'" \
                           f" ({str(entity)})"
                result = HubCoreError.GENERIC_ERROR
                getLogger().warning(message)
        else:
            entity.status = EntityStatus.LOST
            removed = self._garbage_collector([entity.buid])  # removing items related to lost entity
            getLogger().warning(f"Removed {removed} items by garbage collector because entity is"
                                f" lost ({str(entity)})")
            result = HubCoreError.NO_ANSW_ENT
            message = f"Entity lost after {entity.retry_ctx.retries} retries ({str(entity)})"
            getLogger().warning(message)
        return result, message

    def _garbage_collector(self, buids: list):
        if not all(isinstance(b, int) for b in buids):
            raise Exception("buids param must be a string of int")
        removed_items = self._hubcore_pool.remove_item_by_func(_get_items_by_buids, buids)
        if len(removed_items) > 0:
            # Send MQTT response for removed items
            for item in removed_items:
                head = Head(uuid=item.body.msg_context[1].head.uuid,
                            message=f"Removed by gargabe collector ({str(item.body.target)})",
                            res=HubCoreError.GENERIC_ERROR)
                self.send_answer(topic=item.body.msg_context[0], payload=ResponsePayload(head))
        return len(removed_items)

    def _configure_polling(self):
        # Get entities with polling measures
        self._poll_sched.reset()
        for entity in self._reg.get_polling_entities():  # type: MeasureEntity
            for meas in entity.measures:  # type: Measure
                if meas.additional_cfg.get("polling"):
                    period = meas.additional_cfg.get("polling_period")
                    if period is None or period <= 0:
                        period = entity.DEFAULT_POLLING_PERIOD
                    polling_item = HubCoreMessage(entity, drv_ctx=meas)
                    task = Task(period, self._polling_request, item=polling_item,
                                item_func=self.read_and_save_measure)
                    self._poll_sched.add_task(task)
                    entity.active_polling_task.append(task)
        getLogger().info(f"{self._poll_sched.task_count} active polling tasks")

    def _polling_request(self, kwargs):
        """This method adds periodically a new item to the thread pool list"""
        if "item" in kwargs:
            entity = kwargs["item"].target  # type: MeasureEntity
            if entity.status == EntityStatus.LOST:
                getLogger().debug(f"Entity Lost ({str(entity)})")
            elif entity.enabled and entity.status != EntityStatus.LOST:
                getLogger().debug(f"Add polling req ({str(kwargs['item'].target)}) ")
                if "item_func" in kwargs:
                    try:
                        res = self._hubcore_pool.add_item(kwargs["item"], kwargs["item_func"], _append_criteria_ent)
                        # type: HubCoreMsgResult
                        getLogger().debug(res.msg_status)
                    except BaseException as err:
                        getLogger().debug(f"{type(err).__name__}: {err.args[0]}")  # TODO: diagnostica
            else:
                # TODO: disabilitare il polling
                getLogger().debug(f"Entity disabled or lost ({str(entity)})")

    def get_polling_task_info(self):
        """Return polling tasks configuration in dict format"""
        task_info = []
        tasks = self._poll_sched.get_tasks()
        for task in tasks:
            task_info.append({"entity_id": task.kwargs["item"].target.buid, "tag": task.kwargs["item"].drv_context.tag,
                              "period": task.period, "start": f"{datetime.utcfromtimestamp(task.start_ts)}+00:00"})
        return task_info
    
    def restart_hubcore(self):
        # TODO: disconnessione database?
        self._mqtt.set_custom_disconnect_callback(restart_myself)
        self._mqtt.disconnect("hub core restart command received")

    def reboot_system(self):
        # TODO: disconnessione database?
        self._mqtt.set_custom_disconnect_callback(reboot_os)
        self._mqtt.disconnect("os reboot")


def _append_criteria_ent(item_list: list, new_item: ThreadPoolItem, items_in_progress: list) -> HubCoreMsgResult:
    """This handler discriminates if a new message has to be discarded, be added to message list or overwrite another
    message already in the list"""
    response = HubCoreMsgResult()
    entity = new_item.body.target  # type: GenericEntity
    if entity.enabled:
        buid = entity.buid
        driver_context = new_item.body.drv_context
        # check if "entity" has items in progress
        item_in_progress = next((item for item in items_in_progress if item.body.target.buid == buid), None)
        if item_in_progress:
            # check if the item in progress is identical
            if item_in_progress.body.drv_context == driver_context:
                entity_in_progress = item_in_progress.body.target  # type: GenericEntity
                if entity_in_progress.status == EntityStatus.UNREACHABLE:
                    # If the entity is unreachable, prepare the retry
                    item_list.insert(0, new_item)  # insert as first element
                    response.msg_status = MessageStatus.ADD
                    response.msg = f"Retry n.{entity_in_progress.retry_ctx.retries}"
                else:
                    getLogger().debug(f"ThrPool: entity with buid {buid} has an identical msg already in progress "
                                      f"(msg: {str(driver_context)})")
                    response.msg_status = MessageStatus.DISCARD
                    response.msg = "Identical message already in progress"
        if response.msg_status is None:
            # check if "entity" has other items in the pool list
            entity_items = [item for item in item_list if item.body.target.buid == buid]
            if len(entity_items) > 0:
                # apply driver-dependent criteria to decide
                response = entity.queueing_criteria(driver_context, entity_items)  # type: HubCoreMsgResult
                if response is None:
                    response = HubCoreMsgResult(MessageStatus.ADD)
                    item_list.append(new_item)
                elif response.msg_status == MessageStatus.ADD or response.msg_status == MessageStatus.OVERWRITE:
                    for item in response.remove_list:
                        # Remove the overwritten items
                        item_list.remove(item)
                    item_list.append(new_item)
            else:
                # No item for the entity, the new one should be added
                # TODO: inserire qui eventuali logiche di limiti per tipologia di entità (es max 3 ent HTTP in parall)
                item_list.append(new_item)
                response.msg_status = MessageStatus.ADD
    else:
        response.msg_status = MessageStatus.DISCARD
        response.msg = "Entity is disabled"
    return response


def _append_criteria_drv(item_list: list, new_item: ThreadPoolItem, items_in_progress: list) -> HubCoreMsgResult:
    response = HubCoreMsgResult()
    driver_class = new_item.body.target
    if driver_class is None:
        response.msg_status = MessageStatus.DISCARD
        response.msg = "Invalid driver class"
    else:
        response.msg_status = MessageStatus.ADD
        item_list.append(new_item)
        # TODO: scartare se già presente o se c'è un messaggio identico in progress!
    return response


def is_an_entity(obj):
    return isinstance(obj, GenericEntity)


def _remove_criteria(item_list: list, *args) -> list:
    """This method receives as input a list of Item objects and returns a list of Items that can be executed.
    args[0] contains the list of items already in execution (which can be useful to decide which item to execute)"""
    rmv_items = []
    items = item_list
    # TODO: Necessario un refactory... ora è molto confusionario
    # TODO: questo comportamento deve essere specifico per solo alcune entità! => creare una remove_criteria specifica
    #  per il driver...
    items_in_progress = args[0]  # type: list
    # Filter out items whose entity_id is in item_in_progress_list
    # for item in items_in_progress:
    #     items_filtered = [it for it in items if it.body.target.buid != item.body.target.buid]
    #     items = items_filtered
    buids_in_progress = [it.body.target.buid for it in items_in_progress if is_an_entity(it.body.target)]
    entities_not_in_progress = [it for it in item_list if is_an_entity(it.body.target) and
                                it.body.target.buid not in buids_in_progress]  # TODO: testare
    drivers_in_progress = [it.body.target for it in items_in_progress if not is_an_entity(it.body.target)]
    driver_not_in_progress = [it for it in item_list if not is_an_entity(it.body.target) and
                              it.body.target not in drivers_in_progress]  # TODO: testare
    items = entities_not_in_progress + driver_not_in_progress

    if len(items) > 0:  # Found items that can be executed
        # do not consider elements waiting for retry
        items = [item for item in items if not is_an_entity(item.body.target) or
                 item.body.target.retry_ctx.next_try_ts < datetime.now(timezone.utc)]
        if items:
            # get first item with the highest priority level
            item_idx = [item.body.prio for item in items].index(max(item.body.prio for item in items))
            rmv_items.append(items[item_idx])
    return rmv_items


def _get_items_by_buids(item_list: list, *args):
    """This method take an item list and returns all the items with the buids specified in args[0]"""
    buids = args[0]  # type: list
    return [item for item in item_list if item.body.target.buid in buids]


def restart_mosquitto():
    """Restart Mosquitto broker"""
    subprocess.Popen(['systemctl', 'restart', 'mosquitto'])
    getLogger().warning("mosquitto broker has been restarted")


def restart_myself():
    """Relaunch Hub Core python script"""
    getLogger().warning("Restarting myself...")
    python = sys.executable
    subprocess.call([python] + sys.argv)


def reboot_os():
    """Reboot OS"""
    getLogger().warning("Rebooting OS...")
    subprocess.Popen(['reboot'])



