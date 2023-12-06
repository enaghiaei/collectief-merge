const md5 = require("md5");
const sha1 = require("sha1");
require('dotenv').config();
exports.get_temperature_per_day = function (token,res0) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    //var sqlite3 = require('sqlite3');
    //var sqlite = require('sqlite-sync');
    const num_t = process.env.n;
    const Database = require('better-sqlite3');
    var type_op = token.type
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
    for (i = 0; i < 10; i++) {
        const db = new Database('./db/XYZ_API_sphensor_data.db', { verbose: console.log });
        var today = new Date();
        var today_time = today.getTime();
        var date1 = new Date(today_time - (1000 * 60 * i * 1));
        var m = date1.getMinutes();
        var date = new Date(today_time - (1000 * 60 * m * 1) - (1000 * 60 * i * 1));
        //let date = new Date();
        let today_ = date.toLocaleDateString();
       //console.log("today_", today_)
        var today_tmp = today_.split("/");
       //console.log("today_tmp", today_tmp)
        let today1 = today_tmp[0];
        let today2 = today_tmp[1];
        let today3 = today_tmp[2];

        let today_2 = date1.toLocaleDateString();
       //console.log("today_", today_)
        var today_tmp_2 = today_2.split("/");
       //console.log("today_tmp", today_tmp)
        let today1_2 = today_tmp_2[0];
        let today2_2 = today_tmp_2[1];
        let today3_2 = today_tmp_2[2];

        var s = date.getSeconds();
        
        var h = date.getHours();
        var h_2 = date1.getHours();
        var x0 = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + "00" + ":" + "00";
        var x1 = today3_2 + "-" + today1_2 + "-" + today2_2 + " " + h_2 + ":" + "00" + ":" + "00";
       //console.log("x0:", x0);
       //console.log("x1:", x1);
        //sqlite.connect("./db/XYZ_API_sphensor_data.db");
        if (type_op == 0)
            var rows = db.prepare("SELECT AVG(measure_value) AS av FROM main.node_2204036" + num_t + " WHERE measure_kind = 'Temperature'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1+"'").all();
        else if (type_op == 1)
            var rows = db.prepare("SELECT MAX(measure_value) AS av FROM main.node_2204036" + num_t + " WHERE measure_kind = 'Temperature'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "'").all();
        else if (type_op == 2)
            var rows = db.prepare("SELECT MIN(measure_value) AS av FROM main.node_2204036" + num_t + " WHERE measure_kind = 'Temperature'" + " AND timestamp >= '" + x0 + "'" + " AND timestamp <= '" + x1 + "'").all();
        db.close();
        row_all[i] = rows;
    }
    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM main.node_22040367").all();
   //console.log(rows);
    res0.json({ result: row_all });  
    return { result: rows }
  };
