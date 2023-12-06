const e = require("express");
const md5 = require("md5");
const sha1 = require("sha1");
var mysql2 = require('mysql2/promise');
var config = require('../config/config.js');

exports.test_connection = function (token, res0) {
    const mysql = require('mysql2');
    const { Client } = require('ssh2');
    const sshClient = new Client();
   
    var con = mysql.createConnection({
        host: global.config.vals.database.host,
        port: global.config.vals.database.port,
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
    });

    var con2 = mysql.createConnection({
        host: global.config.vals.local_ip.value,
        port: global.config.vals.database_hub_core.port,
        user: global.config.vals.database_hub_core.user,
        password: global.config.vals.database_hub_core.password,
        database: global.config.vals.database_hub_core.name
    });
   
    const nDate_2 = new Date();
    var s = nDate_2.getSeconds();
    const nDate0 = new Date(nDate_2.getTime()).toLocaleString('en-US', {
        hour12: false,
        timeZone: "Europe/London"
    });    
    const nDate = new Date(nDate_2.getTime() - ((60 * 1000) + (s * 1000))).toLocaleString('en-US', {
        hour12: false,
        timeZone: "Europe/London"
    });
    const nDate2 = new Date(nDate_2.getTime() - ((120 * 1000) + (s * 1000))).toLocaleString('en-US', {
        hour12: false,
        timeZone: "Europe/London"
    });
    /*console.log("nDate0 ==== ", nDate0)
    console.log("nDate ==== ", nDate)
    console.log("nDate2 ==== ", nDate2)*/
    const nDate_new = new Date(nDate_2.getTime() - ((3600 * 100) + (60 * 1000) + (s * 1000)));
    const nDate2_new = new Date(nDate_2.getTime() - ((3600 * 100) + (120 * 1000) + (s * 1000)));
    let today_ = nDate
    //console.log("today_", today_)
    var today_tmp1 = today_.replace(" ", "");
    today_tmp1 = today_tmp1.replace("PM", "");
    var today_tmp2 = today_tmp1.split(",");
    var today_tmp = today_tmp2[0].split("/");
    var today_tmp_h = today_tmp2[1].split(":");

    let today_2 = nDate2
    //console.log("today_", today_)
    var today_tmp1_2 = today_2.replace(" ", "");
    today_tmp1_2 = today_tmp1_2.replace("PM", "");
    var today_tmp2_2 = today_tmp1_2.split(",");
    var today_tmp_2 = today_tmp2_2[0].split("/");
    var today_tmp_h_2 = today_tmp2_2[1].split(":");

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
    
    let today1_2 = today_tmp_2[0];
    let today2_2 = today_tmp_2[1];
    let today3_2 = today_tmp_2[2];
    if (today1_2 < 10) {
        today1_2 = "0" + today1_2;
    }
    if (today2_2 < 10) {
        today2_2 = "0" + today2_2;
    }
    var s = today_tmp_h_2[0];

    var h = today_tmp_h[0];
    var h_2 = today_tmp_h_2[0];

    var m = today_tmp_h[1];
    var m_2 = today_tmp_h_2[1];

    var s = today_tmp_h[2];
    var s_2 = today_tmp_h_2[2];

    if (s < 10) {
        //s = "0" + s;
    }
    if (s_2 < 10) {
        //s_2 = "0" + s_2;
    }
    if (m < 10) {
        //m = "0" + m;
    }
    if (m_2 < 10) {
        //m_2 = "0" + m_2;
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (h_2 < 10) {
        h_2 = "0" + h_2;
    }
    var x0 = today3 + "-" + today1 + "-" + today2 + "T" + h + ":" + m + ":" + "00.000Z";
    var x1 = today3_2 + "-" + today1_2 + "-" + today2_2 + "T" + h_2 + ":" + m_2 + ":" + "00.000Z";
    
    con2.connect((err) => {
        if (err) {
            console.error('Error connecting to database 1:', err);
            return;
        }
        console.log('Connected to database 0!');
        // Perform operations with database 1
    });
    con.connect((err) => {
        if (err) {
            console.error('Error connecting to database 1:', err);
            return;
        }
        console.log('Connected to database 1!');
        // Perform operations with database 1
    });
    con2.query(
        "SELECT hc_entities.field_id AS sensor_serial,hc_measure_data.*,hc_measures.tag FROM hc_measures JOIN hc_measure_data ON hc_measure_data.measure_id=hc_measures.id JOIN hc_entity_data_groups ON hc_measures.edg_id = hc_entity_data_groups.id JOIN hc_entities ON hc_entities.id = hc_entity_data_groups.entity_id where dt >= '" + x1 + "' and dt <= '" + x0 + "'",
        function (err, results, fields) {
            con.query("SELECT * FROM measure_types WHERE 1=1", function (err, results_m, fields) {
                //console.log("SELECT hc_entities.field_id AS sensor_serial,hc_measure_data.*,hc_measures.tag FROM hc_measures JOIN hc_measure_data ON hc_measure_data.measure_id=hc_measures.id JOIN hc_entity_data_groups ON hc_measures.edg_id = hc_entity_data_groups.id JOIN hc_entities ON hc_entities.id = hc_entity_data_groups.entity_id where dt >= '" + x1 + "' and dt <= '" + x0 + "' limit 10")
                //console.log("SELECT hc_entities.ent_id AS sensor_serial,hc_measure_data.*,hc_measures.tag FROM hc_measures JOIN hc_measure_data ON hc_measure_data.measure_id=hc_measures.id JOIN hc_entity_data_groups ON hc_measures.edg_id = hc_entity_data_groups.id JOIN hc_entities ON hc_entities.id = hc_entity_data_groups.entity_id where dt >= '" + x1 + "' and dt <= '" + x0 + "' limit 10")
                //console.log("sql===", connection.sql);                
                //console.log(fields); // fields contains extra meta data about results, if available
                for (var key in results) {

                    var mn = ""
                    var mk = ""

                    for (var key_m in results_m) {

                        if (results_m[key_m]["measure_equal"].localeCompare(results[key]["tag"]) == 0) {
                            mn = results_m[key_m]["measure_name"]
                            mk = results_m[key_m]["measure_kind"]
                        }

                    }
                    var rows = results;
                    var time = rows[key]["dt"].toISOString();
                    var sli = time.split(".");
                    var sli1 = sli[0].split("T");
                    var time2 = sli1[0] + " " + sli1[1];
                    //console.log("time2", time2)
                    //console.log("time", time)
                    var vals = "'" + rows[key]["sensor_serial"] + "','" + rows[key]["tag"] + "','" + mn + "','" + rows[key]["tag"] + "','" + mk + "','" + rows[key]["value"] + "'" + ",'" + time2 + "'";
                    con.query("INSERT INTO node_220403690 (sensor_serial,sensor_type,measure_name,measure_var,measure_kind,measure_value,timestamp) VALUES (" + vals + ")");

                }
                con.end();
                con2.end();
                res0.json({ result: 1 });
            }
            );


        }
    );
    /*});
}).connect(tunnelConfig);
});
*/
};
