const md5 = require("md5");
const sha1 = require("sha1");

exports.check_ = function (schedule, res0) {
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
    process.env.TZ = 'Etc/Universal';
    const num_t = process.env.n;
   //console.log(global.config)
    var i = 1;
    var today = new Date();
    var today_time = today.getTime();
    //var date1 = new Date(today_time - (1000 * 60 * 60 * i));
    var date1 = new Date(today_time);
    var m = date1.getMinutes();
    //var date = new Date(today_time - (1000 * 60 * m) - (1000 * 60 * 60 * (i + 1)));
    var date = new Date(today_time - (1000 * 15 * 60 * (i)));
    var m2 = date.getMinutes();
    //let date = new Date();
    let today_ = date.toLocaleDateString();
    //console.log("today_", today_)
    var today_tmp = today_.split("/");
    //console.log("today_tmp", today_tmp)
    let today1 = today_tmp[0];
    let today2 = today_tmp[1];
    let today3 = today_tmp[2];
    if (today1 < 10) {
        today1 = "0" + today1;
    }
    if (today2 < 10) {
        today2 = "0" + today2;
    }
    let today_2 = date1.toLocaleDateString();
    ////console.log("today_", today_)
    var today_tmp_2 = today_2.split("/");
    ////console.log("today_tmp", today_tmp)
    let today1_2 = today_tmp_2[0];
    let today2_2 = today_tmp_2[1];
    let today3_2 = today_tmp_2[2];
    if (today1_2 < 10) {
        today1_2 = "0" + today1_2;
    }
    if (today2_2 < 10) {
        today2_2 = "0" + today2_2;
    }
    var s = date.getSeconds();

    var h = date.getHours();
    var h_2 = date1.getHours();
    if (s < 10) {
        s = "0" + s;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (m2 < 10) {
        m2 = "0" + m2;
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (h_2 < 10) {
        h_2 = "0" + h_2;
    }
    var x0 = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + m2 + ":" + "00";
    var x1 = today3_2 + "-" + today1_2 + "-" + today2_2 + " " + h_2 + ":" + m + ":" + "00";
    con.connect(function (err) {
       //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        if (err) throw err;
        var val = [schedule.sensor];
        var res1 = con.query("select nt_operation AS operation,nt_value AS value,measure_kind,measure_name,notification.nt_id,nt_importance FROM notification JOIN notification_types ON notification_types.nte_id = notification.nte_id JOIN measure_types ON measure_types.measure_id = notification_types.measure_id  where nte_deleted = 0 and nt_deleted = 0 and nt_active = 1", function (err, result0, fields) {
           //console.log("***********************************************", result0);
           //console.log(res1.sql);
            for (var key in result0) {

                if (result0[key]) {

                   //console.log("key", key)
                    var op = ""
                    if (result0[key].operation == 0) {
                        op = " < "
                    } else if (result0[key].operation == 1) {
                        op = " = "
                    }
                    else if (result0[key].operation == 2) {
                        op = " > "
                    }
                   //console.log("**")
                    var res2 = con.query("SELECT AVG(measure_value) AS av,MAX(measure_value) AS av_max,MIN(measure_value) AS av_min,'" + h + " to " + h_2 + "' AS range_title,measure_name,sensor_serial,collectief_location.cl_title FROM node_2204036" + num_t + " LEFT JOIN collectief_assignment ON node_2204036" + num_t + ".sensor_serial = collectief_assignment.sensor_id LEFT JOIN collectief_location ON collectief_location.cl_id = collectief_assignment.cl_id  WHERE measure_kind = '" + result0[key].measure_kind + "' AND measure_name = '" + result0[key].measure_name + "'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "' GROUP BY sensor_serial,cl_title,measure_name HAVING AVG(measure_value) " + op + result0[key].value, function (err, result1, fields) {
                       //console.log(res2.sql);
                       //console.log(result1)
                        var message = ""
                       //console.log("###")
                       //console.log("key", key)

                        for (var key2 in result1) {

                            if (result0[key].operation == 0) {
                                if (result1[key2].cl_title != "" && result1[key2].cl_title != null)
                                    message = result0[key].measure_name + " of " + result1[key2].cl_title + " is LOW ";
                                else
                                    message = result0[key].measure_name + " is LOW ";
                            } else if (result0[key].operation == 1) {
                                message = ""
                            }
                            else if (result0[key].operation == 2) {
                                //message = result0[key].measure_name + " is HIGH ";
                                //message = result0[key].measure_name + " is HIGH ";
                                if (result1[key2].cl_title != "" && result1[key2].cl_title != null)
                                    message = result0[key].measure_name + " of " + result1[key2].cl_title + " is HIGH ";
                                else
                                    message = result0[key].measure_name + " is HIGH ";
                            }

                            var time = 3600;
                            var time_now = Math.floor(new Date().getTime() / 1000);
                            if (result0[key].importance == 2)
                                time = 1800
                            else if (result0[key].importance == 3)
                                time = 900

                           //console.log("message", message)

                            if (result1.length > 0) {
                               //console.log("$$$")
                                var res4 = con.query("SELECT * FROM notification_messages  WHERE nm_message = '" + message + "'  AND (" + time_now + " - nt_date) < '" + time + "'", function (err, result4, fields) {
                                    if (result4.length == 0) {
                                       //console.log(res4.sql);
                                        var val = [[result0[0].nt_id, result1[key2].av, message, Math.floor(new Date().getTime() / 1000), result1[key2].sensor_serial]];
                                        var res = con.query("INSERT INTO notification_messages (nt_id,nm_value,nm_message,nt_date,nm_sensor_id) VALUES ?", [val], function (err, result, fields) {
                                           //console.log(res.sql);
                                            //console.log(result); 
                                            insert_id = result.insertId;
                                            if (insert_id > 0) {
                                                //res0.json({ message: 1, token: insert_id });
                                            }
                                            else {
                                                //res0.json({ message: 0 });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                // res0.json({ message: -1, token: -1 });
                            }

                        }

                    }
                    );

                }

            }
            res0.json({ message: -1, token: -1 });
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
       // else {
       //     res0.json({ message: -1, token: -1 });
       // }
        
        });
        //console.log(res.sql);

  
    //con.close();    
 

};
