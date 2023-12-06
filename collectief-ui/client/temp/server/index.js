const http = require('http');
const express = require("express");
var bodyParser = require('body-parser')
var pro = require('./models/get_sensors');
var pro1 = require('./models/get_sensor_data');
var gst = require('./models/get_sensors_type');
var gt = require('./models/get_temperature');
const PORT = process.env.PORT || 3002;



const app = express();
const cors = require("cors");
var FormData = require('form-data');
var request = require('request');
const url = require('url');
var cookieParser = require('cookie-parser');
var axios = require('axios');
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '100mb' }));
app.use('/uploads', express.static('uploads'));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


//check_u.login("mahdi","password");
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/server/videos'));
// Parse JSON bodies (as sent by API clients)

app.use(express.json());

app.get("/get_sensors", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    console.log("get_sensors");
    //console.log(req.body);

    var result1 = pro.get_sensors(req.body, res);
    console.log("$$$$$");
    console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_sensors", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    console.log("get_sensors");
    //console.log(req.body);

    var result1 = pro.get_sensors(req.body, res);
    console.log("$$$$$");
    console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_sensor_data", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    console.log("get_sensor_data");
    console.log(req.body);

    var result1 = pro1.get_sensor_data(req.body, res);
    console.log("$$$$$");
    console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_sensors_type", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    console.log("get_sensors");
    //console.log(req.body);

    var result1 = gst.get_sensors_type(req.body, res);
    console.log("$$$$$");
    console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_temperature", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    console.log("get_sensors");
    //console.log(req.body);

    var result1 = gt.get_temperature(req.body, res);
    console.log("$$$$$");
    console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.get("/get_temperature", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    console.log("get_sensors");
    //console.log(req.body);

    var result1 = gt.get_temperature(req.body, res);
    console.log("$$$$$");
    console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_locations", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    console.log("get_sensors");
    //console.log(req.body);

    //var result1 = pro.get_locations(req.body, res);
    console.log("$$$$$");
    //console.log(result1);
    res.json({ result: 8 });  
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
