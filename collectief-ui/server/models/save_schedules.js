const md5 = require("md5");
const sha1 = require("sha1");

exports.save_schedules = function (schedule, res0) {
    //console.log(schedule)
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    var insert_id = 0;
    var mysql = require('mysql2'); var config = require('../config/config.js');
    var con = mysql.createConnection({
        host: global.config.vals.database.host, port: global.config.vals.database.port,
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
    });
    //console.log(global.config)
    con.connect(function (err) {

        if (err) throw err;


    });

    var res1 = con.query("select * FROM session where s_token=?", [schedule.token], function (err, result0, fields) {
        //console.log(result0);
        var val = [JSON.stringify(schedule.schedule), result0[0]["s_user_id"], schedule.location, schedule.type, schedule.mode];
        var res = con.query("INSERT INTO schedule (sc_schedule,user_id,sc_location,sc_type,sc_mode) VALUES ?", [[val]], function (err, result, fields) {
            //console.log(res.sql);
            //console.log(result); 
            insert_id = result.insertId;
            if (insert_id > 0)
                res0.json({ message: 1, token: insert_id });
            else {
                res0.json({ message: 0 });
            }
            con.end();
            //con.close();
            /* if (insert_id > 0) {
    
                 sql = "update projects_file set pf_token='" + md5(sha1(insert_id)) + "' where pf_id = ?";
                 var where = [insert_id];
                 con.query(sql, where, function (err, result) {
                     if (err) throw err;
                     updated = result.affectedRows;
                     if (insert_id > 0 && updated > 0)
                         res0.json({ message: 1, r1: r1, token: md5(sha1(insert_id)) });
                     else {
                         res0.json({ message: 0, r1: r1 });
                     }
                    //console.log("Number of records updated: " + result.affectedRows);
                 });
             }*/

        });
        //con.close();
    });
    //console.log(res.sql);




};
