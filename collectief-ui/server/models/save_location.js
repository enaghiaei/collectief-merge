const md5 = require("md5");
const sha1 = require("sha1");
exports.insert_to_table = function (con, res0, val) {

    var res = con.query("INSERT INTO collectief_location (cl_title,cl_user,cl_type,cl_parent,cl_location,cl_detail) VALUES ?", [val], function (err, result, fields) {
       //console.log(res.sql);
        //console.log(result); 
        insert_id = result.insertId;
        if (insert_id > 0)
            res0.json({ message: 1, token: insert_id });
        else {
            res0.json({ message: 0 });
        }

        con.end();
    });
}
exports.save_ = function (schedule, res0) {
    
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

        if (err) throw err;


        //});
        //console.log(res.sql);

    });
    //this.insert_to_table(con, res0, []);
    // var res1 = con.query("select * FROM session where s_token=?",[token.token], function (err, result0, fields) {
    //console.log(result0);
    var x = {};
    var context = this;
    var cl_type = schedule.type

    if (cl_type == 1) {
        x.cluster = schedule.title
        x.building = ""
        x.unit = ""
        x.room = ""
        var val = [[schedule.title, 0, schedule.type, schedule.parent, "{\"lat\":\"" + schedule.lat + "\",\"lng\":\"" + schedule.lng + "\"}", JSON.stringify(x)]];
        this.insert_to_table(con, res0, val)
    }
    else if (cl_type == 2) {
        x.cluster = ""
        x.building = schedule.title
        x.unit = ""
        x.room = ""
       
        var res4 = con.query("select cl_title,cl_id,cl_parent FROM collectief_location where cl_id = ?", [schedule.parent], function (err, result000, fields) {
            x.cluster = result000[0]["cl_title"];
           //console.log("x", x)
            x.unit = "";
           //console.log("x", x)
           //console.log("/////////////////////////////////////////////////////")
           //console.log(result000);
            var val = [[schedule.title, 0, schedule.type, schedule.parent, "{\"lat\":\"" + schedule.lat + "\",\"lng\":\"" + schedule.lng + "\"}", JSON.stringify(x)]];
            context.insert_to_table(con, res0, val)
            
        }
        );
    }
    else if (cl_type == 3) {
        x.cluster = ""
        x.building = ""
        x.unit = schedule.title
        x.room = ""
        var res4 = con.query("select cl_title,cl_id,cl_parent FROM collectief_location where cl_id = ?", [schedule.parent], function (err, result000, fields) {
            x.building = result000[0]["cl_title"];
           //console.log("x", x)
            x.unit = "";
           //console.log("x", x)
           //console.log("/////////////////////////////////////////////////////")
           //console.log(result000);
            if (result000[0]) {
                var res5 = con.query("select cl_title,cl_id,cl_parent FROM collectief_location where cl_id = ?", [result000[0]["cl_parent"]], function (err, result001, fields) {
                    x.cluster = result001[0]["cl_title"];
                    var val = [[schedule.title, 0, schedule.type, schedule.parent, "{\"lat\":\"" + schedule.lat + "\",\"lng\":\"" + schedule.lng + "\"}", JSON.stringify(x)]];
                    context.insert_to_table(con, res0, val)
                }
                );
            } else {
                con.end();
            }
        }
        );
    }
    else if (cl_type == 4) {
        x.cluster = ""
        x.building = ""
        x.unit = ""
        x.room = schedule.title
        
        var res4 = con.query("select cl_title,cl_id,cl_parent FROM collectief_location where cl_id = ?", [schedule.parent], function (err, result000, fields) {
            x.unit = result000[0]["cl_title"];
           //console.log("x", x)
            //x.unit = "";
           //console.log("x", x)
           //console.log("/////////////////////////////////////////////////////")
           //console.log(result000);
            if (result000[0]) {
                var res5 = con.query("select collectief_location.cl_title,collectief_location.cl_id,collectief_location.cl_parent,clt.cl_title AS cl_title2,clt.cl_id AS cl_id2,clt.cl_parent AS cl_parent2 FROM collectief_location JOIN collectief_location AS clt ON collectief_location.cl_parent = clt.cl_id where collectief_location.cl_id = ?", [result000[0]["cl_parent"]], function (err, result001, fields) {
                    x.building = result001[0]["cl_title"];
                    x.cluster = result001[0]["cl_title2"];
                    var val = [[schedule.title, 0, schedule.type, schedule.parent, "{\"lat\":\"" + schedule.lat + "\",\"lng\":\"" + schedule.lng + "\"}", JSON.stringify(x)]];
                    context.insert_to_table(con, res0, val)
                }
                );
            }else{
                con.end();
            }
        }
        );
    }
    
    
    

    
    //con.close();    
 

}


