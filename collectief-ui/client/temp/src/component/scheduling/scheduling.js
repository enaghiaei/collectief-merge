
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus, faGear, faTemperature0, faPowerOff, faArrowRight } from '@fortawesome/free-solid-svg-icons';
var first_point = 0;
var last_point = 0;
var current_start = 0;
var current_end = 0;
var current_temp = 0;
var current_range = 0;
var current_mode = -1;
var context;
var days_g = ["Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var mode_colors = ["#7CC4F6", "#8FF96D", "#F9B55D", "#F91045"]
var modes = ["mode1", "mode2", "mode3", "mode4"]
class Schedule extends React.Component {
    
    constructor(props) {

        super(props);
        var times = [{ time: "00:00", position: "0" }, { time: "03:00", position: "0" }, { time: "06:00", position: "0" }, { time: "09:00", position: "0" }, { time: "12:00", position: "0" }, { time: "15:00", position: "0" }, { time: "18:00", position: "0" }, { time: "21:00", position: "0" }, { time: "24:00", position: "0" }]

        this.state = {

            style: [{ position: "absolute", left: "100px", height: "80px", width: "130px", background: "#7CC4F6", cursor: "pointer", "border-right": "3px solid white", "border-left": "3px solid white", writable: true, }],
            parts: [{ start: "21", end: "24", mode: "0", temperature: "0" , key: 0 }],
            times: times,
            value: 10,
            modes: modes,
            writable: true,
        };
        context = this;


    }

    componentDidMount() {
        var times = [{ time: "00:00", position: "0" }, { time: "03:00", position: "0" }, { time: "06:00", position: "0" }, { time: "09:00", position: "0" }, { time: "12:00", position: "0" }, { time: "15:00", position: "0" }, { time: "18:00", position: "0" }, { time: "21:00", position: "0" }, { time: "24:00", position: "0" }]
        var cu = { ...this.state.style };
        var objCopy = cu;
        var x = [{}];
        for (var key1 in objCopy) {
            for (var key2 in objCopy[key1]) {
                x[key1][key2] = objCopy[key1][key2];
            }
        }
        console.log(x);
        console.log("rightffffffffffffffffffffff=", $(".right_schedule").width()*0.8)
        var y = parseInt(parseInt($(".timeline").width()) / 24);
        $(".timeline").css("width", $(".timeline").width())
        for (var key in this.state.parts) {
            console.log(this.state.parts[key])
            var start = parseInt(this.state.parts[key].start);
            var end = parseInt(this.state.parts[key].end);
            x[key].left = (start * y) + "px"
            x[key].width = (end - start) * y + "px";
        }

        y = parseInt(parseInt($(".timeline1").width()) / 8);
        var r = 0;
        for (var key in times) {
            console.log("y", y);
            console.log((r) * y)
            times[key].position = ((r) * y) + "px";
            times[key].position_time = ((r) * y) - 15 + "px";
            r++;
        }
        console.log("times",times)

        this.setState({

            style: x,
            times: times,
            
        });
       
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
        console.log(x);
        $(".timeline").css("width", $(".right_schedule").width() * 0.8)
        $(".timeline1").css("width", $(".right_schedule").width() * 0.8)
        console.log("rightffffffffffffffffffffff=", $(".right_schedule").width() * 0.8)
        var y = parseInt(parseInt($(".timeline").width()) / 24);
        console.log(this.state.parts)
        console.log(mode_colors)
        var x_new = [];
        for (var key in this.state.parts) {
            if (this.state.parts[key].key === this.state.current_day || 1 == 1) {
                console.log("key:::", key)
                console.log(this.state.parts[key])
                var start = parseInt(this.state.parts[key].start);
                var end = parseInt(this.state.parts[key].end);
                if (!x_new[key])
                    x_new[key] = {};
                x_new[key].left = (start * y) + "px"
                console.log(mode_colors[this.state.parts[key].mode])
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
            }
            console.log(x_new[key])
        }
        console.log(x_new)
        y = parseInt(parseInt($(".timeline1").width()) / 8);
        var r = 0;
        for (var key in times) {
            console.log("y", y);
            console.log((r) * y)
            times[key].position = ((r) * y) + "px";
            times[key].position_time = ((r) * y) - 15 + "px";
            r++;
        }
        console.log("times", times)
        console.log("style", x_new)

        this.setState({

            style: x_new,
            times: times,

        });

    }

    setmode_val(event,value) {
        //alert(value);
        console.log("mode_value11111111111111111", value)
        current_mode = value;
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
        
        this.componentDidMount1()
    }

    cancelRight() {
        $(".range_values").addClass("d-none");
    }

    saveSchedule() {
        //alert("0");
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
        console.log(parts);
        parts[current_day] = {};
        parts[current_day].temperature = current_temp
        parts[current_day].start = current_start
        parts[current_day].end = current_end
        console.log("current_mode", current_mode)
        parts[current_day].mode = current_mode;
        parts[current_day].key = current_day;
        console.log(parts);
        this.setState({

            parts: parts


        });
        this.componentDidMount1();
    }

    createLeft() {
        var days = ["Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var str = ``;
       
        var context = this;
        return days.map(function (o, key) {
            
            return (
                <div>
                    <div className="day_stat_root" onClick={(event) => context.setDay(event, key)}>
                        <div className="day_stat_title_tmp day_stat_title" id={"day_title_" + key}>
                            {days[key]}
                        </div>
                        <div className="day_stat" id={"day_"+key}>

                        </div>
                        <div className="inline-arrow">
                           
                            <FontAwesomeIcon icon={faArrowRight} id={"arrow_" + key} className="arrow ml-5" />
                        </div>
                        <div className="newline"></div>
                    </div>
            </div>
            );
        });
    }

    valuetext(event,value) {
        console.log(event)
        //console.log("value",value);
        return `${value}°C`;
        //current_start = value
    }


    valuetext1(event, value) {
        console.log(event)
        console.log("value0000", value);
        current_start = value[0];
        current_end = value[1];
        return `${value}°C`;
        //current_start = value
    }

    movement(e,id) {
        console.log(e);
        console.log(id);
        first_point = e.clientX;
        console.log("First: ", first_point);
        current_range = id;
    }

    movement2(e) {
        const { dimensions } = context.state;
        console.log("dimensions", dimensions)
        console.log("555");
        console.log("right=", $(".timeline").innerWidth())
        var cu = {...context.state.style};
        var objCopy = cu;
        console.log(cu)
        console.log("current_range",current_range)
        var left = cu[current_range].left;
        left = parseInt(left.replace("px", ""));
        
        console.log(e);
        console.log(e);
        last_point = e.clientX;
        console.log("Last: ", last_point)
        var newpos = parseInt(left) + (last_point - first_point);
        if (newpos < 0) {
            newpos = 0;
        }
        newpos = newpos + "px";
        console.log("newpos===",newpos)
        var x = [{}];
        for (var key1 in objCopy) {
            for (var key2 in objCopy[key1]) {
                if (!x[key1])
                    x[key1] = {};
                x[key1][key2] = objCopy[key1][key2];
            }
        }
        console.log(x);
        x[current_range].left = newpos;
        context.setState({

            style: x
        });
    }
   
    renderTimeLine() {
        var context1 = this;
        
        return this.state.times.map(function (o, key) {
            console.log(context.state.times[key].position)
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
                return (
                    <div onMouseDown={(event) => context1.movement(event, key)} onMouseUp={context1.movement2} style={context1.state.style[key]}>
                        <div style={{ position: "relative", left: context1.state.style[key].temperature_x, top: context1.state.style[key].temperature_y,"font-weight":"bold" }}>
                            {context1.state.style[key].temperature}℃
                        </div>
                    </div>
                )
            }

        }
        )

    }

    renderModes() {
                                    
        var context1 = this;

        return this.state.modes.map(function (o, key) {
           // console.log(context.state.times[key].position)
            return (
                <div className = "inline">
                    <span className="mr-1 text-item">Mode{key}</span><input type="radio" name="mode" className="mr-5" onClick={(event) => context1.setmode_val(event,key)} />
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
            console.log(context.state.times[key].position)
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
        console.log("temp", newValue)
        current_temp = newValue;
    };

    handleInputChange = (event) => {
        var x = (event.target.value === '' ? '' : Number(event.target.value));
        console.log("temp", x)
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
                    <div className="timeline" onMouseUp={this.movement2} >
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

                        <div className="slider-parent_l1">

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
       console.log("renderRows");
         return this.createLeft();
         //this.createRight();
     }


    render() {

        
        
        return (
            <div className="main_panel">
                <div className="container_main">
                   
                    <div className="container_main_l1 text-left">
                        <div className="left_schedule">
                            {this.createLeft()}
                        </div>
                        <div className="right_schedule d-none">
                            {this.createRight()}
                        </div>
                    </div>
                   
                </div>
            </div>
        );
    }
}



export default Schedule;