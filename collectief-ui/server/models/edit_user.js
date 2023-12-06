const md5 = require("md5");
const sha1 = require("sha1");

async function edit (req,ip,res0) {
   //console.log(req);
    var token = req.token;
    req.country = ""
    req.country = ""
    req.country = ""
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1=false;
    var insert_id = 0;
    var updated = 0;
    //var mysql = require('mysql2'); 
    var mysql = require('mysql2/promise');

    require('../config/config.js');
    var token_list = [];
    
    var con = await mysql.createConnection({
        host: global.config.vals.database.host, port:global.config.vals.database.port,
        user: global.config.vals.database.user,
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
      });
      
    await con.beginTransaction();

    [result0, fields] = await con.query("select * FROM session where s_token=?", [token]);
    [result11, fields] = await con.query("select * FROM users where token=?", [req.user_token]);
    var [result22] = await con.query("DELETE FROM users_detail where user_id=?", [result11[0]["user_id"]]);
       // if (err) throw err;
       //console.log(res3.sql);
        // var res1 = con.query("select * FROM session where s_token=?",[token.token], function (err, result0, fields) {  
       //console.log(result0);
    var val = [[req.username, md5(req.password), req.name, req.phone, result0[0].s_user_id, req.user_type, req.user_token]];
        //[result] = await con.query("INSERT INTO users (email,password,fullname,phone_number,owner,user_type) VALUES ?", [val]);
          // console.log(res.sql);
            //console.log(result); 
    insert_id = result11[0]["user_id"];
            if (insert_id > 0) {

                sql = "update users set email=?,password=?,fullname=?,phone_number=? where user_id = ?";
                var where = [req.username, md5(req.password), req.name, req.phone, insert_id];
                [result] = await con.query(sql, where);
                   // if (err) throw err;
                    updated = result.affectedRows;
                   //console.log(res3.sql);
                   //console.log(token_list);
                    var x = {};
                    //var user_type = parseInt(req.user_type)
                var user_type = 4;
                    if (user_type === 4) {
                        var success = 0;
                        var fail = 0;
                        for (var key in req.location_id) {
                            x.unit = "";
                            x.building = "";
                            x.cluster = "";
                            console.log("key------", key)
                           var [result000, fields] = await con.query("select cl_title,cl_id,cl_parent FROM collectief_location where cl_id = ?", [req.location_id[key]]);
                                x.unit = result000[0]["cl_title"];
                                console.log("x_____________"+key, x)
                                console.log(result000)
                                //console.log("x", x)
                                //console.log("/////////////////////////////////////////////////////")
                                //console.log(result000);
                                if (result000[0]) {
                                    var [result001, fields] = await con.query("select collectief_location.cl_title,collectief_location.cl_id,collectief_location.cl_parent,clt.cl_title AS cl_title2,clt.cl_id AS cl_id2,clt.cl_parent AS cl_parent2 FROM collectief_location JOIN collectief_location AS clt ON collectief_location.cl_parent = clt.cl_id where collectief_location.cl_id = ?", [result000[0]["cl_parent"]]);
                                        //console.log(res5.sql);
                                        if (result001 && result001[0]) {
                                            x.building = result001[0]["cl_title"];
                                            x.cluster = result001[0]["cl_title2"];
                                            //console.log("x", x)
                                            if (insert_id > 0 && updated > 0) {
                                                var val = [[req.country, req.address, req.position, insert_id, req.location_id[key], JSON.stringify(x)]];
                                                //console.log(val)
                                                var [result4] = await con.query("INSERT INTO users_detail (ud_country,ud_address,ud_position,user_id,location_id,location_detail) VALUES ?", [val]);
                                                    //console.log(res20.sql);

                                                    success++;
                                                
                                                //res0.json({ message: 1 });

                                            }
                                            else {
                                                fail++;
                                            }
                                        }
                                   
                                }
                            
                        }
                        console.log("success", success)
                        console.log("fail", fail)


                        if (success > 0) {
                            res0.json({ message: 1 });
                            await con.commit();
                            await con.end();
                            con.close();
                        } else {
                            res0.json({ message: 0 });
                            await con.commit();
                            await con.end();
                            con.close();
                        }

                    }
                    else if (user_type === 3)
                    {

                        var [result000] = await con.query("select cl_title,cl_id,cl_parent FROM collectief_location where cl_id = ?", [req.location_id]);
                            x.building = result000[0]["cl_title"];
                           //console.log("x", x)
                            x.unit = "";
                           //console.log("x", x)
                           //console.log("/////////////////////////////////////////////////////")
                           //console.log(result000);
                            if (result000[0]) {
                                var [result001] = await con.query("select cl_title,cl_id,cl_parent FROM collectief_location where cl_id = ?", [result000[0]["cl_parent"]]);
                                    x.cluster = result001[0]["cl_title"];
                                   //console.log("x", x)
                                    if (insert_id > 0 && updated > 0) {
                                        var val = [[req.country, req.address, req.position, insert_id, req.location_id, JSON.stringify(x)]];
                                       //console.log(val)
                                        var [result001] = await con.query("INSERT INTO users_detail (ud_country,ud_address,ud_position,user_id,location_id,location_detail) VALUES ?", [val]);
                                           //console.log(res20.sql);
                                        res0.json({ message: 1 });
                                        await con.commit();
                                        await con.end();
                                            con.end();
                                       
                                        //res0.json({ message: 1 });

                                    }
                                    else {
                                        res0.json({ message: 0 });
                                        await con.commit();
                                        await con.end();
                                        con.end();
                                    }
                                
                            }
                                             
                        
                    }
                    else if (user_type === 2) {

                        x.unit = "";
                        x.building = "";
                        var [result000] = await con.query("select cl_title FROM collectief_location where cl_id = ?", [req.location_id]);
                            x.cluster = result000[0]["cl_title"];
                            if (insert_id > 0 && updated > 0) {
                                var val = [[req.country, req.address, req.position, insert_id, req.location_id, JSON.stringify(x)]];
                               //console.log(val)
                                var [res20] = await con.query("INSERT INTO users_detail (ud_country,ud_address,ud_position,user_id,location_id,location_detail) VALUES ?", [val]);
                                   //console.log(res20.sql);
                                res0.json({ message: 1 });
                                await con.commit();
                                await con.end();
                                con.end();
                                
                                //res0.json({ message: 1 });

                            }
                            else {
                                res0.json({ message: 0 });
                                await con.commit();
                                await con.end();
                                con.end();
                            }
                                             
                       
                    }
                    else if (user_type === 1) {

                        x.cluster = "";
                        x.unit     = "";
                        x.building = "";
                        if (insert_id > 0 && updated > 0) {
                            var val = [[req.country, req.address, req.position, insert_id, req.location_id, JSON.stringify(x)]];
                           //console.log(val)
                            var [res20] = await con.query("INSERT INTO users_detail (ud_country,ud_address,ud_position,user_id,location_id,location_detail) VALUES ?", [val]);
                               //console.log(res20.sql);
                                res0.json({ message: 1 });
                                await con.commit();
                                await con.end();
                                con.end();
                            
                            //res0.json({ message: 1 });

                        }
                        else {
                            res0.json({ message: 0 });
                            await con.commit();
                            await con.end();
                            con.end();
                        }
                        
                    }
                  
                   
               

            } else {
                await con.commit();
                await con.end();
                con.end();
            }

        
        //});
        //console.log(res.sql);

    
      
};

module.exports = {
    edit: edit
}
