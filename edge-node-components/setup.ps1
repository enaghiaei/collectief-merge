# Define variables
$COMPOSE_PROJECT_NAME = "brig"
$ENV_FILE = ".env"
$MARIA_DB_FILE = "../hub-core/hub_core/config/mariadb.json"
$HUB_CORE_FILE = "../hub-core/hub_core/config/hub_core.json"
$MQTT_FILE = "../hub-core/hub_core/config/mqtt.json"

# Prompt user for input
$ROOT_USERNAME = Read-Host "Enter ROOT_USERNAME (default root)"
if ([string]::IsNullOrEmpty($ROOT_USERNAME)) {
    $ROOT_USERNAME = "root"
}

$BRIG_ID = Read-Host "Enter BRIG_ID"
$MYSQL_ROOT_PASSWORD = Read-Host "Enter MYSQL_ROOT_PASSWORD" -AsSecureString
$MYSQL_ROOT_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($MYSQL_ROOT_PASSWORD))

$MYSQL_DATABASE = Read-Host "Enter MYSQL_DATABASE (default `collectief_db`)"
if ([string]::IsNullOrEmpty($MYSQL_DATABASE)) {
    $MYSQL_DATABASE = "collectief_db"
}

$DB_PORT = Read-Host "Enter DB_PORT (default `3306`)"
if ([string]::IsNullOrEmpty($DB_PORT)) {
    $DB_PORT = "3306"
}

$MYSQL_USER = Read-Host "Enter MYSQL_USER"
$MYSQL_PASSWORD = Read-Host "Enter MYSQL_PASSWORD" -AsSecureString
$MYSQL_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($MYSQL_PASSWORD))

$MQTT_PASSWORD = Read-Host "Enter MQTT_PASSWORD" -AsSecureString
$MQTT_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($MQTT_PASSWORD))

# Create or update .env file
if (-Not (Test-Path -Path $ENV_FILE))
{
    New-Item -Path $ENV_FILE -ItemType File | Out-Null
@"
COMPOSE_PROJECT_NAME=$COMPOSE_PROJECT_NAME
ROOT_USERNAME=$ROOT_USERNAME
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=$MYSQL_DATABASE
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
INIT_IP=192.168.92.10
DB_IP=192.168.92.11
DB_PORT=$DB_PORT
BROKER_IP=192.168.35.2
MQTT_PASSWORD=$MQTT_PASSWORD
BRIG_ID=$BRIG_ID
"@ | Set-Content -Path $ENV_FILE
} else {
    if (-not [string]::IsNullOrWhiteSpace($ROOT_USERNAME)) {
        Write-Host "ROOT_USERNAME modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^ROOT_USERNAME=.*$", "ROOT_USERNAME=$ROOT_USERNAME"
        } | Set-Content -Path $ENV_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_ROOT_PASSWORD)) {
        Write-Host "MYSQL_ROOT_PASSWORD modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^MYSQL_ROOT_PASSWORD=.*$", "MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD"
        } | Set-Content -Path $ENV_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_DATABASE)) {
        Write-Host "MYSQL_DATABASE modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^MYSQL_DATABASE=.*$", "MYSQL_DATABASE=$MYSQL_DATABASE"
        } | Set-Content -Path $ENV_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_USER)) {
        Write-Host "MYSQL_USER modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^MYSQL_USER=.*$", "MYSQL_USER=$MYSQL_USER"
        } | Set-Content -Path $ENV_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_PASSWORD)) {
        Write-Host "MYSQL_PASSWORD modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^MYSQL_PASSWORD=.*$", "MYSQL_PASSWORD=$MYSQL_PASSWORD"
        } | Set-Content -Path $ENV_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($DB_PORT)) {
        Write-Host "DB_PORT modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^DB_PORT=.*$", "DB_PORT=$DB_PORT"
        } | Set-Content -Path $ENV_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MQTT_PASSWORD)) {
        Write-Host "MQTT_PASSWORD modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^MQTT_PASSWORD=.*$", "MQTT_PASSWORD=$MQTT_PASSWORD"
        } | Set-Content -Path $ENV_FILE
    } else {
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^MQTT_PASSWORD=.*$", "MQTT_PASSWORD="
        } | Set-Content -Path $ENV_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($BRIG_ID)) {
        Write-Host "BRIG_ID modified in $ENV_FILE"
        (Get-Content -Path $ENV_FILE) | ForEach-Object {
            $_ -replace "^BRIG_ID=.*$", "BRIG_ID=$BRIG_ID"
        } | Set-Content -Path $ENV_FILE
    }
}

# Create or update hub_core.json file
if (-Not (Test-Path -Path $HUB_CORE_FILE)) {
    New-Item -Path $HUB_CORE_FILE -ItemType File | Out-Null
@"
{
    `"FactorySN`": `"$BRIG_ID`",
    `"FirmwareVersion`": `"1.00.01a`",
    `"FirmwareMin`": `"1.00.01a`",
    `"LSICode`": `"CBR`",
    `"LSISubCode`": `"002`"
}
"@ | Set-Content -Path $HUB_CORE_FILE
} else {
    if (-not [string]::IsNullOrWhiteSpace($BRIG_ID)) {
        Write-Host "BRIG_ID modified in $HUB_CORE_FILE"
        (Get-Content -Path $HUB_CORE_FILE) | ForEach-Object {
            $_ -replace "`"FactorySN`": `".*`"", "`"FactorySN`": `"$BRIG_ID`""
        } | Set-Content -Path $HUB_CORE_FILE
    }
}
# Create or update mariadb.json file
if (-Not (Test-Path -Path $MARIA_DB_FILE)) {
    New-Item -Path $MARIA_DB_FILE -ItemType File | Out-Null
@"
{
    `"user`": `"$ROOT_USERNAME`",
    `"pwd`": `"$MYSQL_ROOT_PASSWORD`",
    `"test_user`": `"$MYSQL_USER`",
    `"test_pwd`": `"$MYSQL_PASSWORD`",
    `"host_dckr`": `"192.168.92.11`",
    `"host`": `"localhost`",
    `"port`": $DB_PORT,
    `"db_name`": `"$MYSQL_DATABASE`"
}
"@ | Set-Content -Path $MARIA_DB_FILE
} else {
    if (-not [string]::IsNullOrWhiteSpace($BRIG_ID)) {
        Write-Host "ROOT_USERNAME modified in $MARIA_DB_FILE"
        (Get-Content -Path $MARIA_DB_FILE) | ForEach-Object {
            $_ -replace "`"user`": `".*`"", "`"user`": `"$ROOT_USERNAME`""
        } | Set-Content -Path $MARIA_DB_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_ROOT_PASSWORD)) {
        Write-Host "MYSQL_ROOT_PASSWORD modified in $MARIA_DB_FILE"
        (Get-Content -Path $MARIA_DB_FILE) | ForEach-Object {
            $_ -replace "`"pwd`": `".*`"", "`"pwd`": `"$MYSQL_ROOT_PASSWORD`""
        } | Set-Content -Path $MARIA_DB_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_USER)) {
        Write-Host "MYSQL_USER modified in $MARIA_DB_FILE"
        (Get-Content -Path $MARIA_DB_FILE) | ForEach-Object {
            $_ -replace "`"test_user`": `".*`"", "`"test_user`": `"$MYSQL_USER`""
        } | Set-Content -Path $MARIA_DB_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_PASSWORD)) {
        Write-Host "MYSQL_PASSWORD modified in $MARIA_DB_FILE"
        (Get-Content -Path $MARIA_DB_FILE) | ForEach-Object {
            $_ -replace "`"test_pwd`": `".*`"", "`"test_pwd`": `"$MYSQL_PASSWORD`""
        } | Set-Content -Path $MARIA_DB_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($DB_PORT)) {
        Write-Host "DB_PORT modified in $MARIA_DB_FILE"
        (Get-Content -Path $MARIA_DB_FILE) | ForEach-Object {
            $_ -replace "`"port`": .*,", "`"port`": $DB_PORT,"
        } | Set-Content -Path $MARIA_DB_FILE
    }
    if (-not [string]::IsNullOrWhiteSpace($MYSQL_DATABASE)) {
        Write-Host "MYSQL_DATABASE modified in $MARIA_DB_FILE"
        (Get-Content -Path $MARIA_DB_FILE) | ForEach-Object {
            $_ -replace "`"db_name`": `".*`"", "`"db_name`": `"$MYSQL_DATABASE`""
        } | Set-Content -Path $MARIA_DB_FILE
    }
}

# Create or update mqtt.json file
if (-Not (Test-Path -Path $MQTT_FILE))
{
    New-Item -Path $MQTT_FILE -ItemType File | Out-Null
    @"
{
    `"broker_ip_dckr`": `"192.168.35.2`",
    `"broker_ip`": `"localhost`",
    `"mqtt_client_pwd`": `"$MQTT_PASSWORD`"
}
"@ | Set-Content -Path $MQTT_FILE
} else {
    if (-not [string]::IsNullOrWhiteSpace($MQTT_PASSWORD)) {
        Write-Host "MQTT_PASSWORD modified in $MQTT_FILE"
        (Get-Content -Path $MQTT_FILE) | ForEach-Object {
            $_ -replace "`"mqtt_client_pwd`": `".*`"", "`"mqtt_client_pwd`": `"$MQTT_PASSWORD`""
        } | Set-Content -Path $MQTT_FILE
    } else {
        Write-Host "MQTT_PASSWORD set to empty string"
        (Get-Content -Path $MQTT_FILE) | ForEach-Object {
            $_ -replace "`"mqtt_client_pwd`": `".*`"", "`"mqtt_client_pwd`": `"`""
        } | Set-Content -Path $MQTT_FILE
    }
}