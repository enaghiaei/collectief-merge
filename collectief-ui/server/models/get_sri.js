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
    var res1 = con.query("select * FROM session where s_token=?", [token.token], function (err, result0, fields) {
       //console.log(result0);
        if (result0[0]) {
            var res2 = con.query("SELECT users_detail.calculation_data,user_type FROM users_detail JOIN users ON users_detail.user_id = users.user_id  WHERE users_detail.user_id=?", [result0[0].s_user_id], function (err, result2, fields) {

                // UNIT LOCATION
                //result2[0].calculation_data
                if (result2[0] && result2[0].user_type) {
                    if (result2[0].user_type == 3) {
                        con.end();
                        res0.json({ result: JSON.stringify(result2) });
                    }
                    else if (result2[0].user_type == 2) {
                        //res0.json({ result: result2[0].calculation_data });
                        var res2 = con.query("SELECT u2.calculation_data,collectief_location.cl_title FROM users_detail JOIN collectief_location ON collectief_location.cl_parent = users_detail.location_id JOIN users_detail u2 ON collectief_location.cl_id = u2.location_id WHERE users_detail.user_id=?", [result0[0].s_user_id], function (err, result3, fields) {
                            con.end();
                            res0.json({ result: JSON.stringify(result3) });
                        });
                    } else {
                        con.end();
                        res0.json({ result: [] });
                    }
                } else {
                    con.end();
                    res0.json({ result: [] });
                  
                }
                
            });
        } else {
            con.end();
            res0.json({ result: [] });
        }
    });



    ////console.log(res.sql);

    //con.close();

};

module.exports = {
    get_: get_
}
