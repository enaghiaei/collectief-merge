const e = require("express");
const md5 = require("md5");
const sha1 = require("sha1");

exports.get_users_detail = function (token,res0) {
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
        
        
      });

    var res1 = con.query("select * FROM session where s_token=?", [token.token], function (err, result0, fields) {
       //console.log(result0);
        if (result0[0]) {
            var res = con.query("select * FROM users LEFT JOIN users_detail ON users.user_id = users_detail.user_id where users.token=?", [token.user_token], function (err, result, fields) {
               //console.log("result",result)

                res0.json({ result: result });
                con.end();
                
            });
        } else {
            res0.json({ result: [] });
            con.end();
        }

    });
        //console.log(res.sql);

    
      
  };
