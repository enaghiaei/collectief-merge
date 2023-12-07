
# Collectief Initial Deployment Facility Manager and End User

Welcome to the repository for the initial deployable version of the Collectief application. This document provides instructions on how to set up and run this version.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Docker Desktop
- A git client to clone the repository

## Setup Instructions

### Initial Setup
0. Clone the repository to your local machine

1. Change directory to the `edge-node-components` and run the setup script.
   ```
   cd edge-node-components/
   ./setup.ps1
   ```

### Configuration
2. Use the following values during the setup process:

   - When running `setup.sh`, use the values below:
     ```
     ROOT_USERNAME: root
     BRIG_ID: 22040368
     MYSQL_ROOT_PASSWORD: marco
     MYSQL_DATABASE: collectief_db
     DB_PORT: 3306
     MYSQL_USER: collectief
     MYSQL_PASSWORD: collectief
     MQTT_PASSWORD: 
     ```

3. In the `collectief-ui/server/.env` directory, add or update the values in the `.env` file as follows:
   
   **Note:** `LOCAL_IP` is your local network IP address. You can find it by typing the command `ipconfig/all` in cmd.
   
   **Note:** Values for `DB_HUB_*` parameters do not need to be updated unless values for `hub_core/setup.sh` have been changed from step 2.
   
   ```
   LOCAL_IP = "YOUR_LOCAL_NETWORK_IP"
   DB_USER = "collectief_user"
   DB_PASS = "collectief_user"
   DB_NAME = "collectief"
   DB_HOST = "mysql_db"
   DB_PORT = "3307"
   DB_HUB_USER = "root"
   DB_HUB_PASS = "marco"
   DB_HUB_NAME = "collectief_db"
   DB_HUB_HOST = "maria_db"
   DB_HUB_PORT = "3306"
   ```

### Deployment
4. In the `collectief-ui` directory, open `docker-compose_for_all.txt`, copy all text and paste it into the `docker-compose.yml` file in the `edge-node-components` directory.

5. In the `edge-node-components` directory, run the following command:
   ```
   docker compose up
   ```

6. Access the COLLECTiEf application interface by navigating to `http://localhost:3003` in a web browser (Edge or Chrome preferred; do not use Safari).

## User Login

### Facility Manager
To log in as a facility manager, use the following credentials:
- **User:** collectief3@gmail.com
- **Pass:** 12345678

Here, you can add new users (end-users) and assign zones to them. Once the users are created, use their respective email and password to log in as an end-user.

### Cluster Manager
A demo of the cluster node user view is presented when logging in with the following account. Note that it's not populated with real data.
- **User:** collectief2@gmail.com
- **Pass:** 12345678
