const e = require("express");
const md5 = require("md5");
const sha1 = require("sha1");

exports.get_users_access = function (token,res0) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1=false;
    var mysql = require('mysql2'); var config = require('../config/config.js');
    var con = mysql.createConnection({
        host: global.config.vals.database.host, port:global.config.vals.database.port,
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
      });
     //console.log("eeeeeeesssssssssssssss");
     //console.log(token);
     //console.log("bbbbbbbbbbbbbeeeeeeesssssssssssssss");

      con.connect(function(err) {
        
        if (err) throw err;
        
        //console.log(res.sql);
        
      });

    var res1 = con.query("select * FROM session where s_token=?", [token.token], function (err, result0, fields) {
       //console.log(result0);
        if (result0[0]) {
            var res = con.query("select users.email,collectief_location_access.cla_id AS id FROM users JOIN collectief_location_access ON collectief_location_access.cla_user = users.user_id where cla_deleted = 0 AND cl_id=?", [token.id], function (err, result, fields) {
               //console.log(result);
                res0.json({ result: result });
                con.end();
            });
        } else {
            res0.json({ result: [] });
            con.end();
        }

    });

  
      
  };
