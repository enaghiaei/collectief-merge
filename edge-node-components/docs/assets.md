# Asset dictionary description and API
## Json Schema implementation
### General Overview

The provided schema describes a JSON structure for defining a configuration with various properties related to buildings, zones, sensors, and actuators. Here is a simplified documentation of the schema:

- The top-level structure should contain at least one property (minimum 1), It refers to the high level areas managed by a single BRiG. Each one is defined by its BRiG serial for the scope of this project
- Inside the top-level structure, there is a "patternProperties" property, which allows dynamic properties to match a specific pattern.
  - The pattern for dynamic properties is "^[0-9]+$", which means they should be numeric strings.
- Each dynamic property represents an object with several properties including "brigId", "building_name", "zones", "sensors", and "actuators".
  - *brigId* repeats the brigId in the key of the object, kept in case the keys do not correspond to the brig Serial
  - *buildingName* defines the building as a string that describes its name
  - *coordinates* (to be added) describes its latitude and longitude, to be used in certain cases where geolocation may be required, optional parameter
  - *weatherId* 
  - The **zones** property contains zone definitions, each represented by an object with properties such as "zoneName", "zoneType", "zoneCategory", "sensors", and "actuators".
    - *zoneType* is a string descri 
    - The **sensors** property represents sensor definitions, which follow a similar structure as "zones".
    - The **actuators** property represents actuator definitions, which also follow a similar structure as "zones".
      - Actuator definitions include two types: "HVAC_setpoint" and "Boolean", each with specific properties.
    - The **indicators** (to be added) property defines any derivative calculation, it can be used for any case where certain data can be inferred indirectly, assuming that the methods are present in `custom_methods.py` and the relative measures are defined in its string
    - The schema provides detailed properties for each actuator type, such as temperature setpoint values, features, and engagement signals.
    - **sensors** and **actuators** can have dynamic properties matching the pattern "^[-\\w]+$", allowing alphanumeric names.
- At all levels there is a **comment**

Ensure that the JSON data you create adheres to this schema to avoid validation errors.


### Actuator Structures

As of now the schema allows for a number of actuator settings, which are variable based on the kind of controls that the project requires

#### HVAC Setpoint Actuator:
- Actuator Type: "HVAC_setpoint"
- Description: This type of actuator is typically used for controlling HVAC (Heating, Ventilation, and Air Conditioning) systems by setting temperature setpoints.
- Required Properties:
  - "_comment" (optional): A string for adding comments or descriptions.
  - "settings": An object containing the following properties:
    - "values": An object specifying the minimum, default, and maximum values for the temperature setpoint.
    - "features": An object defining additional features of the actuator.

#### Boolean Actuator:
- Actuator Type: "Boolean"
- Description: This type of actuator represents a simple on/off switch or a binary control.
- Required Properties:
  - "settings": An object containing the "features" property that specifies the actuator's features.

### Sensor Structure
- Sensors are defined within the "sensors" property of each zone or the top-level configuration.
- Sensor definitions follow a similar structure as zones and actuators.
- Each sensor definition consists of a dynamic property representing the sensor's name.
- Inside the sensor definition, there is an array of strings representing the sensor items.

### Indicator Structure
- If the value of the given indicator key is a *string*, said string has to be a reference to a specific sensor, following the convention **[driver]/[field_id]/[tag]**, with the following meanings:
  - **driver**: the type of sensor acquisition, allowing so far the following values:
    - _sph_p_: sphensor interface
    - _sginterop_: driver for the french case
    - _emsystemer_(WIP): driver for Norway's pilots
    - _a2a_: driver for the italian pilots' thermostats and smart plugs
    - _ecobee_(WIP): driver for the ecobee pilot
    - _sensibo_: driver for the AC cooling unit
    - _cstb_ (WIP): driver for the emulation software data
  - **field_id**: the id of the field for a given dataset
  - **tag**: the sensor tag that defines the measure
- If instead the indicator is an object, the keys are:
  - **method**: name of the method. loaded from the [custom functions file](../actuation_engine/algorithms/utils/customFunctions.py), that the partners will use for defining and writing their own methods
  - **args**: arguments of the function, they refer to the data values needed to calculate the metrics
- Indicators are being standardized according to a number of set values, depending on the algorithms. For the RLDSM case the current set values are:
  - optTemp
  - energy
  
As new algorithms are developed, each indicator has to be indicated in the relevant assets file

## Asset Class
The asset class handles the asset dictionary through a series of methods that can be used to filter, order and slice the dictionary according to the needs of each algorithm.
A number of methods have been set externally in the relative `algorithms.utils.data` submodule.

The asset class handles the levels of the assets in a way that makes nesting
less of a hassle, and in addition with the auxiliary methods in the utils.data folder, it
severely simplifes the interaction with the dictionary within the algorithms.

The methods that have been developed are divided among a number of categories:

### Constructor methods
Among the constructor methods a number have been devised with the idea of handling a number of loading cases in order
to ease deployment and modifications of the assets:
- `load_assets_from_file`: loads the assets from a given path, assuming it is on the local machine
- `load_assets_from_dumped_json`: for importing files from a dumped json, in case, let's say, it is uploaded online
- `load_assets_from_db`: for importing assets from the relative `AlgoAssets` table

It is fundamental to note that these methods answer different use cases,
namely the ability to modify the assets on later redeployment or deploment modifications, in case of rest, or
desire to save the configuration for later use

### data handling methods
- `seek_zone_by_name`: to query a zone by its graphical name, it may be interesting to expand this
- `dump_asset_to_db`: to dump assets into the database for later use
- `flatten_item`: wrapper around the `flatten_item` function, potentially useful to map the value
- `check asset validity`: function to check whether the assets are valid, it is a class method as it is called within the constructor (Pending point, this could be a decorator instead)
- `get_item`: main method to retrieve an item according to the keys
- `_edit_item`: method to edit an item while it is running. can be used in conjunction with other methods to save the new asset data
- `_del_item`: method to delete an item from an asset dictionary

### other properties
- `zones`: as cycling through the zones happens often, the zone property has been defined out of simplicity
- `_SENSOR_LEVELS`: **TBD** used for searching at a specific level of the asset dictionary
- `_ACTUATOR_LEVELS`: **TBD** same as above
- `_ASSETS_SCHEMA`: a class attribute that is used for validating the schema

### considerations and future additions
The Asset dictionary serves the purpose of making it easy to deal with the complexity of the measurement
systems as defined within the edge node firmware by moving away from a driver>sensor|actuator perspective
and into a pure entity perspective. With the addition of the auxiliary methods (which are recommended to read
in the relative documentation file [here](utilities.md#))

#### Notice
I am open for feedback or suggestions in the mail marcoantonio.insabato@energyatwork.it.
The structure is not permanent, some simplifications may be required for ease of use of all partners,
feel free to suggest them as it is in the interest of this project to make all pieces work together