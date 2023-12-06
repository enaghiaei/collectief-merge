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
            var res2 = con.query("select fullname,user_type,location_id,cl_title AS location_title FROM users LEFT JOIN users_detail ON users.user_id = users_detail.user_id LEFT JOIN collectief_location ON collectief_location.cl_id = users_detail.location_id  where users.user_id=?", [result0[0].s_user_id], function (err, result2, fields) {
                console.log("select fullname,user_type,location_id,cl_title AS location_title FROM users LEFT JOIN users_detail ON users.user_id = users_detail.user_id LEFT JOIN collectief_location ON collectief_location.cl_id = users_detail.location_id  where users.user_id=" + result0[0].s_user_id)
                console.log("result_location",result2);
                // UNIT LOCATION
                    if (result2[0].user_type == 1) {
                        var res = con.query("select cl_title AS title,cl_id AS id,cl_date AS date,cl_type AS type FROM collectief_location where  cl_deleted =0", [], function (err, result, fields) {
                           //console.log(result);
                           //console.log(res.sql)
                            con.end();
                            res0.json({ result: result });
                            
                        });
                    }
                    else if (result2[0].user_type == 2) {
                        var res = con.query("select cl_title AS title,cl_id AS id,cl_date AS date,cl_type AS type FROM collectief_location where  cl_deleted =0 and  cl_type=? and cl_parent=?", [2, result2[0].location_id], function (err, result, fields) {
                           //console.log(result);
                            var res2 = con.query("select collectief_location.cl_title AS title,collectief_location.cl_id AS id,collectief_location.cl_date AS date,collectief_location.cl_type AS type FROM collectief_location JOIN collectief_location AS clt ON collectief_location.cl_parent = clt.cl_id  where  clt.cl_deleted =0 and  clt.cl_type=? and clt.cl_parent=?", [2, result2[0].location_id], function (err, result3, fields) {
                               //console.log(res2.sql)
                               //console.log("result3 === ", result3);
                                con.end();
                                res0.json({ result: result.concat(result3) });
                                
                            });

                        });
                    }
                    else if (result2[0].user_type == 3) {
                        var res = con.query("select cl_title AS title,cl_id AS id,cl_date AS date,cl_type AS type FROM collectief_location where  cl_deleted =0 and  cl_type=? and cl_parent=?", [3 , result2[0].location_id], function (err, result, fields) {
                            console.log("result",result);
                            var res2 = con.query("select collectief_location.cl_title AS title,collectief_location.cl_id AS id,collectief_location.cl_date AS date,collectief_location.cl_type AS type FROM collectief_location JOIN collectief_location AS clt ON collectief_location.cl_parent = clt.cl_id  where  clt.cl_deleted =0 and  clt.cl_type=? and clt.cl_parent=?", [3, result2[0].location_id], function (err, result3, fields) {
                               //console.log(res2.sql)
                               //console.log("result3 === ", result3);
                                con.end();
                                res0.json({ result: result.concat(result3) });
                              
                            });
                            
                        });
                    }
                    else {
                        var res = con.query("select cl_title AS title,cl_id AS id,cl_date AS date,cl_type AS type FROM collectief_location where  cl_deleted =0 and  cl_type=? and cl_id=?", [3, result2[0].location_id], function (err, result, fields) {
                           console.log(result);
                            var res2 = con.query("select collectief_location.cl_title AS title,collectief_location.cl_id AS id,collectief_location.cl_date AS date,collectief_location.cl_type AS type FROM collectief_location JOIN collectief_location AS clt ON collectief_location.cl_parent = clt.cl_id  where  collectief_location.cl_deleted =0 and  collectief_location.cl_type=? and collectief_location.cl_parent=?", [4, result2[0].location_id], function (err, result3, fields) {
                               console.log(res2.sql)
                               console.log("result3 === ", result3);
                                con.end();
                                res0.json({ result: result3 });
                               
                            });

                        });
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
