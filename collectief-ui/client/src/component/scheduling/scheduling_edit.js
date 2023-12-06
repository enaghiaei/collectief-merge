
import React, { useState, useRef } from "react";
import ReactWeather from 'react-open-weather';

import { Line } from '@ant-design/charts';
import { Gauge } from '@ant-design/plots';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import $ from "jquery";
import { Area } from '@ant-design/plots'
import Grid from '@mui/material/Grid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '@mui/material/Input';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus, faGear, faTemperature0, faPowerOff, faArrowRight, faCheck, faPlus, faRectangleAd, faRectangleList, faFileImport, faSquare, faClone, faSave, faList, faArrowCircleRight, faClose } from '@fortawesome/free-solid-svg-icons';
var first_point = 0;
var last_point = 0;
var current_start = -1;
var current_end = -1;
var current_temp = -1;
var current_title = "";
var current_range = 0;
var current_mode = -1;
var current_value = -1;
var current_value2 = -1;
var current_sensor_type = -1;
var context;
var template = [];
var parts_tmp = [];
var days_g = ["Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var mode_colors = ["#fff", "#FF30C0", "#0CA1FF", "#39B401", "#57823B","#3B5528"]
var modes = ["Manual Mode", "Resillent Mode", "Comfort Mode", "Eco Mode"]
var sensor_type = ["Temprature", "Pressure", "Humidity"];
var edit_id = -1;
class Scheduling_edit extends React.Component {
    
    constructor(props) {

        super(props);
        var times = [{ time: "00:00", position: "0" }, { time: "03:00", position: "0" }, { time: "06:00", position: "0" }, { time: "09:00", position: "0" }, { time: "12:00", position: "0" }, { time: "15:00", position: "0" }, { time: "18:00", position: "0" }, { time: "21:00", position: "0" }, { time: "24:00", position: "0" }]
        var index = 0;
        template[index] = {};
        var parts = [];
        var url_string = window.location.href
        var url = new URL(url_string);
        
        var edit_id_tmp = url.searchParams.get("token");
        edit_id = edit_id_tmp;
        for (var key = 0; key < 7; key++) {
            parts[index] = {};
            parts[index].temperature = "20";
            parts[index].start = 1;
            parts[index].end = 4;
            //console.log("current_mode", current_mode)
            parts[index].mode = 0;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Re";
            parts[index].start = 4;
            parts[index].end = 11;
            //console.log("current_mode", current_mode)
            parts[index].mode = 1;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Co";
            parts[index].start = 11;
            parts[index].end = 17;
            //console.log("current_mode", current_mode)
            parts[index].mode = 2;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Ec";
            parts[index].start = 17;
            parts[index].end = 24;
            //console.log("current_mode", current_mode)
            parts[index].mode = 3;
            parts[index].key = key;
            parts[index].title = "";
            index++;
        }
        template[0].parts = [{}];
        template[0].key = "0";
        template[0].name = "From empty template";
        template[1] = {};
        template[1].parts = parts;
        template[1].key = "0";
        template[1].name = "From Temprature";
        template[1].type = "Temprature";
        parts = [];
        index = 0;
        for (var key = 0; key < 7; key++) {
            parts[index] = {};
            parts[index].temperature = "10";
            parts[index].start = 1;
            parts[index].end = 4;
            //console.log("current_mode", current_mode)
            parts[index].mode = 0;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Co";
            parts[index].start = 4;
            parts[index].end = 15;
            //console.log("current_mode", current_mode)
            parts[index].mode = 2;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Re";
            parts[index].start = 15;
            parts[index].end = 19;
            //console.log("current_mode", current_mode)
            parts[index].mode = 1;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Ec";
            parts[index].start = 19;
            parts[index].end = 24;
            //console.log("current_mode", current_mode)
            parts[index].mode = 3;
            parts[index].key = key;
            parts[index].title = "";
            index++;
        }
        template[2] = {};
        template[2].parts = parts;
        template[2].key = "0";
        template[2].name = "From Pressure";
        template[2].type = "Pressure";
        parts = [];
        index = 0;
        for (var key = 0; key < 7; key++) {
            parts[index] = {};
            parts[index].temperature = "20";
            parts[index].start = 1;
            parts[index].end = 4;
            //console.log("current_mode", current_mode)
            parts[index].mode = 0;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Ec";
            parts[index].start = 4;
            parts[index].end = 10;
            //console.log("current_mode", current_mode)
            parts[index].mode = 3;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Co";
            parts[index].start = 10;
            parts[index].end = 17;
            //console.log("current_mode", current_mode)
            parts[index].mode = 2;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Re";
            parts[index].start = 17;
            parts[index].end = 24;
            //console.log("current_mode", current_mode)
            parts[index].mode = 1;
            parts[index].key = key;
            parts[index].title = "";
            index++;
        }
        var index = 0;
        var schedule = [];
        schedule[index] = {}
        schedule[index].parts = parts;
        schedule[index].key = index;
        schedule[index].type = "Humidity";
        schedule[index].name = "Temp Schedule";
        template[3] = {};
        template[3].parts = parts;
        template[3].key = "0";
        template[3].name = "From Humidity";
        template[3].type = "Humidity";
        
        this.state = {

            style: [],
            parts: [{}],
            schedules: schedule,
            template: template,
            times: times,
            value: 10,
            modes: modes,
            writable: true,
            style2: [{}],
            current_sensor_type: ""
        };
        context = this;


    }

    componentDidMount() {
        this.get_schedules()
        var parts = [];
        var index = 0;
        for (var key = 0; key < 7; key++) {
            parts[index] = {};
            parts[index].temperature = "20";
            parts[index].start = 1;
            parts[index].end = 4;
            //console.log("current_mode", current_mode)
            parts[index].mode = 0;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Ec";
            parts[index].start = 4;
            parts[index].end = 10;
            //console.log("current_mode", current_mode)
            parts[index].mode = 3;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Co";
            parts[index].start = 10;
            parts[index].end = 17;
            //console.log("current_mode", current_mode)
            parts[index].mode = 2;
            parts[index].key = key;
            parts[index].title = "";
            index++;
            parts[index] = {};
            parts[index].temperature = "Re";
            parts[index].start = 17;
            parts[index].end = 24;
            //console.log("current_mode", current_mode)
            parts[index].mode = 1;
            parts[index].key = key;
            parts[index].title = "";
            index++;
        }
        index = 0;
        var schedule = [];
        schedule[index] = {}
        schedule[index].parts = parts;
        schedule[index].key = index;
        schedule[index].type = "Humidity";
        schedule[index].name = "Temp Schedule";
        var times = [{ time: "00:00", position: "0" }, { time: "03:00", position: "0" }, { time: "06:00", position: "0" }, { time: "09:00", position: "0" }, { time: "12:00", position: "0" }, { time: "15:00", position: "0" }, { time: "18:00", position: "0" }, { time: "21:00", position: "0" }, { time: "24:00", position: "0" }]
        var cu = { ...this.state.style };
        var objCopy = cu;
        var x = [{}];
        for (var key1 in objCopy) {
            for (var key2 in objCopy[key1]) {
                x[key1][key2] = objCopy[key1][key2];
            }
        }
       //console.log(x);
       //console.log("rightffffffffffffffffffffff=", $(".right_schedule").width()*0.8)
        var y = parseInt(parseInt($(".timeline").width()) / 24);
        $(".timeline").css("width", $(".timeline").width())
        for (var key in this.state.parts) {
           //console.log(this.state.parts[key])
            var start = parseInt(this.state.parts[key].start);
            var end = parseInt(this.state.parts[key].end);
            x[key].left = (start * y) + "px"
            x[key].width = (end - start) * y + "px";
        }

        y = parseInt(parseInt($(".timeline1").width()) / 8);
        var r = 0;
        for (var key in times) {
           //console.log("y", y);
           //console.log((r) * y)
            times[key].position = ((r) * y) + "px";
            times[key].position_time = ((r) * y) - 15 + "px";
            r++;
        }
       //console.log("times",times)

        this.setState({

            style: x,
            times: times,
            schedules: schedule
        });
        this.componentDidMount1();
       
    }

    get_schedules() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token') })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result.result)
                    console.log(JSON.parse(result.result[0].sce))
                    var sc_tmp = [];
                    for (var key in result.result) {
                        if (sc_tmp[key].id == edit_id) {
                            console.log(key)
                            console.log(result.result[key].sce)
                            sc_tmp[key] = JSON.parse(result.result[key].sce)
                            sc_tmp[key].id = result.result[key].id
                        }
                    }
                    this.setState({
                        schedules: sc_tmp
                    }
                    );
                    this.editSchedule(edit_id);
                    console.log(result);
                    //this.renderRows();
                    //this.renderRows();

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }


    delete_schedule(id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/delete_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'),id:id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result)
                    if (result.message == "1") {
                        //console.log(result.result[0].sc_schedule)
                        var sc_tmp = [];
                        for (var key in result.result) {
                            sc_tmp[key] = JSON.parse(result.result[key].sce)
                            sc_tmp[key].id = result.result[key].id
                        }
                        this.setState({
                            schedules: sc_tmp
                        }
                        );
                    } else {
                        var sc_tmp = [];
                        this.setState({
                            schedules: sc_tmp
                        })
                    }
                    console.log(result);
                    //this.renderRows();
                    //this.renderRows();

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    save_schedules(schedule,index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/save_schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(schedule[index])
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result)
                    console.log(result.token)
                    schedule[index].id = result.token
                    this.setState({
                        schedules: schedule
                    }
                    );
                    console.log(result);
                    //this.renderRows();
                    //this.renderRows();

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }


    componentDidMount1() {
        var times = [{ time: "00:00", position: "0" }, { time: "03:00", position: "0" }, { time: "06:00", position: "0" }, { time: "09:00", position: "0" }, { time: "12:00", position: "0" }, { time: "15:00", position: "0" }, { time: "18:00", position: "0" }, { time: "21:00", position: "0" }, { time: "24:00", position: "0" }]
        var cu = { ...this.state.style };
        var objCopy = cu;
        var x = [{}];
        for (var key1 in objCopy) {
            for (var key2 in objCopy[key1]) {
                if (!x[key1])
                    x[key1] = {};
                x[key1][key2] = objCopy[key1][key2];
            }
        }
        var yz = { position: "absolute", left: "100px", height: "80px", width: "130px", background: "#7CC4F6", cursor: "pointer", "border-right": "3px solid white", "border-left": "3px solid white", writable: true, };
       //console.log(x);
        $(".timeline").css("width", $(".right_schedule").width() * 0.8)
        $(".timeline1").css("width", $(".right_schedule").width() * 0.8)
       //console.log("rightffffffffffffffffffffff=", $(".right_schedule").width() * 0.8)
        var y = parseInt(parseInt($(".timeline").width()) / 24); 
        var y2 = parseInt(parseInt($(".day_stat").width()) / 24);
       //console.log(this.state.parts)
       //console.log(mode_colors)
        var x_new = [];
        var x_new2 = [];
        const parts_tmp = this.state.parts;
        if (current_value2 != current_value) {
           // parts_tmp = [{}]
        }
        for (var key in parts_tmp) {
            if (this.state.parts[key].key === this.state.current_day || 1 == 1) {
               //console.log("key:::", key)
               //console.log(this.state.parts[key])
                var start = parseInt(this.state.parts[key].start);
                var end = parseInt(this.state.parts[key].end);
                if (!x_new[key])
                    x_new[key] = {};
                x_new[key].left = (start * y) + "px"
               //console.log(mode_colors[this.state.parts[key].mode])
                x_new[key].background = mode_colors[this.state.parts[key].mode];
                x_new[key].width = (end - start) * y + "px";
                x_new[key].key = this.state.parts[key].key;
                x_new[key].temperature = this.state.parts[key].temperature;
                x_new[key].temperature_x = (((end - start) * y)/2) - 20;
                x_new[key].temperature_y = 30;
                x_new[key].position = "absolute";
                x_new[key].height = "80px";
                x_new[key].cursor = "pointer";
                x_new[key]["border-right"] = "3px solid white";
                x_new[key]["border-left"] = "3px solid white";
                if (!x_new2[key])
                    x_new2[key] = {};
                x_new2[key].left = (start * y2) + "px"
               //console.log(mode_colors[this.state.parts[key].mode])
                x_new2[key].background = mode_colors[this.state.parts[key].mode];
                x_new2[key].width = (end - start) * y2 + "px";
                x_new2[key].key = this.state.parts[key].key;
                x_new2[key].temperature = this.state.parts[key].temperature;
                x_new2[key].temperature_x = (((end - start) * y2) / 2) - 10;
                x_new2[key].temperature_y = "-4px";
                x_new2[key].position = "absolute";
                x_new2[key].height = "2.4vh";
                x_new2[key].cursor = "pointer";
                x_new2[key]["border-right"] = "0px solid white";
                x_new2[key]["border-left"] = "0px solid white";
            }
           //console.log(x_new[key])
        }
       //console.log(x_new)
        y = parseInt(parseInt($(".timeline1").width()) / 8);
        var r = 0;
        for (var key in times) {
           //console.log("y", y);
           //console.log((r) * y)
            times[key].position = ((r) * y) + "px";
            times[key].position_time = ((r) * y) - 15 + "px";
            r++;
        }
       //console.log("times", times)
       //console.log("style", x_new)

        this.setState({

            style: x_new,
            times: times,
            style2: x_new2

        });

    }

    setmode_val(event,value) {
        //alert(value);
       //console.log("mode_value11111111111111111", value)
        current_mode = value;
    }


    settitle_val(event, value) {
        //alert(value);
       //console.log("mode_value11111111111111111", value)
        current_title = event.target.value;
    }

    setDay(event, key) {
        //alert("0")
        this.setState({

            current_day: key
            

        }); 
        $(".day_stat").removeClass("day_stat_b");       
        $("#day_" + key).addClass("day_stat_b");
        //day_stat_title
        //day_stat_title_tmp
        //$(".day_stat_title").addClass("day_stat_b");
        $(".day_stat_title_tmp").removeClass("day_stat_title_bold");
        $("#day_title_" + key).addClass("day_stat_title_bold");
        $(".right_schedule").removeClass("d-none");
       
        $(".arrow").removeClass("font_black");
        $("#arrow_" + key).addClass("font_black");
        current_start = -1;
        current_end = -1;
        current_temp = -1;        
        current_mode = -1;
        if (current_value2 != current_value) {
           
            /*this.setState({

                parts: [{}],
                style2: [{}],
                style: [{}]

            });*/
            this.componentDidMount1()
        } else {
            this.componentDidMount1()
        }
        
    }

    cancelRight() {
        $(".range_values").addClass("d-none");
    }

    saveSchedule() {
        //alert("0");
        if ((current_temp === -1 || current_mode === -1 || current_start === -1 || current_end === -1) && (current_mode == "0")) {
            /*if (current_title === "")
                toast.error('Please enter Schedule name ', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });*/
            //if()
            if (current_temp === -1)
            toast.error('Please set Temperature', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            if (current_mode === -1)
                toast.error('Please set Mode', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
         
            if (current_start === -1 || current_end === -1)
                toast.error('Please set Range', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

        }
        else if ((current_mode === -1 || current_start === -1 || current_end === -1) && (current_mode != "0")) {
            if (current_mode === -1)
                toast.error('Please set Mode', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            if (current_start === -1 || current_end === -1)
                toast.error('Please set Range', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        }
        else {
            toast.success('The new schedule is saved', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            $(".range_values").addClass("d-none");
            var current_day = this.state.current_day;

            var parts = this.state.parts;
            var cu = { ...this.state.parts };
            var objCopy = cu;
            var x = [{}];
            for (var key1 in objCopy) {
                for (var key2 in objCopy[key1]) {
                    if (!x[key1]) {
                        x[key1] = {};
                    }
                    x[key1][key2] = objCopy[key1][key2];
                }
            }
           //var parts = x;
            if (this.state.currenValue_tmp2 != this.state.currenValue_tmp) {
                //parts = [{}];
            }
           //console.log(parts);
            var index = parts.length;
            parts[index] = {};
            var mo = modes[current_mode].split("");
           //console.log(mo)
            if (current_mode !== 0)
                parts[index].temperature = mo[0] + "" + mo[1]
            else {
                parts[index].temperature = current_temp

                //parts[index].temperature = current_temp
            }
            parts[index].start = current_start
            parts[index].end = current_end
           //console.log("current_mode", current_mode)
            parts[index].mode = current_mode;
            parts[index].key = current_day;
            parts[index].title = current_title;
           console.log("inja========",parts);
            var start = parseInt(parts[index].start);
            var end = parseInt(parts[index].end);
            var x_new = []
            var key = index;
            var y = parseInt(parseInt($(".timeline").width()) / 24);
            var y2 = parseInt(parseInt($(".day_stat").width()) / 24);
            x_new[key] = {};
            x_new[key].left = (start * y) + "px"
           //console.log(mode_colors[parts[index].mode])
            x_new[key].background = mode_colors[parts[index].mode];
            x_new[key].width = (end - start) * y + "px";
            x_new[key].key = parts[index].key;
            x_new[key].temperature = parts[index].temperature;
            x_new[key].temperature_x = (((end - start) * y) / 2) - 20;
            x_new[key].temperature_y = 30;
            x_new[key].position = "absolute";
            x_new[key].height = "80px";
            x_new[key].cursor = "pointer";
            x_new[key]["border-right"] = "3px solid white";
            x_new[key]["border-left"] = "3px solid white";
            this.setState({

                parts: parts
               


            });
            this.componentDidMount1();
        }
    }

    setScheduleView(day) {
        var context1 = this;
        return this.state.style2.map(function (o, key) {
            //console.log(context.state.times[key].position)
            if (day === context1.state.style2[key].key) {
                return (
                    <div style={{ position: "relative" }}>
                        <div onMouseDown={(event) => context1.movement(event, key)} onMouseUp={context1.movement2} style={context1.state.style2[key]}>
                            <div style={{ position: "relative", left: context1.state.style2[key].temperature_x, color:"#000", top: context1.state.style2[key].temperature_y, "font-weight": "bold" }}>
                                {context1.state.style2[key].temperature}
                            </div>
                        </div>
                    </div>
                )
            }

        }
        )
    }

    createLeft() {
        var days = ["Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var str = ``;
       
        var context = this;
        return days.map(function (o, key) {
            
            return (
                <div>
                    <div className="day_stat_root" onClick={(event) => context.setDay(event, key)}>
                        <div className="day_stat_title_tmp day_stat_title" style={{}} id={"day_title_" + key}>
                            {days[key]}
                        </div>
                        <div>
                            <div className="day_stat" id={"day_" + key}>
                            {context.setScheduleView(key)}
                        </div>
                        <div className="inline-arrow">
                           
                            <FontAwesomeIcon icon={faArrowRight} id={"arrow_" + key} className="arrow ml-5" />
                        </div>
                    </div>
                        <div className="newline"></div>
                    </div>
            </div>
            );
        });
    }

    valuetext(event,value) {
       //console.log(event)
        //console.log("value",value);
        return `${value}°C`;
        //current_start = value
    }


    valuetext1(event, value) {
       //console.log(event)
       //console.log("value0000", value);
        current_start = value[0];
        current_end = value[1];
        return `${value}°C`;
        //current_start = value
    }

    movement(e,id) {
       //console.log(e);
       //console.log(id);
        first_point = e.clientX;
       //console.log("First: ", first_point);
        current_range = id;
    }

    movement2(e) {
        const { dimensions } = context.state;
       //console.log("dimensions", dimensions)
       //console.log("555");
       //console.log("right=", $(".timeline").innerWidth())
        var cu = {...context.state.style};
        var objCopy = cu;
       //console.log(cu)
       //console.log("current_range",current_range)
        var left = cu[current_range].left;
        left = parseInt(left.replace("px", ""));
        
       //console.log(e);
       //console.log(e);
        last_point = e.clientX;
       //console.log("Last: ", last_point)
        var newpos = parseInt(left) + (last_point - first_point);
        if (newpos < 0) {
            newpos = 0;
        }
        newpos = newpos + "px";
       //console.log("newpos===",newpos)
        var x = [{}];
        for (var key1 in objCopy) {
            for (var key2 in objCopy[key1]) {
                if (!x[key1])
                    x[key1] = {};
                x[key1][key2] = objCopy[key1][key2];
            }
        }
       //console.log(x);
        x[current_range].left = newpos;
        context.setState({

            style: x
        });
    }
   
    renderTimeLine() {
        var context1 = this;
        
        return this.state.times.map(function (o, key) {
           //console.log(context.state.times[key].position)
            return (
                <div style={{ width: "3px", "background-color": "#000", height: "8px", display: "inline-table", position: "absolute", left: context1.state.times[key].position }}>

                </div>
            )
            
        }
        )
       
    }

    renderRanges() {

        var context1 = this;
        return this.state.style.map(function (o, key) {
            //console.log(context.state.times[key].position)
            if (context1.state.style[key].key === context1.state.current_day) {
               //console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
               //console.log(context1.state.style[key])
                if (context1.state.parts[key] && context1.state.parts[key].mode && context1.state.parts[key].mode == 0) {
                    return (
                        <div onMouseDown={(event) => context1.movement(event, key)} onMouseUp={context1.movement2} style={context1.state.style[key]}>
                            <div style={{ position: "relative", left: context1.state.style[key].temperature_x, top: context1.state.style[key].temperature_y, "font-weight": "bold" }}>
                                {context1.state.style[key].temperature}℃
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div onMouseDown={(event) => context1.movement(event, key)} onMouseUp={context1.movement2} style={context1.state.style[key]}>
                            <div style={{ position: "relative", left: context1.state.style[key].temperature_x, top: context1.state.style[key].temperature_y, "font-weight": "bold" }}>
                                {context1.state.style[key].temperature}
                            </div>
                        </div>
                    )
                }
            }

        }
        )

    }

    renderModes() {
                                    
        var context1 = this;

        return this.state.modes.map(function (o, key) {
           ////console.log(context.state.times[key].position)
            if(key === 0)
            return (
                <div className="inline mr-1" style={{"width":"150px"} }>
                    <span className="mr-1 text-item">{context.state.modes[key]}</span><input type="radio" name="mode" className="" onClick={(event) => context1.setmode_val(event,key)} />
                </div>
                )
            else
                return (
                    <div className="inline mr-1" style={{ "width": "150px" }}>
                        <span className="mr-1 text-item">{context.state.modes[key]}</span><input type="radio" name="mode" className="" onClick={(event) => context1.setmode_val(event, key)} />
                    </div>
                )

        }
        )
    }


    setTemp(e) {
        $(".set_temperature").removeClass("d-none")
        $(".set_mode").addClass("d-none")
    }


    setMode(e) {
        $(".set_mode").removeClass("d-none")
        $(".set_temperature").addClass("d-none")
    }

    set_range(e) {
        $(".range_values").removeClass("d-none")
    }

    renderTimeLine2() {
        var context1 = this;

        return this.state.times.map(function (o, key) {
           //console.log(context.state.times[key].position)
            return (
                <div style={{ display: "inline-table", position: "absolute","top":"9px", left: context1.state.times[key].position_time }}>
                    {context1.state.times[key].time}
                </div>
            )

        }
        )

    }


    handleSliderChange = (event, newValue) => {
       // setValue(newValue);
        this.setState({

            value: newValue


        });
       //console.log("temp", newValue)
        current_temp = newValue;
    };

    handleInputChange = (event) => {
        var x = (event.target.value === '' ? '' : Number(event.target.value));
       //console.log("temp", x)
        current_temp = x;
        this.setState({

            value: x


        });
    };


    handleBlur(value){
        if (value < 0) {
            this.setState({

                value: 0


            });
        } else if (value > 100) {
            this.setState({

                value: 100


            });
        }
    };

    createRight() {

        const Separator = styled('div')(
            ({ theme }) => `
  height: ${theme.spacing(3)};
`,
        );

        const marks = [
            {
                value: 0,
                label: '00:00',
            },
            {
                value: 4,
                label: '04:00',
            },
            {
                value: 8,
                label: '08:00',
            },
            {
                value: 12,
                label: '00:12',
            },
            {
                value: 16,
                label: '00:16',
            },
            {
                value: 20,
                label: '00:20',
            },
            {
                value: 24,
                label: '00:24',
            }
        ];
        
        return (
            <div className="text-left">
               
                <div className="title">
                    Time
                </div>
                <div className = "ml-3 mt-2">
                    <div className="timeline" onMouseUp={this.movement2} style={{border:"1px solid gray"} }>
                        <div style={{ position: "relative",width: this.state.width }} >
                            {context.renderRanges()}
                        </div>
                    </div>
                    <div className="timeline1" onMouseUp={this.movement2} >
                        <div style={{ position: "relative" }} >
                            {context.renderTimeLine()}
                        </div>
                    </div>
                    <div className="timeline1" onMouseUp={this.movement2} >
                        <div style={{ position: "relative" }} >
                            {context.renderTimeLine2()}
                        </div>
                    </div>
                </div>
                <div className="newline2"></div>
                <div className="icon-row ml-3 mt-2">
                    <div className="icon-row-l1 mr-4 pointer" onClick={ (event) => this.set_range(event) }>
                        <FontAwesomeIcon icon={faAdd} className="circle mr-3" /><button className="button">Add</button>
                    </div>
                    <div className="icon-row-l1 mr-4 pointer">
                        <FontAwesomeIcon icon={faMinus} className="circle mr-3" /><button className="button">Remove</button>
                    </div>
                </div>
                <div className="text-left d-none range_values ml-3">
                    
                    <div className="slider_range slider-parent mt-3">
                        <div className= "title_s">
                            Choose range
                        </div>
                        <div className="slider-parent_l1 ml-4 mt-2">
                            
                            
                            <Slider
                                track={true}
                                aria-labelledby="track-false-range-slider"
                                getAriaValueText={(event) => this.valuetext(event)}
                                onChange={this.valuetext1}
                                defaultValue={[8, 14]}
                                min={0}
                                max={24}
                                aria-label="Always visible"
                                marks={marks}
                                step={1}
                                size="Small"
                                valueLabelDisplay="on"
                                disableSwap
                            />
                        </div>
                     
                    </div>
                    <div className="newline"></div>
                    <div className="title_s mt-3">
                        Action
                    </div>
                    <div className="newline"></div>
                    <div className="icon-row ml-2 mt-3">
                        <div className="icon-row-l1 mr-3 pointer" onClick={(event) => this.setMode(event)}>
                            <FontAwesomeIcon icon={faGear} className="circle mr-4" /><button className="button">SET MODE</button>
                        </div>
                        <div className="icon-row-l1 mr-3 pointer" onClick={(event) => this.setTemp(event)}>
                            <FontAwesomeIcon icon={faTemperature0} className="circle mr-4" /><button className="button">SET temperature</button>
                        </div>
                        <div className="icon-row-l1 mr-3 pointer">
                            <FontAwesomeIcon icon={faPowerOff} className="circle mr-4" /><button className="button">TURN OFF</button>
                        </div>
                    </div>


                    <div className = "set_temperature d-none">

                        <div className="slider-parent_l1 mt-3 ml-3">
                            <Typography id="input-slider" gutterBottom className="title">
                                <span className="mr-1 text-item">Temperature</span>
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                
                                </Grid>
                                <Grid item xs>
                                    <Slider
                                        value={typeof this.state.value === 'number' ? this.state.value : 0}
                                        onChange={this.handleSliderChange}
                                        aria-labelledby="input-slider"
                                    />
                                </Grid>
                                <Grid item>
                                    <Input
                                        value={this.state.value}
                                        size="small"
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleBlur}
                                        inputProps={{
                                            step: 1,
                                            min: 0,
                                            max: 100,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                    </div>

                    <div className="set_mode d-none mt-3 ml-3">

                        <div className="slider-parent_l1" style={{width:"100%"}}>

                            {context.renderModes()}
                        </div>

                    </div>


                    <div className="icon-row ml-0 mt-5">
                        <button className="button2" onClick={(event) => this.cancelRight()}>CANCEL</button>
                        <button className="button2" onClick={(event) => this.saveSchedule()}>SAVE</button>
                        
                    </div>
                </div>
            </div>
        );

    }


     renderRows(){
      //console.log("renderRows");
         return this.createLeft();
         //this.createRight();
    }

    setScheduleType() {
        //"color": "#4A4949" "border": "3px solid gray" 
        this.setState({

            parts: [{}],
            style2: [{}],
            style: [],
            times: [{}],
            current_sensor_type:-1
        });
        current_sensor_type = -1;
        $("#schedule_list").addClass("d-none"); 
        $("#schedule_new").removeClass("d-none"); 
        $("#schedule_list_b").css("border", "3px solid gray");
        $("#schedule_list_b").css("color", "gray");
        $("#schedule_new_b").css("color", "#4A4949"); 
        $("#schedule_new_b").css("border", "3px solid #5BB1EB"); 
        $("#save_button").removeClass("d-none");
        $("#template_div").removeClass("d-none");
        $("#edit_button").addClass("d-none");
        $("#day_0").click();
    }


    setScheduleList() {
        //"color": "#4A4949" "border": "3px solid gray" 
        this.setState({

            parts: [{}],
            style2: [{}],
            style: [],
            times: [{}],
            current_sensor_type: -1
        });
        current_sensor_type = -1;
        $("#schedule_new").addClass("d-none");
        $("#schedule_list").removeClass("d-none");
        $("#schedule_new_b").css("border", "3px solid gray");
        $("#schedule_list_b").css("border", "3px solid #5BB1EB");
        $("#schedule_list_b").css("color", "#4A4949");
        $("#schedule_new_b").css("color", "gray"); 
    }
    renderSensorTypeOptions() {
        var context1 = this;

        return sensor_type.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            return (
                <option value={key}>
                    {sensor_type[key]}
                </option>
            )

        }
        )
    }
    renderTemplateOptions() {
        var context1 = this;
        console.log("templates",template)
        return template.map(function (o, key) {
           ////console.log(context.state.temlate[key].position)
            return (
                <option value={key}>
                    { template[key].name}
                </option>
            )

        }
        )
    }

    editSchedule(id, key) {
        console.log("edit")
        console.log(this.state.schedules[key].parts)
        const parts_tmp = this.state.parts;
        if (current_value2 != current_value) {
            // parts_tmp = [{}]
        }
        var x_new = [];
        var x_new2 = [];
         $(".timeline").css("width", $(".right_schedule").width() * 0.8)
        $(".timeline1").css("width", $(".right_schedule").width() * 0.8)
       //console.log("rightffffffffffffffffffffff=", $(".right_schedule").width() * 0.8)
        var y = parseInt(parseInt($(".timeline").width()) / 24); 
        var y2 = parseInt(parseInt($(".day_stat").width()) / 24);
        for (var key in parts_tmp) {
            if (this.state.parts[key].key === this.state.current_day || 1 == 1) {
                //console.log("key:::", key)
                //console.log(this.state.parts[key])
                var start = parseInt(this.state.parts[key].start);
                var end = parseInt(this.state.parts[key].end);
                if (!x_new[key])
                    x_new[key] = {};
                x_new[key].left = (start * y) + "px"
                //console.log(mode_colors[this.state.parts[key].mode])
                x_new[key].background = mode_colors[this.state.parts[key].mode];
                x_new[key].width = (end - start) * y + "px";
                x_new[key].key = this.state.parts[key].key;
                x_new[key].temperature = this.state.parts[key].temperature;
                x_new[key].temperature_x = (((end - start) * y) / 2) - 20;
                x_new[key].temperature_y = 30;
                x_new[key].position = "absolute";
                x_new[key].height = "80px";
                x_new[key].cursor = "pointer";
                x_new[key]["border-right"] = "3px solid white";
                x_new[key]["border-left"] = "3px solid white";
                if (!x_new2[key])
                    x_new2[key] = {};
                x_new2[key].left = (start * y2) + "px"
                //console.log(mode_colors[this.state.parts[key].mode])
                x_new2[key].background = mode_colors[this.state.parts[key].mode];
                x_new2[key].width = (end - start) * y2 + "px";
                x_new2[key].key = this.state.parts[key].key;
                x_new2[key].temperature = this.state.parts[key].temperature;
                x_new2[key].temperature_x = (((end - start) * y2) / 2) - 10;
                x_new2[key].temperature_y = "-4px";
                x_new2[key].position = "absolute";
                x_new2[key].height = "2.4vh";
                x_new2[key].cursor = "pointer";
                x_new2[key]["border-right"] = "0px solid white";
                x_new2[key]["border-left"] = "0px solid white";
            }
            //console.log(x_new[key])
        }
        var times = [];
        y = parseInt(parseInt($(".timeline1").width()) / 8);
        var r = 0;
        for (var key in times) {
            //console.log("y", y);
            //console.log((r) * y)
            times[key].position = ((r) * y) + "px";
            times[key].position_time = ((r) * y) - 15 + "px";
            r++;
        }
        //console.log("times", times)
        //console.log("style", x_new)

        this.setState({

            style: x_new,
            times: times,
            style2: x_new2,
            parts: this.state.schedules[key].parts

        });
       

        this.componentDidMount1();
        $("#schedule_list").addClass("d-none");
        $("#save_button").addClass("d-none");
        $("#template_div").addClass("d-none");
        $("#edit_button").removeClass("d-none");
        $("#schedule_new").removeClass("d-none");
        $("#schedule_list_b").css("border", "3px solid gray");
        $("#schedule_list_b").css("color", "gray");
        $("#schedule_new_b").css("color", "#4A4949");
        $("#schedule_new_b").css("border", "3px solid #5BB1EB"); 
    }

    listSchedule() {

        var context1 = this;
        console.log("schedules:::",this.state.schedules)
        return this.state.schedules.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            return (
                <div value={key} className="m-2" style={{ border: "1px solid #eee", "border-radius": "10px", "padding": "10px", "display": "inline-table", "width": "220px", "height": "220px" }}>
                    <div style={{ position: "relative" }} title="Delete" onClick={(event) => context1.delete_schedule(context1.state.schedules[key].id)}>
                        <div style={{ position: "absolute", bottom: "0px", top: "-5px", "right": "-25px" , "cursor" : "pointer" }}>
                            <FontAwesomeIcon icon={faClose} className="circle mr-4" style={{"width":"16px","color":"gray","border":"2px solid gray"}} />
                        </div>
                    </div>
                    <div className="newline mt-2"></div>
                    <span style={{ "font-weight": "bold" }}> Title: </span>
                    <div className="newline"></div>
                    <span className = "ml-2">
                        {context1.state.schedules[key].name}
                    </span>
                    <div className="newline"></div>
                    <span style={{ "font-weight": "bold" }}> Type: </span>
                    <div className="newline"></div>
                    <span className="ml-2">
                        {context1.state.schedules[key].type}
                    </span>
                    <div style={{ position: "relative", "cursor": "pointer" }}>
                        <div style={{ position: "absolute", bottom: "0px",top:"50px","right":"-20px" }}>
                            <FontAwesomeIcon onClick={(event) => context1.editSchedule(context1.state.schedules[key].id,key)} icon={faArrowCircleRight} className="circle mr-4" style={{ "width": "20px","height":"20px" }} />
                        </div>
                    </div>
                </div>
            )

        }
        )

    }


    setTemplateType(value) {
       console.log("value=========", value);
       //console.log(template)
       console.log(template[value].parts)
        this.setState({

            parts: template[value].parts,
            currenValue_tmp: value,
            current_type: template[value].type
        });
        current_value2 = -1;
        current_value = value;
        //this.componentDidMount1()
        //this.componentDidMount1()
        //$("#select0").click();
    }

    setSensorType(value) {
        console.log("value=========", value);
        //console.log(template)
        console.log("sensor_type",sensor_type[value])
        this.setState({


            current_sensor_type: sensor_type[value]

        });
        current_sensor_type = sensor_type[value]
        //current_value2 = -1;
        //current_value = value;
        //this.componentDidMount1()
        //this.componentDidMount1()
        //$("#select0").click();
    }
    setTemplate() {
        this.setState({

            current_type: template[this.state.currenValue_tmp].type

        });
        current_value2 = current_value;
        //current_value = value;
        this.setState({
        currenValue_tmp2: this.state.currenValue_tmp
        });
        this.componentDidMount1()
    }

    saveNewTemplate() {
        const x = template;
        console.log(x)
       console.log(template)
        if (current_title === "" || this.state.current_sensor_type == "") {
            if (current_title === "")
            toast.error('Please enter Schedule name ', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            if (this.state.current_sensor_type === "")
                toast.error('Please enter Sensor type ', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        }
        else {
            
            //alert(index)
            const x = this.state.parts
            console.log(x)
            var schedule = this.state.schedules
            var index = schedule.length
            schedule[index] = {}
            schedule[index].parts = x;
            schedule[index].key = index;
            schedule[index].type = current_sensor_type;
            schedule[index].name = current_title;
            current_sensor_type = -1;
            toast.success('The new schedule is saved', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            $("#arrow_" + this.state.current_day).removeClass("font_black");
            $("#day_title_" + this.state.current_day).removeClass("day_stat_title_bold");
            this.setState({
                schedules: schedule,
                parts: [{}],
                style2: [{}],
                currenValue_tmp: "-1",
                currenValue_tmp2: "-2",
                current_sensor_type: "-1"


            });
            current_value2 = -1;
            current_value = -2;
            $(".right_schedule").addClass("d-none");
            $(".day_stat").removeClass("day_stat_b");
            $("#schedule_name").val("");
            current_title = "";
            this.save_schedules(schedule,index)
            //$("#day_" + key).addClass("day_stat_b");
            //this.setTemplate()
            //this.setTemplateType(0)
            //this.componentDidMount1()
        }
    }


    render() {

        //className = "ml-0 d-none" id = "schedule_part"
        
        return (
            <div className="main_panel">
                <div className="container_main mb-3">
                   
                    <div className="container_main_l1 text-left mb-3" style={{ "min-height": "500px"}}>
                        <div className="mb-4">
                            <button id="schedule_list_b" type="button" className="button2 pr-4 pl-4" style={{ "border-radius": "4px", "color": "#4A4949" }} onClick={(event) => this.setScheduleList()} value="New"><FontAwesomeIcon style={{ "font-weight": "bold", "color": "#4A4949" }} className="mr-2" icon={faList} /> List</button>

                            <button id="schedule_new_b" type="button" className="button2 pr-4 pl-4" style={{ color: "gray", "border": "3px solid gray", "border-radius": "4px" }} onClick={(event) => this.setScheduleType()} value="New"><FontAwesomeIcon style={{ "font-weight": "bold", "color": "#4A4949" }} className="mr-2" icon={faPlus} /> New</button>
                            <button type="button" className="button2" style={{ color: "gray", "border": "3px solid gray", "border-radius": "4px" }} value="Duplicate"><FontAwesomeIcon style={{ "font-weight": "bold" }} icon={faClone} /> Duplicate</button>
                            <button type="button" className="button2" style={{ color: "gray", "border": "3px solid gray", "border-radius": "4px" }} value="import"><FontAwesomeIcon style={{ "font-weight": "bold" }} icon={faFileImport} /> import</button>
                            <button type="button" className="button2" style={{ color: "gray", "border": "3px solid gray", "border-radius": "4px" }} value=""><FontAwesomeIcon style={{ "font-weight": "bold" }} icon={faGear} /> Wizard</button>
                        </div>
                        <div >
                            <div id="schedule_new" className= " d-none" style={{ border: "1px solid #eee", "border-radius": "10px", "padding": "10px" }}>
                                <div className="mb-5 text-center" id = "template_div">
                                    <div style={{ "display": "inline-table" }}>
                                        <span className="title" style={{ "padding-right": "10px", "font-size": "16px", "color":"#4A4949"}}>
                                            Choose template
                                        </span>
                                        <select id="select0" onClick={(event) => this.setTemplateType(event.target.value)} style={{ "border": "1px solid gray", "border-radius": "7px", width: "210px", padding: "5px" }}>
                                        {this.renderTemplateOptions()}
                                        </select>
                                        <button onClick={(event) => this.setTemplate()} className="button2 ml-1 p-1" style={{ background: "white", width: "36px", "border-radius": "7px" }}> <FontAwesomeIcon style={{"color":"#000","font-size":"18px","font-weight":"bold"}} icon={faCheck}  /></button>
                                    </div>
                               
                                </div>
                            
                                <div className="left_schedule">
                                    {this.createLeft()}
                                </div>
                                <div className="right_schedule d-none">
                                    {this.createRight()}
                                </div>
                                <div className="mb-4 mt-4 text-center">

                                    <div className="ml-5" style={{ "display": "inline-table" }}>
                                        <span className="title" style={{ "padding-right": "10px", "font-size": "16px" }}>

                                        </span>
                                        <div className="newline"></div>
                                        <select id="select1" onClick={(event) => this.setSensorType(event.target.value)} style={{ "border": "1px solid gray", "border-radius": "7px", width: "400px", padding: "5px" }}>
                                            <option value="">
                                                Choose sensor type
                                            </option>
                                            {this.renderSensorTypeOptions()}
                                        </select>
                                        <div className = "newline m-3"></div>
                                        <input type="text" className="pl-2" onKeyUp={(event) => this.settitle_val(event)} id="schedule_name" placeholder="Schedule name" style={{ "border": "1px solid gray", "border-radius": "7px", width: "400px", padding: "5px" }} />



                                    </div>
                                    <div className="newline"></div>
                                    <div id = "save_button" className="title mt-4" style={{ "display": "inline-table", "padding": "15px", "padding-top": "5px", "padding-bottm": "5px" }}>
                                        <button onClick={(event) => this.saveNewTemplate()} className="button2" style={{ "border-radius": "12px", "padding-right": "20px", "padding-left": "20px", "color": "#4A4949" }}><FontAwesomeIcon style={{ "font-weight": "bold", "color": "#4A4949" }} icon={faSave} />  Save</button>
                                    </div>
                                    <div id = "edit_button" className="title mt-4 d-none" style={{ "display": "inline-table", "padding": "15px", "padding-top": "5px", "padding-bottm": "5px" }}>
                                        <button onClick={(event) => this.editNewTemplate()} className="button2" style={{ "border-radius": "12px", "padding-right": "20px", "padding-left": "20px", "color": "#4A4949" }}><FontAwesomeIcon style={{ "font-weight": "bold", "color": "#4A4949" }} icon={faSave} />  Edit</button>
                                    </div>
                                </div>
                            </div>
                            <div id = "schedule_list">                                
                                <div>
                                    {this.listSchedule()}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                   
                </div>
            </div>
        );
    }
}



export default Scheduling_edit;