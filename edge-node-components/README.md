# node-database
database schema and implementation that will be used to connect to all the sources.

## Project Structure
* **data**: folder containing the configuration of the buildings for all the cases, as well as extra data files that can be used in place of the local brig dataset,such as scraped data
  * assets_\*.json contain the provisional data
  * table.csv: table of all the sphensors in the data
  * uuids.csv: uuids to be used in communication with the Cluster Node
* *algorithms*: source code for the algorithms adapted on the BRiG, as well as containing the tests for the algorithms
  * *config* configuration files 
* *db*: all files related to file generation. Extra code is added, related to the generation of database entries from the sensor list as well as a script to generate a database model starting from the database connection
* *i-gateway* the iG part of the BRiG, handles all communications with the layers above and beside
* *kpi-calc* functions to calculate the KPIs by handling the data, will probably fall under *algorithms* in the future
* *mqtt*: folder containing functions for dispatching the MQTT clients for the components
* *on_msg_conn*: data containing functions triggered depending on the data source, related to file saving as well as file sending

## Instructions for startup and data acquisition
Generate the volumes before starting the docker compose, both for this
repository and the [hub core]()
```docker-compose -f docker-compose.yml up```


## TO DO

- add unit tests and integration tests with other components such as edge node algorithms (DSM and TC)
