const md5 = require("md5");
const sha1 = require("sha1");

exports.get_temperature = function (token,res0) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    //var sqlite3 = require('sqlite3');
    var sqlite = require('sqlite-sync');
    /*let db = new sqlite('./db/XYZ_API_sphensor_data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error("err00",err.message);
        }
        console.log('Connected to the chinook database.');
    });

    db.serialize(() => {
        var result = [];
        db.each(`SELECT DISTINCT sensor_serial FROM main.node_22040367`, (err, row) => {
            if (err) {
                console.error("errrrrroor",err.message);
            }
            console.log(row);
            result[result.length] = row;
        });
        res0.json({ result: result });   
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    */
    
    sqlite.connect("./db/XYZ_API_sphensor_data.db");
    var rows = sqlite.run("SELECT AVG(measure_value) AS av FROM main.node_22040367 WHERE measure_kind = 'Temperature'");
    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM main.node_22040367").all();
    console.log(rows);
    res0.json({ result: rows });  
    return { result: rows }
  };
