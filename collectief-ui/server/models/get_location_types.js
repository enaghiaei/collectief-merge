const e = require("express");
const md5 = require("md5");
const sha1 = require("sha1");

exports.get_location_types = function (token,res0) {
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

    var res1 = con.query("select user_type FROM session JOIN users ON users.user_id = session.s_user_id where s_token=?", [token.token], function (err, result0, fields) {
       //console.log(result0);
        if (result0[0]) {
            var res = con.query("select * FROM area_location_types where alt_deleted = 0", [], function (err, result, fields) {
               //console.log(result);
                var user_types_list = [];
                for (var key in result) {
                    var user_types = JSON.parse(result[key]["alt_user_types"]);
                   //console.log(user_types);
                    if (user_types["user_types"].includes(result0[0]["user_type"])) {
                        var index = user_types_list.length;
                        if (!user_types_list[user_types_list.length])
                            user_types_list[user_types_list.length] = {};
                        user_types_list[index]["title"] = result[key]["alt_title"];
                        user_types_list[index]["id"] = result[key]["alt_id"];
                    }
                }
               //console.log("user_types_list", user_types_list)
                res0.json({ result: user_types_list });
                con.end();
            });
        } else {
            res0.json({ result: [] });
            con.end();
        }

    });

  
      
  };
