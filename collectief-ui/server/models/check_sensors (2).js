const md5 = require("md5");
const sha1 = require("sha1");
require('dotenv').config();
var mysql = require('mysql2/promise');
var config = require('../config/config.js');
async function check_sensors(token,res0) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    //var sqlite3 = require('sqlite3');
    //var sqlite = require('sqlite-sync');
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
    var today = new Date();
    var date = new Date(today.getTime() - (1000 * 60 * 60 * 2));
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
    var s = date.getSeconds();
    var m = date.getMinutes();
    var h = date.getHours();
    if (s < 10) {
        s = "0" + s;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (h < 10) {
        h = "0" + h;
    }
    var x = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + m + ":" + "00";

   //console.log("check_sensors");

    [rows0, fields0] = await con.execute("SELECT DISTINCT * FROM notification  WHERE nt_id = 7 and nt_active = 1");
    [rows, fields] = await con.execute("SELECT DISTINCT sensor_serial FROM node_per_quarter  WHERE 1");

   //console.log(rows)

    for (var key in rows) {
        [rows2, fields2] = await con.execute("SELECT * FROM sensors_list  WHERE sl_sensor = ?", [rows[key].sensor_serial]);
        if (rows2.length == 0) {
            [rows3] = await con.execute("INSERT INTO sensors_list (sl_sensor)  VALUES (" + rows[key].sensor_serial+")");
        }
    }
    [rows5] = await con.execute("UPDATE sensors_list SET sl_status = 2 WHERE 1=1");
    [rows6, fields6] = await con.execute("SELECT DISTINCT sensor_serial FROM node_220403690  WHERE timestamp >= '" + x + "'");
    console.log("list sensor serial", rows6)
    for (var key in rows6) {
        [rows7] = await con.execute("UPDATE sensors_list SET sl_status = 1 WHERE sl_sensor = ?", [rows6[key].sensor_serial]);
    }
    [rows7] = await con.execute("UPDATE sensors_list SET sl_status = 0 WHERE sl_status = 2");
    //sqlite.close();
    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM main.node_22040367").all();
    //db.close();
    [rows2_0, fields2_0] = await con.execute("SELECT sl_sensor,sl_status FROM sensors_list  WHERE 1=1");
   //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
   //console.log(rows2_0)
   //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    for (var key in rows2_0) {
       //console.log("sensor",rows2_0[key].sl_sensor)
       //console.log("status", rows2_0[key].sl_status)
        if (rows2_0[key].sl_status == 1) {
           //console.log("in0")
            [rows7_0] = await con.execute("UPDATE notification_messages SET nm_archived = 1 WHERE nm_type = 1 and nm_sensor_id = ?", [rows2_0[key].sl_sensor]);
            [rows7_0] = await con.execute("UPDATE notification_messages SET nm_archived = 0 WHERE nm_type = 0 and nm_sensor_id = ?", [rows2_0[key].sl_sensor]);
        }
        else {
           //console.log("in1")
            [rows7_0] = await con.execute("UPDATE notification_messages SET nm_archived = 1 WHERE nm_type = 0 and nm_sensor_id = ?", [rows2_0[key].sl_sensor]);
        }
    }
   //console.log(rows);
    if (rows0.length > 0) {
        [rows8, fields8] = await con.execute("SELECT DISTINCT sl_sensor AS sensor_serial,collectief_location.cl_title,cl_deleted,ca_deleted FROM sensors_list  LEFT JOIN collectief_assignment on sensors_list.sl_sensor = collectief_assignment.sensor_id  LEFT JOIN collectief_location ON collectief_location.cl_id = collectief_assignment.cl_id   WHERE sl_status = 0");

        for (var key in rows8) {
            var flag_ins = 1;
            if (rows8[key].cl_title != "" && rows8[key].cl_title != null) {
                message = "The " + rows8[key].sensor_serial + " sensor is disconnected from " + rows8[key].cl_title;
                if (parseInt(rows8[key].ca_deleted) == 1) {
                    flag_ins = 0;
                }
                if (parseInt(rows8[key].cl_deleted) == 1) {
                    flag_ins = 0;
                }

            }
            else
                message = "The " + rows8[key].sensor_serial + " sensor is disconnected";
            if (flag_ins == 0) {
                message = "The " + rows8[key].sensor_serial + " sensor is disconnected";
            }
            if (1 == 1) {
                var impo = 0;
                var time = 3600;
                var time_now = Math.floor(new Date().getTime() / 1000);
                if (impo == 1)
                    time = 1800
                else if (impo == 2)
                    time = 900

               //console.log("message", message)
                var [result4, fields4] = await con.execute("SELECT * FROM notification_messages  WHERE nm_message = '" + message + "'  AND (" + time_now + " - nt_date2) < '" + time + "'");
                var [result5, fields5] = await con.execute("SELECT * FROM notification_messages  WHERE nm_message = '" + message + "'");
                var vals = "7" + ",'" + "0" + "','" + message + "','" + Math.floor(new Date().getTime() / 1000) + "','" + Math.floor(new Date().getTime() / 1000) + "','" + rows8[key].sensor_serial + "',1";
                if (result4.length == 0 && result5.length == 0) {
                    [result7] = await con.execute("INSERT INTO notification_messages (nt_id,nm_value,nm_message,nt_date,nt_date2,nm_sensor_id,nm_type) VALUES (" + vals + ")");
                } else if (result4.length == 0) {
                    [result6] = await con.execute("update notification_messages set nm_seen = 0 , nm_deleted = 0 , nm_archived = 0 , nt_date = " + time_now + " , nt_date2 = " + time_now + " where nm_message = '" + message + "'");
                }
            }
        }
    }
    res0.json({ result: rows });  
    await con.commit();
    await con.end()
    con.close();
   
    return { result: rows }
};

module.exports = {
    check_sensors: check_sensors
}
