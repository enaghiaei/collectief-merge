const md5 = require("md5");
const sha1 = require("sha1");

exports.update_ = function (schedule, res0) {
   //console.log(schedule)
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    var insert_id = 0;
    var mysql = require('mysql2'); var config = require('../config/config.js');
    var con = mysql.createConnection({
        host: global.config.vals.database.host, port:global.config.vals.database.port,        
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
    });

    con.connect(function (err) {

        if (err) throw err;
        // var res1 = con.query("select * FROM session where s_token=?",[token.token], function (err, result0, fields) {  
        //console.log(result0);
        //var val = [[JSON.stringify(schedule)]];
        
        //con.close();
        //});
        //console.log(res.sql);

    });
    var sql = "update schedule set sc_schedule='" + schedule.sce + "',sc_location='" + schedule.location + "',sc_type='" + schedule.type + "',sc_mode='" + schedule.mode + "' where sc_id = ?";
    var where = [schedule.id];
    console.log("where", where)
    console.log("sql", sql)
    var res1 = con.query("select * FROM session where s_token=?", [schedule.token], function (err, result0, fields) {
        var where = [schedule.id];
        var sql1 = "select * FROM schedule where sc_id = ?";
        con.query(sql1, where, function (err, result1) {
            con.query(sql, where, function (err, result) {
                if (err) throw err;
                updated = result.affectedRows;
                if (updated > 0) {
                    if (schedule.location != "") {
                        var res2 = con.query("select sc_schedule AS sce,sc_id AS id,sc_active AS active,sc_mode AS mode FROM schedule where sc_deleted =0 and user_id=? and sc_location=?", [result0[0]["s_user_id"], result1[0]["sc_location"]], function (err, result, fields) {
                            //console.log(result);
                            res0.json({ message: 1, result: result });
                            con.end();
                        });
                    } else {
                        var res2 = con.query("select sc_schedule AS sce,sc_id AS id,sc_active AS active,sc_mode AS mode FROM schedule where sc_deleted =0 and user_id=?", [result0[0]["s_user_id"]], function (err, result, fields) {
                            //console.log(result);
                            res0.json({ message: 1, result: result });
                            con.end();
                        });
                    }

                }
                else {
                    res0.json({ message: 0 });
                    con.end();
                }
               //console.log("Number of records updated: " + result.affectedRows);
            });
        });

    });

    };

