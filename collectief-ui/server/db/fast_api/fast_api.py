import os
import uvicorn

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from databases import Database
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv('DB_PATH')
database = Database("sqlite:///" + DB_PATH)

app = FastAPI()

@app.on_event("startup")
async def database_connect():
    await database.connect()


@app.on_event("shutdown")
async def database_disconnect():
    await database.disconnect()


@app.get("/filter/sensor_id")
async def fetch_data(table_name: str, id: int):
    '''
    Get all datapoints from a specific sensor. 
    Require you to pass the Sensors serial number.
    '''
    try:
        query = "SELECT * FROM {} WHERE sensor_serial={}".format(table_name, id)
        results = await database.fetch_all(query=query)
    except:
        print("No table found")
    
    return  results

@app.get("/filter/specific")
async def fetch_data(cols: str, table_name: str, size: int):
    query = """SELECT {selected_cols} 
                FROM {table_name}
                LIMIT {query_size}""".format(selected_cols= cols, table_name= table_name, query_size = size)
    results = await database.fetch_all(query=query)
    return  results

@app.post("/setup/max_table_size")
async def fetch_data(table_name: str, size: int):
    '''
    Change the maximum allowed amount of rows int the database table
    '''
    drop_query = """DROP TRIGGER "main"."table_size_limit";"""
    update_query = """
                CREATE TRIGGER table_size_limit 
                                    AFTER INSERT ON {table_name} 
                                BEGIN
                                    DELETE FROM {table_name} WHERE ROWID IN (
                                        SELECT ROWID FROM {table_name} ORDER BY ROWID DESC LIMIT -1 OFFSET {limit});
                                END""".format(table_name = table_name, limit = size)

    try:
        await database.fetch_all(query=drop_query)
        print(1)
    except:
        print(2)
        pass
    finally:
        print(3)
        await database.fetch_all(query=update_query)

    return {      
        "result": "Max size successfully changed to {}".format(size)
    }

def run():
    uvicorn.run(app="fast_api.fast_api:app", host="127.0.0.1",
    port=8000, reload=True, log_level="debug")

if __name__ == "__main__":
    print("current dir: ", os.getcwd())
    uvicorn.run(app="fast_api:app", host="127.0.0.1",
    port=8000, reload=True, log_level="debug")