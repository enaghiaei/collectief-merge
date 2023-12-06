function createPool() {
    try {
      require('../config/config.js');
      const mysql = require('mysql2');
  
      const pool = mysql.createPool({
        host: global.config.vals.database.host, port:global.config.vals.database.port,
          user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name,
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0
      });
  
      const promisePool = pool.promise();
  
      return promisePool;
    } catch (error) {
      return//console.log(`Could not connect - ${error}`);
    }
  }
  
  const pool = createPool();
  
  module.exports = {
    connection: async () => pool.getConnection(),
    execute: (...params) => pool.execute(...params),
    release: async () => pool.release(),
  };