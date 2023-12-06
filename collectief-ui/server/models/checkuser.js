const md5 = require("md5");
const sha1 = require("sha1");

exports.login = function (res1,email,password,ip) {
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
       //console.log(email);
       //console.log(password);
        if (err) throw err;
            
      });
    var res = con.query("SELECT * FROM users where email=? and password=?", [email, md5(password)], function (err, result, fields) {
        if (err) throw err;
       //console.log(result);
        var string = JSON.stringify(result);
       //console.log('>> string: ', string);
        if (result.length > 0) {
            var insert_id = 0;
            var updated = 0;
            var sql = "INSERT INTO session (s_ip, s_first_time, s_last_time, s_info, s_user_id) VALUES ?";
            var values = [
                [ip, login_time, login_time, "", result[0].user_id],

            ];
            var user_type = result[0].user_type
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                insert_id = result.insertId;
               //console.log(result);
               //console.log("insertId==" + result.insertId);
               //console.log("Number of records inserted: " + result.affectedRows);
                if (insert_id > 0) {
                    sql = "update session set s_token='" + md5(sha1(insert_id)) + "' where s_id = ?";
                    var where = [insert_id];
                    con.query(sql, where, function (err, result) {
                        if (err) throw err;
                        updated = result.affectedRows;
                        if (insert_id > 0 && updated > 0)
                            res1.json({ message: 1, token: md5(sha1(insert_id)), user_type: user_type });
                        else {
                            res1.json({ message: 0 });
                        }
                       //console.log("Number of records updated: " + result.affectedRows);
                        con.end();
                    });
                }
              
            });
           //console.log("insert id = " + insert_id);

        }
        else {
            res1.json({ message: 0 });
            con.end();
        }
        //var json =  JSON.parse(string);
       
        return string;
    });
    //console.log(res.sql);
    
  };
