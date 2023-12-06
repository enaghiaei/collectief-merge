import sqlite3
import os


class Sphensor: 

    def __init__(self, db_path, table_name):
        self.current_path = os.getcwd()
        # self.con = sqlite3.connect(os.getcwd() + db_path)
        self.con = sqlite3.connect(db_path)
        self.cur = self.con.cursor()
        self.table_name = table_name
        self.create_table(table_name)
        print('Databse Directory: {}'.format(self.current_path))

    def create_table(self, table_name):
        # self.cur.execute("""DROP TABLE node_22040367""")
        table_query =  """CREATE TABLE IF NOT EXISTS {}(
            id INTEGER PRIAMRY KEY,
            timestamp INTEGER,
            sensor_type TEXT, 
            channel TEXT, 
            measure_name TEXT, 
            measure_var TEXT, 
            measure_kind TEXT, 
            is_external INTEGER, 
            is_calibrated INTEGER, 
            measure_value NUMERIC, 
            sensor_serial INTEGER
            )""".format(table_name)
        self.cur.execute(table_query)

# Method to insert a single row into the table
    def insert(self, item):
        table_query =  """INSERT INTO {}(timestamp, sensor_type, channel, measure_name, measure_var,measure_kind, is_external, is_calibrated, measure_value, sensor_serial) VALUES(?,?,?,?,?,?,?,?,?,?)""".format(self.table_name)
        self.cur.execute(table_query, item)
        self.con.commit()
        return self.cur.lastrowid

# Method to insert multiple rows into the table
    def insert_many(self, items):
        table_query =  """INSERT INTO {}(timestamp, sensor_type, channel, measure_name, measure_var,measure_kind, is_external, is_calibrated, measure_value, sensor_serial) VALUES(?,?,?,?,?,?,?,?,?,?)""".format(self.table_name)
        self.cur.executemany(table_query, items)
        self.con.commit()
        return self.cur.lastrowid

# Method to read all rows in the table
    def read_all(self):
        table_query = """SELECT * FROM {}""".format(self.table_name)
        self.cur.execute(table_query)
        rows = self.cur.fetchall()
        return rows

    def read(self, nr_of_rows = "-1", cols:str = "*"):
        table_query = """SELECT {selected_cols} 
                FROM {table_name}
                LIMIT {query_size}""".format(selected_cols= cols, table_name=self.table_name, query_size = nr_of_rows)
        self.cur.execute(table_query)
        rows = self.cur.fetchall()
        return rows

# Change the Limit of the database Maximum records here (Currently set to 100):
    def limit_table_trigger(self, max_rows):
        trigger_query = """CREATE TRIGGER IF NOT EXISTS table_size_limit 
                    AFTER INSERT ON {table_name} 
                BEGIN
                    DELETE FROM {table_name} WHERE ROWID IN (
                        SELECT ROWID FROM {table_name} ORDER BY ROWID DESC LIMIT -1 OFFSET {limit});
                END;""".format(table_name = self.table_name, limit = max_rows)
        self.cur.execute(trigger_query)

#Method call to update the maximum allowed rows in the table
    def update_trigger_limit(self, col, max_rows):
        drop_query = """DROP TRIGGER "main"."table_size_limit";"""
        update_query = """
                    CREATE TRIGGER table_size_limit 
                                        AFTER INSERT ON {table_name} 
                                    BEGIN
                                        DELETE FROM {table_name} WHERE ROWID IN (
                                            SELECT ROWID FROM {table_name} ORDER BY ROWID DESC LIMIT -1 OFFSET {limit});
                                    END""".format(table_name = self.table_name, limit = max_rows)
        self.cur.execute(drop_query)
        self.cur.execute(update_query)
                                

    def close(self):
        self.con.close()

    