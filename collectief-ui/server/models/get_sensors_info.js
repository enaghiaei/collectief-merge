const md5 = require("md5");
const sha1 = require("sha1");
require('dotenv').config();
var mysql = require('mysql2/promise');
var config = require('../config/config.js');
async function get_sensors_info(token,res0) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    //var sqlite3 = require('sqlite3');
    //var sqlite = require('sqlite-sync');
    const num_t = process.env.n;
    //const Database = require('better-sqlite3');


    let [rows, fields] = [[], []];
    let [rows2, fields2] = [[], []];
    //let [rows2_0, fields2_0] = [[], []];
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
        db.each(`SELECT DISTINCT sensor_serial FROM node_22040367`, (err, row) => {
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
    var date = new Date(today.getTime() - (1000 * 30 * 60 * 1));
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
    var x = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + m + ":" + s;
    //sqlite.connect("./db/XYZ_API_sphensor_data.db");
    var rows3 = [];
    if (num_t == "7") {
        //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM node_2204036" + num_t + " WHERE 1=1").all();
    }
    else
        [rows, fields] = await con.execute("SELECT DISTINCT sensor_serial FROM node_2204036" + num_t + " WHERE timestamp >= '" + x + "'");
    console.log("SELECT DISTINCT sensor_serial FROM node_2204036" + num_t + " WHERE timestamp >= '" + x + "'")
   //console.log(rows);
    var g = 0;
    for (var key in rows) {
        if (num_t == "7")
            [rows2, fields2] = await con.execute("SELECT * FROM node_2204036" + num_t + " where  sensor_serial='" + rows[key].sensor_serial + "' order by timestamp desc LIMIT 1");
        else
            [rows2, fields2] = await con.execute("SELECT * FROM node_2204036" + num_t + " where timestamp >= '" + x + "'" + " AND sensor_serial='" + rows[key].sensor_serial + "' order by timestamp desc LIMIT 1");
       //console.log(rows2)
        console.log("SELECT * FROM node_2204036" + num_t + " where timestamp >= '" + x + "'" + " AND sensor_serial='" + rows[key].sensor_serial + "' order by timestamp desc LIMIT 1")
        //2023 - 03 - 05T15: 05: 04.000Z
        //rows2[0].timestamp;
        var xxx = rows2[0].timestamp;
        var zzz = xxx + ""
        var ggg = rows2[0].timestamp.toISOString()
       //console.log(ggg)
        var xx = ggg.split('.');
       //console.log(xx)
        var y = xx[0].split('T');
        var z0 = y[0].replace(' ', '');
        var z1 = y[1].replace(' ', '');
        var z = z0 + ' ' + z1;
       //console.log("zzzzzzzzz" , z)
       //console.log("SELECT DISTINCT sensor_serial, measure_name, measure_value, measure_kind, sensor_type, channel, timestamp FROM node_2204036" + num_t + " where timestamp = '" + rows2[0].timestamp + "'" + " AND sensor_serial = '" + rows[key].sensor_serial + "'")
        var [rows2_0, fields2_0] =  await con.execute("SELECT DISTINCT sensor_serial,measure_name,measure_value,measure_kind,sensor_type,channel,timestamp FROM node_2204036" + num_t + " where timestamp = '" + z + "'" + " AND sensor_serial='" + rows[key].sensor_serial + "'");
        console.log("SELECT DISTINCT sensor_serial,measure_name,measure_value,measure_kind,sensor_type,channel,timestamp FROM node_2204036" + num_t + " where timestamp = '" + z + "'" + " AND sensor_serial='" + rows[key].sensor_serial + "'")
        for (var key2_0 in rows2_0) {
            rows3[g++] = rows2_0[key2_0];
        }
    }
    await con.commit();
    con.close();
    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM node_22040367").all();
   //console.log(rows3);
    res0.json({ result: rows3 });  
    return { result: rows3 }
};

module.exports = {
    get_sensors_info: get_sensors_info
}
