const md5 = require("md5");
const sha1 = require("sha1");

exports.edit_ = function (schedule, res0) {
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
   //console.log(global.config)
    con.connect(function (err) {
       //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        if (err) throw err;
      
    });

    //var val = [schedule.sensor,schedule.id];
    var res1 = con.query("select * FROM collectief_location where cl_title = '" + schedule.title + "' and cl_deleted=0 and cl_id != ?", [schedule.id], function (err, result0, fields) {
       //console.log("***********************************************", result0);
       //console.log(res1.sql);
        if (result0.length == 0) {
            //var val = [[schedule.location, schedule.sensor, 0]];
            var res = con.query("UPDATE collectief_location set cl_title = '" + schedule.title + "',cl_type=" + schedule.type + " WHERE cl_id = ?", [schedule.id], function (err, result, fields) {
               //console.log(res.sql);
                //console.log(result); 
                insert_id = result.affectedRows;
                if (insert_id > 0) {
                   //console.log("in0")
                    var res1 = con.query("select * FROM collectief_boxes where cb_deleted=0", function (err, result2, fields) {
                       //console.log("in1")
                       //console.log(result2)
                        for (var key in result2) {
                            var x = JSON.parse(result2[key]["cb_type"])
                           //console.log(x)
                            for (var key2 in x) {

                                if (x[key2]["type"] && x[key2]["type"]["location"] && parseInt(x[key2]["type"]["location"]) == parseInt([schedule.id])) {
                                   //console.log(x[key2]["type"]["location"])
                                    var param = ""
                                    if (parseInt(x[key2]["type"]["parametr"]) == 0) {
                                        param = "Temprature"
                                    }
                                    if (parseInt(x[key2]["type"]["parametr"]) == 1) {
                                        param = "Pressure"
                                    }
                                    if (parseInt(x[key2]["type"]["parametr"]) == 2) {
                                        param = "Humidity"
                                    }
                                    if (parseInt(x[key2]["type"]["parametr"]) == 3) {
                                        param = "Mass (PM)"
                                    }
                                    if (parseInt(x[key2]["type"]["parametr"]) == 4) {
                                        param = "Voltage"
                                    }
                                    x[key2]["title"] = schedule.title + " " + param + " Over Time";
                                }
                            }
                            var res = con.query("UPDATE collectief_boxes set cb_type = '" + JSON.stringify(x) + "' WHERE cb_id = ?", [result2[key]["cb_id"]], function (err, result, fields) {
                            });
                        }

                        res0.json({ message: 1, token: insert_id });
                        con.end();
                    }
                    );
                }
                else {
                    res0.json({ message: 0 });
                    con.end();
                }
            });
        }
        else {
            res0.json({ message: -1, token: -1 });
            con.end();
        }

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

        //console.log(res.sql);

  
    //con.close();    
 

};
