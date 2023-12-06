import json
import importlib
from datetime import datetime
from alembic.config import Config
from alembic import command
from alembic.util.exc import CommandError
from paho.mqtt.client import Client
from os.path import exists
from uuid import uuid4
from os import listdir
from configparser import ConfigParser
from logging import getLogger

# topic_dict["brig_id"] = topic_list[1]
# topic_dict["entity"] = topic_list[2]
# topic_dict["id"] = topic_list[3]
# topic_dict["class"] = topic_list[4]
# topic_dict["trig"] = topic_list[5]
TOPIC_LEVELS = ["root", "brig_id", "entity", "id", "class", "trig"]


def on_connect(client, userdata, flags, res_code):
    print(f"{client._client_id} has connected with result code {res_code}\n",
          f"flags: {flags}\n")


def on_subscribe(client, userdata, mid, granted_qos):
    print(f"Subscribed with QoS {granted_qos}")


def on_publish(client, userdata, msg):
    print(f"sending the following payload \n test{msg}")


class VersionManager(object):
    """
    used to manage the database revisions remotely in case of specific edits, not definitive
    """
    def __init__(self, db_url: str, brig_id: str, alembic_cfg: str = 'alembic.ini', directory: str ="alembic_data"):
        self.db_url = db_url
        self.directory = directory
        self.alembic_cfg = alembic_cfg
        self._config = Config(alembic_cfg)
        self.brig_id = brig_id
        self.client = Client(client_id=f"manager_{brig_id}")
        self.client.on_publish = on_publish
        self.client.on_connect = on_connect
        self.client.on_message = self.on_message
        self.topics = brig_id
        self.info_actions = {
            "get revisions": self.get_revision_list,
            "get head": self.get_head_revision
        }

        self.migrate_actions = {
            "upgrade": command.upgrade,
            "downgrade": command.downgrade
        }

    @property
    def topics(self):
        return self._TOPICS

    @topics.setter
    def topics(self, brig_id):
        self._TOPICS = {
            "collectief": {  # root
                brig_id: {  # brig_id
                    "brig_db": {  # entity
                        "alembic": {  # id
                            "migrate": {  # class
                                "req": {  # request or answer (ans not included)
                                    "action": {  # action field in the body
                                        "upgrade": {"params": {"revision": {"default": "head"}}},  # all possible actions
                                        "downgrade": {"params": {"revision": {"default": "base"}}}
                                    }
                                }
                            },
                            "info": {
                                "req": {
                                    "action": {
                                        "get revisions": {"params": {}},
                                        "head revision": {"params": {}}
                                    }
                                }
                            }
                        }
                    }
                }
                # will it be necessary to communicate to other brigs about modifications? (propagate them perhaps)
            }
        }

    @property
    def config(self):
        return self._config

    @config.setter
    def config(self, alembic_cfg):
        return Config(alembic_cfg)

    def connect(self, host: str, port: int, password: str):
        self.client.username_pw_set(username=self.brig_id, password=password)
        self.client.connect(host=host, port=port)

    def subscribe(self):
        self.client.subscribe(topic=f"collectief/{self.brig_id}/brig_db/#")
        self.client.loop_forever()

    def get_revision_list(self):
        revision_list = []
        old_revs = []
        for file in listdir(f'{self.directory}/versions'):
            if "__" not in file:
                file = ".".join(file.split(".")[:-1])
                rev_file = importlib.import_module('.' + file, f'{self.directory}.versions')
                revision = rev_file.revision
                if rev_file.down_revision:
                    old_revs.append(rev_file.down_revision)
                else:
                    revision = f"{revision} (base)"

                if file not in old_revs:
                    revision = f"{revision} (head)"

                revision_list.append(revision)
        return revision_list

    def check_current_revision(self):
        try:
            command.check(self.config)
            return False
        except CommandError as e:
            print(e)
            return True

    def get_head_revision(self):
        revisions = [importlib.import_module('.' + ".".join(f.split(".")[:-1]), f'{self.directory}.versions').revision
                     for f in
                     listdir(f'{self.directory}/versions') if "__" not in f]
        old_revisions = [
            importlib.import_module('.' + ".".join(f.split(".")[:-1]), f'{self.directory}.versions').down_revision for
            f in listdir(f'{self.directory}/versions') if "__" not in f]
        return list(set(revisions).difference(old_revisions))[0]

    def init_migration_environment(self) -> None:
        alembic_cfg = ConfigParser()
        alembic_cfg.read(self.alembic_cfg)
        command.upgrade(self.config, "head")

        with open(self.alembic_cfg, "w") as f:
            alembic_cfg.write(f)
        self.config = self.alembic_cfg

    def bad_function(self, action, topic_levels, uuid_val):
        """
        function in case of bad action
        """
        self.client.publish(topic=topic_levels[:-1].append("ans").join("/"),
                            payload=json.dumps({
                                "head": self.generate_head(uuid_val=uuid_val,
                                                           res="NOT_FOUND",
                                                           message=f"{action} is not valid"),
                            }))

    def on_message(self, client, _, message):
        """
        manages received messages, checking validity at first
        """
        payload = json.loads(message.payload.decode('utf-8'))
        uuid_val = payload["head"]["uuid"]
        topic_levels = message.topic.split("/")
        item = self.topics
        for name, level in zip(TOPIC_LEVELS, topic_levels):
            item = item.get(level, None)
            if item is None:
                valid_items = ",".join(list(item.keys()))
                client.publish(topic=topic_levels[:-1].append("ans").join("/"),
                               payload=json.dumps({
                                   "head": self.generate_head(uuid_val=uuid_val,
                                                              res="NOT_FOUND",
                                                              message=f"{name} value is incorrect, please select"
                                                                      f"among these elements {valid_items}"),
                               }))
                break
            classname = level if name == "class" else ''

            if classname == "info":
                action = payload.get("action", None)
                function = self.info_actions.get("action", self.bad_function)
                if action:
                    function()
                else:
                    function(**{"topic_levels": topic_levels, "uuid_val": uuid_val})

            elif classname == "migrate":
                action = payload.get("action", None)
                params = payload.get("params")

                function = self.migrate_actions.get("action", self.bad_function)
                if action:
                    params = {**params, **{"autogenerate": True, "config": self.config}} if action == "revision" else {
                        **params, "config": self.config}
                    try:
                        function(**params)
                    except TypeError as e:
                        client.publish(topic=topic_levels[:-1].append("ans").join("/"),
                                       payload=json.dumps({
                                           "head": self.generate_head(uuid_val=uuid_val,
                                                                      res="NOT_FOUND",
                                                                      message=f"{params} are incorrect, please review the request"),
                                       }))
                else:
                    function(**{"topic_levels": topic_levels, "uuid_val": uuid_val})

    @staticmethod
    def generate_head(prio=1, uuid_val: str = None, **kwargs):
        head = {"ts": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3],
                "uuid": uuid_val if uuid_val else str(uuid4()),
                "prio": prio}
        if kwargs:
            head = {**head, **kwargs}
        return head

    @staticmethod
    def modify_env_file(env_file):
        with open(env_file, "r") as f:
            env_data = f.read()

        env_data.replace("# from myapp import mymodel\n"
                         "# target_metadata = mymodel.Base.metadata\n"
                         "target_metadata = None",  # original string
                         "import sys\n"
                         "sys.path.append('..')"
                         "from db.models import ExtendedBase"
                         "target_metadata = ExtendedBase.metadata")  # get metadata

        with open(env_file, "w") as f:
            f.write(env_data)

        getLogger().info("Env.py file set up")

