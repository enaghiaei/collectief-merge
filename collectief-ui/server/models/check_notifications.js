const md5 = require("md5");
const sha1 = require("sha1");
require('dotenv').config();
var mysql = require('mysql2/promise');
var config = require('../config/config.js');
async function check_(token, res0) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    //var sqlite3 = require('sqlite3');
    //var sqlite = require('sqlite-sync');
    const num_t = process.env.n;
    //const Database = require('better-sqlite3');


    let [rows, fields] = [[], []];
    var con = await mysql.createConnection({
        host: global.config.vals.database.host, port:global.config.vals.database.port,
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
    });

    await con.beginTransaction();
    /*let db = new sqlite('./db/XYZ_API_sphensor_data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error("err00",err.message);
        }
       //console.log('Connected to the chinook database.');
    });

    db.serialize(() => {
        var result = [];
        db.each(`SELECT DISTINCT sensor_serial FROM main.node_22040367`, (err, row) => {
            if (err) {
                console.error("errrrrroor",err.message);
            }
           //console.log(row);
            result[result.length] = row;
        });
        res0.json({ result: result });   
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
       //console.log('Close the database connection.');
    });
    */
    process.env.TZ = 'Etc/Universal';
    //const num_t = process.env.n;
   //console.log(global.config)
    var i = 1;
    var today = new Date();
    var today_time = today.getTime();
    //var date1 = new Date(today_time - (1000 * 60 * 60 * i));
    var date1 = new Date(today_time);
    var m = date1.getMinutes();
    //var date = new Date(today_time - (1000 * 60 * m) - (1000 * 60 * 60 * (i + 1)));
    var date = new Date(today_time - (1000 * 60 * 12 * 60 * (i)));
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

    [result0, fields] = await con.execute("select nt_operation AS operation,nt_value AS value,measure_kind,measure_name,notification.nt_id,nt_importance FROM notification JOIN notification_types ON notification_types.nte_id = notification.nte_id JOIN measure_types ON measure_types.measure_id = notification_types.measure_id  where nte_deleted = 0 and nt_deleted = 0 and nt_active = 1");
    console.log(result0)
    console.log("select nt_operation AS operation,nt_value AS value,measure_kind,measure_name,notification.nt_id,nt_importance FROM notification JOIN notification_types ON notification_types.nte_id = notification.nte_id JOIN measure_types ON measure_types.measure_id = notification_types.measure_id  where nte_deleted = 0 and nt_deleted = 0 and nt_active = 1");

    for (var key in result0) {
       //console.log("key", key)
        var op = ""
        var ope = result0[key].operation
        var mn = result0[key].measure_name
        var impo = result0[key].importance
        var nt_id = result0[key].nt_id
        if (result0[key].operation == 0) {
            op = " < "
        } else if (result0[key].operation == 1) {
            op = " = "
        }
        else if (result0[key].operation == 2) {
            op = " > "
        }
        [result1, fields2] = await con.execute("SELECT MAX(ca_deleted) AS ca_deleted,MAX(cl_deleted) AS cl_deleted,AVG(measure_value) AS av,MAX(measure_value) AS av_max,MIN(measure_value) AS av_min,'" + h + " to " + h_2 + "' AS range_title,measure_name,sensor_serial,collectief_location.cl_title FROM node_2204036" + num_t + " JOIN sensors_list ON sensors_list.sl_sensor =  node_2204036" + num_t + ".sensor_serial LEFT JOIN collectief_assignment ON node_2204036" + num_t + ".sensor_serial = collectief_assignment.sensor_id LEFT JOIN collectief_location ON collectief_location.cl_id = collectief_assignment.cl_id  WHERE measure_kind = '" + result0[key].measure_kind + "' AND measure_name = '" + result0[key].measure_name + "'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "' AND sl_status = 1 GROUP BY sensor_serial,cl_title,measure_name HAVING AVG(measure_value) " + op + result0[key].value);
        console.log("SELECT MAX(ca_deleted) AS ca_deleted,MAX(cl_deleted) AS cl_deleted,AVG(measure_value) AS av,MAX(measure_value) AS av_max,MIN(measure_value) AS av_min,'" + h + " to " + h_2 + "' AS range_title,measure_name,sensor_serial,collectief_location.cl_title FROM node_2204036" + num_t + " JOIN sensors_list ON sensors_list.sl_sensor =  node_2204036" + num_t + ".sensor_serial LEFT JOIN collectief_assignment ON node_2204036" + num_t + ".sensor_serial = collectief_assignment.sensor_id LEFT JOIN collectief_location ON collectief_location.cl_id = collectief_assignment.cl_id  WHERE measure_kind = '" + result0[key].measure_kind + "' AND measure_name = '" + result0[key].measure_name + "'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "' AND sl_status = 1 GROUP BY sensor_serial,cl_title,measure_name HAVING AVG(measure_value) " + op + result0[key].value);
        console.log(result1);
        var message = ""
       //console.log("###")
       //console.log("key", key)

        for (var key2 in result1) {
           //console.log(result0[key])
            var flag_ins = 1;
            if (parseInt(result1[key2].ca_deleted) == 1) {
                flag_ins = 0;
            }
            if (parseInt(result1[key2].cl_deleted) == 1) {
                flag_ins = 0;
            }
            if (parseInt(ope) == 0) {
                
                if (result1[key2].cl_title != "" && result1[key2].cl_title != null && flag_ins == 1)
                    message = mn + " of " + result1[key2].cl_title + " is LOW ";
                else
                    message = mn + " of " + result1[key2].sensor_serial + " is LOW ";
            } else if (parseInt(ope) == 1) {
                message = ""
            }
            else if (parseInt(ope) == 2) {
                //message = result0[key].measure_name + " is HIGH ";
                //message = result0[key].measure_name + " is HIGH ";
                if (result1[key2].cl_title != "" && result1[key2].cl_title != null && flag_ins == 1)
                    message = mn + " of " + result1[key2].cl_title + " is HIGH ";
                else
                    message = mn + " of " + result1[key2].sensor_serial + " is HIGH ";
            }

            var time = 3600;
            var time_now = Math.floor(new Date().getTime() / 1000);
            if (impo == 1)
                time = 1800
            else if (impo == 2)
                time = 900



           //console.log("message", message)
            var [result4, fields4] = await con.execute("SELECT * FROM notification_messages  WHERE nm_message = '" + message + "'  AND (" + time_now + " - nt_date2) < '" + time + "'");
            var [result5, fields5] = await con.execute("SELECT * FROM notification_messages  WHERE nm_message = '" + message + "'");
            var vals = nt_id + ",'" + result1[key2].av + "','" + message + "','" + Math.floor(new Date().getTime() / 1000) + "','" + Math.floor(new Date().getTime() / 1000) +"','" + result1[key2].sensor_serial + "'";
            if (result4.length == 0 && result5.length == 0) {
                [result7] = await con.execute("INSERT INTO notification_messages (nt_id,nm_value,nm_message,nt_date,nt_date2,nm_sensor_id) VALUES (" + vals + ")");
            } else if (result4.length == 0) {     
                [result6] = await con.execute("update notification_messages set nm_seen = 0 , nm_deleted = 0 , nt_date = " + time_now + " , nt_date2 = " + time_now +" where nm_message = '" + message + "'");
            }

        }

    }

    //db.close();
    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM main.node_22040367").all();
   //console.log(rows);
    await con.commit();
    await con.end();
    con.close();
    res0.json({ result: rows });
    return { result: rows }
};

module.exports = {
    check_: check_
}
