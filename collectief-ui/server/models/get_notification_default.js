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
       

    });

    /* var res1 = con.query("select * FROM session where s_token=?", [token.token], function (err, result0, fields) {
           //console.log(result0);
            if (result0[0]) {*/
    var res = con.query("select nt_active AS stat,nt_id AS id FROM notification where  nt_deleted =0 and nt_default = 1 and  nt_user=?", [0], function (err, result, fields) {
       //console.log(result);
        res0.json({ result: result });
        con.end();
    });
    //
    /* } else {
         res0.json({ result: [] });
     }*/
    //});
    //console.log(res.sql);

   

    //con.close();

};

module.exports = {
    get_: get_
}
