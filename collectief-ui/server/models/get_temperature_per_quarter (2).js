const md5 = require("md5");
const sha1 = require("sha1");
require('dotenv').config();
var mysql = require('mysql2/promise');
var config = require('../config/config.js');
//exports.get_temperature_per_hour = function (token, res0) {
async function get_temperature_per_quarter(token, res0) {
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
    //for (var i = 9; i > 0; i--) {
    var i = 0;
          
            //console.log("i==", i);
            //const db = new Database('./db/XYZ_API_sphensor_data.db', { verbose: console.log });
            var today = new Date();
            var today_time = today.getTime();
            //var date1 = new Date(today_time - (195 * 1000 * 60));
            var date1 = new Date(today_time);
            var m = date1.getMinutes();
            /*if(m < 15)
                var date = new Date(today_time - (1000 * 60 * (m + 1) + (195 * 1000 * 60)));  
            else
                var date = new Date(today_time - (1000 * 60 * (m - 1) + (195 * 1000 * 60)));  */
            if (m < 15)
                var date = new Date(today_time - (1000 * 60 * (m + 1)));
            else
                var date = new Date(today_time - (1000 * 60 * (m - 1)));  
            var date3 = new Date(today_time - (1000 * 60 * 60 * 48));  
            //let date = new Date();
            let today_ = date.toLocaleDateString();
    let today_3 = date3.toLocaleDateString();
   //console.log("today_3",today_3)
            //console.log("today_", today_)
            var today_tmp = today_.split("/");
    var today_tmp_3 = today_3.split("/");
   //console.log("today_tmp_3",today_tmp_3)
            //console.log("today_tmp", today_tmp)
            let today1 = today_tmp[0];
            let today2 = today_tmp[1];
            let today3 = today_tmp[2];
            let today1_3 = today_tmp_3[0];
            let today2_3 = today_tmp_3[1];
            let today3_3 = today_tmp_3[2];
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
            var h_3 = date3.getHours();
            var m_0 = "";
            var m_1 = "";
            if (parseInt(m) >= 0 && parseInt(m) <= 15) {
                m_0 = "45"
                m_1 = "00"
            }
            else if (parseInt(m) >= 15 && parseInt(m) <= 30) {
                m_0 = "00"
                m_1 = "15"
            }
            else if (parseInt(m) >= 30 && parseInt(m) <= 45) {
                m_0 = "15"
                m_1 = "30"
            }
            else if (parseInt(m) >= 45 && parseInt(m) <= 59) {
                m_0 = "30"
                m_1 = "45"
            }
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
    if (h_3 < 10) {
        h_3 = "0" + h_3;
    }

            if (parseInt(m) >= 0 && parseInt(m) <= 15) {

            }
            else if (parseInt(m) >= 15 && parseInt(m) <= 30) {

            }
            else if (parseInt(m) >= 30 && parseInt(m) <= 45) {

            }
            else if (parseInt(m) >= 45 && parseInt(m) <= 59) {

            }
            var x0 = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + m_0 + ":" + "00";
            var x1 = today3_2 + "-" + today1_2 + "-" + today2_2 + " " + h_2 + ":" + m_1 + ":" + "00";
             const x2 = today3_3 + "-" + today1_3 + "-" + today2_3 + " " + h_3 + ":" + "00" + ":" + "00";
           //console.log("x0:", x0);
           //console.log("x1:", x1);
   //console.log("x2:", x2);
    
            //sqlite.connect("./db/XYZ_API_sphensor_data.db");
        //console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
       // const sql = con.format("SELECT AVG(measure_value) AS av,MAX(measure_value) AS av_max,MIN(measure_value) AS av_min,'" + h + " to " + h_2 + "' AS range_title,measure_name,cl_id FROM node_2204036" + num_t + " JOIN collectief_assignment ON collectief_assignment.sensor_id = node_2204036" + num_t + ".sensor_serial  WHERE measure_kind = 'Temprature'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "' GROUP BY cl_id,measure_name");
       ////console.log(sql)
        [rows4,fields4] = await con.execute("select * FROM node_per_quarter  WHERE" + " nph_from2 = '" + x0 + "' AND nph_to2 = '" + x1 + "'");
        [rows5, fields5] = await con.execute("select * FROM sensors_list  WHERE" + " 1 = 1");
    
        [rows6, fields6] = await con.execute("select * FROM measure_types  WHERE" + " 1 = 1");
     
   //console.log("x2:", x2);
    //console.log(con.sql);
        if (rows4.length == 0) {

            for (var key5 in rows5) {
                for (var key6 in rows6) {
                    [rows, fields] = await con.execute("SELECT sensor_serial,AVG(measure_value) AS av,MAX(measure_value) AS av_max,MIN(measure_value) AS av_min,'" + h + " to " + h_2 + "' AS range_title,measure_kind,measure_name FROM node_2204036" + num_t + "  WHERE " + " sensor_serial = '" + rows5[key5].sl_sensor + "' AND measure_kind = '" + rows6[key6].measure_kind + "' AND " + " measure_name = '" + rows6[key6].measure_name + "' AND " + " timestamp >= '" + x0 + "'" + " AND timestamp < '" + x1 + "' GROUP BY sensor_serial,measure_kind,measure_name");
                    //console.log(con.sql);
                   //console.log("rows", rows)
                   //console.log("xxxxxxxxxxxx")
                    if (rows.length > 0) {
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
                            var vals = rows[key]["sensor_serial"] + "," + rows[key]["av_max"].toFixed(2) + "," + rows[key]["av_min"].toFixed(2) + "," + rows[key]["av"].toFixed(2) + ",'" + rows[key]["measure_kind"] + "','" + rows[key]["measure_name"] + "'" + ",'" + h + ":" + m_0 + "'" + ",'" + h_2 + ":" + m_1 + "'" + ",'" + x0 + "','" + x1 + "'";
                            [rows2] = await con.execute("INSERT INTO node_per_quarter (sensor_serial,nph_max,nph_min,nph_avg,nph_kind,nph_name,nph_from,nph_to,nph_from2,nph_to2) VALUES (" + vals + ")");
                        }
                    } else {
                        var vals = rows5[key5]["sl_sensor"] + "," + "0" + "," + "0" + "," + "0" + ",'" + rows6[key6]["measure_kind"] + "','" + rows6[key6]["measure_name"] + "'" + ",'" + h + ":" + m_0 + "'" + ",'" + h_2 + ":" + m_1 + "'" + ",'" + x0 + "','" + x1 + "'";
                        [rows2] = await con.execute("INSERT INTO node_per_quarter (sensor_serial,nph_max,nph_min,nph_avg,nph_kind,nph_name,nph_from,nph_to,nph_from2,nph_to2) VALUES (" + vals + ")");
                    }
                }
            }

        }
   
        [rows3] = await con.execute("DELETE FROM node_2204036" + num_t + " WHERE" + " timestamp <= '" + x0 + "'");
       //console.log("DELETE FROM node_2204036" + num_t + " WHERE" + " timestamp < '" + x1 + "'")
        //console.log(query.sql);  
    row_all[k++] = rows;
    await con.execute("Delete FROM node_per_quarter  WHERE " + " nph_from2 <= '" + x2 + "'");
   //console.log("Delete FROM node_per_quarter  WHERE " + " nph_from2 <= '" + x2 + "'")
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
          

           // }
    await con.commit();
    con.close();

    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM main.node_22040367").all();
    //console.log(row_all);
    res0.json({ result: row_all });  
        return { result: row_all }
    //});
};

module.exports = {
    get_temperature_per_quarter: get_temperature_per_quarter
}
