require('dotenv').config();
module.exports = global.config = {
    vals: {
        local_ip: {
            value: process.env.LOCAL_IP
        },
        root: {
            ip: "localhost:8081"
        },
        database: {                       
            user: process.env.DB_USER,
            password: process.env.DB_PASS, 
            name: process.env.DB_NAME,
            port: process.env.DB_PORT,
            host: process.env.DB_HOST

        },        
        database_hub_core: {                      
            user: process.env.DB_HUB_USER,
            password: process.env.DB_HUB_PASS,
            name: process.env.DB_HUB_NAME,
            port: process.env.DB_HUB_PORT,
            host: process.env.DB_HUB_HOST
        }
        // rest of your translation object
    }
    // other global config variables you wish
    //  value: "192.168.43.91"
};