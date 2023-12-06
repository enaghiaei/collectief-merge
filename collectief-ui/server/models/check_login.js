const md5 = require("md5");
const sha1 = require("sha1");

exports.check_ = function (token,res1) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var mysql = require('mysql2');
    var config = require('../config/config.js');
    var con = mysql.createConnection({
        host: global.config.vals.database.host, port:global.config.vals.database.port,
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
      });
      
      con.connect(function(err) {
        
        if (err) throw err;

       
      });
    var res = con.query("delete FROM session where s_token=?", [token.token], function (err, result, fields) {
       //console.log(result);

        if (result.affectedRows > 0) {
            res1.json({ message: 1 });
        }
        else {
            res1.json({ message: 0 });
        }
        con.end();
    });
    //console.log(res.sql);
    
  };
