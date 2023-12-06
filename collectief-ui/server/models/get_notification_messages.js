const md5 = require("md5");
const sha1 = require("sha1");

async function get_(token, res0) {
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1 = false;
    var mysql = require('mysql2');
    var config = require('../config/config.js');
    var con = mysql.createConnection({
        host: global.config.vals.database.host, port:global.config.vals.database.port,
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
    });

    con.connect(function (err) {

        if (err) throw err;
       /* var res1 = con.query("select * FROM session where s_token=?", [token.token], function (err, result0, fields) {
           //console.log(result0);
            if (result0[0]) {*/
       
        //
           /* } else {
                res0.json({ result: [] });
            }*/
        //});
        //console.log(res.sql);

    });

    var res = con.query("select DISTINCT nm_message AS message,MAX(nm_value) AS value,MAX(nm_deleted) AS deleted,MAX(nm_seen) AS seen,MAX(nm_id) AS id,MAX(notification.nt_importance) AS importance,MAX(nt_date) AS date FROM notification_messages JOIN notification ON notification_messages.nt_id = notification.nt_id  where  nm_archived = 0 AND nt_deleted = 0 and  nm_user=? GROUP BY nm_message ORDER BY nt_date desc", [0], function (err, result, fields) {
        //console.log(result);
        for (var key in result) {

        }
        res0.json({ result: result });
        con.end();
    });

    

};

module.exports = {
    get_: get_
}
