#!/usr/bin/expect -f
set timeout -1

spawn mosquitto_ctrl dynsec init path/to/dynamic-security.json $env(BRIG_ID)
expect "Enter password:"
send -- "$env(MQTT_PASSWORD)\r"
expect eof
