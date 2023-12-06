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
        

    });

    // var res1 = con.query("select * FROM session where s_token=?",[token.token], function (err, result0, fields) {  
    //console.log(result0);
    //var val = [[JSON.stringify(schedule)]];
    var sql = "update notification set nt_active='" + schedule.stat + "' where nt_id = ?";
    var where = [schedule.id];
    con.query(sql, where, function (err, result) {
        if (err) throw err;
        updated = result.affectedRows;
        if (updated > 0) {
            var res2 = con.query("select nt_active AS stat,nt_id AS id FROM notification where nt_deleted =0 and nt_user=?", [0], function (err, result, fields) {
               //console.log(result);
                if (schedule.stat == 1) {
                    var time_now = 3600;
                    var sql = "update notification_messages set nt_date = (nt_date - " + time_now + ") where nt_id = ?";
                    var where = [schedule.id];
                    con.query(sql, where, function (err, result2) {
                        con.end();
                    });
                } else {
                    res0.json({ message: 1, result: result });
                    con.end();
                }
            });

        }
        else {
            res0.json({ message: 0 });
            con.end();
        }
       //console.log("Number of records updated: " + result.affectedRows);
    });

    
        //con.close();
        //});
        //console.log(res.sql);

};
