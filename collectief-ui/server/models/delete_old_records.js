const md5 = require("md5");
const sha1 = require("sha1");
require('dotenv').config();
exports.delete_ = function (token, res0) {
   
    const Database = require('better-sqlite3');
    const db = new Database('./db/XYZ_API_sphensor_data.db', { verbose: console.log });
    const num_t = process.env.n;
    var today = new Date();
    var today_time = today.getTime();
    var date = new Date(today_time - (1000 * 60 * 60 * (24)));
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
    var h = date.getHours();

    if (h < 10) {
        h = "0" + h;
    }

    var x = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + "00" + ":" + "00";
    // var res1 = con.query("select * FROM session where s_token=?",[token.token], function (err, result0, fields) {
    //console.log(result0);
    //var val = [[JSON.stringify(schedule)]];
    var rows3 = [];

    var sql = "delete from main.node_2204036" + num_t + " WHERE timestamp <= '" + x + "'";

    var rows = db.prepare(sql).run();
    //sqlite.close();
    //var rows = db.prepare("SELECT DISTINCT sensor_serial FROM main.node_22040367").all();
    db.close();
   //console.log(rows);
    res0.json({ result: rows });
    return { result: rows }
};
