#!/bin/bash

COMPOSE_PROJECT_NAME="brig"
ENV_FILE=.env
MARIA_DB_FILE=../hub-core/hub_core/config/mariadb.json
HUB_CORE_FILE=../hub-core/hub_core/config/hub_core.json
MQTT_FILE=../hub-core/hub_core/config/mqtt.json

read -rp "Enter ROOT_USERNAME (default \"root\"): " ROOT_USERNAME
if [ -z "$ROOT_USERNAME" ]; then
  # Set a default value
  ROOT_USERNAME="root"
fi

read -rp "Enter BRIG_ID: " BRIG_ID
read -rsp "Enter MYSQL_ROOT_PASSWORD: " MYSQL_ROOT_PASSWORD
echo ""

read -rp "Enter MYSQL_DATABASE (default: \"collectief_db\"): " MYSQL_DATABASE
if [ -z "$MYSQL_DATABASE" ]; then
  # Set a default value
  MYSQL_DATABASE="collectief_db"
fi

read -rp "Enter DB_PORT (default: 3306): " DB_PORT
if [ -z "$DB_PORT" ]; then
  # Set a default value
  DB_PORT=3306
fi

read -rp "Enter MYSQL_USER: " MYSQL_USER
read -rsp "Enter MYSQL_PASSWORD: " MYSQL_PASSWORD
echo ""

#read -rp "ENTER MQTT_USERNAME (default: \"collectief\"): " MQTT_USERNAME
#if [ -z "$MQTT_USERNAME" ]; then
#  MQTT_USERNAME="collectief"
#fi

read -rsp "Enter MQTT_PASSWORD: " MQTT_PASSWORD
echo ""
if [ -z "$MQTT_PASSWORD" ]; then
  MQTT_PASSWORD=""
fi

# Create the .kenv file and write its parameters
if ! [ -f "$ENV_FILE" ]; then
  touch $ENV_FILE
  {
    echo "COMPOSE_PROJECT_NAME=$COMPOSE_PROJECT_NAME"
    echo "ROOT_USERNAME=$ROOT_USERNAME"
    echo "MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD"
    echo "MYSQL_DATABASE=$MYSQL_DATABASE"
    echo "MYSQL_USER=$MYSQL_USER"
    echo "MYSQL_PASSWORD=$MYSQL_PASSWORD"
    echo "INIT_IP=192.168.92.10"
    echo "DB_IP=192.168.92.11"
    echo "DB_PORT=$DB_PORT"
    echo "BROKER_IP=192.168.35.2"
#    echo "MQTT_USERNAME=$MQTT_USERNAME"
    echo "MQTT_PASSWORD=$MQTT_PASSWORD"
    echo "BRIG_ID=$BRIG_ID"
  } >> $ENV_FILE
else
  if [ -n "$ROOT_USERNAME" ]; then
    echo "root username modified in the env file"
    sed -i "s/ROOT_USERNAME=.*$/ROOT_USERNAME=$ROOT_USERNAME/" $ENV_FILE
  fi
  if [ -n "$MYSQL_ROOT_PASSWORD" ]; then
    echo "root password modified in the env file"
    sed -i "s/MYSQL_ROOT_PASSWORD=.*$/MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD/" $ENV_FILE
  fi
  if [ -n "$MYSQL_DATABASE" ]; then
    echo "MYSQL_DATABASE modified in the env file"
    sed -i "s/MYSQL_DATABASE=.*$/MYSQL_DATABASE=$MYSQL_DATABASE/" $ENV_FILE
  fi
  if [ -n "$MYSQL_USER" ]; then
    echo "MYSQL_USER modified in the env file"
    sed -i "s/MYSQL_USER=.*$/MYSQL_USER=$MYSQL_USER/" $ENV_FILE
  fi
  if [ -n "$MYSQL_PASSWORD" ]; then
    echo "MYSQL_PASSWORD modified in the env file"
    sed -i "s/MYSQL_PASSWORD=.*$/MYSQL_PASSWORD=$MYSQL_PASSWORD/" $ENV_FILE
  fi
  if [ -n "$DB_PORT" ]; then
    echo "DB_PORT modified in the env file"
    sed -i "s/DB_PORT=.*$/DB_PORT=$DB_PORT/" $ENV_FILE
  fi
  if [ -n "$BRIG_ID" ]; then
    echo "BRIG_ID modified in the env file"
    sed -i "s/BRIG_ID=.*$/BRIG_ID=$BRIG_ID/" $ENV_FILE
  fi
#  sed -i "s/MQTT_USERNAME=.*/MQTT_USERNAME=$MQTT_USERNAME/" $ENV_FILE
  if [ -n "$MQTT_PASSWORD" ]; then
    echo "MQTT_PASSWORD modified in the env file"
    sed -i "s/MQTT_PASSWORD=.*$/MQTT_PASSWORD=$MQTT_PASSWORD/" $ENV_FILE
  fi
fi

# creates or replaces the hub core credentials
if ! [ -f "$HUB_CORE_FILE" ]; then
  touch $HUB_CORE_FILE
  {
    echo "{"
    echo "    \"FactorySN\": \"$BRIG_ID\","
    echo "    \"FirmwareVersion\": \"1.00.01a\","
    echo "    \"FirmwareMin\": \"1.00.01a\","
    echo "    \"LSICode\": \"CBR\","
    echo "    \"LSISubCode\": \"002\""
    echo "}"
  } >> $HUB_CORE_FILE
else
  if [ -n "$BRIG_ID" ]; then
    sed -i "s/\"FactorySN\": \".*\"/\"FactorySN\": \"$BRIG_ID\"/" $HUB_CORE_FILE
  fi
fi

if ! [ -f "$MARIA_DB_FILE" ]; then
  touch $MARIA_DB_FILE
  {
  echo "{"
  echo "    \"user\": \"$ROOT_USERNAME\","
  echo "    \"pwd\": \"$MYSQL_ROOT_PASSWORD\","
  echo "    \"test_user\": \"$MYSQL_USER\","
  echo "    \"test_pwd\": \"$MYSQL_PASSWORD\","
  echo "    \"host_dckr\": \"192.168.92.11\","
  echo "    \"host\": \"localhost\","
  echo "    \"port\": $DB_PORT,"
  echo "    \"db_name\": \"$MYSQL_DATABASE\""
  echo "}"
  } >> $MARIA_DB_FILE
else
  if [ -n "$ROOT_USERNAME" ]; then
    echo "modified root username"
    sed -i "s/\"user\": \".*\"/\"user\": \"$ROOT_USERNAME\"/" $MARIA_DB_FILE
  fi
  if [ -n "$MYSQL_ROOT_PASSWORD" ]; then
    echo "modified root password"
    sed -i "s/\"pwd\": \".*\"/\"pwd\": \"$MYSQL_ROOT_PASSWORD\"/" $MARIA_DB_FILE
  fi
  if [ -n "$MYSQL_USER" ]; then
    echo "modified reader user"
    sed -i "s/\"test_user\": \".*\"/\"test_user\": \"$MYSQL_USER\"/" $MARIA_DB_FILE
  fi
  if [ -n "$MYSQL_PASSWORD" ]; then
    echo "modified reader password"
    sed -i "s/\"test_pwd\": \".*\"/\"test_pwd\": \"$MYSQL_PASSWORD\"/" $MARIA_DB_FILE
  fi
  if [ -n "$DB_PORT" ]; then
    echo "modified database port"
    sed -i "s/\"port\": \".*\"/\"port\": \"$DB_PORT\"/" $MARIA_DB_FILE
  fi
  if [ -n "$MYSQL_DATABASE" ]; then
    echo "modified database port"
    sed -i "s/\"db_name\": \".*\"/\"db_name\": \"$MYSQL_DATABASE\"/" $MARIA_DB_FILE
  fi
fi

if ! [ -f "$MQTT_FILE" ]; then
  touch $MQTT_FILE
  {
  echo "{"
  echo "    \"broker_ip_dckr\": \"192.168.35.2\","
  echo "    \"broker_ip\": \"localhost\","
  } >> $MQTT_FILE
  if [ -n "$MQTT_PASSWORD" ]; then
    echo "    \"mqtt_client_pwd\": \"$MQTT_PASSWORD\"" >> $MQTT_FILE
  else
    echo "    \"mqtt_client_pwd\": \"\"" >> $MQTT_FILE
  fi
  echo "}" >> $MQTT_FILE

else
  if [ -n "$MQTT_PASSWORD" ]; then
    echo "modified mqtt password"
    sed -i "s/\"mqtt_client_pwd\": \".*\"/\"mqtt_client_pwd\": \"$MQTT_PASSWORD\"/" $MQTT_FILE
  else
    echo "setting empty mqtt password"
    sed -i "s/\"mqtt_client_pwd\": \".*\"/\"mqtt_client_pwd\": \"\"/" $MQTT_FILE
  fi
fi
