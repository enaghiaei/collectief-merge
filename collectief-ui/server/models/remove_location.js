const md5 = require("md5");
const sha1 = require("sha1");

exports.remove_ = function (schedule, res0) {
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

    con.connect(function (err) {

        if (err) throw err;
        

    });

    // var res1 = con.query("select * FROM session where s_token=?",[token.token], function (err, result0, fields) {  
    //console.log(result0);
    //var val = [[JSON.stringify(schedule)]];
    var sql = "update collectief_location set cl_deleted='1' where cl_id = ?";
    var where = [schedule.id];
    con.query(sql, where, function (err, result) {
        if (err) throw err;
        updated = result.affectedRows;

        var res1 = con.query("select * FROM collectief_boxes where cb_deleted=0", function (err, result2, fields) {
           //console.log("in1")
           //console.log(result2)
            for (var key in result2) {
                var x = JSON.parse(result2[key]["cb_type"])
                var z = [...x]
               //console.log(x)
                for (var key2 in x) {

                    if (x[key2]["type"] && x[key2]["type"]["location"] && parseInt(x[key2]["type"]["location"]) == parseInt([schedule.id])) {
                        z.splice(key2, 1)
                    }
                }
                var res = con.query("UPDATE collectief_boxes set cb_type = '" + JSON.stringify(z) + "' WHERE cb_id = ?", [result2[key]["cb_id"]], function (err, result, fields) {
                });
            }

            //  res0.json({ message: 1, token: insert_id });


            var sql2 = "update collectief_assignment set ca_deleted='1' where cl_id = ?";
            var where2 = [schedule.id];
            con.query(sql2, where2, function (err, result) {
                if (err) throw err;
                if (updated > 0) {
                    var res2 = con.query("select cl_title AS title,cl_id AS id,cl_date AS date FROM collectief_location where cl_deleted =0 and nt_user=?", [0], function (err, result, fields) {
                       //console.log(result);
                        res0.json({ message: 1, result: result });
                        con.end();
                    });

                }
                else {
                    res0.json({ message: 0 });
                    con.end();
                }
            });
        }
        );
       //console.log("Number of records updated: " + result.affectedRows);
    });

    
        //con.close();
        //});
        //console.log(res.sql);

};
