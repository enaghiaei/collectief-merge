# Algorithm utility functions
A number of utility functions have been developed to control and manipulate the data structures of the
algorithm as well as of other data. Most of these standalone functions can be used to extend the code,
particularly when dealing with the [asset class](assets.md#asset-class) or the DSM library functions-

## data methods
### flatten_item
Credit: https://stackoverflow.com/questions/6027558/flatten-nested-dictionaries-compressing-keys

A recursive method to flatten the dictionary. By performing the flattening of the resources, it is possible
to perform further operations.

**Parameters**
- item : *dict* or *MutableMapping*

    Item to flatten, received from the flatten_item method.
- parent_key : *str*, *optional*

    Initial key, set to an empty string, by default ''
- separator : *str*, *optional*

     Ubiquitous separator for the keys, by default '/'
- current_level : *int*, *optional*
  
    Not actually used, used to keep track of the state of the level for max_level, by default 0
- max_level : *int*, *optional*

    Max level of the flattening, by default None
- flatten_list : *bool*, *optional*

    Whether to flatten lists, where keys are integers in that case, by default False

**Returns**
- item_list : *dict*
    A flattened dictionary that can be further processed with parse_flat_keys to obtain a list of dictionaries with
    the keys.
    
  
### filter_flat_keys
Filter keys according to a given keyword(s).

**Parameters**
- flat_item : *dict*

  Flattened item from flatten_item.
- positive_keyword : *str* or *list*, *optional*

  Positive keyword for selecting the keys, by default ''.
- negative_keyword : str or list, optional

  Negative keyword for removing said keys, by default ''.

**Returns**
- flat_item_filtered: dict

  filtered items according to the given keywords


### process_flat_keys
    
Method to parse flat keys. It is assumed that all items of the dictionary are filtered to the same level
in order to ease the key management.

**Parameters**

- flat_item : *dict* or *MutableMapping*
    
  Flattened item from flatten_item.
- item_key_names : *list\[str\]*

  Names of the keys.
- element_key_name : *str*, *optional*
    
  Name of the final key, by default "".
- \*\*kwargs
    
    Optional keyword arguments.

**Returns**

- parsed_key
    
  The parsed key.

**Other Parameters**

- prune : *Optional*

  Keys to remove keys among the element_key_name.



### path_merge
    
Merge between absolute and relative paths. It expects at least a degree of overlap,
used in case relative paths don't cut it and using ".." is not sure to work.

**Parameters**

abs_path : str
    Absolute path of the machine or "less relative" path.
rel_path : str
    Relative path of the file or folder to make absolute.

**Returns**
- A *str* of the absolute path

    


### edit_item
Append or modify a generic item to an object. It assumes that the added keys are correct.

**Parameters**

- dictionary: dict
    Dictionary to edit
- item : Any
    item that will be added, follows the MQTT naming conventions:
    zones/driver/[sensors|actuators]/serial/tag (in case of tag, item must be none).
last_key : str, optional
    Key of the new item to append. Omitted if the thing being appended is a dictionary.
keys : tuple
    Args to append the data on.

**Returns**
None
    This function does not return any value.
    