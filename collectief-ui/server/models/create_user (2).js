const md5 = require("md5");
const sha1 = require("sha1");

exports.create = function (req,ip,res0) {
   //console.log(req);
    var token = req.token;
    var login_time = Math.floor(new Date().getTime() / 1000);
    var result1=false;
    var insert_id = 0;
    var updated = 0;
    var mysql = require('mysql2'); 
    require('../config/config.js');
    var token_list = [];
    
    var con = mysql.createConnection({
        host: global.config.vals.database.host, port:global.config.vals.database.port,
        user: "root",
        password: global.config.vals.database.password,
        database: global.config.vals.database.name
      });
      
      con.connect(function(err) {
        
        if (err) throw err;
        var res3 = con.query("select * FROM session where s_token=?",[token], function (err, result0, fields) { 
            if (err) throw err;
           //console.log(res3.sql);  
       // var res1 = con.query("select * FROM session where s_token=?",[token.token], function (err, result0, fields) {  
           //console.log(result0);
            var val = [[req.username,md5(req.password),req.name,req.phone,result0[0].s_user_id]];
            var res = con.query("INSERT INTO users (email,password,fullname,phone_number,owner) VALUES ?",[val], function (err, result, fields) {
               //console.log(res.sql);        
            //console.log(result); 
            insert_id = result.insertId;
            if(insert_id > 0){
                
                sql = "update users set token='"+md5(sha1(insert_id))+"' where user_id = ?";
                var where = [insert_id];
                var res3 = con.query(sql, where, function (err, result) {
                    if (err) throw err;
                    updated = result.affectedRows;
                   //console.log(res3.sql); 
                   //console.log(token_list);
                    
                    if(insert_id > 0 && updated > 0){
                        var val = [[req.country,req.address,req.position,insert_id]];
                        var res = con.query("INSERT INTO users_detail (ud_country,ud_address,ud_position,user_id) VALUES ?",[val], function (err, result, fields) {
                        res0.json({ message: 1 });
                        });
                    }
                    else{
                        res0.json({ message: 0 });
                    }
                });
            }
        
        });
   //});
        //console.log(res.sql);
        
      });

    });
      
  };
