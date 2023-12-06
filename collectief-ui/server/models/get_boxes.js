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
        
        //console.log(res.sql);

    });

    var res1 = con.query("select * FROM session where s_token=?", [token.token], function (err, result0, fields) {
       //console.log(result0);
        if (result0[0]) {
            var res = con.query("select * FROM collectief_boxes where  cb_deleted =0 and  cb_user=? ORDER BY cb_date DESC LIMIT 1", [result0[0].s_user_id], function (err, result, fields) {
               //console.log(result);
                if (result && result.length != 0) {
                    con.end();
                    res0.json({ result: result });
                    
                } else {
                    var res2 = con.query("select * FROM collectief_boxes JOIN users ON collectief_boxes.cb_user = users.user_id where  cb_deleted =0 and  is_admin=1", function (err, result2, fields) {
                        con.end();
                        res0.json({ result: result2 });
                        
                    });
                }
               
            });
            //
        } else {
            con.end();
            res0.json({ result: [] });
         
        }
       
    });

   

    //con.close();

};

module.exports = {
    get_: get_
}
