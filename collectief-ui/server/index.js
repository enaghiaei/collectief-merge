const http = require('http');
const express = require("express");
var bodyParser = require('body-parser')
var pro = require('./models/get_sensors');
var pro_all = require('./models/get_sensors_all');
var pro_info = require('./models/get_sensors_info');
var pro1 = require('./models/get_sensor_data');
var pro2 = require('./models/get_location_data');
var gmt = require('./models/get_measure_types');
var gst = require('./models/get_sensors_type');
var gt = require('./models/get_temperature');
var gt_battery = require('./models/get_battery');
var gt_ph = require('./models/get_temperature_per_hour');
var gt_ph_12h = require('./models/get_temperature_per_hour_12h');
var gt_ph_48h = require('./models/get_temperature_per_hour_48h');
var gt_ph_7d = require('./models/get_temperature_per_hour_7d');
var gt_ph_30d = require('./models/get_temperature_per_hour_30d');
var gt_ph_365d = require('./models/get_temperature_per_hour_365d');
var gt_ph_sensor = require('./models/get_temperature_per_hour_sensor');
var gt_ph_sensor_12h = require('./models/get_temperature_per_hour_sensor_12h');
var gt_ph_sensor_48h = require('./models/get_temperature_per_hour_sensor_48h');
var gt_ph_sensor_7d = require('./models/get_temperature_per_hour_sensor_7d');
var gt_ph_sensor_30d = require('./models/get_temperature_per_hour_sensor_30d');
var gt_ph_sensor_365d = require('./models/get_temperature_per_hour_sensor_365d');
var gt_ph_quarter = require('./models/get_temperature_per_quarter');
var gt_pre = require('./models/get_pressure_per_hour');
var gt_pre_sensor = require('./models/get_pressure_per_hour_sensor');
var gt_pm = require('./models/get_pm_per_hour');
var gt_pm_sensor = require('./models/get_pm_per_hour_sensor');
var gt_hum = require('./models/get_humidity_per_hour');
var gt_hum_sensor = require('./models/get_humidity_per_hour_sensor');
var gt_pd = require('./models/get_temperature_per_day');
var save_sc = require('./models/save_schedules');
var save_nt = require('./models/save_notification');
var get_sc = require('./models/get_schedules'); 
var get_nt = require('./models/get_notification');
var get_nt_types = require('./models/get_notification_types');
var get_nt_mes = require('./models/get_notification_messages');
var get_lo = require('./models/get_location');
var get_lo_sch = require('./models/get_location_schedule');
var get_lo_c = require('./models/get_clusters');
var get_lo_b = require('./models/get_buildings');
var get_lo_u = require('./models/get_units');
var get_lo_r = require('./models/get_rooms');
var get_lo_ = require('./models/get_location_');
var get_as = require('./models/get_assignment');
var get_as_lo = require('./models/get_assignment_locations');
var get_bo = require('./models/get_boxes');
var get_nt_def = require('./models/get_notification_default');
var get_nt_b = require('./models/get_notification_base');
var del_sc = require('./models/delete_schedule');
var pow_sc = require('./models/power_schedule');
var del_sc_access = require('./models/delete_user_access');
var upd_sc = require('./models/update_schedule');
var upd_nt = require('./models/update_notification');
var upd_nt_cu = require('./models/update_notification_custom');
var upd_nt_cu_stat = require('./models/update_notification_custom_stat');
var sav_co = require('./models/save_comment');
var sav_lo = require('./models/save_location');
var edit_as = require('./models/edit_assignment');
var edit_lo = require('./models/edit_location');
var remove_lo = require('./models/remove_location');
var sav_as = require('./models/save_assignment');
var sav_ho = require('./models/save_home');
var sav_ac = require('./models/save_access');
var del_re = require('./models/delete_old_records');
var che_not = require('./models/check_notifications');
var che_sensors = require('./models/check_sensors');
var che_not_def = require('./models/check_notifications_default');
var delete_nt_def = require('./models/delete_notification');
var delete_nt_def_cu = require('./models/delete_notification_custom');
var set_seen = require('./models/set_seen');
var set_delete = require('./models/set_delete');
var check_u = require('./models/checkuser');
var create_user = require('./models/create_user');
var delete_s = require('./models/deletesession');
var check_l = require('./models/check_login');
var is_login = require('./models/is_login');
var edit_user = require('./models/edit_user');
var usr = require('./models/get_users');
var usr_v2 = require('./models/get_users_v2');
var usr_detail = require('./models/get_users_detail');
var usr_access = require('./models/get_users_access'); 
var glt = require('./models/get_location_types'); 
var dis_sens = require('./models/disconnect_sensor'); 
var test_conn = require('./models/test_connection'); 
 
var update_sensor_list = require('./models/update_sensor_list'); 
var get_sri = require('./models/get_sri');
var update_sri = require('./models/update_sri'); 
var ksb = require('./models/ksb');
var ksb_2 = require('./models/ksb_2');
var ksb_3 = require('./models/ksb_3');
var export_csv = require('./models/export_csv');
var get_info = require('./models/get_info');
var check_get_from_qpe = require('./models/check_get_from_qpe');
//del_re
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


app.post("/create_user", (req, res) => {
    var result = create_user.create(req.body, req.socket.remoteAddress, res);
   //console.log("create_user");
   //console.log(result);

}

);


app.post("/edit_user", (req, res) => {
    var result = edit_user.edit(req.body, req.socket.remoteAddress, res);
    //console.log("create_user");
    //console.log(result);

}

);


app.get("/check_get_from_qpe", (req, res) => {

   //console.log("check_get_from_qpe");
    ////console.log(result);
    //inverval_timer = setInterval(function () {
    var result = check_get_from_qpe.check_get_from_qpe(req.body, res);
    //}, 1000);
}

);

app.post("/logout", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("logout");
   //console.log(req.body);
    delete_s.delete_session(req.body, res);

});


app.get("/get_data_from_qpe", (req, res) => {

   //console.log("get_data_from_qpe");
    ////console.log(result);
    inverval_timer = setInterval(function () {
        var result = get_info.get_data_from_qpe(req.body, res);
    }, 1000);
}

);


app.get("/test_connection", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("test_connection");
   //console.log(req.body);
    test_conn.test_connection(req.body, res);

});


app.get('/export_csv', function (req, res) {
    export_csv.export_csv(req.body, res);
});


app.get('/ksb_3', function (req, res) {
    //ksb_3.ksb_3(req.body, res);
    inverval_timer = setInterval(function () {
        var result = ksb_3.ksb_3(req.body, res);
    }, 10000);
});



app.post("/update_sri", (req, res) => {

    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("update_sri");
   //console.log(req.body);
    update_sri.save_(req.body, res);

});

app.get("/update_sensor_list", (req, res) => {    
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("update_sensor_list");
   //console.log(req.body);
    update_sensor_list.update_sensor_list(req.body, res);

});

app.post("/check_user", (req, res) => {
    var result = check_u.login(res, req.body.username, req.body.password, req.socket.remoteAddress);
   //console.log("login");
   //console.log(result);

});

app.post("/check_login", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("logout");
   //console.log(req.body);
    check_l.check_(req.body, res);

});

app.post("/is_login", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("is_login");
   //console.log(req.body);
    is_login.check_(req.body, res);

});



app.post("/get_sensors", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensors");
    //console.log(req.body);

    var result1 = pro.get_sensors(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_location_types", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_location_types");
    //console.log(req.body);

    var result1 = glt.get_location_types(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_sensors_all", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensors_all");
    //console.log(req.body);

    var result1 = pro_all.get_sensors_all(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_sensors_info", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensors");
    //console.log(req.body);

    var result1 = pro_info.get_sensors_info(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/save_schedules", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("save_schedules");
   //console.log(req.body);

    var result1 = save_sc.save_schedules(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/save_notification", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("save_notification");
   //console.log(req.body);
    var result1 = save_nt.save_notification(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_schedules", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_schedules");
   //console.log(req.body);

    var result1 = get_sc.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_notification", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_nt.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_notification_types", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification_types");
   //console.log(req.body);

    var result1 = get_nt_types.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_notification_messages", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_nt_mes.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_location", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_lo.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_location_schedule", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("get_notification");
    //console.log(req.body);

    var result1 = get_lo_sch.get_(req.body, res);
    //console.log("$$$$$");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_clusters", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_lo_c.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_buildings", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_lo_b.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_sri", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sri");
   //console.log(req.body);

    var result1 = get_sri.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.get('/ksb', function (req, res) {
    inverval_timer = setInterval(function () {
        var result = ksb.ksb(req.body, res);
    }, 2000);
});

app.get('/ksb_2', function (req, res) {
    ksb_2.ksb_2(req.body, res);
});

app.post("/get_units", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_lo_u.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_rooms", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_lo_r.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_location_", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_lo_.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_assignment", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_as.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_assignment_locations", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_as_lo.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_boxes", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_boxes");
   //console.log(req.body);

    var result1 = get_bo.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_notification_base", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_nt_b.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_users", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_users");
   //console.log(req.body);

    result1 = usr.get_users(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
   //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_users_v2", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("get_users");
    //console.log(req.body);

    result1 = usr_v2.get_users_v2(req.body, res);
    //console.log("$$$$$");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_users_detail", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("get_users");
    //console.log(req.body);

    result1 = usr_detail.get_users_detail(req.body, res);
    //console.log("$$$$$");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_users_access", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_users_access");
   //console.log(req.body);

    result1 = usr_access.get_users_access(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
   //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_notification_def", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_notification");
   //console.log(req.body);

    var result1 = get_nt_def.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/delete_notification", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_notification");
   //console.log(req.body);

    var result1 = delete_nt_def.update_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/power_schedule", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = pow_sc.power_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/delete_schedule", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("delete_schedule");
    //console.log(req.body);

    var result1 = del_sc.delete_(req.body, res);
    //console.log("$$$$$");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/delete_user_access", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = del_sc_access.delete_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/save_comment", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = sav_co.save_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/save_location", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = sav_lo.save_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/save_assignment", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = sav_as.save_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/edit_assignment", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("edit_assignment");
   //console.log(req.body);

    var result1 = edit_as.edit_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/edit_location", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("edit_location");
   //console.log(req.body);

    var result1 = edit_lo.edit_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/remove_location", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("edit_location");
   //console.log(req.body);

    var result1 = remove_lo.remove_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/set_seen", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("set_seen");
   //console.log(req.body);

    var result1 = set_seen.set_seen(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/set_delete", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("set_delete");
   //console.log(req.body);

    var result1 = set_delete.set_delete(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.get("/check_notifications", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("check_notifications");
   //console.log(req.body);

    var result1 = che_not.check_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/disconnect_sensor", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("disconnect_sensor");
   //console.log(req.body);

    var result1 = dis_sens.disconnect_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.get("/check_notifications_default", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("check_notifications_default");
   //console.log(req.body);

    var result1 = che_not_def.check_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.get("/check_sensors", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("check_sensors");
   //console.log(req.body);

    var result1 = che_sensors.check_sensors(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/save_home", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("save_home");
   //console.log(req.body);

    var result1 = sav_ho.save_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/save_access", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("save_home");
   //console.log(req.body);

    var result1 = sav_ac.save_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/update_schedule", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = upd_sc.update_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/update_notification", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = upd_nt.update_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/update_notification_custom", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("update_notification_custom");
   //console.log(req.body);

    var result1 = upd_nt_cu.update_notification(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/update_notification_custom_stat", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("update_notification_custom");
   //console.log(req.body);

    var result1 = upd_nt_cu_stat.update_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.get("/delete_record", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("delete_schedule");
   //console.log(req.body);

    var result1 = del_re.delete_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_sensor_data", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensor_data");
   //console.log(req.body);

    var result1 = pro1.get_sensor_data(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_location_data", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_location_data");
   //console.log(req.body);

    var result1 = pro2.get_location_data(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_sensors_type", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensors");
    //console.log(req.body);

    var result1 = gst.get_sensors_type(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_measure_types", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("get_sensors");
    //console.log(req.body);

    var result1 = gmt.get_measure_types(req.body, res);
    //console.log("$$$$$");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_temperature", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_temprature ......... !!!!!!!!!!!!!!!");
    //console.log(req.body);

    var result1 = gt.get_temperature(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/get_battery", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensors");
    //console.log(req.body);

    var result1 = gt_battery.get_(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_hour", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("temperature_per_hour");
    //console.log(req.body);

    var result1 = gt_ph.get_temperature_per_hour(req.body, res);
   //console.log("$$$$$temperature_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/temperature_per_hour_12h", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour");
    //console.log(req.body);

    var result1 = gt_ph_12h.get_temperature_per_hour_12h(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/temperature_per_hour_48h", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour");
    //console.log(req.body);

    var result1 = gt_ph_48h.get_temperature_per_hour_48h(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_hour_7d", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour");
    //console.log(req.body);

    var result1 = gt_ph_7d.get_temperature_per_hour_7d(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_hour_30d", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour");
    //console.log(req.body);

    var result1 = gt_ph_30d.get_temperature_per_hour_30d(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_hour_365d", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour");
    //console.log(req.body);

    var result1 = gt_ph_365d.get_temperature_per_hour_365d(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/temperature_per_hour_sensor", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("temperature_per_hour_sensor");
    //console.log(req.body);

    var result1 = gt_ph_sensor.get_temperature_per_hour_sensor(req.body, res);
   //console.log("$$$$$temperature_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});



app.post("/temperature_per_hour_sensor_12h", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour_sensor");
    //console.log(req.body);

    var result1 = gt_ph_sensor_12h.get_temperature_per_hour_sensor_12h(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});



app.post("/temperature_per_hour_sensor_48h", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour_sensor");
    //console.log(req.body);

    var result1 = gt_ph_sensor_48h.get_temperature_per_hour_sensor_48h(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_hour_sensor_7d", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour_sensor");
    //console.log(req.body);

    var result1 = gt_ph_sensor_7d.get_temperature_per_hour_sensor_7d(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_hour_sensor_30d", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour_sensor");
    //console.log(req.body);

    var result1 = gt_ph_sensor_30d.get_temperature_per_hour_sensor_30d(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_hour_sensor_365d", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
    //console.log("temperature_per_hour_sensor");
    //console.log(req.body);

    var result1 = gt_ph_sensor_365d.get_temperature_per_hour_sensor_365d(req.body, res);
    //console.log("$$$$$temperature_per_hour");
    //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.get("/temperature_per_hour_quarter", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("temperature_per_quarter");
    //console.log(req.body);

    var result1 = gt_ph_quarter.get_temperature_per_quarter(req.body, res);
   //console.log("$$$$$temperature_per_quarter");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/pressure_per_hour", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("pressure_per_hour");
    //console.log(req.body);

    var result1 = gt_pre.get_pressure_per_hour(req.body, res);
   //console.log("$$$$$pressure_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/pressure_per_hour_sensor", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("pressure_per_hour");
    //console.log(req.body);

    var result1 = gt_pre_sensor.get_pressure_per_hour(req.body, res);
   //console.log("$$$$$pressure_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/humidity_per_hour", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("pressure_per_hour");
    //console.log(req.body);

    var result1 = gt_hum.get_humidity_per_hour(req.body, res);
   //console.log("$$$$$pressure_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/humidity_per_hour_sensor", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("pressure_per_hour");
    //console.log(req.body);

    var result1 = gt_hum_sensor.get_humidity_per_hour(req.body, res);
   //console.log("$$$$$pressure_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/pm_per_hour", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("pressure_per_hour");
    //console.log(req.body);

    var result1 = gt_pm.get_pm_per_hour(req.body, res);
   //console.log("$$$$$pressure_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/pm_per_hour_sensor", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("pressure_per_hour");
    //console.log(req.body);

    var result1 = gt_pm_sensor.get_pm_per_hour(req.body, res);
   //console.log("$$$$$pressure_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});


app.post("/temperature_per_day", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("temperature_per_hour");
    //console.log(req.body);

    var result1 = gt_pd.get_temperature_per_day(req.body, res);
   //console.log("$$$$$temperature_per_hour");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});



app.get("/get_temperature", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensors");
    //console.log(req.body);

    var result1 = gt.get_temperature(req.body, res);
   //console.log("$$$$$");
   //console.log(result1);
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.post("/get_locations", (req, res) => {
    //var result = check_u.login(res,req.body.username,req.body.password,req.socket.remoteAddress);
   //console.log("get_sensors");
    //console.log(req.body);

    //var result1 = pro.get_locations(req.body, res);
   //console.log("$$$$$");
    //console.log(result1);
    res.json({ result: 8 });  
    //console.log("$$$$$");
    //check_l.check_(req.body,res);

});

app.listen(PORT, () => {
   //console.log(`Server listening on ${PORT}`);
});
