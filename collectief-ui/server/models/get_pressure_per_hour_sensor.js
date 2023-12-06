const md5 = require("md5");
const sha1 = require("sha1");
require('dotenv').config();
var mysql = require('mysql2/promise');
var config = require('../config/config.js');
//exports.get_temperature_per_hour = function (token, res0) {
async function get_pressure_per_hour(token, res0) {
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
    //con.connect(function (err) {
    //    if (err) throw err;
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
  
        var row_all = [];
        var k = 0;
    for (var i = 1; i > 0; i--) {
       
          
           //console.log("i==", i);
            //const db = new Database('./db/XYZ_API_sphensor_data.db', { verbose: console.log });
            var today = new Date();
            var today_time = today.getTime();
            var date1 = new Date(today_time);
            var m = date1.getMinutes();
            //var date = new Date(today_time - (1000 * 60 * m) - (1000 * 60 * 60 * (i + 7)));
            var date = new Date(today_time - (1000 * 60 * 60 * (i + 7)));
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
            //console.log("today_", today_)
            var today_tmp_2 = today_2.split("/");
            //console.log("today_tmp", today_tmp)
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
            if (h < 10) {
                h = "0" + h;
            }
            if (h_2 < 10) {
                h_2 = "0" + h_2;
            }
            var x0 = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + "00" + ":" + "00";
            var x1 = today3_2 + "-" + today1_2 + "-" + today2_2 + " " + h_2 + ":" + "00" + ":" + "00";
            //console.log("x0:", x0);
            //console.log("x1:", x1);
            //sqlite.connect("./db/XYZ_API_sphensor_data.db");
        [rows, fields] = await con.execute("SELECT nph_avg AS av,nph_max AS av_max,nph_min AS av_min,nph_from AS range_title,nph_name AS measure_name,sensor_serial FROM node_per_quarter  WHERE nph_kind = 'Pressure'" + " AND nph_from2 >= '" + x0 + "'" + " AND nph_from2 <= '" + x1 + "' ");
        for (var key in rows) {
            if (rows[key]["av"] === null || rows[key]["av"] === "null" || rows[key]["av"] === "")
                rows[key]["av"] = 0;
            else {
                rows[key]["av"] = parseFloat(rows[key]["av"]);
            }
            if (rows[key]["av_max"] === null || rows[key]["av_max"] === "null" || rows[key]["av_max"] === "")
                rows[key]["av_max"] = 0;
            else {
                rows[key]["av_max"] = parseFloat(rows[key]["av_max"]);
            }
            if (rows[key]["av_min"] === null || rows[key]["av_min"] === "null" || rows[key]["av_min"] === "")
                rows[key]["av_min"] = 0;
            else {
                rows[key]["av_min"] = parseFloat(rows[key]["av_min"]);
            }
        }
        row_all[k++] = rows;
        /*var res1 = con.query("SELECT AVG(measure_value) AS av,'" + h + "to" + h_2 + "' AS range_title FROM node_2204036" + num_t + " WHERE measure_kind = 'Temperature'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "'", [], function (err, result0, fields) {
                //var rows = db.prepare("SELECT AVG(measure_value) AS av,'" + h + "to" + h_2 + "' AS range_title FROM main.node_2204036" + num_t + " WHERE measure_kind = 'Temperature'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "'").all();
               //console.log("SELECT AVG(measure_value) AS av,'" + h + "to" + h_2 + "' AS range_title FROM main.node_2204036" + num_t + " WHERE measure_kind = 'Temperature'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "'")
               //console.log(result0)
               //console.log(result0[0]["av"])
                if (result0[0]["av"] === null || result0[0]["av"] === "null" || result0[0]["av"] === "")
                    result0[0]["av"] = 0;
                else {
                    //rows[0]["av"] = rows[0]["av"].toFixed(6);
                }
                row_all[k++] = result0;
                //db.close();

            }
            );*/
          

            }
    await con.commit();
    con.close();

    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM main.node_22040367").all();
    //console.log(row_all);
    res0.json({ result: row_all });  
        return { result: row_all }
    //});
};

module.exports = {
    get_pressure_per_hour: get_pressure_per_hour
}
