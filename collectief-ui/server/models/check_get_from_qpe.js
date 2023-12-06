
const axios = require("axios")
var fs = require("fs");
var config = require('../config/config.js');
const path = require('path');
var config = require('../config/config.js');
var mysql = require('mysql2/promise');
//import { appendFileSync } from "fs";
async  function check_get_from_qpe (token, res0) {
    fs.readFile("./qpe_time.txt", "utf-8", (err, qpe) => {
        var x = parseInt(qpe);
        var y = Date.now();
       //console.log("x",x)
       //console.log("y", y)
        if (x == "")
            x = 0;
        if (y - x > 10000) {
            //var contents = fs.readFileSync('https://tracking.virtual.se:3002/get_data_from_qpe').toString();
            fetch('http://tracking.virtual.se:3002/get_data_from_qpe', {
                method: 'GET'
                
            })
                .then(data => data)
                .then(
                    (result) => {
                       //console.log("result",result)
                       // this.send_data_of_project(x, JSON.stringify(result), res0, title, token)

                    },

                    (error) => {

                        return "";
                       //console.log(error)
                    }
                )
        }
    });
    

}
    


exports.get_lcoations0 = function (x, res0,title,token) {
    fs.readFile("qpe.txt", "utf-8", (err, qpe) => {
        fetch(qpe + 'getTagData?mod=json&format=defaultLocation&humanReadable=true&maxAge=1000', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(
                (result) => {

                    this.send_data_of_project(x, JSON.stringify(result), res0, title, token)

                },

                (error) => {

                    return "";
                }
            )
    });
    
}


exports.send_data_of_project = function (tags_data2, y, res0, title,token) {
    
    var formData = new FormData();
    formData.append('x', tags_data2);
    formData.append('y', y);
    formData.append('title', title);
    formData.append('username', token.username);    
    //formData.append('title', title);
    var context = this;
    fetch( global.config.vals.root.server + 'ProjectsController/create_project_offline2' , {
        method: 'POST',
        body: formData
    })
        .then(data => data.json())
        .then(
            (result) => {

               //console.log("result", result)
                var file = "config.txt"
                /*fs.open('config.txt', 'w', function (err, file) {
                    if (err) throw err;
                   //console.log('Saved!');
                });*/

                
                fs.readFile("config.txt", "utf-8", (err, data3) => {

                    var formData = new FormData();
                    project_info = JSON.parse(data3);

                    var index = project_info.length;
                    project_info[index] = result;

                    project_info[index].title = title;
                    var data2 = JSON.stringify(project_info);

                    fs.writeFile("config.txt", data2, (err) => {

                        if (err)
                           //console.log(err);

                       //console.log("Successfully Written to File.");                        
                        var result = context.get_lcoations(token, res0, project_info[index].project_id);
                        
                       //console.log(result);                        
                        res0.sendFile(path.join(__dirname + './../create-ok.html'));

                    });
                }
                );
                
                

            },
            
            (error) => {
                //console.log(data)
               //console.log(error)
            }
        )
}

exports.get_lcoations = function (token, res0,project_id) {

    fs.readFile("qpe.txt", "utf-8", (err, qpe) => {
        var x = 1000;
        var context = this;

        if (token && token.interval && x != "")
            x = token.interval;
        var inverval_timer = setInterval(function () {
            fetch(qpe + 'getTagData?mod=json&format=defaultLocation&humanReadable=true&maxAge=1000', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(data => data.json())
                .then(
                    (result) => {

                        context.send_data_locations(JSON.stringify(result.tags), res0, token,project_id)

                    },

                    (error) => {

                        return "";
                    }
                )
        }, x);
    });

}

exports.send_data_locations = function (tags_data2, res0, token,project_id) {
    
    var project_info;

    fs.readFile("config.txt", "utf-8", (err, data3) => {

        var formData = new FormData();
        project_info = JSON.parse(data3);
        formData.append('x', tags_data2);
        formData.append('project_id', project_id);

       //console.log('Sending Data ...');

        fetch(global.config.vals.root.server + 'Quuppa_create/get_data2_quuppa_ext', {
            method: 'POST',
            body: formData
        })
            .then(data => data.json())
            .then(
                (result) => {

                   //console.log("Sended Successfully.");
                    //res0.sendFile(path.join(__dirname + './../index2.html'));

                },

                (error) => {
                   //console.log(error)
                }
            )
    });
    
}


module.exports = {
    check_get_from_qpe: check_get_from_qpe
}

