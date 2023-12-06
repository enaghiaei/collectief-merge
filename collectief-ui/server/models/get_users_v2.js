const e = require("express");
const md5 = require("md5");
const sha1 = require("sha1");

exports.get_users_v2 = function (token,res0) {
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
            var res = con.query("select * FROM users LEFT JOIN users_detail ON users.user_id = users_detail.user_id where users.user_id=?", [result0[0].s_user_id], function (err, result, fields) {
               //console.log("result",result)
                if (result[0]["user_type"] == 4) {
                   //console.log(result);
                    var res = con.query("select distinct users.* FROM users LEFT JOIN users_detail ON users.user_id = users_detail.user_id where users.user_id=?", [result0[0].s_user_id], function (err, result, fields) {

                        res0.json({ result: result });
                        con.end();
                    });
                }
                else if (result[0]["user_type"] == 3) {
                    var res = con.query("select distinct users.* FROM users LEFT JOIN users_detail on users.user_id = users_detail.user_id LEFT JOIN collectief_location ON collectief_location.cl_id = location_id WHERE (location_id=? OR cl_parent=?)", [result[0].location_id, result[0].location_id], function (err, result2, fields) {
                      //console.log(res.sql)
                      //console.log(result2);
                        res0.json({ result: result2 });
                        con.end();
                    });
                }
                else if (result[0]["user_type"] == 2) {
                    var res = con.query("select distinct users.* FROM users LEFT JOIN users_detail on users.user_id = users_detail.user_id LEFT JOIN collectief_location ON collectief_location.cl_id = location_id WHERE (location_id=? OR cl_parent=?)", [result[0].location_id, result[0].location_id], function (err, result2, fields) {
                       //console.log(res.sql)
                       //console.log(result);
                        res0.json({ result: result2 });
                        con.end();
                    });
                }
                else if (result[0]["user_type"] == 1) {
                    var res = con.query("select distinct users.* FROM users LEFT JOIN users_detail ON users.user_id = users_detail.user_id WHERE user_type != 0", [], function (err, result2, fields) {
                       //console.log(res.sql)
                       //console.log(result);
                        res0.json({ result: result2 });
                        con.end();
                    });
                }
            });
        } else {
            res0.json({ result: [] });
            con.end();
        }

    });
        //console.log(res.sql);

    
      
  };
