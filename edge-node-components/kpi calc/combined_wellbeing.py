# KPIs that are related to the cyprus institute part

class CombinedWellBeing:
    def __init__(self, inputs, *args, **kwargs):
        """The idea of using separate files is a bit """
        self.inputs = inputs
        # these calculators should have complete access to reading and limited access to writing
        self.database_engine = sqlalchemy.create_engine(f"mariadb+mariadbconnector://{os.environ.get('MYSQL_USER')}:{os.environ.get('MYSQL_PASSWORD')}@{os.environ.get('DB_IP')}/{os.environ.get('MYSQL_DATABASE')}")
        self.client = mqtt.Client() # TODO set up a naming scheme in order for the system to work
        self.args = args
        self.kwargs = kwargs
        # TODO define a similar standards for inputs and outputs or just make the functions ad hoc

    def calculate(self):
        pass

    def request_input_data(self):
        # request input timeseries
        Session = sqlalchemy.orm.sessionmaker(self.database_engine) 
        with Session() as session:
            # request by the univocal driver - dataset combination
            session.scalars(sqlalchemy.select(HcMeasureData).filter_by(inputs))