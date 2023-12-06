
import React from "react";
import ReactWeather from 'react-open-weather';

import { Line } from '@ant-design/charts';
import { Gauge } from '@ant-design/plots';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Area } from '@ant-design/plots';
import { faStar, faToggleOn, faToggleOff, faTrash, faTrashAlt, faPlus, faClose, faPlusCircle, faMinusCircle, faCheck, faCheckCircle, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus, faGear, faTemperature0, faPowerOff, faArrowRight, faArrowLeft, faInfo, faCircleInfo, faInfoCircle, faHome, faClock, faVolumeControlPhone, faWarning } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
var rate = 0;
var comment = "";
var notification = [];
var notification_base = [];
var notification_types = ["Indoor humidity", "Indoor temperature", "Pressure", "CO2", "Noise", "Outdoor humidity", "Outdoor temperature"]
var notification_unit = ["", "℃", "Pa", "", "dB", "", "℃"]
var notification_default = ["40", "40", "40", "40", "40", "40", "40"]
var notification_operation = ["Less than", "Equal", "Greater than"]
var current_new_notification = -1
var current_operation = -1
var current_val = -1
var current_unit = -1
var stat_of_edit = 0
var stat_of_edit_id = 0
class Notification extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            items: [],
            loading: "text-center",
            notification: notification,
            notification_messages: [],
            notification_base: notification_base,
            notification_types:[],
            notification_def: []
        };
        this.setState({
            items: [],
            loading: "text-center"
        });




    }

    componentDidMount() {
       
        this.get_notification_types()
      //  this.get_notification_messages()
        this.get_notification_base()
        this.get_notification_def()
        this.get_notification()
    }

    get_notification() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_notification', {
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
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};   
                        //console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].value = result.result[key].value
                        nt_tmp[key].type = result.result[key].type
                        nt_tmp[key].operation = result.result[key].operation
                        nt_tmp[key].importance = result.result[key].importance
                        nt_tmp[key].stat = result.result[key].stat
                        if (nt_tmp[key].stat == 0) {
                            //this.setSwitchCustom(nt_tmp[key].id, 0, 1)
                        } else {
                            //setSwitch(nt_tmp[key].id)
                        }
                    }
                   
                    this.setState({
                        notification: nt_tmp
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

    get_notification_types() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_notification_types', {
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
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        //console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].value = result.result[key].value
                        
                    }
                    this.setState({
                        notification_types: nt_tmp
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

    get_notification_messages() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_notification_messages', {
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
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        //console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].value = result.result[key].value
                        nt_tmp[key].message = result.result[key].message
                        nt_tmp[key].seen = result.result[key].seen
                 
                    }
                    this.setState({
                        notification_messages: nt_tmp
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
    get_notification_base() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_notification_base', {
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
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        //console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].value = result.result[key].value
                        nt_tmp[key].type = result.result[key].type
                        nt_tmp[key].operation = result.result[key].operation
                    }
                    this.setState({
                        notification_base: nt_tmp
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


    get_notification_def() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_notification_def', {
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
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].stat = result.result[key].stat
                        if (nt_tmp[key].stat == 0) {
                            this.setSwitch(nt_tmp[key].id,0,1)
                        } else {
                            //setSwitch(nt_tmp[key].id)
                        }
                    }
                    this.setState({
                        notification_def: nt_tmp
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


    SaveNotification(schedule, index) {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        current_val = $(".inp").val()
        var url = ""
        if (stat_of_edit == 0) {
            url = 'http://' + global.config.vals.root.ip + ':3002/save_notification'
        } else {
            url = 'http://' + global.config.vals.root.ip + ':3002/update_notification_custom'
        }
        return fetch(url , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "val": current_val, "operation": current_operation, "unit": this.state.current_new_notification_id, "id": stat_of_edit_id, "importance": $("#importance").val(), 'token': cookies.get('token') })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    this.get_notification()
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result)
                    for (var x = 1; x <= 5; x++) {
                        $("#id" + x).css("color", "gray");
                    }
                    $("#comment").val("")
                    toast.success('The new notification is saved', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                   
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

    setDelete(id) {



    }


    /* renderRows(){
       console.log("renderRows");
       this.createRow();
     }*/

    listNotification() {

        var context1 = this;
        console.log("notification:::", this.state.notification)
        return this.state.notification.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            var type = "";
            if (parseInt(context1.state.notification[key].stat) === 1) {
                return (

                    <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table", "cursor": "pointer" }} id={"custom_notification_" + context1.state.notification[key].id}>
                        <div style={{ "display": "inline-table", "text-align": "left" }} className="p-3" onClick={(event) => (context1.setPage3(key))} >
                            <div style={{ "font-weight": "bold" }}>
                                {notification_types[context1.state.notification[key].type]}
                            </div>
                            <div className="newline p-1"></div>
                            <div style={{ "color": "#C4C4C4" }}>
                                {notification_operation[context1.state.notification[key].operation]} {context1.state.notification[key].value} {notification_unit[context1.state.notification[key].type]}
                            </div>
                        </div>

                        <div style={{ "float": "right", "position": "relative", "top": "10px", "z-index": "100" }}>
                            <FontAwesomeIcon icon={faTrashAlt} className="arrow3" style={{ "font-size": "30px", "cursor": "pointer", "color": "#212121" }} id={"trash_" + context1.state.notification[key].id} onClick={(event) => (context1.DeleteNotification(context1.state.notification[key].id))} />
                        </div>
                        <div style={{ "float": "right", "position": "relative", "top": "8px", "right": "10px" }}>
                            <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id={"on_c_" + context1.state.notification[key].id} onClick={(event) => (context1.setSwitchCustom(context1.state.notification[key].id, 0))} />
                            <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id={"off_c_" + context1.state.notification[key].id} onClick={(event) => (context1.setSwitchCustom(context1.state.notification[key].id, 1))} />
                        </div>
                    </div>
                )
            } else {
                return (

                    <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table", "cursor": "pointer" }} id={"custom_notification_" + context1.state.notification[key].id}>
                        <div style={{ "display": "inline-table", "text-align": "left" }} className="p-3" onClick={(event) => (context1.setPage3(key))} >
                            <div style={{ "font-weight": "bold" }}>
                                {notification_types[context1.state.notification[key].type]}
                            </div>
                            <div className="newline p-1"></div>
                            <div style={{ "color": "#C4C4C4" }}>
                                {notification_operation[context1.state.notification[key].operation]} {context1.state.notification[key].value} {notification_unit[context1.state.notification[key].type]}
                            </div>
                        </div>

                        <div style={{ "float": "right", "position": "relative", "top": "10px", "z-index": "100" }}>
                            <FontAwesomeIcon icon={faTrashAlt} className="arrow3" style={{ "font-size": "30px", "cursor": "pointer", "color": "#212121" }} id={"trash_" + context1.state.notification[key].id} onClick={(event) => (context1.DeleteNotification(context1.state.notification[key].id))} />
                        </div>
                        <div style={{ "float": "right", "position": "relative", "top": "8px", "right": "10px" }}>
                            <FontAwesomeIcon icon={faToggleOn} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id={"on_c_" + context1.state.notification[key].id} onClick={(event) => (context1.setSwitchCustom(context1.state.notification[key].id, 0))} />
                            <FontAwesomeIcon icon={faToggleOff} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id={"off_c_" + context1.state.notification[key].id} onClick={(event) => (context1.setSwitchCustom(context1.state.notification[key].id, 1))} />
                        </div>
                    </div>
                )
            }

        }
        )

    }

    page1() {

        var context1 = this;
        //console.log("notification:::", this.state.notification)
        return this.state.notification_types.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            var type = "";
           // console.log(context1.state.notification_base[key].type)
            return (

                <div style={{ "text-align": "left", "width": "100%", "border-bottom": "2px solid #EDEDED", "display": "inline-table", "cursor": "pointer" }} onClick={(event) => (context1.setPage2(context1.state.notification_types[key].id))}>
                    <div style={{ "display": "inline-table", "text-align": "left", color: "#2B2B2B" }} className="p-3">

                        <div style={{ "font-weight": "bold" }}>
                            {context1.state.notification_types[key].value}
                        </div>

                        <div className="newline p-1"></div>
                       
                    </div>
                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                        <FontAwesomeIcon icon={faArrowRight} className="arrow3" style={{ "font-size": "20px", "cursor": "pointer", "color": "#D6D6D6" }} id="on_4" onClick={(event) => (this.setSwitch(4, 0))} />
                    </div>
                </div>
            )

        }
        )

    }

    inc() {
        var x = $(".inp").val();
        console.log(x++)
        $(".inp").val((x++));
    }

    dec() {
        var x = $(".inp").val();
        console.log(x--)
        $(".inp").val((x--));
    }

    setOperation(id) {
        current_operation = id
        $(".opr").addClass("d-none")
        $("#op_" + id).removeClass("d-none")
        $(".opt").css("color","#2B2B2B")
        $("#opt_" + id).css("color", "#EDA96E")
        $(".opr").css("color", "#2B2B2B")
        $("#op_" + id).css("color", "#EDA96E")

    }

    page2() {
        var key = 0;
        var context1 = this;
        //value={notification_default[context1.state.current_new_notification_id]}
        return (
            <div>
                <div style={{ "height": "600px" }} className="mt-5">
                    <div style={{ "text-align": "center", "font-weight": "bold" }} className="mt-5">
                                    <div className="pb-3" id="ph1" style={{ "text-align": "left", "font-weight": "bold", "display": "inline-table", "width": "33%", "border-bottom": "2px solid #C4C4C4", "color": "#000", "cursor": "pointer" }} onClick={(event) => (this.setPage1())}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="arrow3" style={{ "color": "#000" }} />
                                    </div>
                                    <div className="pb-3" id="ph2" style={{ "text-align": "center", "display": "inline-table", "width": "33%", "border-bottom": "2px solid #C4C4C4", "color": "#181818", "cursor": "pointer" }} onClick={(event) => (this.customP())}>
                                        <span style={{"font-weight" : "normal"}}> {context1.state.current_new_notification_title} </span>
                                    </div>
                                    <div className="pb-3" id="ph2" style={{ "text-align": "right", "font-weight": "bold", "display": "inline-table", "width": "33%", "border-bottom": "2px solid #C4C4C4", "color": "#000", "cursor": "pointer" }} onClick={(event) => (this.customP())}>
                                        <FontAwesomeIcon icon={faClose} className="arrow3" style={{ "color": "#000" }} />
                                    </div>
                                </div>

                                <div style={{ "text-align": "center", color: "#000", "border-bottom": "1px solid #EDEDED", "font-weight": "bold" }} className="pt-3 pb-3">
                                <div className="ml-1 pl-2" style={{ "font-size": "20px" }}>
                                        Edit your notification
                                    </div>
                                </div>
                    <div style={{ "text-align": "left", "width": "100%", "border-bottom": "2px solid #EDEDED", "display": "inline-table", "cursor": "pointer" }} onClick={(event) => (context1.setOperation(0))}>
                        <div style={{ "display": "inline-table", "text-align": "left", color: "#2B2B2B" }} className="p-3">
                            <div style={{ "font-size": "18px", "font-weight": "bold" }} id="opt_0" className="opt">
                                {"When "}<span>{context1.state.current_new_notification_title}</span>{" is less than"}
                            </div>
                            <div className="newline p-1"></div>

                        </div>
                        <div style={{ "float": "right", "position": "relative", "top": "15px" }}>
                            <FontAwesomeIcon icon={faCheckCircle} className="arrow3" style={{ "font-size": "26px", "cursor": "pointer", "color": "#D6D6D6" }} id="op_0" className="d-none opr" />
                        </div>
                    </div>
                    <div style={{ "text-align": "left", "width": "100%", "border-bottom": "2px solid #EDEDED", "display": "inline-table", "cursor": "pointer" }} onClick={(event) => (context1.setOperation(2))}>
                        <div style={{ "display": "inline-table", "text-align": "left", color: "#2B2B2B" }} className="p-3">
                            <div style={{ "font-size": "18px", "font-weight": "bold" }} id="opt_2" className="opt">
                                {"When "}<span> {context1.state.current_new_notification_title} </span>{" is greater than"}
                            </div>
                            <div className="newline p-1"></div>

                        </div>
                        <div style={{ "float": "right", "position": "relative", "top": "15px" }}>
                            <FontAwesomeIcon icon={faCheckCircle} className="arrow3" style={{ "font-size": "26px", "cursor": "pointer", "color": "#D6D6D6" }} id="op_2" className="d-none opr" />
                        </div>
                    </div>
                    <div style={{ "text-align": "left", "width": "100%", "border-bottom": "2px solid #EDEDED", "display": "inline-table", "cursor": "pointer" }}>
                        <div style={{ "display": "inline-table", "text-align": "left", color: "#2B2B2B" }} className="p-3">
                                <div style={{ "font-size": "18px" }} >
                                    <span> <input className= "inp" type="text"  style={{ "font-weight": "bold", "border": "0px", "width": "40px" }} /> </span><span style={{ "font-weight": "bold" }}> {notification_unit[context1.state.current_new_notification_id]}</span>
                            </div>
                            <div className="newline p-1"></div>

                        </div>
                        <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                <FontAwesomeIcon icon={faPlusCircle} className="arrow3 " style={{ "font-size": "26px", "cursor": "pointer", "color": "#4378F3" }} id="inp" onClick={(event) => (context1.inc())} />
                                <FontAwesomeIcon icon={faMinusCircle} className="arrow3 " style={{ "font-size": "26px", "cursor": "pointer", "color": "#4378F3" }} id="inp" onClick={(event) => (context1.dec())} />

                        </div>
                    </div>
                    <div style={{   "vertical-align":"middle","text-align": "left", "width": "100%", "border-bottom": "2px solid #EDEDED", "display": "inline-table", "cursor": "pointer", "height": "140px" }}>
                        <div style={{ "display": "inline-table", "text-align": "left", color: "#2B2B2B" , "vertical-align":"middle" }} className="p-3">
                            <div style={{ "font-size": "18px", "font-weight": "bold" }} className = "mt-4">
                                <span>
                                    Importance
                                </span>
                            </div>
                            <div className="newline p-1"></div>

                        </div>
                        <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                            <select size="3" style={{width:"200px" , "border":"1px solid #ddd"}} id="importance">
                                <option value="0" style={{ padding: "10px", "font-weight": "bold", "curser": "pointer" }} >Low <span style={{width:"10px",height:"10px","background-color":"green"} }></span></option>
                                <option value="1" style={{ padding: "10px", "font-weight": "bold", "curser": "pointer" }}>Middle</option>
                                <option value="2" style={{ padding: "10px", "font-weight": "bold", "curser": "pointer" }}>High</option>
                            </select>

                        </div>
                    </div>
                </div>

                <div>
                    <button onClick={(event) => (context1.SaveNotification())} style={{ "background-color": "#4378F3", "width": "60%", "color": "#fff", "border": "0px", "border-radius": "6px", "font-weight": "bold" }} className="p-3">Save</button>
                </div>
            </div>
        )

    }

    setPage0() {
        $("#page0").removeClass("d-none")
        $("#page1").addClass("d-none")
        $("#page2").addClass("d-none")
    }

    setPage1() {
        if (stat_of_edit == 0) {
            $("#page1").removeClass("d-none")
            $("#page0").addClass("d-none")
            $("#page2").addClass("d-none")
        } else {
            $("#page0").removeClass("d-none")
            $("#page1").addClass("d-none")
            $("#page2").addClass("d-none")
        }
        stat_of_edit = 0;
    }

    setPage2(key) {
        stat_of_edit = 0;
        //{ "val": current_val, "operation": current_operation, "unit": current_unit }
        $("#page2").removeClass("d-none")
        $("#page0").addClass("d-none")
        $("#page1").addClass("d-none")
        current_new_notification = key

        this.setState({
            current_new_notification_title: notification_types[current_new_notification],
            current_new_notification_id: key
        })
        
        this.setOperation(this.state.notification_base[key].operation)
        var x = this.state.notification_base[key].value
        //alert(x)
        $(".inp").val(x)
        current_val = x
        current_operation = this.state.notification_base[key].operation
        current_unit = current_new_notification
        
    }

    setPage3(key) {

        stat_of_edit = 1;
        //{ "val": current_val, "operation": current_operation, "unit": current_unit }
        $("#page2").removeClass("d-none")
        $("#page0").addClass("d-none")
        $("#page1").addClass("d-none")
        current_new_notification = key

        this.setState({
            current_new_notification_title: notification_types[current_new_notification],
            current_new_notification_id: key
        })

        this.setOperation(this.state.notification[key].operation)
        var x = this.state.notification[key].value
        //alert(x)
        $(".inp").val(x)
        stat_of_edit_id = this.state.notification[key].id
        current_val = x
        current_operation = this.state.notification[key].operation
        current_unit = current_new_notification
        $("#importance").val(this.state.notification[key].importance)

    }


    defaultP() {

    }

    customP() {

    }

    UpdateNotification(id, type) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        current_val = $(".inp").val()

        return fetch('http://' + global.config.vals.root.ip + ':3002/update_notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "stat": type, "id": id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result)
                    for (var x = 1; x <= 5; x++) {
                        $("#id" + x).css("color", "gray");
                    }
                    $("#comment").val("")
                    toast.success('Done', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

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

    UpdateNotificationCustom(id, type) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        current_val = $(".inp").val()

        return fetch('http://' + global.config.vals.root.ip + ':3002/update_notification_custom_stat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "stat": type, "id": id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result)
                    for (var x = 1; x <= 5; x++) {
                       // $("#id" + x).css("color", "gray");
                    }
                    $("#comment").val("")
                    toast.success('Done', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

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

    CheckDeleteNotification(id) {

        this.DeleteNotification(id);
        <Popup trigger={<button className="main_header_button" modal nested>

           
            New company
        </button>} modal nested>
            {close => (
                <div className="">

                    <div className="mb-4">
                        <div className="mt-3 mb-3 text-center">
                            You can build your company to manage your staff and projects
                        </div>
                        <div className="text-center">
                            
                            <input type="text" onChange={(e) => this.set_company_title(e.target.value)} className="company_create_text" placeholder="Company name" />
                            <label htmlFor="logo"><FontAwesomeIcon icon={faPaperclip} className="attach mr-2" title="Choose file" /></label>
                            <button className="main_header_button" onClick={() => this.create_company()} style={{ display: "inline-table" }}>Create</button>
                        </div>
                    </div>
                    <input type="file" className="d-none" onChange={(e) => this.uploadfile(e.target.files)} multiple id="logo" accept="image/*" />

                </div>
            )}




        </Popup>

    }

    DeleteNotification(id) {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        current_val = $(".inp").val()

        return fetch('http://' + global.config.vals.root.ip + ':3002/delete_notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"id": id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    this.get_notification()
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result)
                    for (var x = 1; x <= 5; x++) {
                        $("#id" + x).css("color", "gray");
                    }
                    $("#comment").val("")
                    toast.success('Done', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

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

    setSwitch(id, type, flag = 0) {
        //alert(id)
        if (type == 0) {
            $("#on_" + id).addClass("d-none")
            $("#off_" + id).removeClass("d-none")
        } else {
            $("#off_" + id).addClass("d-none")
            $("#on_" + id).removeClass("d-none")
        }
        if(flag == 0)
            this.UpdateNotification(id, type);
    }


    setSwitchCustom(id, type, flag = 0) {
        //alert(id)
        if (type == 0) {
            $("#on_c_" + id).addClass("d-none")
            $("#off_c_" + id).removeClass("d-none")
        } else {
            $("#off_c_" + id).addClass("d-none")
            $("#on_c_" + id).removeClass("d-none")
        }
        if (flag == 0)
            this.UpdateNotificationCustom(id, type);
    }

    defaultP() {
        $("#p1").removeClass("d-none")
        $("#p2").addClass("d-none")
        $("#ph1").css("border-bottom", "3px solid #181818");
        $("#ph1").css("color", "#181818");
        $("#ph2").css("color", "#C4C4C4");
        $("#ph2").css("border-bottom", "3px solid #C4C4C4");
    }

    customP() {
        $("#p2").removeClass("d-none")
        $("#p1").addClass("d-none")
        $("#ph2").css("border-bottom", "3px solid #181818");
        $("#ph1").css("border-bottom", "3px solid #C4C4C4");
        $("#ph2").css("color", "#181818");
        $("#ph1").css("color", "#C4C4C4");
    }


    render() {
        
            
        return (
            <div className="main_panel mb-2 pb-5">
                <div className="container_main">

                    <div className="container_main_l1 text-center" style={{ "vertical-align": "middle", "min-height": "400px" }}>

                        <div id = "page0" style={{ display: "inline-table" , "text-align" : "left" , "width":"100%"}}>
                            <div style={{ "text-align": "center" , "font-weight": "bold" }}>
                                Notifications
                            </div>
                            <div className="newline"></div>
                            <div style={{ "text-align": "center", "font-weight": "bold" }} className="mt-5">
                                <div className="pb-3" id="ph1" style={{ "text-align": "center", "font-weight": "bold", "display": "inline-table", "width": "45%", "border-bottom": "3px solid #181818", "color": "#181818", "cursor": "pointer" }} onClick={(event)=>(this.defaultP())}>
                                    Default
                                </div>
                                <div className="pb-3" id="ph2" style={{ "text-align": "center", "font-weight": "bold", "display": "inline-table", "width": "45%", "border-bottom": "3px solid #C4C4C4", "color": "#C4C4C4", "cursor": "pointer" }} onClick={(event) => (this.customP())}>
                                    Custom
                                </div>
                            </div>
                            <div id="p1" style={{ "text-align": "center" }} >
                                <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4" , "display" : "inline-table" }} >
                                    <div style={{ "display": "inline-table", "text-align": "left"}} className = "p-3">
                                        <div style={{"font-weight":"bold"}}>
                                            Freezing temperature
                                        </div>
                                        <div className="newline p-1"></div>
                                        <div style={{ "color": "#C4C4C4"}}>
                                            Outdoor temperature drops below 3℃ (37°F)
                                        </div>
                                    </div>
                                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                        <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="on_1" onClick={(event) => (this.setSwitch(1,0))} />
                                        <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="off_1"  onClick={(event) => (this.setSwitch(1,1))} />
                                    </div>
                                </div>

                                <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table" }} >
                                    <div style={{ "display": "inline-table" , "text-align": "left" }} className="p-3">
                                        <div style={{ "font-weight": "bold" }}>
                                            Pressure drop   
                                        </div>
                                        <div className="newline p-1"></div>
                                        <div style={{ "color": "#C4C4C4" }}>
                                            Pressure dropped by more than 2mbar (0.06inHg) in the last hour
                                        </div>
                                    </div>
                                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                        <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="on_2" onClick={(event) => (this.setSwitch(2, 0))} />
                                        <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="off_2" onClick={(event) => (this.setSwitch(2, 1))} />
                                    </div>
                                </div>

                                <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table" }} >
                                    <div style={{ "display": "inline-table", "text-align": "left" }} className="p-3">
                                        <div style={{ "font-weight": "bold" }}>
                                            Low temperature
                                        </div>
                                        <div className="newline p-1"></div>
                                        <div style={{ "color": "#C4C4C4" }}>
                                            Indoor temperature drops below 3℃ (37°F)
                                        </div>
                                    </div>
                                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                        <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="on_3" onClick={(event) => (this.setSwitch(3, 0))} />
                                        <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="off_3" onClick={(event) => (this.setSwitch(3, 1))} />
                                    </div>
                                </div>

                                <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table" }} >
                                    <div style={{ "display": "inline-table", "text-align": "left" }} className="p-3">
                                        <div style={{ "font-weight": "bold" }}>
                                            High CO2
                                        </div>
                                        <div className="newline p-1"></div>
                                        <div style={{ "color": "#C4C4C4" }}>
                                            CO2 level rises above 1000ppm
                                        </div>
                                    </div>
                                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                        <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="on_4" onClick={(event) => (this.setSwitch(4, 0))} />
                                        <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="off_4" onClick={(event) => (this.setSwitch(4, 1))} />
                                    </div>
                                </div>

                                <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table" }} >
                                    <div style={{ "display": "inline-table", "text-align": "left" }} className="p-3">
                                        <div style={{ "font-weight": "bold" }}>
                                            Very high CO2
                                        </div>
                                        <div className="newline p-1"></div>
                                        <div style={{ "color": "#C4C4C4" }}>
                                            CO2 level rises above 2000ppm
                                        </div>
                                    </div>
                                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                        <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="on_5" onClick={(event) => (this.setSwitch(5, 0))} />
                                        <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="off_5" onClick={(event) => (this.setSwitch(5, 1))} />
                                    </div>
                                </div>

                                <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table" }} >
                                    <div style={{ "display": "inline-table", "text-align": "left" }} className="p-3">
                                        <div style={{ "font-weight": "bold" }}>
                                            Humidity rise
                                        </div>
                                        <div className="newline p-1"></div>
                                        <div style={{ "color": "#C4C4C4" }}>
                                            Humidity rises by 20% within a short time
                                        </div>
                                    </div>
                                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                        <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="on_6" onClick={(event) => (this.setSwitch(6, 0))} />
                                        <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="off_6" onClick={(event) => (this.setSwitch(6, 1))} />
                                    </div>
                                </div>

                                <div style={{ "text-align": "left", "width": "90%", "border-bottom": "2px solid #D4D4D4", "display": "inline-table" }} >
                                    <div style={{ "display": "inline-table", "text-align": "left" }} className="p-3">
                                        <div style={{ "font-weight": "bold" }}>
                                            Sensors status
                                        </div>
                                        <div className="newline p-1"></div>
                                        <div style={{ "color": "#C4C4C4" }}>
                                            Alert for disconnected sensors
                                        </div>
                                    </div>
                                    <div style={{ "float": "right", "position": "relative", "top": "10px" }}>
                                        <FontAwesomeIcon icon={faToggleOn} className="arrow3" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="on_7" onClick={(event) => (this.setSwitch(7, 0))} />
                                        <FontAwesomeIcon icon={faToggleOff} className="arrow3 d-none" style={{ "color": "#F98928", "font-size": "40px", "cursor": "pointer" }} id="off_7" onClick={(event) => (this.setSwitch(7, 1))} />
                                    </div>
                                </div>

                            </div>
                            <div className="d-none" id="p2" className="d-none" style={{ "text-align": "center" }}>
                                <div style={{ "overflow-y": "auto", "height":"400px"}}>
                                    {this.listNotification()}
                                </div>
                                <div>
                                    <button onClick={(event) => (this.setPage1())} style={{ "background-color": "#4378F3", "width": "60%", "color": "#fff", "border": "0px", "border-radius": "6px", "font-weight": "bold" }} className="p-3"><FontAwesomeIcon icon={faPlus} style={{ "color": "#FFF", "font-weight": "bold", "font-size": "16px", "cursor": "pointer" }} /> New notification</button>
                                </div>
                            </div>
                        </div>

                        <div id="page1" className="d-none">
                            <div style={{ "text-align": "center", "font-weight": "bold" }} className="mt-5">
                                <div className="pb-3" id="ph1" style={{ "text-align": "left", "font-weight": "bold", "display": "inline-table", "width": "33%", "border-bottom": "2px solid #C4C4C4", "color": "#000", "cursor": "pointer" }} onClick={(event) => (this.setPage0())}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="arrow3" style={{ "color": "#000" }} />
                                </div>
                                <div className="pb-3" id="ph2" style={{ "text-align": "center", "font-weight": "bold", "display": "inline-table", "width": "33%", "border-bottom": "2px solid #C4C4C4", "color": "#181818", "cursor": "pointer" }} onClick={(event) => (this.customP())}>
                                    New notification
                                </div>
                                <div className="pb-3" id="ph2" style={{ "text-align": "right", "font-weight": "bold", "display": "inline-table", "width": "33%", "border-bottom": "2px solid #C4C4C4", "color": "#000", "cursor": "pointer" }} onClick={(event) => (this.customP())}>
                                    <FontAwesomeIcon icon={faClose} className="arrow3" style={{ "color": "#000" }} />
                                </div>
                            </div>

                            <div style={{ "text-align": "left", color: "#2B2B2B", "border-bottom": "1px solid #EDEDED" }} className="pt-3 pb-3">
                                <div className = "ml-1 pl-2">
                                    Select the measure for which you want to create a notification. You will receive a notification for all modules that concern the selected measure.
                                </div>
                            </div>
                            {this.page1()}
                        </div>

                        <div id="page2" className = "d-none">
                            {this.page2()}
                        </div>

                        <div className="newline">
                        </div>
                      
                    </div>

                </div>
            </div>
        );
    }
}



export default Notification;