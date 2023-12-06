"""Hub Core MQTT Topic module"""
from logging import getLogger


class HubCoreTopic(dict):
    """Hub Core Topic class"""
    def __init__(self, *args, **kw):
        super(HubCoreTopic, self).__init__(*args, **kw)

    def convert_to_str(self):
        """Convert topic object to string"""
        if self["root"] == "collectief":
            topic_list = [self["root"], self["brig_id"], self["entity"], self["id"], self["class"], self["trig"]]
        elif self["root"] == "sphensor":
            topic_list = [self["root"], self["brig_id"], self["sph_id"], self["message_type"]]
        else:
            raise Exception("Try converting an incompatible mqtt topic")
        return "/".join(topic_list)

    @staticmethod
    def create_from_string(topic_str):
        """Create a topic object from string"""
        topic_list = list(topic_str.split('/'))
        topic_dict = HubCoreTopic()
        topic_dict["root"] = topic_list[0]
        if topic_dict["root"] == "collectief" and len(topic_list) <= 6:
            topic_dict["brig_id"] = topic_list[1]
            topic_dict["entity"] = topic_list[2]
            topic_dict["id"] = topic_list[3]
            topic_dict["class"] = topic_list[4]
            topic_dict["trig"] = topic_list[5]
        elif topic_dict["root"] == "sphensor" and len(topic_list) <= 4:
            topic_dict["brig_id"] = topic_list[1]
            topic_dict["sph_id"] = topic_list[2]
            topic_dict["message_type"] = topic_list[3]
        else:
            raise Exception(f"invalid topic '{topic_str}'")
        return topic_dict

