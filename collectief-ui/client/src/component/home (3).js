
import React from "react";
import ReactWeather from 'react-open-weather';
import { Column } from '@ant-design/plots';
import { Line } from '@ant-design/charts';
import { Gauge } from '@ant-design/plots';
import { Bar } from '@ant-design/plots';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import homepic from './../assets/image/home.png';
import Cookies from 'universal-cookie';
import { Area } from '@ant-design/plots';
import $ from "jquery";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus, faGear, faTemperature0, faPowerOff, faArrowRight, faArrowLeft, faInfo, faCircleInfo, faInfoCircle, faPlusSquare, faClose, faCheck, faTrashAlt, faPlusCircle, faPlus, faEdit, faPenClip, faPen, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import Spinner2 from "./Spinner2"
var config1 = {};
var config2 = {};
var config3 = {};
var config4 = {};
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        "border-radius": "10px"
    },
};
const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        "border-radius": "10px"
    },
};
let subtitle;
class Home extends React.Component {
   
    constructor(props) {

        super(props);
        this.state = {
            items: [],
            loading: "text-center",
            modalIsOpen: false,
            setIsOpen: false,
            modalIsOpen2: false,
            setIsOpen2: false,
            modalIsOpen3: false,
            setIsOpen3: false,
            sensor_info: [],
            top_boxes: [],
            top_boxes_all: [],
            box_function: -1,
            box_chart: 0,
            box_other: 0,
            box_parametr: 0,
            box_value_type: [0,1],
            box_title:"",
            data5: [{ "year": "1300", "value": "100", "category": "0x" }],
            data6: [{ "year": "1300", "value": "100", "category": "0x" }],
            boxes: [],
            rows: [],
            rows_new: [],
            boxes_new: [],
            location_title: [],
            is_login: false,
            top_boxes_stat:"remove-part p-0 pt-0 pr-1 d-none"
        };
        this.setState({
            items: [],
            modalIsOpen: false,
            setIsOpen: false,
            modalIsOpen2: false,
            setIsOpen2: false,
            modalIsOpen3: false,
            setIsOpen3: false,
            loading: "text-center",
            sensor_info: [],
            top_boxes: [],
            top_boxes_all: [],
            rows_new: [],
            boxes_new: [],
            data5: [{ "year": 0, "value": 0, "category": 0 }],
            data6: [{ "year": 0, "value": 0, "category": 0 }],
            temperature:`<div className={this.state.loading}>  
                  <Spinner3 customText="Loading"/>
                  </div>`
        });
        //this.temperature_per_hour();
        this.is_login()


    }

    componentDidMount() {
        this.is_login()
        setTimeout(() => {
            this.sensors();
            this.sensors_type();
          this.locations();
            this.temperature();
            this.temperature_per_hour();
            
            this.humidity_per_hour();
            this.pm_per_hour();
            this.pressure_per_hour();
            
            this.get_boxes();
              
            this.get_location();
           ;
        }, 2000);
        /*setInterval(() => {
            this.sensors();
            this.sensors_type();
            this.locations();
            this.temperature();
        }, 20000);*/
    }

    /* renderRows(){
       console.log("renderRows");
       this.createRow();
     }*/
    sensors() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_sensors', {
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
                    this.setState({
                        sensor_number: result.result.length,
                        sensor_info: result.result,
                        loading0: "d-none"
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

    sensors_type() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_sensors_type', {
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
                    this.setState({
                        sensor_type_number: result.result.length,
                        loading2: "d-none"
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


    temperature() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_temperature', {
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
                    //alert(result.result[0].av)
                    if (result.result[0].av == "" || result.result[0].av == "null" || result.result[0].av == null) {
                        result.result[0].av = 0;
                    }
                    /*
                    <option value="0">Cell temperature</option>
                    <option value="1">Air temperature</option>
                    <option value="2">Pressure</option>
                    <option value="3">Humidity</option>                                    
                    <option value="4">Voltage</option>
                    <option value="5">PM 1 (MASS)</option>
                    <option value="6">PM 2.5 (MASS)</option>
                    <option value="7">PM 4 (MASS)</option>
                    <option value="8">PM 10 (MASS)</option>
                    <option value="9">CO2</option>
                    <option value="10">TVOC</option>
                    */
                    var xxx = [];
                    var zzz = [];
                    var top_boxes_all = []
                    var yyy = ["Cell temperature", "Air temperature", "Atm. pressure", "Relative humidity", "Battery (V)", "PM 1 (MASS)", "PM 2.5 (MASS)", "PM 4 (MASS)", "PM 10 (MASS)", "CO2", "TVOC" ]
                    for (var key in result.result) {
                        top_boxes_all[top_boxes_all.length] = result.result[key];
                        xxx[xxx.length] = result.result[key].measure_name
                    }
                    for (var key in yyy) {
                        if (!xxx.includes(yyy[key]))
                            zzz[zzz.length] = yyy[key]
                    }
                    for (var key in zzz) {
                        var l = top_boxes_all.length
                        top_boxes_all[l] = {};
                        top_boxes_all[l].measure_name = zzz[key]
                        top_boxes_all[l].av = "-"
                    }
                    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",zzz)
                    //alert(result.result[0].av)
                    this.setState({
                        temperature: result.result[0].av.toFixed(2),
                        loading3: "d-none",
                        top_boxes_all: top_boxes_all
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

    openModal() {
        //setIsOpen(true);
        this.setState({
            setIsOpen: true
        });
}

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal() {

     this.setState({
         setIsOpen: false,
         box_function: -1
     });
    }
    chooseOperation(e) {
        //alert($("#box_function").val())
        var box_function = $("#box_function").val()
        console.log("box_function", box_function)
        if (box_function == 0) {
            console.log("h0")
            $("#level4").addClass("d-none")
            $("#level3").removeClass("d-none")
            $("#level2").removeClass("d-none")
            $("#level1").removeClass("d-none")
            $("#level11").removeClass("d-none")
        }
        else if (box_function == 1) {
            console.log("h1")
            $("#level4").removeClass("d-none")
            $("#level3").addClass("d-none")
            $("#level2").addClass("d-none")
            $("#level1").addClass("d-none")
            $("#level11").addClass("d-none")
        }
        this.setState({
           
            box_function: e.target.value
            
        });

    }

    chooseOperation_chart(e) {
        
        this.setState({

            box_chart: e.target.value

        });

    }


    chooseOperation_parametr(e) {

        this.setState({

            box_parametr: e.target.value

        });

    }


    chooseOperation_value_type(e) {
        var box_value_type
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({

            box_value_type: value

        });

    }


    chooseOperation_other(e) {

        this.setState({

            box_other: e.target.value

        });

    }

    /*
    chooseOperation_(e) {

        this.setState({

            box_: e.target.value

        });

    }


    chooseOperation_(e) {

        this.setState({

            box_: e.target.value

        });

    }*/

    openModal2(row,col,edit=0) {
        //setIsOpen(true);
        
        $("#row").val(row)
        $("#col").val(col)
        $("#edit").val(edit)
        console.log("edittttttttttttt",edit)
       
       

        if (edit == 1) {
            var rows_new = this.state.rows_new;
            //var rows = this.state.rows;
            var index = 0;
            for (var key in rows_new) {
                if (key < row) {
                    index += rows_new[key].c;
                }
            }
            var g = (index) + (col);
            var x = this.state.boxes_new[g].type
            console.log("editttttttttttttxxxxxxxxxxxxxx", x)
            $("#box_function").val(x.function)
            $("#box_chart").val(x.chart)
            $("#box_parametr").val(x.parametr)
            $("#box_value_type").val(x.value_type)
            $("#box_other").val(x.other)
            $("#box_function").click();
            this.setState({
                setIsOpen2: true,
                box_function: x.function,
                box_chart: x.chart,
                box_other: x.other,
                box_parametr: x.parametr,
                box_value_type: x.value_type,
                box_title: "",
            });
        } else {
            this.setState({
                setIsOpen2: true,
                
            });
        }
    }


    removeModal2(row, col) {
        //setIsOpen(true);
        $("#row").val(row)
        $("#col").val(col)
     
        this.removeItem()
    }


    removeM(key) {
        //setIsOpen(true);
        //$("#key").val(key)
       //alert(key)
        this.removeI3(key)
    }

    afterOpenModal2() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal2() {

        this.setState({
            setIsOpen2: false,
            box_function: -1
        });
    }

    openModal3(row, col) {
        //setIsOpen(true);
        $("#row").val(row)
        $("#col").val(col)
        this.setState({
            setIsOpen3: true
        });
    }


    removeModal3(row, col) {
        //setIsOpen(true);
        $("#row").val(row)
        $("#col").val(col)
        this.removeItem()
    }

    afterOpenModal3() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal3() {

        this.setState({
            setIsOpen3: false
        });
    }


    temperature_per_hour() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour', {
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
                    // Temperature (℃) per hour
                    console.log(result.result);
                    var data5 = [];
                    var i = 0;
                    
                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Temperature (℃) per hour";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "1x";
                            }
                            i++
                        }
                        
                    }
                    

                  

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Temperature (℃) per hour";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "0x";
                            }
                            i++
                        }
                        
                    }

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Temperature (℃) per hour";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }
                        
                    }

                    

                    console.log("data5",data5)
                    this.setState({
                        
                        data5: data5,
                        loading4: "d-none"
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


    humidity_per_hour() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/humidity_per_hour', {
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
                    // Temperature (℃) per hour
                    console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].category = "Max Humidity (℃) per hour";
                                data5[i].category2 = "Max";
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "1x";
                            }
                            i++
                        }
                        
                    }




                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Humidity (℃) per hour";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "0x";
                            }
                            i++
                        }
                        
                    }

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Humidity (℃) per hour";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }
                        
                    }



                    console.log("data5", data5)
                    this.setState({

                        data7: data5,
                        loading4: "d-none"
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


    pm_per_hour() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/pm_per_hour', {
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
                    // Temperature (℃) per hour
                    console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] +" per hour";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "1x";
                            }
                            i++
                        }
                           
                        
                    }




                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] +" per hour";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "0x";
                            }
                            i++
                        }
                            

                    }

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] +" per hour";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }
                        
                    }



                    console.log("data88888888888888888888888888888888888", data5)
                    this.setState({

                        data8: data5,
                        loading4: "d-none"
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

    pressure_per_hour() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/pressure_per_hour', {
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
                    console.log(result.result);
                    var data5 = [];
                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[key] = {};
                                data5[key].year = result.result[key][key2]["range_title"];
                                data5[key].value = parseFloat(result.result[key][key2]["av"]);
                                data5[key].category = "Pressure (P) per hour";
                                data5[key].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[key] = {};
                                data5[key].year = key;
                                data5[key].value = key;
                                data5[key].category = "0x";
                            }
                        }
                    }
                    var i = 0;
                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Pressure (P) per hour";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "0x";
                            }
                            i++
                        }
                        
                    }

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Pressure (P) per hour";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "1x";
                            }
                            i++
                        }
                       
                    }

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            console.log(key)
                            console.log(result.result[key])
                            console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Pressure (P) per hour";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].category2 = "Min";
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }
                        
                    }

                    console.log(data5)
                    this.setState({

                        data6: data5,
                        loading6: "d-none"
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

    locations() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_locations', {
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
                    this.setState({
                        sensor_location: result.result,
                        loading1: "d-none"
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

    show_sensors() {
        //$(".serials_detail").html("");
        $(".serials_detail2").addClass("d-none");
        $(".serials_detail3").addClass("d-none");
        $(".serials_detail1").removeClass("d-none");
        if ($(".serials").hasClass("d-none")){
            $(".serials").removeClass("d-none")
        } else {
            $(".serials").addClass("d-none")
        }
    }

    show_sensors1() {
        //$(".serials_detail").html("");
        $(".serials_detail2").addClass("d-none");
        $(".serials_detail3").addClass("d-none");
        $(".serials_detail1").removeClass("d-none");
       
    }

    show_sensor_data(serial_id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_sensor_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({serial: serial_id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    $(".serials_detail1").addClass("d-none");
                    $(".serials_detail2").removeClass("d-none");
                    $(".serials_detail3").removeClass("d-none");
                    var str = ``;
                    console.log(result);
                    for (var key in result.result) {
                        var x = "";
                        if (result.result[key].measure_kind === "Lux") {
                            x = "Lm/m<sup>2</sup>";
                        }
                        else if (result.result[key].measure_kind === "Humidity") {
                            x = "HR";
                        }
                        else if (result.result[key].measure_kind === "Temperature") {
                            x = "℃";
                        }
                        else if (result.result[key].measure_kind === "Pressure") {
                            x = "Pa";
                        }
                        else if (result.result[key].measure_kind === "Mass") {
                            x = "PM";
                        }
                        else if (result.result[key].measure_kind === "TVOC") {
                            x = "µg/m3";
                        }
                        else if (result.result[key].measure_kind === "CO2") {
                            x = "PPM";
                        }
                        else if (result.result[key].measure_kind === "Voltage") {
                            x = "V";
                        }
                        str += `<div style="border-bottom: 1px solid #eee;"><div style="display:inline-table;font-weight:bold;width:150px;text-align:left;">` + result.result[key].measure_name + `</div>` + `<div style="display:inline-table;font-weight:normal;width:100px">` + Number(result.result[key].measure_value).toFixed(2) + `</div><div style="display: inline-table; font-weight: normal; width: 70px">` + "" + x + "" + `</div><div style="clear:both;"></div></div>`;
                    }
                    $(".serials_detail2").html(str);
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

    list_sensors() {
        var context = this;
        return this.state.sensor_info.map(function (o, key) {

            return (
                <div style={{"border-bottom":"1px solid #eee"}}>
                    <div className="day_stat_root" onClick={(event) => context.show_sensor_data(context.state.sensor_info[key].sensor_serial)}>
                        <div className="day_stat_title_tmp day_stat_title" style={{ "font-weight": "bold","color":"black" , "cursor" : "pointer"}}  id={"day_title_" + key}>
                            {context.state.sensor_info[key].sensor_serial}
                        </div>
                        
                    </div>
                </div>
            );
        });
    }

   


    get_boxes() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_boxes', {
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
                    var x = []
                    var y = []
                    for (var key in result.result) {
                        
                        //console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        console.log("cb_default=====", result.result[key].cb_default)
                        if (parseInt(result.result[key].cb_default) == 1) {
                            var l = nt_tmp.length
                            nt_tmp[l] = {};
                            nt_tmp[l].id = result.result[key].cb_id
                            nt_tmp[l].title = result.result[key].cb_title
                            nt_tmp[l].column = result.result[key].cb_column
                            nt_tmp[l].row = result.result[key].cb_row
                            nt_tmp[l].type = parseInt(result.result[key].cb_type)
                        } else {
                            //var l = nt_tmp.length
                            x = JSON.parse(result.result[key].cb_type)
                            y = JSON.parse(result.result[key].cb_type_2)
                            
                        }
                    }
                    var rows = [];
                    for (var key in nt_tmp) {
                        if (!rows[nt_tmp[key].row]) {
                            rows[nt_tmp[key].row] = {}
                            rows[nt_tmp[key].row].c = 0;
                        }
                        rows[nt_tmp[key].row].c++;
                    }

                    var rows_new = [];
                    console.log("nt_tmp", nt_tmp)
                    console.log("rows", rows)
                    for (var key in x) {
                        if (!rows_new[x[key].row]) {
                            rows_new[x[key].row] = {}
                            rows_new[x[key].row].c = 0;
                        }
                        rows_new[x[key].row].c++;
                    }

                    this.setState({
                        boxes: nt_tmp,
                        boxes_new: x,
                        rows  : rows,
                        rows_new: rows_new,
                        top_boxes: y
                    }
                    );
                    $("#boxes").val(JSON.stringify(this.state.boxes_new))
                    $("#boxes_top").val(JSON.stringify(this.state.top_boxes))
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


    listBoxes() {

        var context1 = this;
        console.log("notification:::", this.state.notification)
        //{notification_operation[context1.state.boxes[key].operation]} {context1.state.boxes[key].value} {notification_unit[context1.state.boxes[key].type]}
            return this.state.rows.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            var type = "";

                return (
                
                <div className="container_main mt-3">
                    
                    {context1.renderColumns(key)}

                </div>
               
             
               
                )

            }
        )

    }

    removeI3(key) {
        var top_boxes = this.state.top_boxes;
        top_boxes.splice(key, 1)
        this.setState({
            top_boxes: top_boxes
        })
        $("#boxes_top").val(JSON.stringify(this.state.top_boxes))
    }


    removeItem() {
       
        var col = parseInt($("#col").val())
        var row = parseInt($("#row").val())
        var boxes_new = this.state.boxes_new;
        console.log("row", row)
        console.log("col", col)
        console.log("boxes_new_old", boxes_new)
        
        var rows_new = this.state.rows_new;
        console.log("rows_new_old", rows_new)
        //var rows = this.state.rows;
        var index = 0;
        for (var key in rows_new) {
            if (key < row) {
                index += rows_new[key].c;
            }
        }
        rows_new[row].c--;
        if (rows_new[row].c <= 0) {
            rows_new.splice(row, 1)
            for (var key in boxes_new) {
                if (boxes_new[key].row > row) {
                    boxes_new[key].row--;
                }
            }
        }
        for (var key in boxes_new) {
            if (boxes_new[key].row == row) {
                if (boxes_new[key].column > col) {
                    boxes_new[key].column--;
                }
            }
        }
        console.log("rows_new", rows_new)
        var g = (index) + (col);
        console.log("g==", g)
        console.log("index", index)
        if (index == 0) {
            g = (col);
        }
        boxes_new.splice(g,1)
        this.setState({
            boxes_new: boxes_new,
            rows_new: rows_new
        })
        $("#boxes").val(JSON.stringify(this.state.boxes_new))
    }

    addItemHorizontal(row) {
        console.log("ROW === " , row)
        // newRows
        var rows_new = this.state.rows_new;
        console.log("rows_new.length", rows_new.length)
        var x = "";
        var nboxes = $("#nboxes").val();
        var column = parseInt($("#nboxes").val());
        var l = row;
        if (rows_new[l].c < 5) {
        //rows_new[l] = {};
        rows_new[l].c++;
        column = rows_new[l].c;
        var boxes_new = this.state.boxes_new;
        var boxes_new2 = boxes_new;
        var split_array = []
        var split_array2 = []
        var flag = 1;
        console.log("boxes_old", boxes_new)
        for (var k = 0; k < boxes_new.length; k++) {
            if (flag == 1) {
                split_array[k] = boxes_new[k]
                if (boxes_new[k].row == l) {
                    if (boxes_new[k + 1] && boxes_new[k + 1].row != l) {
                        flag = 0;
                        var g = split_array.length;
                        split_array[g] = {};
                        split_array[g].row = l;
                        split_array[g].type = -1;
                        split_array[g].column = column - 1;
                        split_array[g].title = "";
                    } else if (!boxes_new[k + 1]) {
                        flag = 0;
                        var g = split_array.length;
                        split_array[g] = {};
                        split_array[g].row = l;
                        split_array[g].type = -1;
                        split_array[g].column = column - 1;
                        split_array[g].title = "";
                    }
                }
               
            } else {
                split_array2[split_array2.length] = boxes_new[k]
            }
            console.log("flag", flag)
        }
        console.log("split_array2", split_array2)
        console.log("split_array", split_array)
        var split_array3 = split_array.concat(split_array2);
        console.log("split_array3", split_array3)
        $("#boxes").val(JSON.stringify(split_array3))
        console.log("boxes_new", boxes_new)
        this.setState({
            boxes_new: split_array3,
            rows_new: rows_new
        })
        console.log("nboxes", nboxes)
        var wAll = 90
        if (nboxes == 1) {
            wAll = 90
        }
        var width = wAll / parseInt(nboxes)
        var w = (width) + ""
        console.log("width", width)
        var container = "";
        if (column === 1) {
            container = "container_c0"
        }
        else if (column === 2) {
            container = "container_c1"
        }
        else if (column === 3) {
            container = "container_c2"
        }
        else if (column === 4) {
            container = "container_c3"
        }
        else if (column === 5) {
            container = "container_c4"
        }
        else if (column === 6) {
            container = "container_c5"
        }
        for (var i = 0; i < parseInt(nboxes); i++) {
            x += '<div class="' + container + '">' + '' + '</div>';
            //x += '<div className="' + container + '" style="width:' + w + '%">' + '</div>';
        }

        console.log(x)
     }
        //$("#newRows").append('<div class="container_main mt-3">' + x + '</div>')
        //this.closeModal()
    }


    is_login() {

        const cookies = new Cookies();
        var token = cookies.get('token');
        //alert(token)
        if (token != "" && token) {
            var credentials = { token: token };
            console.log(credentials);
            return fetch('http://' + global.config.vals.root.ip + ':3002/is_login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })
                .then(data => data.json())
                .then(
                    (result) => {
                        /*this.setState({
                          isLoaded: true,
                          items: result.items
                        });*/
                        console.log(result);
                        console.log("message=" + result.message);
                        if (result.message === 1) {
                            this.setState({ fullname: result.name, is_login:true })
                            return true;

                        }
                        else if (result.message === 0) {

                            console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                            const cookies = new Cookies();
                            cookies.remove('token');
                            window.location.href = "/";
                            return false;


                        } else {

                        }
                        console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

                        //if(result.message == "1")
                        //  window.location.href = "/dashboard";

                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        return true;
                    }
                )
        } else {
            const cookies = new Cookies();
            cookies.remove('token');
            window.location.href = "/";
            return false;
        }

    }




    addItemHorizontal2(row) {

        //var col = parseInt($("#col").val())
        //var row = parseInt($("#row").val())
        var boxes_new = this.state.boxes_new;
        console.log("row", row)
        //console.log("col", col)
        console.log("boxes_new_old", boxes_new)

        var rows_new = this.state.rows_new;
        console.log("rows_new_old", rows_new)
        //var rows = this.state.rows;
        var index = 0;
        for (var key in rows_new) {
            if (key < row) {
                index += rows_new[key].c;
            }
        }
        rows_new[row].c++;
         /*if (rows_new[row].c <= 0) {
            rows_new.splice(row, 1)
            for (var key in boxes_new) {
                if (boxes_new[key].row > row) {
                    boxes_new[key].row--;
                }
            }
        }
       for (var key in boxes_new) {
            if (boxes_new[key].row == row) {
                if (boxes_new[key].column > col) {
                    boxes_new[key].column--;
                }
            }
        }*/
        console.log("rows_new", rows_new)
        /*var g = (index) + (col);
        console.log("g==", g)
        console.log("index", index)
        if (index == 0) {
            g = (col);
        }
        boxes_new.splice(g, 1)*/
        boxes_new[boxes_new.length]++;
        this.setState({
            boxes_new: boxes_new,
            rows_new: rows_new
        })
        $("#boxes").val(JSON.stringify(this.state.boxes_new))
    }

    addItem() {
        var selected = [];
        $('#box_parametr :selected').each(function () {
            selected[selected.length] = $(this).text();
        });
        var selected2 = [];
        $('#box_value_type :selected').each(function () {
            selected2[$(this).val()] = $(this).text();
        });
        console.log(selected);
        console.log(selected2);
        var box_function = parseInt($("#box_function").val())
        var box_chart = parseInt($("#box_chart").val())
        var box_parametr = parseInt($("#box_parametr").val())

        var box_value_type = selected2
        var box_other = parseInt($("#box_other").val())
        console.log("box_parametr", box_parametr)
        var box_title = $("#box_title").val()
        var location = $("#location_s").val()
        var col = parseInt($("#col").val())
        var row = parseInt($("#row").val())
        var boxes_new = this.state.boxes_new;
        var x = {};
        x.function = box_function
        x.chart = box_chart
        x.parametr = box_parametr
        x.value_type = box_value_type
        x.other = box_other
        x.location = location
        var location_title = "";
        for (var key in this.state.location_title) {
            if (parseInt(this.state.location_title[key].id) === parseInt(location)) {
                location_title = this.state.location_title[key].title
                console.log("location_title", location_title)
            }
        }
        console.log("xxxxxxxxxxxx",x)
        console.log("row",row)
        console.log("col",col)
        console.log("boxes_new_old", boxes_new)
        var rows_new = this.state.rows_new;
        //var rows = this.state.rows;
        var index = 0;
        for (var key in rows_new) {
            if (key < row) {               
                index += rows_new[key].c;
            }
        }
        var g = (index) + (col);
        console.log("g==", g)
        console.log("index", index)
        if (index == 0)
        {
            g = (col);
        }
        //for (var k = 0; k < column; k++) {
        
       // boxes_new[g] = {};
        boxes_new[g].row = row;
        boxes_new[g].type = x;
        //boxes_new[g].column = col;
        if (box_title == "")
            if (box_function == 0)
                box_title = location_title + " " + selected[0] + " Over Time"
        if (box_title == "") {
            box_title = "-"
        }
        boxes_new[g].title = box_title;
        
        console.log("boxes_new",boxes_new)
        this.setState({
            boxes_new: boxes_new
        })
        $("#boxes").val(JSON.stringify(this.state.boxes_new))
        this.closeModal2()
        //}
    }



    addItemTop() {
      
        var box_function = parseInt($("#box_function").val())
        var box_chart = parseInt($("#box_chart").val())
        var box_parametr = parseInt($("#box_parametr_2").val())
        var box_title = $("#box_title_2").val()
        
        console.log("box_parametr", box_parametr)
        console.log("Top", this.state.top_boxes_all)
        var x = this.state.top_boxes;
         
        for (var key in this.state.top_boxes_all) {
            if (box_parametr == 0) {
                if (this.state.top_boxes_all[key].measure_name == "Cell temperature") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 1) {
                if (this.state.top_boxes_all[key].measure_name == "Air temperature") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 2) {
                if (this.state.top_boxes_all[key].measure_name == "Atm. pressure") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 3) {
                if (this.state.top_boxes_all[key].measure_name == "Relative humidity") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 4) {
                if (this.state.top_boxes_all[key].measure_name == "Battery (V)") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 5) {
                if (this.state.top_boxes_all[key].measure_name == "PM 1 (MASS)") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 6) {
                if (this.state.top_boxes_all[key].measure_name == "PM 2.5 (MASS)") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 7) {
                if (this.state.top_boxes_all[key].measure_name == "PM 4 (MASS)") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 8) {
                if (this.state.top_boxes_all[key].measure_name == "PM 10 (MASS)") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 9) {
                if (this.state.top_boxes_all[key].measure_name == "CO2") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
            if (box_parametr == 10) {
                if (this.state.top_boxes_all[key].measure_name == "TVOC") {
                    var index = x.length;
                    x[index] = {};
                    x[index].title = box_title
                    x[index].measure_name = this.state.top_boxes_all[key].measure_name
                    x[index].value = this.state.top_boxes_all[key].av
                }
            }
        }
       
        this.setState({
            top_boxes: x,
            top_boxes_stat:"remove-part p-0 pt-0 pr-1"
        })
        $("#boxes_top").val(JSON.stringify(this.state.top_boxes))
        this.closeModal3()
        
        //}
    }

    listTopBoxes() {

        var context = this;
        var context1 = this;
        //                            <FontAwesomeIcon onClick={(event) => context.openModal3(key)} style={{ "color":"gray","cursor": "pointer", "width": "20px", "height": "20px" }} icon={faEdit} className="arrow pl-2" />

        return this.state.top_boxes.map(function (o, key) {
            var title = context.state.top_boxes[key].title
            if (context.state.top_boxes[key].title == "") {
                title = context.state.top_boxes[key].measure_name
            }
            return (
                <div className="container_c6">
                    <div class="row">
                        <div style={{ "text-align": "right", "position": "relative", "top": "-10px" }} className={context.state.top_boxes_stat}>
                            <FontAwesomeIcon onClick={(event) => context.removeM(key)} style={{ "color":"gray","cursor": "pointer", "width": "20px", "height": "20px" }} icon={faWindowClose} className="arrow pl-2" />
                        </div>
                        <div class="col-8">
                            <div class="numbers">
                                <p class="text-sm mb-0 font-weight-bold">
                                    {title}
                                </p>
                                <h5 class="font-weight-bolder mb-0">
                                    {context.state.top_boxes[key].value}
                                    <div className={context.state.loading3}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    <span class="text-success text-sm font-weight-bolder"></span>
                                </h5>
                            </div>
                        </div>
                        <div class="col-4 text-end">
                            <div class="icon icon-shape bg-gr-primary shadow text-center border-radius-md">
                                <FontAwesomeIcon onClick={(event) => context.show_sensors1()} icon={faInfoCircle} className="arrow2" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    addBoxes() {
        // newRows
        var rows_new = this.state.rows_new;
        console.log("rows_new.length", rows_new.length)
        var x = "";
        var nboxes = 1;
        var column = parseInt(1);
        var l = rows_new.length;
        rows_new[l] = {};
        rows_new[l].c = column;
        var boxes_new = this.state.boxes_new;
        
        for (var k = 0; k < column; k++) {
            var g = boxes_new.length;
            boxes_new[g] = {};
            boxes_new[g].row    = l;
            boxes_new[g].type = -1;
            boxes_new[g].column = k;
            boxes_new[g].title  = "";
        }

        $("#boxes").val(JSON.stringify(boxes_new))
        
        this.setState({
            boxes_new: boxes_new,
            rows_new: rows_new
        })
        console.log("nboxes", nboxes)
        var wAll = 90
        if (nboxes == 1) {
            wAll = 90
        }
        var width = wAll / parseInt(nboxes)
        var w = (width) + ""
        console.log("width", width)
        var container = "";
        if (column === 1) {
            container = "container_c0"
        }
        else if (column === 2) {
            container = "container_c1"
        }
        else if (column === 3) {
            container = "container_c2"
        }
        else if (column === 4) {
            container = "container_c3"
        }
        else if (column === 5) {
            container = "container_c4"
        }
        else if (column === 6) {
            container = "container_c5"
        }
        for (var i = 0; i < parseInt(nboxes); i++) {
            x += '<div class="' + container + '">' + '' + '</div>';
            //x += '<div className="' + container + '" style="width:' + w + '%">' + '</div>';
        }
        console.log(x)
        //$("#newRows").append('<div class="container_main mt-3">' + x + '</div>')
        this.closeModal()
    }


    


    listBoxesNew() {

        var context1 = this;
        console.log(this.state.rows_new)
        //console.log("notification:::", this.state.notification)
        //{notification_operation[context1.state.boxes[key].operation]} {context1.state.boxes[key].value} {notification_unit[context1.state.boxes[key].type]}
       
        return this.state.rows_new.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            var type = "";
            if ($(".edit-box").hasClass("d-none")) {
                return (

                    <div className="container_main mt-3" id={"row_" + key}>

                        {context1.renderColumnsNew(key)}
                        <div className="container_main right-remove-part" style={{ float: "right", "vertical-align": "middle", "margin": "1%", "margin-right": "0%", "margin-left": "0%" }} id={"row_add_" + key}>
                            <div className="container_c2" style={{ "vertical-align": "middle" }}>
                                <FontAwesomeIcon onClick={(event) => context1.addItemHorizontal(key)} style={{ "position": "relative", "color": "#000", "vertical-align": "middle", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faPlusCircle} className="arrow pl-2" />
                            </div>
                        </div>

                    </div>



                )
            } else {
                return (

                    <div className="container_main mt-3" id={"row_" + key}>

                        {context1.renderColumnsNew(key)}
                        <div className="container_main right-remove-part d-none" style={{ float: "right", "vertical-align": "middle", "margin": "1%", "margin-right": "0%", "margin-left": "0%" }} id={"row_add_" + key}>
                            <div className="container_c2" style={{ "vertical-align": "middle" }}>
                                <FontAwesomeIcon onClick={(event) => context1.addItemHorizontal(key)} style={{ "position": "relative", "color": "#000", "vertical-align": "middle", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faPlusCircle} className="arrow pl-2" />
                            </div>
                        </div>

                    </div>



                )
            }

        }
        )

    }


    get_location() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location', {
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
                        nt_tmp[key].title = result.result[key].title
                        nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_title: nt_tmp
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


    renderLocationOptions() {
        var context = this;
        return this.state.location_title.map(function (o, i) {
            return (
                <option value={context.state.location_title[i].id}>{context.state.location_title[i].title}</option>
            )
        }
        )
    }



    renderColumnsNew(key2) {
       
        var context1 = this;
        console.log(key2)
        console.log("boxes_new----------------------------------",context1.state.boxes_new)
        console.log("notification:::", this.state.notification)
        var column = this.state.rows_new[key2].c;
        var container = "";
        if (column === 1) {
            container = "container_c0"
        }
        else if (column === 2) {
            container = "container_c1"
        }
        else if (column === 3) {
            container = "container_c2"
        }
        else if (column === 4) {
            container = "container_c3"
        }
        else if (column === 5) {
            container = "container_c4"
        }
        else if (column === 6) {
            container = "container_c5"
        }
        //{notification_operation[context1.state.boxes[key].operation]} {context1.state.boxes[key].value} {notification_unit[context1.state.boxes[key].type]}
        /*x.function = box_function
        x.chart = box_chart
        x.parametr = box_parametr
        x.value_type = box_value_type*/
        return this.state.boxes_new.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            var type = "";
            if (context1.state.boxes_new[key].row === key2) {
                var x5 = context1.state.data5
                var x6 = context1.state.data6
                var x7 = context1.state.data7
                var x8 = context1.state.data8
                console.log("x555555555",x5)
                console.log("x888888888", x8)
                var x5_new = [];
                var x6_new = [];
                var x7_new = [];
                var x8_new = [];
               
                    
                for (var key3 in x6) {
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x6[key3].category2) && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x6[key3].category3)) {
                        
                            x6_new[x6_new.length] = x6[key3]
                        
                    }
                }


                for (var key3 in x5) {
                    
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x5[key3].category2) && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x5[key3].category3)) {
                        x5_new[x5_new.length] = x5[key3]
                    }
                }

                for (var key3 in x7) {
                    console.log("loc_1*", x7[key3].category3)
                    console.log("loc_1#", context1.state.boxes_new[key].type.location)
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x7[key3].category2) && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x7[key3].category3)) {
                        console.log("&&&&&&&&&&&&&&&&&&&&&");
                        x7_new[x7_new.length] = x7[key3]
                    }
                }

                for (var key3 in x8) {
                    //console.log("loc_1*", x8[key3].category3)
                    //console.log("loc_1#", context1.state.boxes_new[key].type.location)
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x8[key3].category2) && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x8[key3].category3)) {
                        x8_new[x8_new.length] = x8[key3]
                    }
                }
                console.log("x555555555_new", x5_new)
                console.log("x888888888_new", x8_new)
                if (context1.state.boxes_new[key].type.function == 1) {

                    
                    
                    
                    if (context1.state.boxes_new[key].type.other === 0) {
                        return (

                            <div className={container}>
                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "70%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title}
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <img src={homepic} style={{ width: "350px" }} />
                            </div>


                        )
                    } else if (context1.state.boxes_new[key].type.other === 1) {
                        return (

                            <div className={container}>
                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title}
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "gray", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "gray", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <Gauge {...config3} />
                            </div>


                        )
                    } else if (context1.state.boxes_new[key].type.other === 2) {
                        return (

                            <div className={container}>
                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "70%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title}
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "gray", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "gray", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <Area {...config4} />

                            </div>


                        )
                    } else if (context1.state.boxes_new[key].type.other === 3) {
                        return (

                            <div className={container}>

                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title}
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                    <Spinner2 customText="Loading" />
                                </div>
                                {context1.renderChart(context1.state.data5)}

                            </div>


                        )
                    }
                    else if (context1.state.boxes_new[key].type.other === 4) {
                        return (

                            <div className={container}>

                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title}
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                    <Spinner2 customText="Loading" />
                                </div>
                                {context1.renderChart(context1.state.data6)}

                            </div>


                        )
                    }
                    else if (context1.state.boxes_new[key].type.other === -1) {
                        return (

                            <div className={container}>

                                <div style={{ "text-align": "right" }} className="p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faPlusCircle} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>

                            </div>


                        )
                    }
                } else if (context1.state.boxes_new[key].type.function == 0) {
                    if (context1.state.boxes_new[key].type.parametr == 0) {
                        if (context1.state.boxes_new[key].type.chart == 1) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position":"relative" , "top":"-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChart(x5_new)}

                                </div>

                            )
                        } else if (context1.state.boxes_new[key].type.chart == 0) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartColumn(x5_new)}

                                </div>

                            )
                        }
                        else if (context1.state.boxes_new[key].type.chart == 2) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartBar(x5_new)}

                                </div>

                            )
                        }
                    }

                    else if (context1.state.boxes_new[key].type.parametr == 1){
                        if (context1.state.boxes_new[key].type.chart == 1) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChart(x6_new)}

                                </div>
                            )
                        } else if (context1.state.boxes_new[key].type.chart == 0) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartColumn(x6_new)}

                                </div>
                            )
                        }
                        else if (context1.state.boxes_new[key].type.chart == 2) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartBar(x6_new)}

                                </div>
                            )
                        }
                    }
                    else if (context1.state.boxes_new[key].type.parametr == 2) {
                        if (context1.state.boxes_new[key].type.chart == 1) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChart(x7_new)}

                                </div>
                            )
                        } else if (context1.state.boxes_new[key].type.chart == 0) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartColumn(x7_new)}

                                </div>
                            )
                        }
                        else if (context1.state.boxes_new[key].type.chart == 2) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartBar(x7_new)}

                                </div>
                            )
                        }
                    }
                    else if (context1.state.boxes_new[key].type.parametr == 3) {
                        if (context1.state.boxes_new[key].type.chart == 1) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChart(x8_new)}

                                </div>
                            )
                        } else if (context1.state.boxes_new[key].type.chart == 0) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartColumn(x8_new)}

                                </div>
                            )
                        }
                        else if (context1.state.boxes_new[key].type.chart == 2) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title}
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column,1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartBar(x8_new)}

                                </div>
                            )
                        }
                    }
                }
                else{
                    return (

                        <div className={container}>

                            <div style={{ "text-align": "right" }} className="p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faPlusCircle} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>

                        </div>



                    )
                }
            }

        }
        )
        /*  <div className="container_main mt-3">
              
             
              <div className="container_c3 text-center">
                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                      Lowest Battery Percentage (V)
                  </div>
                  <Gauge {...config3} />
              </div>
              <div className="container_c4">
                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "70%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>

                      Reward Function
                      </div>
                  <Area {...config4} />
                  
              </div>
          </div>
          <div className="container_main mt-3">

              <div className="container_c0 text-center">

                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                      Sensor Information
                  </div>
                  <div className={this.state.loading4} style={{"text-align":"center"} }>
                      <Spinner2 customText="Loading" />
                  </div>
                  {this.renderChart()}

              </div>   */
    }


    renderColumns(key2){
        var context1 = this;
        console.log(key2)
        console.log("notification:::", this.state.notification)
        var column = this.state.rows[key2].c;
        var container = "";
        if (column === 1) {
            container = "container_c0"
        }
        else if (column === 2) {
            container = "container_c1"
        }
        else if (column === 3) {
            container = "container_c2"
        }
        else if (column === 4) {
            container = "container_c3"
        }
        else if (column === 5) {
            container = "container_c4"
        }
        else if (column === 6) {
            container = "container_c5"
        }
        //{notification_operation[context1.state.boxes[key].operation]} {context1.state.boxes[key].value} {notification_unit[context1.state.boxes[key].type]}
        return this.state.boxes.map(function (o, key) {
            ////console.log(context.state.temlate[key].position)
            var type = "";
            console.log("key--in",key)
            if (context1.state.boxes[key].row === key2) {
                if (context1.state.boxes[key].type === 0) {
                    return (

                        <div className={container}>
                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "70%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>
                            <img src={homepic} style={{ width: "350px" }} />
                        </div>


                    )
                } else if (context1.state.boxes[key].type === 1) {
                    return (

                        <div className={container}>
                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>
                            <Gauge {...config3} />
                        </div>


                    )
                } else if (context1.state.boxes[key].type === 2) {
                    return (

                        <div className={container}>
                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "70%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>
                            <Area {...config4} />

                        </div>


                    )
                } else if (context1.state.boxes[key].type === 3) {
                    return (

                        <div className={container}>

                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-60px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color":"gray","cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>
                            <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                <Spinner2 customText="Loading" />
                            </div>
                            {context1.renderChart(context1.state.data5)}

                        </div>


                    )
                }
            }

        }
        )
              /*  <div className="container_main mt-3">
                    
                   
                    <div className="container_c3 text-center">
                        <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                            Lowest Battery Percentage (V)
                        </div>
                        <Gauge {...config3} />
                    </div>
                    <div className="container_c4">
                        <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "70%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>

                            Reward Function
                            </div>
                        <Area {...config4} />
                        
                    </div>
                </div>
                <div className="container_main mt-3">

                    <div className="container_c0 text-center">

                        <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "black", width: "40%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                            Sensor Information
                        </div>
                        <div className={this.state.loading4} style={{"text-align":"center"} }>
                            <Spinner2 customText="Loading" />
                        </div>
                        {this.renderChart()}

                    </div>   */       
    }


   

   
    renderChart(data_tmp) {
        //+" ℃"
        console.log(this.state.data5);
        var config44 = {
            "data": data_tmp,
            xField: 'year',
           
            yField: 'value',
            seriesField: 'category',
            height: 270,
            width: 300,
            meta: { range :[0,5]},
           
            legend: {
                position: 'top',
            },
        };
        if(data_tmp.length > 0)
        return (
            <Area {...config44} />
        );
        else {
            return (< div style={{ "text-align": "center", "font-weight": "bold", "font-size": "25px", "letter-spacing": "4px" }} className='mt-5' > No Data</div >);
        }
    }


    renderChartColumn(data_tmp) {
        //+" ℃"
        console.log(this.state.data5);
        var config44 = {
            "data": data_tmp,
            xField: 'year',
            height: 270,
            width: 300,
            isGroup: true,
            yField: 'value',
            seriesField: 'category',
            
            xAxis: {

            },
            yAxis: {

            },
            legend: {
                position: 'top',
            },
        };
        if (data_tmp.length > 0)
            return (
                <Column {...config44} />
            );
        else {
            return (< div style={{ "text-align": "center" , "font-weight" : "bold" , "font-size" : "25px" , "letter-spacing":"4px" }} className='mt-5' > No Data</div >);
        }
    }


    renderChartBar(data_tmp) {
        //+" ℃"
        console.log(this.state.data5);
        var config44 = {
            "data": data_tmp,
            xField: 'value',
           
            isGroup: true,
            yField: 'year',
            seriesField: 'category',

            xAxis: {

            },
            yAxis: {

            },
            legend: {
                position: 'top',
            },
        };
        if(data_tmp.length > 0)
        return (
            <Bar {...config44} />
        );
        else {
            return (< div style={{ "text-align": "center", "font-weight": "bold", "font-size": "25px", "letter-spacing": "4px" }} className='mt-5' > No Data</div >);
        }
    }


    renderChart1() {
        console.log(this.state.data5);
       
    }

    inArray(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (haystack[i] == needle) return true;
        }
        return false;
    }

 

    render() {
        
            var data = [
                { year: '14', value: 3 },
                { year: '15', value: 4 },
                { year: '16', value: 6.5 },
                { year: '17', value: 5 },
                { year: '18', value: 4.9 },
                { year: '19', value: 6 },
                { year: '20', value: 7 },
                { year: '21', value: 9 },
                { year: '22', value: 8 },
        ];
        

        const data2 = [
            {
                "year": "1850",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1850",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1851",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1852",
                "value": 57,
                "category": "Thermal comfort"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1853",
                "value": 59,
                "category": "Thermal comfort"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1854",
                "value": 69,
                "category": "Thermal comfort"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1855",
                "value": 71,
                "category": "Thermal comfort"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1856",
                "value": 76,
                "category": "Thermal comfort"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1857",
                "value": 77,
                "category": "Thermal comfort"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1858",
                "value": 78,
                "category": "Thermal comfort"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1859",
                "value": 83,
                "category": "Thermal comfort"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1860",
                "value": 91,
                "category": "Thermal comfort"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1861",
                "value": 95,
                "category": "Thermal comfort"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1862",
                "value": 96,
                "category": "Thermal comfort"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1863",
                "value": 103,
                "category": "Thermal comfort"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1864",
                "value": 112,
                "category": "Thermal comfort"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1865",
                "value": 119,
                "category": "Thermal comfort"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1866",
                "value": 122,
                "category": "Thermal comfort"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1867",
                "value": 130,
                "category": "Thermal comfort"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1868",
                "value": 134,
                "category": "Thermal comfort"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1869",
                "value": 142,
                "category": "Thermal comfort"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1870",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1870",
                "value": 146,
                "category": "Thermal comfort"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1871",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1871",
                "value": 156,
                "category": "Thermal comfort"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1872",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1872",
                "value": 173,
                "category": "Thermal comfort"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1873",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1873",
                "value": 183,
                "category": "Thermal comfort"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1874",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1874",
                "value": 173,
                "category": "Thermal comfort"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1875",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1875",
                "value": 187,
                "category": "Thermal comfort"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1876",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1876",
                "value": 190,
                "category": "Thermal comfort"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1877",
                "value": 2,
                "category": "Energy consumpion"
            },
            {
                "year": "1877",
                "value": 192,
                "category": "Thermal comfort"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1878",
                "value": 2,
                "category": "Energy consumpion"
            },
            {
                "year": "1878",
                "value": 194,
                "category": "Thermal comfort"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1879",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1879",
                "value": 207,
                "category": "Thermal comfort"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1880",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1880",
                "value": 233,
                "category": "Thermal comfort"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1881",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1881",
                "value": 239,
                "category": "Thermal comfort"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1882",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1882",
                "value": 252,
                "category": "Thermal comfort"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1883",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1883",
                "value": 269,
                "category": "Thermal comfort"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1884",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1884",
                "value": 271,
                "category": "Thermal comfort"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1885",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1885",
                "value": 273,
                "category": "Thermal comfort"
            },
            {
                "year": "1885",
                "value": 1,
                "category": "Savings"
            },
            {
                "year": "1885",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1885",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1886",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1886",
                "value": 275,
                "category": "Thermal comfort"
            },
            {
                "year": "1886",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1886",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1886",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1887",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1887",
                "value": 287,
                "category": "Thermal comfort"
            },
            {
                "year": "1887",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1887",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1887",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1888",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1888",
                "value": 317,
                "category": "Thermal comfort"
            },
            {
                "year": "1888",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1888",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1888",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1889",
                "value": 6,
                "category": "Energy consumpion"
            },
            {
                "year": "1889",
                "value": 318,
                "category": "Thermal comfort"
            },
            {
                "year": "1889",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1889",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1889",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1890",
                "value": 8,
                "category": "Energy consumpion"
            },
            {
                "year": "1890",
                "value": 345,
                "category": "Thermal comfort"
            },
            {
                "year": "1890",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1890",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1890",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1891",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1891",
                "value": 360,
                "category": "Thermal comfort"
            },
            {
                "year": "1891",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1891",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1891",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1892",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1892",
                "value": 363,
                "category": "Thermal comfort"
            },
            {
                "year": "1892",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1892",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1892",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1893",
                "value": 10,
                "category": "Energy consumpion"
            },
            {
                "year": "1893",
                "value": 358,
                "category": "Thermal comfort"
            },
            {
                "year": "1893",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1893",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1893",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1894",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1894",
                "value": 372,
                "category": "Thermal comfort"
            },
            {
                "year": "1894",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1894",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1894",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1895",
                "value": 11,
                "category": "Energy consumpion"
            },
            {
                "year": "1895",
                "value": 393,
                "category": "Thermal comfort"
            },
            {
                "year": "1895",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1895",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1895",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1896",
                "value": 12,
                "category": "Energy consumpion"
            },
            {
                "year": "1896",
                "value": 405,
                "category": "Thermal comfort"
            },
            {
                "year": "1896",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1896",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1896",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1897",
                "value": 13,
                "category": "Energy consumpion"
            },
            {
                "year": "1897",
                "value": 425,
                "category": "Thermal comfort"
            },
            {
                "year": "1897",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1897",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1897",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1898",
                "value": 13,
                "category": "Energy consumpion"
            },
            {
                "year": "1898",
                "value": 449,
                "category": "Thermal comfort"
            },
            {
                "year": "1898",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1898",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1898",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1899",
                "value": 14,
                "category": "Energy consumpion"
            },
            {
                "year": "1899",
                "value": 491,
                "category": "Thermal comfort"
            },
            {
                "year": "1899",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1899",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1899",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1900",
                "value": 16,
                "category": "Energy consumpion"
            },
            {
                "year": "1900",
                "value": 515,
                "category": "Thermal comfort"
            },
            {
                "year": "1900",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1900",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1900",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1901",
                "value": 18,
                "category": "Energy consumpion"
            },
            {
                "year": "1901",
                "value": 531,
                "category": "Thermal comfort"
            },
            {
                "year": "1901",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1901",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1901",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1902",
                "value": 19,
                "category": "Energy consumpion"
            },
            {
                "year": "1902",
                "value": 543,
                "category": "Thermal comfort"
            },
            {
                "year": "1902",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1902",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1902",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1903",
                "value": 20,
                "category": "Energy consumpion"
            },
            {
                "year": "1903",
                "value": 593,
                "category": "Thermal comfort"
            },
            {
                "year": "1903",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1903",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1903",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1904",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1904",
                "value": 597,
                "category": "Thermal comfort"
            },
            {
                "year": "1904",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1904",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1904",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1905",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1905",
                "value": 636,
                "category": "Thermal comfort"
            },
            {
                "year": "1905",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1905",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1905",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1906",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1906",
                "value": 680,
                "category": "Thermal comfort"
            },
            {
                "year": "1906",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1906",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1906",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1907",
                "value": 28,
                "category": "Energy consumpion"
            },
            {
                "year": "1907",
                "value": 750,
                "category": "Thermal comfort"
            },
            {
                "year": "1907",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1907",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1907",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1908",
                "value": 30,
                "category": "Energy consumpion"
            },
            {
                "year": "1908",
                "value": 714,
                "category": "Thermal comfort"
            },
            {
                "year": "1908",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1908",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1908",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1909",
                "value": 32,
                "category": "Energy consumpion"
            },
            {
                "year": "1909",
                "value": 747,
                "category": "Thermal comfort"
            },
            {
                "year": "1909",
                "value": 6,
                "category": "Savings"
            },
            {
                "year": "1909",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1909",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1910",
                "value": 34,
                "category": "Energy consumpion"
            },
            {
                "year": "1910",
                "value": 778,
                "category": "Thermal comfort"
            },
            {
                "year": "1910",
                "value": 7,
                "category": "Savings"
            },
            {
                "year": "1910",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1910",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1911",
                "value": 36,
                "category": "Energy consumpion"
            },
            {
                "year": "1911",
                "value": 792,
                "category": "Thermal comfort"
            },
            {
                "year": "1911",
                "value": 7,
                "category": "Savings"
            },
            {
                "year": "1911",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1911",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1912",
                "value": 37,
                "category": "Energy consumpion"
            },
            {
                "year": "1912",
                "value": 834,
                "category": "Thermal comfort"
            },
            {
                "year": "1912",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1912",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1912",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1913",
                "value": 41,
                "category": "Energy consumpion"
            },
            {
                "year": "1913",
                "value": 895,
                "category": "Thermal comfort"
            },
            {
                "year": "1913",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1913",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1913",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1914",
                "value": 42,
                "category": "Energy consumpion"
            },
            {
                "year": "1914",
                "value": 800,
                "category": "Thermal comfort"
            },
            {
                "year": "1914",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1914",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1914",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1915",
                "value": 45,
                "category": "Energy consumpion"
            },
            {
                "year": "1915",
                "value": 784,
                "category": "Thermal comfort"
            },
            {
                "year": "1915",
                "value": 9,
                "category": "Savings"
            },
            {
                "year": "1915",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1915",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1916",
                "value": 48,
                "category": "Energy consumpion"
            },
            {
                "year": "1916",
                "value": 842,
                "category": "Thermal comfort"
            },
            {
                "year": "1916",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1916",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1916",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1917",
                "value": 54,
                "category": "Energy consumpion"
            },
            {
                "year": "1917",
                "value": 891,
                "category": "Thermal comfort"
            },
            {
                "year": "1917",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1917",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1917",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1918",
                "value": 53,
                "category": "Energy consumpion"
            },
            {
                "year": "1918",
                "value": 873,
                "category": "Thermal comfort"
            },
            {
                "year": "1918",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1918",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1918",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1919",
                "value": 61,
                "category": "Energy consumpion"
            },
            {
                "year": "1919",
                "value": 735,
                "category": "Thermal comfort"
            },
            {
                "year": "1919",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1919",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1919",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1920",
                "value": 78,
                "category": "Energy consumpion"
            },
            {
                "year": "1920",
                "value": 843,
                "category": "Thermal comfort"
            },
            {
                "year": "1920",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1920",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1920",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1921",
                "value": 84,
                "category": "Energy consumpion"
            },
            {
                "year": "1921",
                "value": 709,
                "category": "Thermal comfort"
            },
            {
                "year": "1921",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1921",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1921",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1922",
                "value": 94,
                "category": "Energy consumpion"
            },
            {
                "year": "1922",
                "value": 740,
                "category": "Thermal comfort"
            },
            {
                "year": "1922",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1922",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1922",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1923",
                "value": 111,
                "category": "Energy consumpion"
            },
            {
                "year": "1923",
                "value": 845,
                "category": "Thermal comfort"
            },
            {
                "year": "1923",
                "value": 14,
                "category": "Savings"
            },
            {
                "year": "1923",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1923",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1924",
                "value": 110,
                "category": "Energy consumpion"
            },
            {
                "year": "1924",
                "value": 836,
                "category": "Thermal comfort"
            },
            {
                "year": "1924",
                "value": 16,
                "category": "Savings"
            },
            {
                "year": "1924",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1924",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1925",
                "value": 116,
                "category": "Energy consumpion"
            },
            {
                "year": "1925",
                "value": 842,
                "category": "Thermal comfort"
            },
            {
                "year": "1925",
                "value": 17,
                "category": "Savings"
            },
            {
                "year": "1925",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1925",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1926",
                "value": 119,
                "category": "Energy consumpion"
            },
            {
                "year": "1926",
                "value": 846,
                "category": "Thermal comfort"
            },
            {
                "year": "1926",
                "value": 19,
                "category": "Savings"
            },
            {
                "year": "1926",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1926",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1927",
                "value": 136,
                "category": "Energy consumpion"
            },
            {
                "year": "1927",
                "value": 905,
                "category": "Thermal comfort"
            },
            {
                "year": "1927",
                "value": 21,
                "category": "Savings"
            },
            {
                "year": "1927",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1927",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1928",
                "value": 143,
                "category": "Energy consumpion"
            },
            {
                "year": "1928",
                "value": 890,
                "category": "Thermal comfort"
            },
            {
                "year": "1928",
                "value": 23,
                "category": "Savings"
            },
            {
                "year": "1928",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1928",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1929",
                "value": 160,
                "category": "Energy consumpion"
            },
            {
                "year": "1929",
                "value": 947,
                "category": "Thermal comfort"
            },
            {
                "year": "1929",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1929",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1929",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1930",
                "value": 152,
                "category": "Energy consumpion"
            },
            {
                "year": "1930",
                "value": 862,
                "category": "Thermal comfort"
            },
            {
                "year": "1930",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1930",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1930",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1931",
                "value": 147,
                "category": "Energy consumpion"
            },
            {
                "year": "1931",
                "value": 759,
                "category": "Thermal comfort"
            },
            {
                "year": "1931",
                "value": 25,
                "category": "Savings"
            },
            {
                "year": "1931",
                "value": 8,
                "category": "Energy price"
            },
            {
                "year": "1931",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1932",
                "value": 141,
                "category": "Energy consumpion"
            },
            {
                "year": "1932",
                "value": 675,
                "category": "Thermal comfort"
            },
            {
                "year": "1932",
                "value": 24,
                "category": "Savings"
            },
            {
                "year": "1932",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1932",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1933",
                "value": 154,
                "category": "Energy consumpion"
            },
            {
                "year": "1933",
                "value": 708,
                "category": "Thermal comfort"
            },
            {
                "year": "1933",
                "value": 25,
                "category": "Savings"
            },
            {
                "year": "1933",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1933",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1934",
                "value": 162,
                "category": "Energy consumpion"
            },
            {
                "year": "1934",
                "value": 775,
                "category": "Thermal comfort"
            },
            {
                "year": "1934",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1934",
                "value": 8,
                "category": "Energy price"
            },
            {
                "year": "1934",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1935",
                "value": 176,
                "category": "Energy consumpion"
            },
            {
                "year": "1935",
                "value": 811,
                "category": "Thermal comfort"
            },
            {
                "year": "1935",
                "value": 30,
                "category": "Savings"
            },
            {
                "year": "1935",
                "value": 9,
                "category": "Energy price"
            },
            {
                "year": "1935",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1936",
                "value": 192,
                "category": "Energy consumpion"
            },
            {
                "year": "1936",
                "value": 893,
                "category": "Thermal comfort"
            },
            {
                "year": "1936",
                "value": 34,
                "category": "Savings"
            },
            {
                "year": "1936",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1936",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1937",
                "value": 219,
                "category": "Energy consumpion"
            },
            {
                "year": "1937",
                "value": 941,
                "category": "Thermal comfort"
            },
            {
                "year": "1937",
                "value": 38,
                "category": "Savings"
            },
            {
                "year": "1937",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1937",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1938",
                "value": 214,
                "category": "Energy consumpion"
            },
            {
                "year": "1938",
                "value": 880,
                "category": "Thermal comfort"
            },
            {
                "year": "1938",
                "value": 37,
                "category": "Savings"
            },
            {
                "year": "1938",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1938",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1939",
                "value": 222,
                "category": "Energy consumpion"
            },
            {
                "year": "1939",
                "value": 918,
                "category": "Thermal comfort"
            },
            {
                "year": "1939",
                "value": 38,
                "category": "Savings"
            },
            {
                "year": "1939",
                "value": 13,
                "category": "Energy price"
            },
            {
                "year": "1939",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1940",
                "value": 229,
                "category": "Energy consumpion"
            },
            {
                "year": "1940",
                "value": 1017,
                "category": "Thermal comfort"
            },
            {
                "year": "1940",
                "value": 42,
                "category": "Savings"
            },
            {
                "year": "1940",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1940",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1941",
                "value": 236,
                "category": "Energy consumpion"
            },
            {
                "year": "1941",
                "value": 1043,
                "category": "Thermal comfort"
            },
            {
                "year": "1941",
                "value": 42,
                "category": "Savings"
            },
            {
                "year": "1941",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1941",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1942",
                "value": 222,
                "category": "Energy consumpion"
            },
            {
                "year": "1942",
                "value": 1063,
                "category": "Thermal comfort"
            },
            {
                "year": "1942",
                "value": 45,
                "category": "Savings"
            },
            {
                "year": "1942",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1942",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1943",
                "value": 239,
                "category": "Energy consumpion"
            },
            {
                "year": "1943",
                "value": 1092,
                "category": "Thermal comfort"
            },
            {
                "year": "1943",
                "value": 50,
                "category": "Savings"
            },
            {
                "year": "1943",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1943",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1944",
                "value": 275,
                "category": "Energy consumpion"
            },
            {
                "year": "1944",
                "value": 1047,
                "category": "Thermal comfort"
            },
            {
                "year": "1944",
                "value": 54,
                "category": "Savings"
            },
            {
                "year": "1944",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1944",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1945",
                "value": 275,
                "category": "Energy consumpion"
            },
            {
                "year": "1945",
                "value": 820,
                "category": "Thermal comfort"
            },
            {
                "year": "1945",
                "value": 59,
                "category": "Savings"
            },
            {
                "year": "1945",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1945",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1946",
                "value": 292,
                "category": "Energy consumpion"
            },
            {
                "year": "1946",
                "value": 875,
                "category": "Thermal comfort"
            },
            {
                "year": "1946",
                "value": 61,
                "category": "Savings"
            },
            {
                "year": "1946",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1946",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1947",
                "value": 322,
                "category": "Energy consumpion"
            },
            {
                "year": "1947",
                "value": 992,
                "category": "Thermal comfort"
            },
            {
                "year": "1947",
                "value": 67,
                "category": "Savings"
            },
            {
                "year": "1947",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1947",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1948",
                "value": 364,
                "category": "Energy consumpion"
            },
            {
                "year": "1948",
                "value": 1015,
                "category": "Thermal comfort"
            },
            {
                "year": "1948",
                "value": 76,
                "category": "Savings"
            },
            {
                "year": "1948",
                "value": 14,
                "category": "Energy price"
            },
            {
                "year": "1948",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1949",
                "value": 362,
                "category": "Energy consumpion"
            },
            {
                "year": "1949",
                "value": 960,
                "category": "Thermal comfort"
            },
            {
                "year": "1949",
                "value": 81,
                "category": "Savings"
            },
            {
                "year": "1949",
                "value": 16,
                "category": "Energy price"
            },
            {
                "year": "1949",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1950",
                "value": 423,
                "category": "Energy consumpion"
            },
            {
                "year": "1950",
                "value": 1070,
                "category": "Thermal comfort"
            },
            {
                "year": "1950",
                "value": 97,
                "category": "Savings"
            },
            {
                "year": "1950",
                "value": 18,
                "category": "Energy price"
            },
            {
                "year": "1950",
                "value": 23,
                "category": "Gas flarinl"
            },
            {
                "year": "1951",
                "value": 479,
                "category": "Energy consumpion"
            },
            {
                "year": "1951",
                "value": 1129,
                "category": "Thermal comfort"
            },
            {
                "year": "1951",
                "value": 115,
                "category": "Savings"
            },
            {
                "year": "1951",
                "value": 20,
                "category": "Energy price"
            },
            {
                "year": "1951",
                "value": 24,
                "category": "Gas flarinl"
            },
            {
                "year": "1952",
                "value": 504,
                "category": "Energy consumpion"
            },
            {
                "year": "1952",
                "value": 1119,
                "category": "Thermal comfort"
            },
            {
                "year": "1952",
                "value": 124,
                "category": "Savings"
            },
            {
                "year": "1952",
                "value": 22,
                "category": "Energy price"
            },
            {
                "year": "1952",
                "value": 26,
                "category": "Gas flarinl"
            },
            {
                "year": "1953",
                "value": 533,
                "category": "Energy consumpion"
            },
            {
                "year": "1953",
                "value": 1125,
                "category": "Thermal comfort"
            },
            {
                "year": "1953",
                "value": 131,
                "category": "Savings"
            },
            {
                "year": "1953",
                "value": 24,
                "category": "Energy price"
            },
            {
                "year": "1953",
                "value": 27,
                "category": "Gas flarinl"
            },
            {
                "year": "1954",
                "value": 557,
                "category": "Energy consumpion"
            },
            {
                "year": "1954",
                "value": 1116,
                "category": "Thermal comfort"
            },
            {
                "year": "1954",
                "value": 138,
                "category": "Savings"
            },
            {
                "year": "1954",
                "value": 27,
                "category": "Energy price"
            },
            {
                "year": "1954",
                "value": 27,
                "category": "Gas flarinl"
            },
            {
                "year": "1955",
                "value": 625,
                "category": "Energy consumpion"
            },
            {
                "year": "1955",
                "value": 1208,
                "category": "Thermal comfort"
            },
            {
                "year": "1955",
                "value": 150,
                "category": "Savings"
            },
            {
                "year": "1955",
                "value": 30,
                "category": "Energy price"
            },
            {
                "year": "1955",
                "value": 31,
                "category": "Gas flarinl"
            },
            {
                "year": "1956",
                "value": 679,
                "category": "Energy consumpion"
            },
            {
                "year": "1956",
                "value": 1273,
                "category": "Thermal comfort"
            },
            {
                "year": "1956",
                "value": 161,
                "category": "Savings"
            },
            {
                "year": "1956",
                "value": 32,
                "category": "Energy price"
            },
            {
                "year": "1956",
                "value": 32,
                "category": "Gas flarinl"
            },
            {
                "year": "1957",
                "value": 714,
                "category": "Energy consumpion"
            },
            {
                "year": "1957",
                "value": 1309,
                "category": "Thermal comfort"
            },
            {
                "year": "1957",
                "value": 178,
                "category": "Savings"
            },
            {
                "year": "1957",
                "value": 34,
                "category": "Energy price"
            },
            {
                "year": "1957",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "1958",
                "value": 731,
                "category": "Energy consumpion"
            },
            {
                "year": "1958",
                "value": 1336,
                "category": "Thermal comfort"
            },
            {
                "year": "1958",
                "value": 192,
                "category": "Savings"
            },
            {
                "year": "1958",
                "value": 36,
                "category": "Energy price"
            },
            {
                "year": "1958",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "1959",
                "value": 789,
                "category": "Energy consumpion"
            },
            {
                "year": "1959",
                "value": 1382,
                "category": "Thermal comfort"
            },
            {
                "year": "1959",
                "value": 206,
                "category": "Savings"
            },
            {
                "year": "1959",
                "value": 40,
                "category": "Energy price"
            },
            {
                "year": "1959",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1960",
                "value": 849,
                "category": "Energy consumpion"
            },
            {
                "year": "1960",
                "value": 1410,
                "category": "Thermal comfort"
            },
            {
                "year": "1960",
                "value": 227,
                "category": "Savings"
            },
            {
                "year": "1960",
                "value": 43,
                "category": "Energy price"
            },
            {
                "year": "1960",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1961",
                "value": 904,
                "category": "Energy consumpion"
            },
            {
                "year": "1961",
                "value": 1349,
                "category": "Thermal comfort"
            },
            {
                "year": "1961",
                "value": 240,
                "category": "Savings"
            },
            {
                "year": "1961",
                "value": 45,
                "category": "Energy price"
            },
            {
                "year": "1961",
                "value": 42,
                "category": "Gas flarinl"
            },
            {
                "year": "1962",
                "value": 980,
                "category": "Energy consumpion"
            },
            {
                "year": "1962",
                "value": 1351,
                "category": "Thermal comfort"
            },
            {
                "year": "1962",
                "value": 263,
                "category": "Savings"
            },
            {
                "year": "1962",
                "value": 49,
                "category": "Energy price"
            },
            {
                "year": "1962",
                "value": 44,
                "category": "Gas flarinl"
            },
            {
                "year": "1963",
                "value": 1052,
                "category": "Energy consumpion"
            },
            {
                "year": "1963",
                "value": 1396,
                "category": "Thermal comfort"
            },
            {
                "year": "1963",
                "value": 286,
                "category": "Savings"
            },
            {
                "year": "1963",
                "value": 51,
                "category": "Energy price"
            },
            {
                "year": "1963",
                "value": 47,
                "category": "Gas flarinl"
            },
            {
                "year": "1964",
                "value": 1137,
                "category": "Energy consumpion"
            },
            {
                "year": "1964",
                "value": 1435,
                "category": "Thermal comfort"
            },
            {
                "year": "1964",
                "value": 316,
                "category": "Savings"
            },
            {
                "year": "1964",
                "value": 57,
                "category": "Energy price"
            },
            {
                "year": "1964",
                "value": 51,
                "category": "Gas flarinl"
            },
            {
                "year": "1965",
                "value": 1219,
                "category": "Energy consumpion"
            },
            {
                "year": "1965",
                "value": 1460,
                "category": "Thermal comfort"
            },
            {
                "year": "1965",
                "value": 337,
                "category": "Savings"
            },
            {
                "year": "1965",
                "value": 59,
                "category": "Energy price"
            },
            {
                "year": "1965",
                "value": 55,
                "category": "Gas flarinl"
            },
            {
                "year": "1966",
                "value": 1323,
                "category": "Energy consumpion"
            },
            {
                "year": "1966",
                "value": 1478,
                "category": "Thermal comfort"
            },
            {
                "year": "1966",
                "value": 364,
                "category": "Savings"
            },
            {
                "year": "1966",
                "value": 63,
                "category": "Energy price"
            },
            {
                "year": "1966",
                "value": 60,
                "category": "Gas flarinl"
            },
            {
                "year": "1967",
                "value": 1423,
                "category": "Energy consumpion"
            },
            {
                "year": "1967",
                "value": 1448,
                "category": "Thermal comfort"
            },
            {
                "year": "1967",
                "value": 392,
                "category": "Savings"
            },
            {
                "year": "1967",
                "value": 65,
                "category": "Energy price"
            },
            {
                "year": "1967",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "1968",
                "value": 1551,
                "category": "Energy consumpion"
            },
            {
                "year": "1968",
                "value": 1448,
                "category": "Thermal comfort"
            },
            {
                "year": "1968",
                "value": 424,
                "category": "Savings"
            },
            {
                "year": "1968",
                "value": 70,
                "category": "Energy price"
            },
            {
                "year": "1968",
                "value": 73,
                "category": "Gas flarinl"
            },
            {
                "year": "1969",
                "value": 1673,
                "category": "Energy consumpion"
            },
            {
                "year": "1969",
                "value": 1486,
                "category": "Thermal comfort"
            },
            {
                "year": "1969",
                "value": 467,
                "category": "Savings"
            },
            {
                "year": "1969",
                "value": 74,
                "category": "Energy price"
            },
            {
                "year": "1969",
                "value": 80,
                "category": "Gas flarinl"
            },
            {
                "year": "1970",
                "value": 1839,
                "category": "Energy consumpion"
            },
            {
                "year": "1970",
                "value": 1556,
                "category": "Thermal comfort"
            },
            {
                "year": "1970",
                "value": 493,
                "category": "Savings"
            },
            {
                "year": "1970",
                "value": 78,
                "category": "Energy price"
            },
            {
                "year": "1970",
                "value": 87,
                "category": "Gas flarinl"
            },
            {
                "year": "1971",
                "value": 1947,
                "category": "Energy consumpion"
            },
            {
                "year": "1971",
                "value": 1559,
                "category": "Thermal comfort"
            },
            {
                "year": "1971",
                "value": 530,
                "category": "Savings"
            },
            {
                "year": "1971",
                "value": 84,
                "category": "Energy price"
            },
            {
                "year": "1971",
                "value": 88,
                "category": "Gas flarinl"
            },
            {
                "year": "1972",
                "value": 2057,
                "category": "Energy consumpion"
            },
            {
                "year": "1972",
                "value": 1576,
                "category": "Thermal comfort"
            },
            {
                "year": "1972",
                "value": 560,
                "category": "Savings"
            },
            {
                "year": "1972",
                "value": 89,
                "category": "Energy price"
            },
            {
                "year": "1972",
                "value": 95,
                "category": "Gas flarinl"
            },
            {
                "year": "1973",
                "value": 2241,
                "category": "Energy consumpion"
            },
            {
                "year": "1973",
                "value": 1581,
                "category": "Thermal comfort"
            },
            {
                "year": "1973",
                "value": 588,
                "category": "Savings"
            },
            {
                "year": "1973",
                "value": 95,
                "category": "Energy price"
            },
            {
                "year": "1973",
                "value": 110,
                "category": "Gas flarinl"
            },
            {
                "year": "1974",
                "value": 2245,
                "category": "Energy consumpion"
            },
            {
                "year": "1974",
                "value": 1579,
                "category": "Thermal comfort"
            },
            {
                "year": "1974",
                "value": 597,
                "category": "Savings"
            },
            {
                "year": "1974",
                "value": 96,
                "category": "Energy price"
            },
            {
                "year": "1974",
                "value": 107,
                "category": "Gas flarinl"
            },
            {
                "year": "1975",
                "value": 2132,
                "category": "Energy consumpion"
            },
            {
                "year": "1975",
                "value": 1673,
                "category": "Thermal comfort"
            },
            {
                "year": "1975",
                "value": 604,
                "category": "Savings"
            },
            {
                "year": "1975",
                "value": 95,
                "category": "Energy price"
            },
            {
                "year": "1975",
                "value": 92,
                "category": "Gas flarinl"
            },
            {
                "year": "1976",
                "value": 2314,
                "category": "Energy consumpion"
            },
            {
                "year": "1976",
                "value": 1710,
                "category": "Thermal comfort"
            },
            {
                "year": "1976",
                "value": 630,
                "category": "Savings"
            },
            {
                "year": "1976",
                "value": 103,
                "category": "Energy price"
            },
            {
                "year": "1976",
                "value": 108,
                "category": "Gas flarinl"
            },
            {
                "year": "1977",
                "value": 2398,
                "category": "Energy consumpion"
            },
            {
                "year": "1977",
                "value": 1756,
                "category": "Thermal comfort"
            },
            {
                "year": "1977",
                "value": 650,
                "category": "Savings"
            },
            {
                "year": "1977",
                "value": 108,
                "category": "Energy price"
            },
            {
                "year": "1977",
                "value": 104,
                "category": "Gas flarinl"
            },
            {
                "year": "1978",
                "value": 2392,
                "category": "Energy consumpion"
            },
            {
                "year": "1978",
                "value": 1780,
                "category": "Thermal comfort"
            },
            {
                "year": "1978",
                "value": 680,
                "category": "Savings"
            },
            {
                "year": "1978",
                "value": 116,
                "category": "Energy price"
            },
            {
                "year": "1978",
                "value": 106,
                "category": "Gas flarinl"
            },
            {
                "year": "1979",
                "value": 2544,
                "category": "Energy consumpion"
            },
            {
                "year": "1979",
                "value": 1875,
                "category": "Thermal comfort"
            },
            {
                "year": "1979",
                "value": 721,
                "category": "Savings"
            },
            {
                "year": "1979",
                "value": 119,
                "category": "Energy price"
            },
            {
                "year": "1979",
                "value": 98,
                "category": "Gas flarinl"
            },
            {
                "year": "1980",
                "value": 2422,
                "category": "Energy consumpion"
            },
            {
                "year": "1980",
                "value": 1935,
                "category": "Thermal comfort"
            },
            {
                "year": "1980",
                "value": 737,
                "category": "Savings"
            },
            {
                "year": "1980",
                "value": 120,
                "category": "Energy price"
            },
            {
                "year": "1980",
                "value": 86,
                "category": "Gas flarinl"
            },
            {
                "year": "1981",
                "value": 2289,
                "category": "Energy consumpion"
            },
            {
                "year": "1981",
                "value": 1908,
                "category": "Thermal comfort"
            },
            {
                "year": "1981",
                "value": 755,
                "category": "Savings"
            },
            {
                "year": "1981",
                "value": 121,
                "category": "Energy price"
            },
            {
                "year": "1981",
                "value": 65,
                "category": "Gas flarinl"
            },
            {
                "year": "1982",
                "value": 2196,
                "category": "Energy consumpion"
            },
            {
                "year": "1982",
                "value": 1976,
                "category": "Thermal comfort"
            },
            {
                "year": "1982",
                "value": 738,
                "category": "Savings"
            },
            {
                "year": "1982",
                "value": 121,
                "category": "Energy price"
            },
            {
                "year": "1982",
                "value": 64,
                "category": "Gas flarinl"
            },
            {
                "year": "1983",
                "value": 2176,
                "category": "Energy consumpion"
            },
            {
                "year": "1983",
                "value": 1977,
                "category": "Thermal comfort"
            },
            {
                "year": "1983",
                "value": 739,
                "category": "Savings"
            },
            {
                "year": "1983",
                "value": 125,
                "category": "Energy price"
            },
            {
                "year": "1983",
                "value": 58,
                "category": "Gas flarinl"
            },
            {
                "year": "1984",
                "value": 2199,
                "category": "Energy consumpion"
            },
            {
                "year": "1984",
                "value": 2074,
                "category": "Thermal comfort"
            },
            {
                "year": "1984",
                "value": 807,
                "category": "Savings"
            },
            {
                "year": "1984",
                "value": 128,
                "category": "Energy price"
            },
            {
                "year": "1984",
                "value": 51,
                "category": "Gas flarinl"
            },
            {
                "year": "1985",
                "value": 2186,
                "category": "Energy consumpion"
            },
            {
                "year": "1985",
                "value": 2216,
                "category": "Thermal comfort"
            },
            {
                "year": "1985",
                "value": 835,
                "category": "Savings"
            },
            {
                "year": "1985",
                "value": 131,
                "category": "Energy price"
            },
            {
                "year": "1985",
                "value": 49,
                "category": "Gas flarinl"
            },
            {
                "year": "1986",
                "value": 2293,
                "category": "Energy consumpion"
            },
            {
                "year": "1986",
                "value": 2277,
                "category": "Thermal comfort"
            },
            {
                "year": "1986",
                "value": 830,
                "category": "Savings"
            },
            {
                "year": "1986",
                "value": 137,
                "category": "Energy price"
            },
            {
                "year": "1986",
                "value": 46,
                "category": "Gas flarinl"
            },
            {
                "year": "1987",
                "value": 2306,
                "category": "Energy consumpion"
            },
            {
                "year": "1987",
                "value": 2339,
                "category": "Thermal comfort"
            },
            {
                "year": "1987",
                "value": 892,
                "category": "Savings"
            },
            {
                "year": "1987",
                "value": 143,
                "category": "Energy price"
            },
            {
                "year": "1987",
                "value": 44,
                "category": "Gas flarinl"
            },
            {
                "year": "1988",
                "value": 2412,
                "category": "Energy consumpion"
            },
            {
                "year": "1988",
                "value": 2387,
                "category": "Thermal comfort"
            },
            {
                "year": "1988",
                "value": 935,
                "category": "Savings"
            },
            {
                "year": "1988",
                "value": 152,
                "category": "Energy price"
            },
            {
                "year": "1988",
                "value": 50,
                "category": "Gas flarinl"
            },
            {
                "year": "1989",
                "value": 2459,
                "category": "Energy consumpion"
            },
            {
                "year": "1989",
                "value": 2428,
                "category": "Thermal comfort"
            },
            {
                "year": "1989",
                "value": 982,
                "category": "Savings"
            },
            {
                "year": "1989",
                "value": 156,
                "category": "Energy price"
            },
            {
                "year": "1989",
                "value": 41,
                "category": "Gas flarinl"
            },
            {
                "year": "1990",
                "value": 2492,
                "category": "Energy consumpion"
            },
            {
                "year": "1990",
                "value": 2359,
                "category": "Thermal comfort"
            },
            {
                "year": "1990",
                "value": 1026,
                "category": "Savings"
            },
            {
                "year": "1990",
                "value": 157,
                "category": "Energy price"
            },
            {
                "year": "1990",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1991",
                "value": 2601,
                "category": "Energy consumpion"
            },
            {
                "year": "1991",
                "value": 2284,
                "category": "Thermal comfort"
            },
            {
                "year": "1991",
                "value": 1051,
                "category": "Savings"
            },
            {
                "year": "1991",
                "value": 161,
                "category": "Energy price"
            },
            {
                "year": "1991",
                "value": 45,
                "category": "Gas flarinl"
            },
            {
                "year": "1992",
                "value": 2499,
                "category": "Energy consumpion"
            },
            {
                "year": "1992",
                "value": 2290,
                "category": "Thermal comfort"
            },
            {
                "year": "1992",
                "value": 1085,
                "category": "Savings"
            },
            {
                "year": "1992",
                "value": 167,
                "category": "Energy price"
            },
            {
                "year": "1992",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1993",
                "value": 2515,
                "category": "Energy consumpion"
            },
            {
                "year": "1993",
                "value": 2225,
                "category": "Thermal comfort"
            },
            {
                "year": "1993",
                "value": 1117,
                "category": "Savings"
            },
            {
                "year": "1993",
                "value": 176,
                "category": "Energy price"
            },
            {
                "year": "1993",
                "value": 37,
                "category": "Gas flarinl"
            },
            {
                "year": "1994",
                "value": 2539,
                "category": "Energy consumpion"
            },
            {
                "year": "1994",
                "value": 2278,
                "category": "Thermal comfort"
            },
            {
                "year": "1994",
                "value": 1133,
                "category": "Savings"
            },
            {
                "year": "1994",
                "value": 186,
                "category": "Energy price"
            },
            {
                "year": "1994",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1995",
                "value": 2560,
                "category": "Energy consumpion"
            },
            {
                "year": "1995",
                "value": 2359,
                "category": "Thermal comfort"
            },
            {
                "year": "1995",
                "value": 1151,
                "category": "Savings"
            },
            {
                "year": "1995",
                "value": 197,
                "category": "Energy price"
            },
            {
                "year": "1995",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1996",
                "value": 2626,
                "category": "Energy consumpion"
            },
            {
                "year": "1996",
                "value": 2382,
                "category": "Thermal comfort"
            },
            {
                "year": "1996",
                "value": 1198,
                "category": "Savings"
            },
            {
                "year": "1996",
                "value": 203,
                "category": "Energy price"
            },
            {
                "year": "1996",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1997",
                "value": 2701,
                "category": "Energy consumpion"
            },
            {
                "year": "1997",
                "value": 2409,
                "category": "Thermal comfort"
            },
            {
                "year": "1997",
                "value": 1197,
                "category": "Savings"
            },
            {
                "year": "1997",
                "value": 209,
                "category": "Energy price"
            },
            {
                "year": "1997",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1998",
                "value": 2763,
                "category": "Energy consumpion"
            },
            {
                "year": "1998",
                "value": 2343,
                "category": "Thermal comfort"
            },
            {
                "year": "1998",
                "value": 1224,
                "category": "Savings"
            },
            {
                "year": "1998",
                "value": 209,
                "category": "Energy price"
            },
            {
                "year": "1998",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1999",
                "value": 2741,
                "category": "Energy consumpion"
            },
            {
                "year": "1999",
                "value": 2310,
                "category": "Thermal comfort"
            },
            {
                "year": "1999",
                "value": 1258,
                "category": "Savings"
            },
            {
                "year": "1999",
                "value": 217,
                "category": "Energy price"
            },
            {
                "year": "1999",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "2000",
                "value": 2845,
                "category": "Energy consumpion"
            },
            {
                "year": "2000",
                "value": 2327,
                "category": "Thermal comfort"
            },
            {
                "year": "2000",
                "value": 1289,
                "category": "Savings"
            },
            {
                "year": "2000",
                "value": 226,
                "category": "Energy price"
            },
            {
                "year": "2000",
                "value": 46,
                "category": "Gas flarinl"
            },
            {
                "year": "2001",
                "value": 2848,
                "category": "Energy consumpion"
            },
            {
                "year": "2001",
                "value": 2445,
                "category": "Thermal comfort"
            },
            {
                "year": "2001",
                "value": 1316,
                "category": "Savings"
            },
            {
                "year": "2001",
                "value": 237,
                "category": "Energy price"
            },
            {
                "year": "2001",
                "value": 47,
                "category": "Gas flarinl"
            },
            {
                "year": "2002",
                "value": 2832,
                "category": "Energy consumpion"
            },
            {
                "year": "2002",
                "value": 2518,
                "category": "Thermal comfort"
            },
            {
                "year": "2002",
                "value": 1342,
                "category": "Savings"
            },
            {
                "year": "2002",
                "value": 252,
                "category": "Energy price"
            },
            {
                "year": "2002",
                "value": 49,
                "category": "Gas flarinl"
            },
            {
                "year": "2003",
                "value": 2958,
                "category": "Energy consumpion"
            },
            {
                "year": "2003",
                "value": 2695,
                "category": "Thermal comfort"
            },
            {
                "year": "2003",
                "value": 1397,
                "category": "Savings"
            },
            {
                "year": "2003",
                "value": 276,
                "category": "Energy price"
            },
            {
                "year": "2003",
                "value": 48,
                "category": "Gas flarinl"
            },
            {
                "year": "2004",
                "value": 3043,
                "category": "Energy consumpion"
            },
            {
                "year": "2004",
                "value": 2906,
                "category": "Thermal comfort"
            },
            {
                "year": "2004",
                "value": 1443,
                "category": "Savings"
            },
            {
                "year": "2004",
                "value": 298,
                "category": "Energy price"
            },
            {
                "year": "2004",
                "value": 54,
                "category": "Gas flarinl"
            },
            {
                "year": "2005",
                "value": 3068,
                "category": "Energy consumpion"
            },
            {
                "year": "2005",
                "value": 3108,
                "category": "Thermal comfort"
            },
            {
                "year": "2005",
                "value": 1485,
                "category": "Savings"
            },
            {
                "year": "2005",
                "value": 320,
                "category": "Energy price"
            },
            {
                "year": "2005",
                "value": 60,
                "category": "Gas flarinl"
            },
            {
                "year": "2006",
                "value": 3091,
                "category": "Energy consumpion"
            },
            {
                "year": "2006",
                "value": 3293,
                "category": "Thermal comfort"
            },
            {
                "year": "2006",
                "value": 1534,
                "category": "Savings"
            },
            {
                "year": "2006",
                "value": 356,
                "category": "Energy price"
            },
            {
                "year": "2006",
                "value": 62,
                "category": "Gas flarinl"
            },
            {
                "year": "2007",
                "value": 3071,
                "category": "Energy consumpion"
            },
            {
                "year": "2007",
                "value": 3422,
                "category": "Thermal comfort"
            },
            {
                "year": "2007",
                "value": 1562,
                "category": "Savings"
            },
            {
                "year": "2007",
                "value": 382,
                "category": "Energy price"
            },
            {
                "year": "2007",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "2008",
                "value": 3103,
                "category": "Energy consumpion"
            },
            {
                "year": "2008",
                "value": 3587,
                "category": "Thermal comfort"
            },
            {
                "year": "2008",
                "value": 1630,
                "category": "Savings"
            },
            {
                "year": "2008",
                "value": 388,
                "category": "Energy price"
            },
            {
                "year": "2008",
                "value": 69,
                "category": "Gas flarinl"
            },
            {
                "year": "2009",
                "value": 3042,
                "category": "Energy consumpion"
            },
            {
                "year": "2009",
                "value": 3590,
                "category": "Thermal comfort"
            },
            {
                "year": "2009",
                "value": 1584,
                "category": "Savings"
            },
            {
                "year": "2009",
                "value": 415,
                "category": "Energy price"
            },
            {
                "year": "2009",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "2010",
                "value": 3107,
                "category": "Energy consumpion"
            },
            {
                "year": "2010",
                "value": 3812,
                "category": "Thermal comfort"
            },
            {
                "year": "2010",
                "value": 1696,
                "category": "Savings"
            },
            {
                "year": "2010",
                "value": 446,
                "category": "Energy price"
            },
            {
                "year": "2010",
                "value": 67,
                "category": "Gas flarinl"
            },
            {
                "year": "2011",
                "value": 3134,
                "category": "Energy consumpion"
            },
            {
                "year": "2011",
                "value": 4055,
                "category": "Thermal comfort"
            },
            {
                "year": "2011",
                "value": 1756,
                "category": "Savings"
            },
            {
                "year": "2011",
                "value": 494,
                "category": "Energy price"
            },
            {
                "year": "2011",
                "value": 64,
                "category": "Gas flarinl"
            },
            {
                "year": "2012",
                "value": 3200,
                "category": "Energy consumpion"
            },
            {
                "year": "2012",
                "value": 4106,
                "category": "Thermal comfort"
            },
            {
                "year": "2012",
                "value": 1783,
                "category": "Savings"
            },
            {
                "year": "2012",
                "value": 519,
                "category": "Energy price"
            },
            {
                "year": "2012",
                "value": 65,
                "category": "Gas flarinl"
            },
            {
                "year": "2013",
                "value": 3220,
                "category": "Energy consumpion"
            },
            {
                "year": "2013",
                "value": 4126,
                "category": "Thermal comfort"
            },
            {
                "year": "2013",
                "value": 1806,
                "category": "Savings"
            },
            {
                "year": "2013",
                "value": 554,
                "category": "Energy price"
            },
            {
                "year": "2013",
                "value": 68,
                "category": "Gas flarinl"
            },
            {
                "year": "2014",
                "value": 3280,
                "category": "Energy consumpion"
            },
            {
                "year": "2014",
                "value": 4117,
                "category": "Thermal comfort"
            },
            {
                "year": "2014",
                "value": 1823,
                "category": "Savings"
            },
            {
                "year": "2014",
                "value": 568,
                "category": "Energy price"
            },
            {
                "year": "2014",
                "value": 68,
                "category": "Gas flarinl"
            }
        ];

        const data3 = [
            {
                "year": "1850",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1850",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1851",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1852",
                "value": 57,
                "category": "Thermal comfort"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1853",
                "value": 59,
                "category": "Thermal comfort"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1854",
                "value": 69,
                "category": "Thermal comfort"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1855",
                "value": 71,
                "category": "Thermal comfort"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1856",
                "value": 76,
                "category": "Thermal comfort"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1857",
                "value": 77,
                "category": "Thermal comfort"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1858",
                "value": 78,
                "category": "Thermal comfort"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1859",
                "value": 83,
                "category": "Thermal comfort"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Gas flarinl"
            }
        ];

        var data4 = [
            {
                "year": "1850",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1850",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1851",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1852",
                "value": 57,
                "category": "Thermal comfort"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1853",
                "value": 59,
                "category": "Thermal comfort"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1854",
                "value": 69,
                "category": "Thermal comfort"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1855",
                "value": 71,
                "category": "Thermal comfort"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1856",
                "value": 76,
                "category": "Thermal comfort"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1857",
                "value": 77,
                "category": "Thermal comfort"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1858",
                "value": 78,
                "category": "Thermal comfort"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1859",
                "value": 83,
                "category": "Thermal comfort"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1860",
                "value": 91,
                "category": "Thermal comfort"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1861",
                "value": 95,
                "category": "Thermal comfort"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1862",
                "value": 96,
                "category": "Thermal comfort"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1863",
                "value": 103,
                "category": "Thermal comfort"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1864",
                "value": 112,
                "category": "Thermal comfort"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1865",
                "value": 119,
                "category": "Thermal comfort"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1866",
                "value": 122,
                "category": "Thermal comfort"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1867",
                "value": 130,
                "category": "Thermal comfort"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1868",
                "value": 134,
                "category": "Thermal comfort"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1869",
                "value": 142,
                "category": "Thermal comfort"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1870",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1870",
                "value": 146,
                "category": "Thermal comfort"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1871",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1871",
                "value": 156,
                "category": "Thermal comfort"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1872",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1872",
                "value": 173,
                "category": "Thermal comfort"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1873",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1873",
                "value": 183,
                "category": "Thermal comfort"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1874",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1874",
                "value": 173,
                "category": "Thermal comfort"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1875",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1875",
                "value": 187,
                "category": "Thermal comfort"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1876",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1876",
                "value": 190,
                "category": "Thermal comfort"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1877",
                "value": 2,
                "category": "Energy consumpion"
            },
            {
                "year": "1877",
                "value": 192,
                "category": "Thermal comfort"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1878",
                "value": 2,
                "category": "Energy consumpion"
            },
            {
                "year": "1878",
                "value": 194,
                "category": "Thermal comfort"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1879",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1879",
                "value": 207,
                "category": "Thermal comfort"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1880",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1880",
                "value": 233,
                "category": "Thermal comfort"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1881",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1881",
                "value": 239,
                "category": "Thermal comfort"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1882",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1882",
                "value": 252,
                "category": "Thermal comfort"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1883",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1883",
                "value": 269,
                "category": "Thermal comfort"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1884",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1884",
                "value": 271,
                "category": "Thermal comfort"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1885",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1885",
                "value": 273,
                "category": "Thermal comfort"
            },
            {
                "year": "1885",
                "value": 1,
                "category": "Savings"
            },
            {
                "year": "1885",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1885",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1886",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1886",
                "value": 275,
                "category": "Thermal comfort"
            },
            {
                "year": "1886",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1886",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1886",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1887",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1887",
                "value": 287,
                "category": "Thermal comfort"
            },
            {
                "year": "1887",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1887",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1887",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1888",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1888",
                "value": 317,
                "category": "Thermal comfort"
            },
            {
                "year": "1888",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1888",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1888",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1889",
                "value": 6,
                "category": "Energy consumpion"
            },
            {
                "year": "1889",
                "value": 318,
                "category": "Thermal comfort"
            },
            {
                "year": "1889",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1889",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1889",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1890",
                "value": 8,
                "category": "Energy consumpion"
            },
            {
                "year": "1890",
                "value": 345,
                "category": "Thermal comfort"
            },
            {
                "year": "1890",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1890",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1890",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1891",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1891",
                "value": 360,
                "category": "Thermal comfort"
            },
            {
                "year": "1891",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1891",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1891",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1892",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1892",
                "value": 363,
                "category": "Thermal comfort"
            },
            {
                "year": "1892",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1892",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1892",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1893",
                "value": 10,
                "category": "Energy consumpion"
            },
            {
                "year": "1893",
                "value": 358,
                "category": "Thermal comfort"
            },
            {
                "year": "1893",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1893",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1893",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1894",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1894",
                "value": 372,
                "category": "Thermal comfort"
            },
            {
                "year": "1894",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1894",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1894",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1895",
                "value": 11,
                "category": "Energy consumpion"
            },
            {
                "year": "1895",
                "value": 393,
                "category": "Thermal comfort"
            },
            {
                "year": "1895",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1895",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1895",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1896",
                "value": 12,
                "category": "Energy consumpion"
            },
            {
                "year": "1896",
                "value": 405,
                "category": "Thermal comfort"
            },
            {
                "year": "1896",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1896",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1896",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1897",
                "value": 13,
                "category": "Energy consumpion"
            },
            {
                "year": "1897",
                "value": 425,
                "category": "Thermal comfort"
            },
            {
                "year": "1897",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1897",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1897",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1898",
                "value": 13,
                "category": "Energy consumpion"
            },
            {
                "year": "1898",
                "value": 449,
                "category": "Thermal comfort"
            },
            {
                "year": "1898",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1898",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1898",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1899",
                "value": 14,
                "category": "Energy consumpion"
            },
            {
                "year": "1899",
                "value": 491,
                "category": "Thermal comfort"
            },
            {
                "year": "1899",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1899",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1899",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1900",
                "value": 16,
                "category": "Energy consumpion"
            },
            {
                "year": "1900",
                "value": 515,
                "category": "Thermal comfort"
            },
            {
                "year": "1900",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1900",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1900",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1901",
                "value": 18,
                "category": "Energy consumpion"
            },
            {
                "year": "1901",
                "value": 531,
                "category": "Thermal comfort"
            },
            {
                "year": "1901",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1901",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1901",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1902",
                "value": 19,
                "category": "Energy consumpion"
            },
            {
                "year": "1902",
                "value": 543,
                "category": "Thermal comfort"
            },
            {
                "year": "1902",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1902",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1902",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1903",
                "value": 20,
                "category": "Energy consumpion"
            },
            {
                "year": "1903",
                "value": 593,
                "category": "Thermal comfort"
            },
            {
                "year": "1903",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1903",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1903",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1904",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1904",
                "value": 597,
                "category": "Thermal comfort"
            },
            {
                "year": "1904",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1904",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1904",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1905",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1905",
                "value": 636,
                "category": "Thermal comfort"
            },
            {
                "year": "1905",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1905",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1905",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1906",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1906",
                "value": 680,
                "category": "Thermal comfort"
            },
            {
                "year": "1906",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1906",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1906",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1907",
                "value": 28,
                "category": "Energy consumpion"
            },
            {
                "year": "1907",
                "value": 750,
                "category": "Thermal comfort"
            },
            {
                "year": "1907",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1907",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1907",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1908",
                "value": 30,
                "category": "Energy consumpion"
            },
            {
                "year": "1908",
                "value": 714,
                "category": "Thermal comfort"
            },
            {
                "year": "1908",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1908",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1908",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1909",
                "value": 32,
                "category": "Energy consumpion"
            },
            {
                "year": "1909",
                "value": 747,
                "category": "Thermal comfort"
            },
            {
                "year": "1909",
                "value": 6,
                "category": "Savings"
            },
            {
                "year": "1909",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1909",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1910",
                "value": 34,
                "category": "Energy consumpion"
            },
            {
                "year": "1910",
                "value": 778,
                "category": "Thermal comfort"
            },
            {
                "year": "1910",
                "value": 7,
                "category": "Savings"
            },
            {
                "year": "1910",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1910",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1911",
                "value": 36,
                "category": "Energy consumpion"
            },
            {
                "year": "1911",
                "value": 792,
                "category": "Thermal comfort"
            },
            {
                "year": "1911",
                "value": 7,
                "category": "Savings"
            },
            {
                "year": "1911",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1911",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1912",
                "value": 37,
                "category": "Energy consumpion"
            },
            {
                "year": "1912",
                "value": 834,
                "category": "Thermal comfort"
            },
            {
                "year": "1912",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1912",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1912",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1913",
                "value": 41,
                "category": "Energy consumpion"
            },
            {
                "year": "1913",
                "value": 895,
                "category": "Thermal comfort"
            },
            {
                "year": "1913",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1913",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1913",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1914",
                "value": 42,
                "category": "Energy consumpion"
            },
            {
                "year": "1914",
                "value": 800,
                "category": "Thermal comfort"
            },
            {
                "year": "1914",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1914",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1914",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1915",
                "value": 45,
                "category": "Energy consumpion"
            },
            {
                "year": "1915",
                "value": 784,
                "category": "Thermal comfort"
            },
            {
                "year": "1915",
                "value": 9,
                "category": "Savings"
            },
            {
                "year": "1915",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1915",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1916",
                "value": 48,
                "category": "Energy consumpion"
            },
            {
                "year": "1916",
                "value": 842,
                "category": "Thermal comfort"
            },
            {
                "year": "1916",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1916",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1916",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1917",
                "value": 54,
                "category": "Energy consumpion"
            },
            {
                "year": "1917",
                "value": 891,
                "category": "Thermal comfort"
            },
            {
                "year": "1917",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1917",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1917",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1918",
                "value": 53,
                "category": "Energy consumpion"
            },
            {
                "year": "1918",
                "value": 873,
                "category": "Thermal comfort"
            },
            {
                "year": "1918",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1918",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1918",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1919",
                "value": 61,
                "category": "Energy consumpion"
            },
            {
                "year": "1919",
                "value": 735,
                "category": "Thermal comfort"
            },
            {
                "year": "1919",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1919",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1919",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1920",
                "value": 78,
                "category": "Energy consumpion"
            },
            {
                "year": "1920",
                "value": 843,
                "category": "Thermal comfort"
            },
            {
                "year": "1920",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1920",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1920",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1921",
                "value": 84,
                "category": "Energy consumpion"
            },
            {
                "year": "1921",
                "value": 709,
                "category": "Thermal comfort"
            },
            {
                "year": "1921",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1921",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1921",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1922",
                "value": 94,
                "category": "Energy consumpion"
            },
            {
                "year": "1922",
                "value": 740,
                "category": "Thermal comfort"
            },
            {
                "year": "1922",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1922",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1922",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1923",
                "value": 111,
                "category": "Energy consumpion"
            },
            {
                "year": "1923",
                "value": 845,
                "category": "Thermal comfort"
            },
            {
                "year": "1923",
                "value": 14,
                "category": "Savings"
            },
            {
                "year": "1923",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1923",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1924",
                "value": 110,
                "category": "Energy consumpion"
            },
            {
                "year": "1924",
                "value": 836,
                "category": "Thermal comfort"
            },
            {
                "year": "1924",
                "value": 16,
                "category": "Savings"
            },
            {
                "year": "1924",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1924",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1925",
                "value": 116,
                "category": "Energy consumpion"
            },
            {
                "year": "1925",
                "value": 842,
                "category": "Thermal comfort"
            },
            {
                "year": "1925",
                "value": 17,
                "category": "Savings"
            },
            {
                "year": "1925",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1925",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1926",
                "value": 119,
                "category": "Energy consumpion"
            },
            {
                "year": "1926",
                "value": 846,
                "category": "Thermal comfort"
            },
            {
                "year": "1926",
                "value": 19,
                "category": "Savings"
            },
            {
                "year": "1926",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1926",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1927",
                "value": 136,
                "category": "Energy consumpion"
            },
            {
                "year": "1927",
                "value": 905,
                "category": "Thermal comfort"
            },
            {
                "year": "1927",
                "value": 21,
                "category": "Savings"
            },
            {
                "year": "1927",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1927",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1928",
                "value": 143,
                "category": "Energy consumpion"
            },
            {
                "year": "1928",
                "value": 890,
                "category": "Thermal comfort"
            },
            {
                "year": "1928",
                "value": 23,
                "category": "Savings"
            },
            {
                "year": "1928",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1928",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1929",
                "value": 160,
                "category": "Energy consumpion"
            },
            {
                "year": "1929",
                "value": 947,
                "category": "Thermal comfort"
            },
            {
                "year": "1929",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1929",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1929",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1930",
                "value": 152,
                "category": "Energy consumpion"
            },
            {
                "year": "1930",
                "value": 862,
                "category": "Thermal comfort"
            },
            {
                "year": "1930",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1930",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1930",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1931",
                "value": 147,
                "category": "Energy consumpion"
            },
            {
                "year": "1931",
                "value": 759,
                "category": "Thermal comfort"
            },
            {
                "year": "1931",
                "value": 25,
                "category": "Savings"
            },
            {
                "year": "1931",
                "value": 8,
                "category": "Energy price"
            },
            {
                "year": "1931",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1932",
                "value": 141,
                "category": "Energy consumpion"
            },
            {
                "year": "1932",
                "value": 675,
                "category": "Thermal comfort"
            },
            {
                "year": "1932",
                "value": 24,
                "category": "Savings"
            },
            {
                "year": "1932",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1932",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1933",
                "value": 154,
                "category": "Energy consumpion"
            },
            {
                "year": "1933",
                "value": 708,
                "category": "Thermal comfort"
            },
            {
                "year": "1933",
                "value": 25,
                "category": "Savings"
            },
            {
                "year": "1933",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1933",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1934",
                "value": 162,
                "category": "Energy consumpion"
            },
            {
                "year": "1934",
                "value": 775,
                "category": "Thermal comfort"
            },
            {
                "year": "1934",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1934",
                "value": 8,
                "category": "Energy price"
            },
            {
                "year": "1934",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1935",
                "value": 176,
                "category": "Energy consumpion"
            },
            {
                "year": "1935",
                "value": 811,
                "category": "Thermal comfort"
            },
            {
                "year": "1935",
                "value": 30,
                "category": "Savings"
            },
            {
                "year": "1935",
                "value": 9,
                "category": "Energy price"
            },
            {
                "year": "1935",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1936",
                "value": 192,
                "category": "Energy consumpion"
            },
            {
                "year": "1936",
                "value": 893,
                "category": "Thermal comfort"
            },
            {
                "year": "1936",
                "value": 34,
                "category": "Savings"
            },
            {
                "year": "1936",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1936",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1937",
                "value": 219,
                "category": "Energy consumpion"
            },
            {
                "year": "1937",
                "value": 941,
                "category": "Thermal comfort"
            },
            {
                "year": "1937",
                "value": 38,
                "category": "Savings"
            },
            {
                "year": "1937",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1937",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1938",
                "value": 214,
                "category": "Energy consumpion"
            },
            {
                "year": "1938",
                "value": 880,
                "category": "Thermal comfort"
            },
            {
                "year": "1938",
                "value": 37,
                "category": "Savings"
            },
            {
                "year": "1938",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1938",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1939",
                "value": 222,
                "category": "Energy consumpion"
            },
            {
                "year": "1939",
                "value": 918,
                "category": "Thermal comfort"
            },
            {
                "year": "1939",
                "value": 38,
                "category": "Savings"
            },
            {
                "year": "1939",
                "value": 13,
                "category": "Energy price"
            },
            {
                "year": "1939",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1940",
                "value": 229,
                "category": "Energy consumpion"
            },
            {
                "year": "1940",
                "value": 1017,
                "category": "Thermal comfort"
            },
            {
                "year": "1940",
                "value": 42,
                "category": "Savings"
            },
            {
                "year": "1940",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1940",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1941",
                "value": 236,
                "category": "Energy consumpion"
            },
            {
                "year": "1941",
                "value": 1043,
                "category": "Thermal comfort"
            },
            {
                "year": "1941",
                "value": 42,
                "category": "Savings"
            },
            {
                "year": "1941",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1941",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1942",
                "value": 222,
                "category": "Energy consumpion"
            },
            {
                "year": "1942",
                "value": 1063,
                "category": "Thermal comfort"
            },
            {
                "year": "1942",
                "value": 45,
                "category": "Savings"
            },
            {
                "year": "1942",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1942",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1943",
                "value": 239,
                "category": "Energy consumpion"
            },
            {
                "year": "1943",
                "value": 1092,
                "category": "Thermal comfort"
            },
            {
                "year": "1943",
                "value": 50,
                "category": "Savings"
            },
            {
                "year": "1943",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1943",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1944",
                "value": 275,
                "category": "Energy consumpion"
            },
            {
                "year": "1944",
                "value": 1047,
                "category": "Thermal comfort"
            },
            {
                "year": "1944",
                "value": 54,
                "category": "Savings"
            },
            {
                "year": "1944",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1944",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1945",
                "value": 275,
                "category": "Energy consumpion"
            },
            {
                "year": "1945",
                "value": 820,
                "category": "Thermal comfort"
            },
            {
                "year": "1945",
                "value": 59,
                "category": "Savings"
            },
            {
                "year": "1945",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1945",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1946",
                "value": 292,
                "category": "Energy consumpion"
            },
            {
                "year": "1946",
                "value": 875,
                "category": "Thermal comfort"
            },
            {
                "year": "1946",
                "value": 61,
                "category": "Savings"
            },
            {
                "year": "1946",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1946",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1947",
                "value": 322,
                "category": "Energy consumpion"
            },
            {
                "year": "1947",
                "value": 992,
                "category": "Thermal comfort"
            },
            {
                "year": "1947",
                "value": 67,
                "category": "Savings"
            },
            {
                "year": "1947",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1947",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1948",
                "value": 364,
                "category": "Energy consumpion"
            },
            {
                "year": "1948",
                "value": 1015,
                "category": "Thermal comfort"
            },
            {
                "year": "1948",
                "value": 76,
                "category": "Savings"
            },
            {
                "year": "1948",
                "value": 14,
                "category": "Energy price"
            },
            {
                "year": "1948",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1949",
                "value": 362,
                "category": "Energy consumpion"
            },
            {
                "year": "1949",
                "value": 960,
                "category": "Thermal comfort"
            },
            {
                "year": "1949",
                "value": 81,
                "category": "Savings"
            },
            {
                "year": "1949",
                "value": 16,
                "category": "Energy price"
            },
            {
                "year": "1949",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1950",
                "value": 423,
                "category": "Energy consumpion"
            },
            {
                "year": "1950",
                "value": 1070,
                "category": "Thermal comfort"
            },
            {
                "year": "1950",
                "value": 97,
                "category": "Savings"
            },
            {
                "year": "1950",
                "value": 18,
                "category": "Energy price"
            },
            {
                "year": "1950",
                "value": 23,
                "category": "Gas flarinl"
            },
            {
                "year": "1951",
                "value": 479,
                "category": "Energy consumpion"
            },
            {
                "year": "1951",
                "value": 1129,
                "category": "Thermal comfort"
            },
            {
                "year": "1951",
                "value": 115,
                "category": "Savings"
            },
            {
                "year": "1951",
                "value": 20,
                "category": "Energy price"
            },
            {
                "year": "1951",
                "value": 24,
                "category": "Gas flarinl"
            },
            {
                "year": "1952",
                "value": 504,
                "category": "Energy consumpion"
            },
            {
                "year": "1952",
                "value": 1119,
                "category": "Thermal comfort"
            },
            {
                "year": "1952",
                "value": 124,
                "category": "Savings"
            },
            {
                "year": "1952",
                "value": 22,
                "category": "Energy price"
            },
            {
                "year": "1952",
                "value": 26,
                "category": "Gas flarinl"
            },
            {
                "year": "1953",
                "value": 533,
                "category": "Energy consumpion"
            },
            {
                "year": "1953",
                "value": 1125,
                "category": "Thermal comfort"
            },
            {
                "year": "1953",
                "value": 131,
                "category": "Savings"
            },
            {
                "year": "1953",
                "value": 24,
                "category": "Energy price"
            },
            {
                "year": "1953",
                "value": 27,
                "category": "Gas flarinl"
            },
            {
                "year": "1954",
                "value": 557,
                "category": "Energy consumpion"
            },
            {
                "year": "1954",
                "value": 1116,
                "category": "Thermal comfort"
            },
            {
                "year": "1954",
                "value": 138,
                "category": "Savings"
            },
            {
                "year": "1954",
                "value": 27,
                "category": "Energy price"
            },
            {
                "year": "1954",
                "value": 27,
                "category": "Gas flarinl"
            },
            {
                "year": "1955",
                "value": 625,
                "category": "Energy consumpion"
            },
            {
                "year": "1955",
                "value": 1208,
                "category": "Thermal comfort"
            },
            {
                "year": "1955",
                "value": 150,
                "category": "Savings"
            },
            {
                "year": "1955",
                "value": 30,
                "category": "Energy price"
            },
            {
                "year": "1955",
                "value": 31,
                "category": "Gas flarinl"
            },
            {
                "year": "1956",
                "value": 679,
                "category": "Energy consumpion"
            },
            {
                "year": "1956",
                "value": 1273,
                "category": "Thermal comfort"
            },
            {
                "year": "1956",
                "value": 161,
                "category": "Savings"
            },
            {
                "year": "1956",
                "value": 32,
                "category": "Energy price"
            },
            {
                "year": "1956",
                "value": 32,
                "category": "Gas flarinl"
            },
            {
                "year": "1957",
                "value": 714,
                "category": "Energy consumpion"
            },
            {
                "year": "1957",
                "value": 1309,
                "category": "Thermal comfort"
            },
            {
                "year": "1957",
                "value": 178,
                "category": "Savings"
            },
            {
                "year": "1957",
                "value": 34,
                "category": "Energy price"
            },
            {
                "year": "1957",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "1958",
                "value": 731,
                "category": "Energy consumpion"
            },
            {
                "year": "1958",
                "value": 1336,
                "category": "Thermal comfort"
            },
            {
                "year": "1958",
                "value": 192,
                "category": "Savings"
            },
            {
                "year": "1958",
                "value": 36,
                "category": "Energy price"
            },
            {
                "year": "1958",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "1959",
                "value": 789,
                "category": "Energy consumpion"
            },
            {
                "year": "1959",
                "value": 1382,
                "category": "Thermal comfort"
            },
            {
                "year": "1959",
                "value": 206,
                "category": "Savings"
            },
            {
                "year": "1959",
                "value": 40,
                "category": "Energy price"
            },
            {
                "year": "1959",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1960",
                "value": 849,
                "category": "Energy consumpion"
            },
            {
                "year": "1960",
                "value": 1410,
                "category": "Thermal comfort"
            },
            {
                "year": "1960",
                "value": 227,
                "category": "Savings"
            },
            {
                "year": "1960",
                "value": 43,
                "category": "Energy price"
            },
            {
                "year": "1960",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1961",
                "value": 904,
                "category": "Energy consumpion"
            },
            {
                "year": "1961",
                "value": 1349,
                "category": "Thermal comfort"
            },
            {
                "year": "1961",
                "value": 240,
                "category": "Savings"
            },
            {
                "year": "1961",
                "value": 45,
                "category": "Energy price"
            },
            {
                "year": "1961",
                "value": 42,
                "category": "Gas flarinl"
            },
            {
                "year": "1962",
                "value": 980,
                "category": "Energy consumpion"
            },
            {
                "year": "1962",
                "value": 1351,
                "category": "Thermal comfort"
            },
            {
                "year": "1962",
                "value": 263,
                "category": "Savings"
            },
            {
                "year": "1962",
                "value": 49,
                "category": "Energy price"
            },
            {
                "year": "1962",
                "value": 44,
                "category": "Gas flarinl"
            },
            {
                "year": "1963",
                "value": 1052,
                "category": "Energy consumpion"
            },
            {
                "year": "1963",
                "value": 1396,
                "category": "Thermal comfort"
            },
            {
                "year": "1963",
                "value": 286,
                "category": "Savings"
            },
            {
                "year": "1963",
                "value": 51,
                "category": "Energy price"
            },
            {
                "year": "1963",
                "value": 47,
                "category": "Gas flarinl"
            },
            {
                "year": "1964",
                "value": 1137,
                "category": "Energy consumpion"
            },
            {
                "year": "1964",
                "value": 1435,
                "category": "Thermal comfort"
            },
            {
                "year": "1964",
                "value": 316,
                "category": "Savings"
            },
            {
                "year": "1964",
                "value": 57,
                "category": "Energy price"
            },
            {
                "year": "1964",
                "value": 51,
                "category": "Gas flarinl"
            },
            {
                "year": "1965",
                "value": 1219,
                "category": "Energy consumpion"
            },
            {
                "year": "1965",
                "value": 1460,
                "category": "Thermal comfort"
            },
            {
                "year": "1965",
                "value": 337,
                "category": "Savings"
            },
            {
                "year": "1965",
                "value": 59,
                "category": "Energy price"
            },
            {
                "year": "1965",
                "value": 55,
                "category": "Gas flarinl"
            },
            {
                "year": "1966",
                "value": 1323,
                "category": "Energy consumpion"
            },
            {
                "year": "1966",
                "value": 1478,
                "category": "Thermal comfort"
            },
            {
                "year": "1966",
                "value": 364,
                "category": "Savings"
            },
            {
                "year": "1966",
                "value": 63,
                "category": "Energy price"
            },
            {
                "year": "1966",
                "value": 60,
                "category": "Gas flarinl"
            },
            {
                "year": "1967",
                "value": 1423,
                "category": "Energy consumpion"
            },
            {
                "year": "1967",
                "value": 1448,
                "category": "Thermal comfort"
            },
            {
                "year": "1967",
                "value": 392,
                "category": "Savings"
            },
            {
                "year": "1967",
                "value": 65,
                "category": "Energy price"
            },
            {
                "year": "1967",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "1968",
                "value": 1551,
                "category": "Energy consumpion"
            },
            {
                "year": "1968",
                "value": 1448,
                "category": "Thermal comfort"
            },
            {
                "year": "1968",
                "value": 424,
                "category": "Savings"
            },
            {
                "year": "1968",
                "value": 70,
                "category": "Energy price"
            },
            {
                "year": "1968",
                "value": 73,
                "category": "Gas flarinl"
            },
            {
                "year": "1969",
                "value": 1673,
                "category": "Energy consumpion"
            },
            {
                "year": "1969",
                "value": 1486,
                "category": "Thermal comfort"
            },
            {
                "year": "1969",
                "value": 467,
                "category": "Savings"
            },
            {
                "year": "1969",
                "value": 74,
                "category": "Energy price"
            },
            {
                "year": "1969",
                "value": 80,
                "category": "Gas flarinl"
            },
            {
                "year": "1970",
                "value": 1839,
                "category": "Energy consumpion"
            },
            {
                "year": "1970",
                "value": 1556,
                "category": "Thermal comfort"
            },
            {
                "year": "1970",
                "value": 493,
                "category": "Savings"
            },
            {
                "year": "1970",
                "value": 78,
                "category": "Energy price"
            },
            {
                "year": "1970",
                "value": 87,
                "category": "Gas flarinl"
            },
            {
                "year": "1971",
                "value": 1947,
                "category": "Energy consumpion"
            },
            {
                "year": "1971",
                "value": 1559,
                "category": "Thermal comfort"
            },
            {
                "year": "1971",
                "value": 530,
                "category": "Savings"
            },
            {
                "year": "1971",
                "value": 84,
                "category": "Energy price"
            },
            {
                "year": "1971",
                "value": 88,
                "category": "Gas flarinl"
            },
            {
                "year": "1972",
                "value": 2057,
                "category": "Energy consumpion"
            },
            {
                "year": "1972",
                "value": 1576,
                "category": "Thermal comfort"
            },
            {
                "year": "1972",
                "value": 560,
                "category": "Savings"
            },
            {
                "year": "1972",
                "value": 89,
                "category": "Energy price"
            },
            {
                "year": "1972",
                "value": 95,
                "category": "Gas flarinl"
            },
            {
                "year": "1973",
                "value": 2241,
                "category": "Energy consumpion"
            },
            {
                "year": "1973",
                "value": 1581,
                "category": "Thermal comfort"
            },
            {
                "year": "1973",
                "value": 588,
                "category": "Savings"
            },
            {
                "year": "1973",
                "value": 95,
                "category": "Energy price"
            },
            {
                "year": "1973",
                "value": 110,
                "category": "Gas flarinl"
            },
            {
                "year": "1974",
                "value": 2245,
                "category": "Energy consumpion"
            },
            {
                "year": "1974",
                "value": 1579,
                "category": "Thermal comfort"
            },
            {
                "year": "1974",
                "value": 597,
                "category": "Savings"
            },
            {
                "year": "1974",
                "value": 96,
                "category": "Energy price"
            },
            {
                "year": "1974",
                "value": 107,
                "category": "Gas flarinl"
            },
            {
                "year": "1975",
                "value": 2132,
                "category": "Energy consumpion"
            },
            {
                "year": "1975",
                "value": 1673,
                "category": "Thermal comfort"
            },
            {
                "year": "1975",
                "value": 604,
                "category": "Savings"
            },
            {
                "year": "1975",
                "value": 95,
                "category": "Energy price"
            },
            {
                "year": "1975",
                "value": 92,
                "category": "Gas flarinl"
            },
            {
                "year": "1976",
                "value": 2314,
                "category": "Energy consumpion"
            },
            {
                "year": "1976",
                "value": 1710,
                "category": "Thermal comfort"
            },
            {
                "year": "1976",
                "value": 630,
                "category": "Savings"
            },
            {
                "year": "1976",
                "value": 103,
                "category": "Energy price"
            },
            {
                "year": "1976",
                "value": 108,
                "category": "Gas flarinl"
            },
            {
                "year": "1977",
                "value": 2398,
                "category": "Energy consumpion"
            },
            {
                "year": "1977",
                "value": 1756,
                "category": "Thermal comfort"
            },
            {
                "year": "1977",
                "value": 650,
                "category": "Savings"
            },
            {
                "year": "1977",
                "value": 108,
                "category": "Energy price"
            },
            {
                "year": "1977",
                "value": 104,
                "category": "Gas flarinl"
            },
            {
                "year": "1978",
                "value": 2392,
                "category": "Energy consumpion"
            },
            {
                "year": "1978",
                "value": 1780,
                "category": "Thermal comfort"
            },
            {
                "year": "1978",
                "value": 680,
                "category": "Savings"
            },
            {
                "year": "1978",
                "value": 116,
                "category": "Energy price"
            },
            {
                "year": "1978",
                "value": 106,
                "category": "Gas flarinl"
            },
            {
                "year": "1979",
                "value": 2544,
                "category": "Energy consumpion"
            },
            {
                "year": "1979",
                "value": 1875,
                "category": "Thermal comfort"
            },
            {
                "year": "1979",
                "value": 721,
                "category": "Savings"
            },
            {
                "year": "1979",
                "value": 119,
                "category": "Energy price"
            },
            {
                "year": "1979",
                "value": 98,
                "category": "Gas flarinl"
            },
            {
                "year": "1980",
                "value": 2422,
                "category": "Energy consumpion"
            },
            {
                "year": "1980",
                "value": 1935,
                "category": "Thermal comfort"
            },
            {
                "year": "1980",
                "value": 737,
                "category": "Savings"
            },
            {
                "year": "1980",
                "value": 120,
                "category": "Energy price"
            },
            {
                "year": "1980",
                "value": 86,
                "category": "Gas flarinl"
            },
            {
                "year": "1981",
                "value": 2289,
                "category": "Energy consumpion"
            },
            {
                "year": "1981",
                "value": 1908,
                "category": "Thermal comfort"
            },
            {
                "year": "1981",
                "value": 755,
                "category": "Savings"
            },
            {
                "year": "1981",
                "value": 121,
                "category": "Energy price"
            },
            {
                "year": "1981",
                "value": 65,
                "category": "Gas flarinl"
            },
            {
                "year": "1982",
                "value": 2196,
                "category": "Energy consumpion"
            },
            {
                "year": "1982",
                "value": 1976,
                "category": "Thermal comfort"
            },
            {
                "year": "1982",
                "value": 738,
                "category": "Savings"
            },
            {
                "year": "1982",
                "value": 121,
                "category": "Energy price"
            },
            {
                "year": "1982",
                "value": 64,
                "category": "Gas flarinl"
            },
            {
                "year": "1983",
                "value": 2176,
                "category": "Energy consumpion"
            },
            {
                "year": "1983",
                "value": 1977,
                "category": "Thermal comfort"
            },
            {
                "year": "1983",
                "value": 739,
                "category": "Savings"
            },
            {
                "year": "1983",
                "value": 125,
                "category": "Energy price"
            },
            {
                "year": "1983",
                "value": 58,
                "category": "Gas flarinl"
            },
            {
                "year": "1984",
                "value": 2199,
                "category": "Energy consumpion"
            },
            {
                "year": "1984",
                "value": 2074,
                "category": "Thermal comfort"
            },
            {
                "year": "1984",
                "value": 807,
                "category": "Savings"
            },
            {
                "year": "1984",
                "value": 128,
                "category": "Energy price"
            },
            {
                "year": "1984",
                "value": 51,
                "category": "Gas flarinl"
            },
            {
                "year": "1985",
                "value": 2186,
                "category": "Energy consumpion"
            },
            {
                "year": "1985",
                "value": 2216,
                "category": "Thermal comfort"
            },
            {
                "year": "1985",
                "value": 835,
                "category": "Savings"
            },
            {
                "year": "1985",
                "value": 131,
                "category": "Energy price"
            },
            {
                "year": "1985",
                "value": 49,
                "category": "Gas flarinl"
            },
            {
                "year": "1986",
                "value": 2293,
                "category": "Energy consumpion"
            },
            {
                "year": "1986",
                "value": 2277,
                "category": "Thermal comfort"
            },
            {
                "year": "1986",
                "value": 830,
                "category": "Savings"
            },
            {
                "year": "1986",
                "value": 137,
                "category": "Energy price"
            },
            {
                "year": "1986",
                "value": 46,
                "category": "Gas flarinl"
            },
            {
                "year": "1987",
                "value": 2306,
                "category": "Energy consumpion"
            },
            {
                "year": "1987",
                "value": 2339,
                "category": "Thermal comfort"
            },
            {
                "year": "1987",
                "value": 892,
                "category": "Savings"
            },
            {
                "year": "1987",
                "value": 143,
                "category": "Energy price"
            },
            {
                "year": "1987",
                "value": 44,
                "category": "Gas flarinl"
            },
            {
                "year": "1988",
                "value": 2412,
                "category": "Energy consumpion"
            },
            {
                "year": "1988",
                "value": 2387,
                "category": "Thermal comfort"
            },
            {
                "year": "1988",
                "value": 935,
                "category": "Savings"
            },
            {
                "year": "1988",
                "value": 152,
                "category": "Energy price"
            },
            {
                "year": "1988",
                "value": 50,
                "category": "Gas flarinl"
            },
            {
                "year": "1989",
                "value": 2459,
                "category": "Energy consumpion"
            },
            {
                "year": "1989",
                "value": 2428,
                "category": "Thermal comfort"
            },
            {
                "year": "1989",
                "value": 982,
                "category": "Savings"
            },
            {
                "year": "1989",
                "value": 156,
                "category": "Energy price"
            },
            {
                "year": "1989",
                "value": 41,
                "category": "Gas flarinl"
            },
            {
                "year": "1990",
                "value": 2492,
                "category": "Energy consumpion"
            },
            {
                "year": "1990",
                "value": 2359,
                "category": "Thermal comfort"
            },
            {
                "year": "1990",
                "value": 1026,
                "category": "Savings"
            },
            {
                "year": "1990",
                "value": 157,
                "category": "Energy price"
            },
            {
                "year": "1990",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1991",
                "value": 2601,
                "category": "Energy consumpion"
            },
            {
                "year": "1991",
                "value": 2284,
                "category": "Thermal comfort"
            },
            {
                "year": "1991",
                "value": 1051,
                "category": "Savings"
            },
            {
                "year": "1991",
                "value": 161,
                "category": "Energy price"
            },
            {
                "year": "1991",
                "value": 45,
                "category": "Gas flarinl"
            },
            {
                "year": "1992",
                "value": 2499,
                "category": "Energy consumpion"
            },
            {
                "year": "1992",
                "value": 2290,
                "category": "Thermal comfort"
            },
            {
                "year": "1992",
                "value": 1085,
                "category": "Savings"
            },
            {
                "year": "1992",
                "value": 167,
                "category": "Energy price"
            },
            {
                "year": "1992",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1993",
                "value": 2515,
                "category": "Energy consumpion"
            },
            {
                "year": "1993",
                "value": 2225,
                "category": "Thermal comfort"
            },
            {
                "year": "1993",
                "value": 1117,
                "category": "Savings"
            },
            {
                "year": "1993",
                "value": 176,
                "category": "Energy price"
            },
            {
                "year": "1993",
                "value": 37,
                "category": "Gas flarinl"
            },
            {
                "year": "1994",
                "value": 2539,
                "category": "Energy consumpion"
            },
            {
                "year": "1994",
                "value": 2278,
                "category": "Thermal comfort"
            },
            {
                "year": "1994",
                "value": 1133,
                "category": "Savings"
            },
            {
                "year": "1994",
                "value": 186,
                "category": "Energy price"
            },
            {
                "year": "1994",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1995",
                "value": 2560,
                "category": "Energy consumpion"
            },
            {
                "year": "1995",
                "value": 2359,
                "category": "Thermal comfort"
            },
            {
                "year": "1995",
                "value": 1151,
                "category": "Savings"
            },
            {
                "year": "1995",
                "value": 197,
                "category": "Energy price"
            },
            {
                "year": "1995",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1996",
                "value": 2626,
                "category": "Energy consumpion"
            },
            {
                "year": "1996",
                "value": 2382,
                "category": "Thermal comfort"
            },
            {
                "year": "1996",
                "value": 1198,
                "category": "Savings"
            },
            {
                "year": "1996",
                "value": 203,
                "category": "Energy price"
            },
            {
                "year": "1996",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1997",
                "value": 2701,
                "category": "Energy consumpion"
            },
            {
                "year": "1997",
                "value": 2409,
                "category": "Thermal comfort"
            },
            {
                "year": "1997",
                "value": 1197,
                "category": "Savings"
            },
            {
                "year": "1997",
                "value": 209,
                "category": "Energy price"
            },
            {
                "year": "1997",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1998",
                "value": 2763,
                "category": "Energy consumpion"
            },
            {
                "year": "1998",
                "value": 2343,
                "category": "Thermal comfort"
            },
            {
                "year": "1998",
                "value": 1224,
                "category": "Savings"
            },
            {
                "year": "1998",
                "value": 209,
                "category": "Energy price"
            },
            {
                "year": "1998",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1999",
                "value": 2741,
                "category": "Energy consumpion"
            },
            {
                "year": "1999",
                "value": 2310,
                "category": "Thermal comfort"
            },
            {
                "year": "1999",
                "value": 1258,
                "category": "Savings"
            },
            {
                "year": "1999",
                "value": 217,
                "category": "Energy price"
            },
            {
                "year": "1999",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "2000",
                "value": 2845,
                "category": "Energy consumpion"
            },
            {
                "year": "2000",
                "value": 2327,
                "category": "Thermal comfort"
            },
            {
                "year": "2000",
                "value": 1289,
                "category": "Savings"
            },
            {
                "year": "2000",
                "value": 226,
                "category": "Energy price"
            },
            {
                "year": "2000",
                "value": 46,
                "category": "Gas flarinl"
            },
            {
                "year": "2001",
                "value": 2848,
                "category": "Energy consumpion"
            },
            {
                "year": "2001",
                "value": 2445,
                "category": "Thermal comfort"
            },
            {
                "year": "2001",
                "value": 1316,
                "category": "Savings"
            },
            {
                "year": "2001",
                "value": 237,
                "category": "Energy price"
            },
            {
                "year": "2001",
                "value": 47,
                "category": "Gas flarinl"
            },
            {
                "year": "2002",
                "value": 2832,
                "category": "Energy consumpion"
            },
            {
                "year": "2002",
                "value": 2518,
                "category": "Thermal comfort"
            },
            {
                "year": "2002",
                "value": 1342,
                "category": "Savings"
            },
            {
                "year": "2002",
                "value": 252,
                "category": "Energy price"
            },
            {
                "year": "2002",
                "value": 49,
                "category": "Gas flarinl"
            },
            {
                "year": "2003",
                "value": 2958,
                "category": "Energy consumpion"
            },
            {
                "year": "2003",
                "value": 2695,
                "category": "Thermal comfort"
            },
            {
                "year": "2003",
                "value": 1397,
                "category": "Savings"
            },
            {
                "year": "2003",
                "value": 276,
                "category": "Energy price"
            },
            {
                "year": "2003",
                "value": 48,
                "category": "Gas flarinl"
            },
            {
                "year": "2004",
                "value": 3043,
                "category": "Energy consumpion"
            },
            {
                "year": "2004",
                "value": 2906,
                "category": "Thermal comfort"
            },
            {
                "year": "2004",
                "value": 1443,
                "category": "Savings"
            },
            {
                "year": "2004",
                "value": 298,
                "category": "Energy price"
            },
            {
                "year": "2004",
                "value": 54,
                "category": "Gas flarinl"
            },
            {
                "year": "2005",
                "value": 3068,
                "category": "Energy consumpion"
            },
            {
                "year": "2005",
                "value": 3108,
                "category": "Thermal comfort"
            },
            {
                "year": "2005",
                "value": 1485,
                "category": "Savings"
            },
            {
                "year": "2005",
                "value": 320,
                "category": "Energy price"
            },
            {
                "year": "2005",
                "value": 60,
                "category": "Gas flarinl"
            },
            {
                "year": "2006",
                "value": 3091,
                "category": "Energy consumpion"
            },
            {
                "year": "2006",
                "value": 3293,
                "category": "Thermal comfort"
            },
            {
                "year": "2006",
                "value": 1534,
                "category": "Savings"
            },
            {
                "year": "2006",
                "value": 356,
                "category": "Energy price"
            },
            {
                "year": "2006",
                "value": 62,
                "category": "Gas flarinl"
            },
            {
                "year": "2007",
                "value": 3071,
                "category": "Energy consumpion"
            },
            {
                "year": "2007",
                "value": 3422,
                "category": "Thermal comfort"
            },
            {
                "year": "2007",
                "value": 1562,
                "category": "Savings"
            },
            {
                "year": "2007",
                "value": 382,
                "category": "Energy price"
            },
            {
                "year": "2007",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "2008",
                "value": 3103,
                "category": "Energy consumpion"
            },
            {
                "year": "2008",
                "value": 3587,
                "category": "Thermal comfort"
            },
            {
                "year": "2008",
                "value": 1630,
                "category": "Savings"
            },
            {
                "year": "2008",
                "value": 388,
                "category": "Energy price"
            },
            {
                "year": "2008",
                "value": 69,
                "category": "Gas flarinl"
            },
            {
                "year": "2009",
                "value": 3042,
                "category": "Energy consumpion"
            },
            {
                "year": "2009",
                "value": 3590,
                "category": "Thermal comfort"
            },
            {
                "year": "2009",
                "value": 1584,
                "category": "Savings"
            },
            {
                "year": "2009",
                "value": 415,
                "category": "Energy price"
            },
            {
                "year": "2009",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "2010",
                "value": 3107,
                "category": "Energy consumpion"
            },
            {
                "year": "2010",
                "value": 3812,
                "category": "Thermal comfort"
            },
            {
                "year": "2010",
                "value": 1696,
                "category": "Savings"
            },
            {
                "year": "2010",
                "value": 446,
                "category": "Energy price"
            },
            {
                "year": "2010",
                "value": 67,
                "category": "Gas flarinl"
            },
            {
                "year": "2011",
                "value": 3134,
                "category": "Energy consumpion"
            },
            {
                "year": "2011",
                "value": 4055,
                "category": "Thermal comfort"
            },
            {
                "year": "2011",
                "value": 1756,
                "category": "Savings"
            },
            {
                "year": "2011",
                "value": 494,
                "category": "Energy price"
            },
            {
                "year": "2011",
                "value": 64,
                "category": "Gas flarinl"
            },
            {
                "year": "2012",
                "value": 3200,
                "category": "Energy consumpion"
            },
            {
                "year": "2012",
                "value": 4106,
                "category": "Thermal comfort"
            },
            {
                "year": "2012",
                "value": 1783,
                "category": "Savings"
            },
            {
                "year": "2012",
                "value": 519,
                "category": "Energy price"
            },
            {
                "year": "2012",
                "value": 65,
                "category": "Gas flarinl"
            },
            {
                "year": "2013",
                "value": 3220,
                "category": "Energy consumpion"
            },
            {
                "year": "2013",
                "value": 4126,
                "category": "Thermal comfort"
            },
            {
                "year": "2013",
                "value": 1806,
                "category": "Savings"
            },
            {
                "year": "2013",
                "value": 554,
                "category": "Energy price"
            },
            {
                "year": "2013",
                "value": 68,
                "category": "Gas flarinl"
            },
            {
                "year": "2014",
                "value": 3280,
                "category": "Energy consumpion"
            },
            {
                "year": "2014",
                "value": 4117,
                "category": "Thermal comfort"
            },
            {
                "year": "2014",
                "value": 1823,
                "category": "Savings"
            },
            {
                "year": "2014",
                "value": 568,
                "category": "Energy price"
            },
            {
                "year": "2014",
                "value": 68,
                "category": "Gas flarinl"
            }
        ];

        var data5 = [];
        for (var key in data2) {
            if (this.inArray(data2[key]["category"], ["Energy consumpion", "Thermal comfort", "Savings", "Energy price"])) {
                data5[data5.length] = data2[key];
            }
        }

        config4 = {
            "data": data5,
            xField: 'year',
            height: 270,
            width: 300,
            yField: 'value',
            seriesField: 'category',
            color: ['#6897a7', '#8bc0d6', '#60d7a7', '#dedede', '#fedca9', '#fab36f', '#d96d6f'],
            xAxis: {

            },
            yAxis: {

            },
            legend: {
                position: 'top',
            },
        };

        const config = {
                data,
                height: 300,
                xField: 'year',
                yField: 'value',
                point: {
                    size: 5,
                    shape: 'diamond',
                },
        };

       
            const config1 = {
                percent: 0.75,
                type: 'meter',
                height: 300,
                innerRadius: 0.75,
                range: {
                    ticks: [0, 1 / 3, 2 / 3, 1],
                    color: ['#F4664A', '#FAAD14', '#30BF78'],
                },
                indicator: {
                    pointer: {
                        style: {
                            stroke: '#D0D0D0',
                        },
                    },
                    pin: {
                        style: {
                            stroke: '#D0D0D0',
                        },
                    },
                },
                statistic: {
                    content: {
                        style: {
                            fontSize: '36px',
                            lineHeight: '36px',
                        },
                    },
                },
        };
        var x_b = 70;
        var x_b_c = 'l(0) 0:#FF8170 1:#FF2B15';
        if (x_b > 20 && x_b <= 39)
            x_b_c = 'l(0) 0:#FFBE97 1:#FF863D';
        else if (x_b > 39 && x_b <= 100)
            x_b_c = 'l(0) 0:#CAFFA2 1:#5FD136';
        config3 = {
            percent: 0.75,
            range: {
                color: x_b_c,
            },
            height: 270,
            width: 190,
            startAngle: Math.PI,
            endAngle: 2 * Math.PI,
            indicator: null,
            statistic: {
                title: {
                    offsetY: -36,
                    style: {
                        fontSize: '36px',
                        color: '#4B535E',
                    },
                    formatter: () => x_b + '%',
                },
                content: {
                    style: {
                        fontSize: '24px',
                        lineHeight: '44px',
                        color: '#4B535E',
                    },
                    formatter: () => '',
                },
            },
        };
        data = [
            {
                "year": "1850",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1850",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1850",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1851",
                "value": 54,
                "category": "Thermal comfort"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1851",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1852",
                "value": 57,
                "category": "Thermal comfort"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1852",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1853",
                "value": 59,
                "category": "Thermal comfort"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1853",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1854",
                "value": 69,
                "category": "Thermal comfort"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1854",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1855",
                "value": 71,
                "category": "Thermal comfort"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1855",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1856",
                "value": 76,
                "category": "Thermal comfort"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1856",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1857",
                "value": 77,
                "category": "Thermal comfort"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1857",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1858",
                "value": 78,
                "category": "Thermal comfort"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1858",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1859",
                "value": 83,
                "category": "Thermal comfort"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1859",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1860",
                "value": 91,
                "category": "Thermal comfort"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1860",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1861",
                "value": 95,
                "category": "Thermal comfort"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1861",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1862",
                "value": 96,
                "category": "Thermal comfort"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1862",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1863",
                "value": 103,
                "category": "Thermal comfort"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1863",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1864",
                "value": 112,
                "category": "Thermal comfort"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1864",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1865",
                "value": 119,
                "category": "Thermal comfort"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1865",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1866",
                "value": 122,
                "category": "Thermal comfort"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1866",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1867",
                "value": 130,
                "category": "Thermal comfort"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1867",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1868",
                "value": 134,
                "category": "Thermal comfort"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1868",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Energy consumpion"
            },
            {
                "year": "1869",
                "value": 142,
                "category": "Thermal comfort"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1869",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1870",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1870",
                "value": 146,
                "category": "Thermal comfort"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1870",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1871",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1871",
                "value": 156,
                "category": "Thermal comfort"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1871",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1872",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1872",
                "value": 173,
                "category": "Thermal comfort"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1872",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1873",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1873",
                "value": 183,
                "category": "Thermal comfort"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1873",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1874",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1874",
                "value": 173,
                "category": "Thermal comfort"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1874",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1875",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1875",
                "value": 187,
                "category": "Thermal comfort"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1875",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1876",
                "value": 1,
                "category": "Energy consumpion"
            },
            {
                "year": "1876",
                "value": 190,
                "category": "Thermal comfort"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1876",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1877",
                "value": 2,
                "category": "Energy consumpion"
            },
            {
                "year": "1877",
                "value": 192,
                "category": "Thermal comfort"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1877",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1878",
                "value": 2,
                "category": "Energy consumpion"
            },
            {
                "year": "1878",
                "value": 194,
                "category": "Thermal comfort"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1878",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1879",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1879",
                "value": 207,
                "category": "Thermal comfort"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1879",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1880",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1880",
                "value": 233,
                "category": "Thermal comfort"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1880",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1881",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1881",
                "value": 239,
                "category": "Thermal comfort"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1881",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1882",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1882",
                "value": 252,
                "category": "Thermal comfort"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1882",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1883",
                "value": 3,
                "category": "Energy consumpion"
            },
            {
                "year": "1883",
                "value": 269,
                "category": "Thermal comfort"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1883",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1884",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1884",
                "value": 271,
                "category": "Thermal comfort"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Savings"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1884",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1885",
                "value": 4,
                "category": "Energy consumpion"
            },
            {
                "year": "1885",
                "value": 273,
                "category": "Thermal comfort"
            },
            {
                "year": "1885",
                "value": 1,
                "category": "Savings"
            },
            {
                "year": "1885",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1885",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1886",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1886",
                "value": 275,
                "category": "Thermal comfort"
            },
            {
                "year": "1886",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1886",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1886",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1887",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1887",
                "value": 287,
                "category": "Thermal comfort"
            },
            {
                "year": "1887",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1887",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1887",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1888",
                "value": 5,
                "category": "Energy consumpion"
            },
            {
                "year": "1888",
                "value": 317,
                "category": "Thermal comfort"
            },
            {
                "year": "1888",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1888",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1888",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1889",
                "value": 6,
                "category": "Energy consumpion"
            },
            {
                "year": "1889",
                "value": 318,
                "category": "Thermal comfort"
            },
            {
                "year": "1889",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1889",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1889",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1890",
                "value": 8,
                "category": "Energy consumpion"
            },
            {
                "year": "1890",
                "value": 345,
                "category": "Thermal comfort"
            },
            {
                "year": "1890",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1890",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1890",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1891",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1891",
                "value": 360,
                "category": "Thermal comfort"
            },
            {
                "year": "1891",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1891",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1891",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1892",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1892",
                "value": 363,
                "category": "Thermal comfort"
            },
            {
                "year": "1892",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1892",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1892",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1893",
                "value": 10,
                "category": "Energy consumpion"
            },
            {
                "year": "1893",
                "value": 358,
                "category": "Thermal comfort"
            },
            {
                "year": "1893",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1893",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1893",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1894",
                "value": 9,
                "category": "Energy consumpion"
            },
            {
                "year": "1894",
                "value": 372,
                "category": "Thermal comfort"
            },
            {
                "year": "1894",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1894",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1894",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1895",
                "value": 11,
                "category": "Energy consumpion"
            },
            {
                "year": "1895",
                "value": 393,
                "category": "Thermal comfort"
            },
            {
                "year": "1895",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1895",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1895",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1896",
                "value": 12,
                "category": "Energy consumpion"
            },
            {
                "year": "1896",
                "value": 405,
                "category": "Thermal comfort"
            },
            {
                "year": "1896",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1896",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1896",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1897",
                "value": 13,
                "category": "Energy consumpion"
            },
            {
                "year": "1897",
                "value": 425,
                "category": "Thermal comfort"
            },
            {
                "year": "1897",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1897",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1897",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1898",
                "value": 13,
                "category": "Energy consumpion"
            },
            {
                "year": "1898",
                "value": 449,
                "category": "Thermal comfort"
            },
            {
                "year": "1898",
                "value": 2,
                "category": "Savings"
            },
            {
                "year": "1898",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1898",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1899",
                "value": 14,
                "category": "Energy consumpion"
            },
            {
                "year": "1899",
                "value": 491,
                "category": "Thermal comfort"
            },
            {
                "year": "1899",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1899",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1899",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1900",
                "value": 16,
                "category": "Energy consumpion"
            },
            {
                "year": "1900",
                "value": 515,
                "category": "Thermal comfort"
            },
            {
                "year": "1900",
                "value": 3,
                "category": "Savings"
            },
            {
                "year": "1900",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1900",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1901",
                "value": 18,
                "category": "Energy consumpion"
            },
            {
                "year": "1901",
                "value": 531,
                "category": "Thermal comfort"
            },
            {
                "year": "1901",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1901",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1901",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1902",
                "value": 19,
                "category": "Energy consumpion"
            },
            {
                "year": "1902",
                "value": 543,
                "category": "Thermal comfort"
            },
            {
                "year": "1902",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1902",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1902",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1903",
                "value": 20,
                "category": "Energy consumpion"
            },
            {
                "year": "1903",
                "value": 593,
                "category": "Thermal comfort"
            },
            {
                "year": "1903",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1903",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1903",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1904",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1904",
                "value": 597,
                "category": "Thermal comfort"
            },
            {
                "year": "1904",
                "value": 4,
                "category": "Savings"
            },
            {
                "year": "1904",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1904",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1905",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1905",
                "value": 636,
                "category": "Thermal comfort"
            },
            {
                "year": "1905",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1905",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1905",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1906",
                "value": 23,
                "category": "Energy consumpion"
            },
            {
                "year": "1906",
                "value": 680,
                "category": "Thermal comfort"
            },
            {
                "year": "1906",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1906",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1906",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1907",
                "value": 28,
                "category": "Energy consumpion"
            },
            {
                "year": "1907",
                "value": 750,
                "category": "Thermal comfort"
            },
            {
                "year": "1907",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1907",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1907",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1908",
                "value": 30,
                "category": "Energy consumpion"
            },
            {
                "year": "1908",
                "value": 714,
                "category": "Thermal comfort"
            },
            {
                "year": "1908",
                "value": 5,
                "category": "Savings"
            },
            {
                "year": "1908",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1908",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1909",
                "value": 32,
                "category": "Energy consumpion"
            },
            {
                "year": "1909",
                "value": 747,
                "category": "Thermal comfort"
            },
            {
                "year": "1909",
                "value": 6,
                "category": "Savings"
            },
            {
                "year": "1909",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1909",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1910",
                "value": 34,
                "category": "Energy consumpion"
            },
            {
                "year": "1910",
                "value": 778,
                "category": "Thermal comfort"
            },
            {
                "year": "1910",
                "value": 7,
                "category": "Savings"
            },
            {
                "year": "1910",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1910",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1911",
                "value": 36,
                "category": "Energy consumpion"
            },
            {
                "year": "1911",
                "value": 792,
                "category": "Thermal comfort"
            },
            {
                "year": "1911",
                "value": 7,
                "category": "Savings"
            },
            {
                "year": "1911",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1911",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1912",
                "value": 37,
                "category": "Energy consumpion"
            },
            {
                "year": "1912",
                "value": 834,
                "category": "Thermal comfort"
            },
            {
                "year": "1912",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1912",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1912",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1913",
                "value": 41,
                "category": "Energy consumpion"
            },
            {
                "year": "1913",
                "value": 895,
                "category": "Thermal comfort"
            },
            {
                "year": "1913",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1913",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1913",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1914",
                "value": 42,
                "category": "Energy consumpion"
            },
            {
                "year": "1914",
                "value": 800,
                "category": "Thermal comfort"
            },
            {
                "year": "1914",
                "value": 8,
                "category": "Savings"
            },
            {
                "year": "1914",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1914",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1915",
                "value": 45,
                "category": "Energy consumpion"
            },
            {
                "year": "1915",
                "value": 784,
                "category": "Thermal comfort"
            },
            {
                "year": "1915",
                "value": 9,
                "category": "Savings"
            },
            {
                "year": "1915",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1915",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1916",
                "value": 48,
                "category": "Energy consumpion"
            },
            {
                "year": "1916",
                "value": 842,
                "category": "Thermal comfort"
            },
            {
                "year": "1916",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1916",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1916",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1917",
                "value": 54,
                "category": "Energy consumpion"
            },
            {
                "year": "1917",
                "value": 891,
                "category": "Thermal comfort"
            },
            {
                "year": "1917",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1917",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1917",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1918",
                "value": 53,
                "category": "Energy consumpion"
            },
            {
                "year": "1918",
                "value": 873,
                "category": "Thermal comfort"
            },
            {
                "year": "1918",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1918",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1918",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1919",
                "value": 61,
                "category": "Energy consumpion"
            },
            {
                "year": "1919",
                "value": 735,
                "category": "Thermal comfort"
            },
            {
                "year": "1919",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1919",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1919",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1920",
                "value": 78,
                "category": "Energy consumpion"
            },
            {
                "year": "1920",
                "value": 843,
                "category": "Thermal comfort"
            },
            {
                "year": "1920",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1920",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1920",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1921",
                "value": 84,
                "category": "Energy consumpion"
            },
            {
                "year": "1921",
                "value": 709,
                "category": "Thermal comfort"
            },
            {
                "year": "1921",
                "value": 10,
                "category": "Savings"
            },
            {
                "year": "1921",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1921",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1922",
                "value": 94,
                "category": "Energy consumpion"
            },
            {
                "year": "1922",
                "value": 740,
                "category": "Thermal comfort"
            },
            {
                "year": "1922",
                "value": 11,
                "category": "Savings"
            },
            {
                "year": "1922",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1922",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1923",
                "value": 111,
                "category": "Energy consumpion"
            },
            {
                "year": "1923",
                "value": 845,
                "category": "Thermal comfort"
            },
            {
                "year": "1923",
                "value": 14,
                "category": "Savings"
            },
            {
                "year": "1923",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1923",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1924",
                "value": 110,
                "category": "Energy consumpion"
            },
            {
                "year": "1924",
                "value": 836,
                "category": "Thermal comfort"
            },
            {
                "year": "1924",
                "value": 16,
                "category": "Savings"
            },
            {
                "year": "1924",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1924",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1925",
                "value": 116,
                "category": "Energy consumpion"
            },
            {
                "year": "1925",
                "value": 842,
                "category": "Thermal comfort"
            },
            {
                "year": "1925",
                "value": 17,
                "category": "Savings"
            },
            {
                "year": "1925",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1925",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1926",
                "value": 119,
                "category": "Energy consumpion"
            },
            {
                "year": "1926",
                "value": 846,
                "category": "Thermal comfort"
            },
            {
                "year": "1926",
                "value": 19,
                "category": "Savings"
            },
            {
                "year": "1926",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1926",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1927",
                "value": 136,
                "category": "Energy consumpion"
            },
            {
                "year": "1927",
                "value": 905,
                "category": "Thermal comfort"
            },
            {
                "year": "1927",
                "value": 21,
                "category": "Savings"
            },
            {
                "year": "1927",
                "value": 0,
                "category": "Energy price"
            },
            {
                "year": "1927",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1928",
                "value": 143,
                "category": "Energy consumpion"
            },
            {
                "year": "1928",
                "value": 890,
                "category": "Thermal comfort"
            },
            {
                "year": "1928",
                "value": 23,
                "category": "Savings"
            },
            {
                "year": "1928",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1928",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1929",
                "value": 160,
                "category": "Energy consumpion"
            },
            {
                "year": "1929",
                "value": 947,
                "category": "Thermal comfort"
            },
            {
                "year": "1929",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1929",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1929",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1930",
                "value": 152,
                "category": "Energy consumpion"
            },
            {
                "year": "1930",
                "value": 862,
                "category": "Thermal comfort"
            },
            {
                "year": "1930",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1930",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1930",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1931",
                "value": 147,
                "category": "Energy consumpion"
            },
            {
                "year": "1931",
                "value": 759,
                "category": "Thermal comfort"
            },
            {
                "year": "1931",
                "value": 25,
                "category": "Savings"
            },
            {
                "year": "1931",
                "value": 8,
                "category": "Energy price"
            },
            {
                "year": "1931",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1932",
                "value": 141,
                "category": "Energy consumpion"
            },
            {
                "year": "1932",
                "value": 675,
                "category": "Thermal comfort"
            },
            {
                "year": "1932",
                "value": 24,
                "category": "Savings"
            },
            {
                "year": "1932",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1932",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1933",
                "value": 154,
                "category": "Energy consumpion"
            },
            {
                "year": "1933",
                "value": 708,
                "category": "Thermal comfort"
            },
            {
                "year": "1933",
                "value": 25,
                "category": "Savings"
            },
            {
                "year": "1933",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1933",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1934",
                "value": 162,
                "category": "Energy consumpion"
            },
            {
                "year": "1934",
                "value": 775,
                "category": "Thermal comfort"
            },
            {
                "year": "1934",
                "value": 28,
                "category": "Savings"
            },
            {
                "year": "1934",
                "value": 8,
                "category": "Energy price"
            },
            {
                "year": "1934",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1935",
                "value": 176,
                "category": "Energy consumpion"
            },
            {
                "year": "1935",
                "value": 811,
                "category": "Thermal comfort"
            },
            {
                "year": "1935",
                "value": 30,
                "category": "Savings"
            },
            {
                "year": "1935",
                "value": 9,
                "category": "Energy price"
            },
            {
                "year": "1935",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1936",
                "value": 192,
                "category": "Energy consumpion"
            },
            {
                "year": "1936",
                "value": 893,
                "category": "Thermal comfort"
            },
            {
                "year": "1936",
                "value": 34,
                "category": "Savings"
            },
            {
                "year": "1936",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1936",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1937",
                "value": 219,
                "category": "Energy consumpion"
            },
            {
                "year": "1937",
                "value": 941,
                "category": "Thermal comfort"
            },
            {
                "year": "1937",
                "value": 38,
                "category": "Savings"
            },
            {
                "year": "1937",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1937",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1938",
                "value": 214,
                "category": "Energy consumpion"
            },
            {
                "year": "1938",
                "value": 880,
                "category": "Thermal comfort"
            },
            {
                "year": "1938",
                "value": 37,
                "category": "Savings"
            },
            {
                "year": "1938",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1938",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1939",
                "value": 222,
                "category": "Energy consumpion"
            },
            {
                "year": "1939",
                "value": 918,
                "category": "Thermal comfort"
            },
            {
                "year": "1939",
                "value": 38,
                "category": "Savings"
            },
            {
                "year": "1939",
                "value": 13,
                "category": "Energy price"
            },
            {
                "year": "1939",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1940",
                "value": 229,
                "category": "Energy consumpion"
            },
            {
                "year": "1940",
                "value": 1017,
                "category": "Thermal comfort"
            },
            {
                "year": "1940",
                "value": 42,
                "category": "Savings"
            },
            {
                "year": "1940",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1940",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1941",
                "value": 236,
                "category": "Energy consumpion"
            },
            {
                "year": "1941",
                "value": 1043,
                "category": "Thermal comfort"
            },
            {
                "year": "1941",
                "value": 42,
                "category": "Savings"
            },
            {
                "year": "1941",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1941",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1942",
                "value": 222,
                "category": "Energy consumpion"
            },
            {
                "year": "1942",
                "value": 1063,
                "category": "Thermal comfort"
            },
            {
                "year": "1942",
                "value": 45,
                "category": "Savings"
            },
            {
                "year": "1942",
                "value": 11,
                "category": "Energy price"
            },
            {
                "year": "1942",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1943",
                "value": 239,
                "category": "Energy consumpion"
            },
            {
                "year": "1943",
                "value": 1092,
                "category": "Thermal comfort"
            },
            {
                "year": "1943",
                "value": 50,
                "category": "Savings"
            },
            {
                "year": "1943",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1943",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1944",
                "value": 275,
                "category": "Energy consumpion"
            },
            {
                "year": "1944",
                "value": 1047,
                "category": "Thermal comfort"
            },
            {
                "year": "1944",
                "value": 54,
                "category": "Savings"
            },
            {
                "year": "1944",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1944",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1945",
                "value": 275,
                "category": "Energy consumpion"
            },
            {
                "year": "1945",
                "value": 820,
                "category": "Thermal comfort"
            },
            {
                "year": "1945",
                "value": 59,
                "category": "Savings"
            },
            {
                "year": "1945",
                "value": 7,
                "category": "Energy price"
            },
            {
                "year": "1945",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1946",
                "value": 292,
                "category": "Energy consumpion"
            },
            {
                "year": "1946",
                "value": 875,
                "category": "Thermal comfort"
            },
            {
                "year": "1946",
                "value": 61,
                "category": "Savings"
            },
            {
                "year": "1946",
                "value": 10,
                "category": "Energy price"
            },
            {
                "year": "1946",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1947",
                "value": 322,
                "category": "Energy consumpion"
            },
            {
                "year": "1947",
                "value": 992,
                "category": "Thermal comfort"
            },
            {
                "year": "1947",
                "value": 67,
                "category": "Savings"
            },
            {
                "year": "1947",
                "value": 12,
                "category": "Energy price"
            },
            {
                "year": "1947",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1948",
                "value": 364,
                "category": "Energy consumpion"
            },
            {
                "year": "1948",
                "value": 1015,
                "category": "Thermal comfort"
            },
            {
                "year": "1948",
                "value": 76,
                "category": "Savings"
            },
            {
                "year": "1948",
                "value": 14,
                "category": "Energy price"
            },
            {
                "year": "1948",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1949",
                "value": 362,
                "category": "Energy consumpion"
            },
            {
                "year": "1949",
                "value": 960,
                "category": "Thermal comfort"
            },
            {
                "year": "1949",
                "value": 81,
                "category": "Savings"
            },
            {
                "year": "1949",
                "value": 16,
                "category": "Energy price"
            },
            {
                "year": "1949",
                "value": 0,
                "category": "Gas flarinl"
            },
            {
                "year": "1950",
                "value": 423,
                "category": "Energy consumpion"
            },
            {
                "year": "1950",
                "value": 1070,
                "category": "Thermal comfort"
            },
            {
                "year": "1950",
                "value": 97,
                "category": "Savings"
            },
            {
                "year": "1950",
                "value": 18,
                "category": "Energy price"
            },
            {
                "year": "1950",
                "value": 23,
                "category": "Gas flarinl"
            },
            {
                "year": "1951",
                "value": 479,
                "category": "Energy consumpion"
            },
            {
                "year": "1951",
                "value": 1129,
                "category": "Thermal comfort"
            },
            {
                "year": "1951",
                "value": 115,
                "category": "Savings"
            },
            {
                "year": "1951",
                "value": 20,
                "category": "Energy price"
            },
            {
                "year": "1951",
                "value": 24,
                "category": "Gas flarinl"
            },
            {
                "year": "1952",
                "value": 504,
                "category": "Energy consumpion"
            },
            {
                "year": "1952",
                "value": 1119,
                "category": "Thermal comfort"
            },
            {
                "year": "1952",
                "value": 124,
                "category": "Savings"
            },
            {
                "year": "1952",
                "value": 22,
                "category": "Energy price"
            },
            {
                "year": "1952",
                "value": 26,
                "category": "Gas flarinl"
            },
            {
                "year": "1953",
                "value": 533,
                "category": "Energy consumpion"
            },
            {
                "year": "1953",
                "value": 1125,
                "category": "Thermal comfort"
            },
            {
                "year": "1953",
                "value": 131,
                "category": "Savings"
            },
            {
                "year": "1953",
                "value": 24,
                "category": "Energy price"
            },
            {
                "year": "1953",
                "value": 27,
                "category": "Gas flarinl"
            },
            {
                "year": "1954",
                "value": 557,
                "category": "Energy consumpion"
            },
            {
                "year": "1954",
                "value": 1116,
                "category": "Thermal comfort"
            },
            {
                "year": "1954",
                "value": 138,
                "category": "Savings"
            },
            {
                "year": "1954",
                "value": 27,
                "category": "Energy price"
            },
            {
                "year": "1954",
                "value": 27,
                "category": "Gas flarinl"
            },
            {
                "year": "1955",
                "value": 625,
                "category": "Energy consumpion"
            },
            {
                "year": "1955",
                "value": 1208,
                "category": "Thermal comfort"
            },
            {
                "year": "1955",
                "value": 150,
                "category": "Savings"
            },
            {
                "year": "1955",
                "value": 30,
                "category": "Energy price"
            },
            {
                "year": "1955",
                "value": 31,
                "category": "Gas flarinl"
            },
            {
                "year": "1956",
                "value": 679,
                "category": "Energy consumpion"
            },
            {
                "year": "1956",
                "value": 1273,
                "category": "Thermal comfort"
            },
            {
                "year": "1956",
                "value": 161,
                "category": "Savings"
            },
            {
                "year": "1956",
                "value": 32,
                "category": "Energy price"
            },
            {
                "year": "1956",
                "value": 32,
                "category": "Gas flarinl"
            },
            {
                "year": "1957",
                "value": 714,
                "category": "Energy consumpion"
            },
            {
                "year": "1957",
                "value": 1309,
                "category": "Thermal comfort"
            },
            {
                "year": "1957",
                "value": 178,
                "category": "Savings"
            },
            {
                "year": "1957",
                "value": 34,
                "category": "Energy price"
            },
            {
                "year": "1957",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "1958",
                "value": 731,
                "category": "Energy consumpion"
            },
            {
                "year": "1958",
                "value": 1336,
                "category": "Thermal comfort"
            },
            {
                "year": "1958",
                "value": 192,
                "category": "Savings"
            },
            {
                "year": "1958",
                "value": 36,
                "category": "Energy price"
            },
            {
                "year": "1958",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "1959",
                "value": 789,
                "category": "Energy consumpion"
            },
            {
                "year": "1959",
                "value": 1382,
                "category": "Thermal comfort"
            },
            {
                "year": "1959",
                "value": 206,
                "category": "Savings"
            },
            {
                "year": "1959",
                "value": 40,
                "category": "Energy price"
            },
            {
                "year": "1959",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1960",
                "value": 849,
                "category": "Energy consumpion"
            },
            {
                "year": "1960",
                "value": 1410,
                "category": "Thermal comfort"
            },
            {
                "year": "1960",
                "value": 227,
                "category": "Savings"
            },
            {
                "year": "1960",
                "value": 43,
                "category": "Energy price"
            },
            {
                "year": "1960",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1961",
                "value": 904,
                "category": "Energy consumpion"
            },
            {
                "year": "1961",
                "value": 1349,
                "category": "Thermal comfort"
            },
            {
                "year": "1961",
                "value": 240,
                "category": "Savings"
            },
            {
                "year": "1961",
                "value": 45,
                "category": "Energy price"
            },
            {
                "year": "1961",
                "value": 42,
                "category": "Gas flarinl"
            },
            {
                "year": "1962",
                "value": 980,
                "category": "Energy consumpion"
            },
            {
                "year": "1962",
                "value": 1351,
                "category": "Thermal comfort"
            },
            {
                "year": "1962",
                "value": 263,
                "category": "Savings"
            },
            {
                "year": "1962",
                "value": 49,
                "category": "Energy price"
            },
            {
                "year": "1962",
                "value": 44,
                "category": "Gas flarinl"
            },
            {
                "year": "1963",
                "value": 1052,
                "category": "Energy consumpion"
            },
            {
                "year": "1963",
                "value": 1396,
                "category": "Thermal comfort"
            },
            {
                "year": "1963",
                "value": 286,
                "category": "Savings"
            },
            {
                "year": "1963",
                "value": 51,
                "category": "Energy price"
            },
            {
                "year": "1963",
                "value": 47,
                "category": "Gas flarinl"
            },
            {
                "year": "1964",
                "value": 1137,
                "category": "Energy consumpion"
            },
            {
                "year": "1964",
                "value": 1435,
                "category": "Thermal comfort"
            },
            {
                "year": "1964",
                "value": 316,
                "category": "Savings"
            },
            {
                "year": "1964",
                "value": 57,
                "category": "Energy price"
            },
            {
                "year": "1964",
                "value": 51,
                "category": "Gas flarinl"
            },
            {
                "year": "1965",
                "value": 1219,
                "category": "Energy consumpion"
            },
            {
                "year": "1965",
                "value": 1460,
                "category": "Thermal comfort"
            },
            {
                "year": "1965",
                "value": 337,
                "category": "Savings"
            },
            {
                "year": "1965",
                "value": 59,
                "category": "Energy price"
            },
            {
                "year": "1965",
                "value": 55,
                "category": "Gas flarinl"
            },
            {
                "year": "1966",
                "value": 1323,
                "category": "Energy consumpion"
            },
            {
                "year": "1966",
                "value": 1478,
                "category": "Thermal comfort"
            },
            {
                "year": "1966",
                "value": 364,
                "category": "Savings"
            },
            {
                "year": "1966",
                "value": 63,
                "category": "Energy price"
            },
            {
                "year": "1966",
                "value": 60,
                "category": "Gas flarinl"
            },
            {
                "year": "1967",
                "value": 1423,
                "category": "Energy consumpion"
            },
            {
                "year": "1967",
                "value": 1448,
                "category": "Thermal comfort"
            },
            {
                "year": "1967",
                "value": 392,
                "category": "Savings"
            },
            {
                "year": "1967",
                "value": 65,
                "category": "Energy price"
            },
            {
                "year": "1967",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "1968",
                "value": 1551,
                "category": "Energy consumpion"
            },
            {
                "year": "1968",
                "value": 1448,
                "category": "Thermal comfort"
            },
            {
                "year": "1968",
                "value": 424,
                "category": "Savings"
            },
            {
                "year": "1968",
                "value": 70,
                "category": "Energy price"
            },
            {
                "year": "1968",
                "value": 73,
                "category": "Gas flarinl"
            },
            {
                "year": "1969",
                "value": 1673,
                "category": "Energy consumpion"
            },
            {
                "year": "1969",
                "value": 1486,
                "category": "Thermal comfort"
            },
            {
                "year": "1969",
                "value": 467,
                "category": "Savings"
            },
            {
                "year": "1969",
                "value": 74,
                "category": "Energy price"
            },
            {
                "year": "1969",
                "value": 80,
                "category": "Gas flarinl"
            },
            {
                "year": "1970",
                "value": 1839,
                "category": "Energy consumpion"
            },
            {
                "year": "1970",
                "value": 1556,
                "category": "Thermal comfort"
            },
            {
                "year": "1970",
                "value": 493,
                "category": "Savings"
            },
            {
                "year": "1970",
                "value": 78,
                "category": "Energy price"
            },
            {
                "year": "1970",
                "value": 87,
                "category": "Gas flarinl"
            },
            {
                "year": "1971",
                "value": 1947,
                "category": "Energy consumpion"
            },
            {
                "year": "1971",
                "value": 1559,
                "category": "Thermal comfort"
            },
            {
                "year": "1971",
                "value": 530,
                "category": "Savings"
            },
            {
                "year": "1971",
                "value": 84,
                "category": "Energy price"
            },
            {
                "year": "1971",
                "value": 88,
                "category": "Gas flarinl"
            },
            {
                "year": "1972",
                "value": 2057,
                "category": "Energy consumpion"
            },
            {
                "year": "1972",
                "value": 1576,
                "category": "Thermal comfort"
            },
            {
                "year": "1972",
                "value": 560,
                "category": "Savings"
            },
            {
                "year": "1972",
                "value": 89,
                "category": "Energy price"
            },
            {
                "year": "1972",
                "value": 95,
                "category": "Gas flarinl"
            },
            {
                "year": "1973",
                "value": 2241,
                "category": "Energy consumpion"
            },
            {
                "year": "1973",
                "value": 1581,
                "category": "Thermal comfort"
            },
            {
                "year": "1973",
                "value": 588,
                "category": "Savings"
            },
            {
                "year": "1973",
                "value": 95,
                "category": "Energy price"
            },
            {
                "year": "1973",
                "value": 110,
                "category": "Gas flarinl"
            },
            {
                "year": "1974",
                "value": 2245,
                "category": "Energy consumpion"
            },
            {
                "year": "1974",
                "value": 1579,
                "category": "Thermal comfort"
            },
            {
                "year": "1974",
                "value": 597,
                "category": "Savings"
            },
            {
                "year": "1974",
                "value": 96,
                "category": "Energy price"
            },
            {
                "year": "1974",
                "value": 107,
                "category": "Gas flarinl"
            },
            {
                "year": "1975",
                "value": 2132,
                "category": "Energy consumpion"
            },
            {
                "year": "1975",
                "value": 1673,
                "category": "Thermal comfort"
            },
            {
                "year": "1975",
                "value": 604,
                "category": "Savings"
            },
            {
                "year": "1975",
                "value": 95,
                "category": "Energy price"
            },
            {
                "year": "1975",
                "value": 92,
                "category": "Gas flarinl"
            },
            {
                "year": "1976",
                "value": 2314,
                "category": "Energy consumpion"
            },
            {
                "year": "1976",
                "value": 1710,
                "category": "Thermal comfort"
            },
            {
                "year": "1976",
                "value": 630,
                "category": "Savings"
            },
            {
                "year": "1976",
                "value": 103,
                "category": "Energy price"
            },
            {
                "year": "1976",
                "value": 108,
                "category": "Gas flarinl"
            },
            {
                "year": "1977",
                "value": 2398,
                "category": "Energy consumpion"
            },
            {
                "year": "1977",
                "value": 1756,
                "category": "Thermal comfort"
            },
            {
                "year": "1977",
                "value": 650,
                "category": "Savings"
            },
            {
                "year": "1977",
                "value": 108,
                "category": "Energy price"
            },
            {
                "year": "1977",
                "value": 104,
                "category": "Gas flarinl"
            },
            {
                "year": "1978",
                "value": 2392,
                "category": "Energy consumpion"
            },
            {
                "year": "1978",
                "value": 1780,
                "category": "Thermal comfort"
            },
            {
                "year": "1978",
                "value": 680,
                "category": "Savings"
            },
            {
                "year": "1978",
                "value": 116,
                "category": "Energy price"
            },
            {
                "year": "1978",
                "value": 106,
                "category": "Gas flarinl"
            },
            {
                "year": "1979",
                "value": 2544,
                "category": "Energy consumpion"
            },
            {
                "year": "1979",
                "value": 1875,
                "category": "Thermal comfort"
            },
            {
                "year": "1979",
                "value": 721,
                "category": "Savings"
            },
            {
                "year": "1979",
                "value": 119,
                "category": "Energy price"
            },
            {
                "year": "1979",
                "value": 98,
                "category": "Gas flarinl"
            },
            {
                "year": "1980",
                "value": 2422,
                "category": "Energy consumpion"
            },
            {
                "year": "1980",
                "value": 1935,
                "category": "Thermal comfort"
            },
            {
                "year": "1980",
                "value": 737,
                "category": "Savings"
            },
            {
                "year": "1980",
                "value": 120,
                "category": "Energy price"
            },
            {
                "year": "1980",
                "value": 86,
                "category": "Gas flarinl"
            },
            {
                "year": "1981",
                "value": 2289,
                "category": "Energy consumpion"
            },
            {
                "year": "1981",
                "value": 1908,
                "category": "Thermal comfort"
            },
            {
                "year": "1981",
                "value": 755,
                "category": "Savings"
            },
            {
                "year": "1981",
                "value": 121,
                "category": "Energy price"
            },
            {
                "year": "1981",
                "value": 65,
                "category": "Gas flarinl"
            },
            {
                "year": "1982",
                "value": 2196,
                "category": "Energy consumpion"
            },
            {
                "year": "1982",
                "value": 1976,
                "category": "Thermal comfort"
            },
            {
                "year": "1982",
                "value": 738,
                "category": "Savings"
            },
            {
                "year": "1982",
                "value": 121,
                "category": "Energy price"
            },
            {
                "year": "1982",
                "value": 64,
                "category": "Gas flarinl"
            },
            {
                "year": "1983",
                "value": 2176,
                "category": "Energy consumpion"
            },
            {
                "year": "1983",
                "value": 1977,
                "category": "Thermal comfort"
            },
            {
                "year": "1983",
                "value": 739,
                "category": "Savings"
            },
            {
                "year": "1983",
                "value": 125,
                "category": "Energy price"
            },
            {
                "year": "1983",
                "value": 58,
                "category": "Gas flarinl"
            },
            {
                "year": "1984",
                "value": 2199,
                "category": "Energy consumpion"
            },
            {
                "year": "1984",
                "value": 2074,
                "category": "Thermal comfort"
            },
            {
                "year": "1984",
                "value": 807,
                "category": "Savings"
            },
            {
                "year": "1984",
                "value": 128,
                "category": "Energy price"
            },
            {
                "year": "1984",
                "value": 51,
                "category": "Gas flarinl"
            },
            {
                "year": "1985",
                "value": 2186,
                "category": "Energy consumpion"
            },
            {
                "year": "1985",
                "value": 2216,
                "category": "Thermal comfort"
            },
            {
                "year": "1985",
                "value": 835,
                "category": "Savings"
            },
            {
                "year": "1985",
                "value": 131,
                "category": "Energy price"
            },
            {
                "year": "1985",
                "value": 49,
                "category": "Gas flarinl"
            },
            {
                "year": "1986",
                "value": 2293,
                "category": "Energy consumpion"
            },
            {
                "year": "1986",
                "value": 2277,
                "category": "Thermal comfort"
            },
            {
                "year": "1986",
                "value": 830,
                "category": "Savings"
            },
            {
                "year": "1986",
                "value": 137,
                "category": "Energy price"
            },
            {
                "year": "1986",
                "value": 46,
                "category": "Gas flarinl"
            },
            {
                "year": "1987",
                "value": 2306,
                "category": "Energy consumpion"
            },
            {
                "year": "1987",
                "value": 2339,
                "category": "Thermal comfort"
            },
            {
                "year": "1987",
                "value": 892,
                "category": "Savings"
            },
            {
                "year": "1987",
                "value": 143,
                "category": "Energy price"
            },
            {
                "year": "1987",
                "value": 44,
                "category": "Gas flarinl"
            },
            {
                "year": "1988",
                "value": 2412,
                "category": "Energy consumpion"
            },
            {
                "year": "1988",
                "value": 2387,
                "category": "Thermal comfort"
            },
            {
                "year": "1988",
                "value": 935,
                "category": "Savings"
            },
            {
                "year": "1988",
                "value": 152,
                "category": "Energy price"
            },
            {
                "year": "1988",
                "value": 50,
                "category": "Gas flarinl"
            },
            {
                "year": "1989",
                "value": 2459,
                "category": "Energy consumpion"
            },
            {
                "year": "1989",
                "value": 2428,
                "category": "Thermal comfort"
            },
            {
                "year": "1989",
                "value": 982,
                "category": "Savings"
            },
            {
                "year": "1989",
                "value": 156,
                "category": "Energy price"
            },
            {
                "year": "1989",
                "value": 41,
                "category": "Gas flarinl"
            },
            {
                "year": "1990",
                "value": 2492,
                "category": "Energy consumpion"
            },
            {
                "year": "1990",
                "value": 2359,
                "category": "Thermal comfort"
            },
            {
                "year": "1990",
                "value": 1026,
                "category": "Savings"
            },
            {
                "year": "1990",
                "value": 157,
                "category": "Energy price"
            },
            {
                "year": "1990",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1991",
                "value": 2601,
                "category": "Energy consumpion"
            },
            {
                "year": "1991",
                "value": 2284,
                "category": "Thermal comfort"
            },
            {
                "year": "1991",
                "value": 1051,
                "category": "Savings"
            },
            {
                "year": "1991",
                "value": 161,
                "category": "Energy price"
            },
            {
                "year": "1991",
                "value": 45,
                "category": "Gas flarinl"
            },
            {
                "year": "1992",
                "value": 2499,
                "category": "Energy consumpion"
            },
            {
                "year": "1992",
                "value": 2290,
                "category": "Thermal comfort"
            },
            {
                "year": "1992",
                "value": 1085,
                "category": "Savings"
            },
            {
                "year": "1992",
                "value": 167,
                "category": "Energy price"
            },
            {
                "year": "1992",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1993",
                "value": 2515,
                "category": "Energy consumpion"
            },
            {
                "year": "1993",
                "value": 2225,
                "category": "Thermal comfort"
            },
            {
                "year": "1993",
                "value": 1117,
                "category": "Savings"
            },
            {
                "year": "1993",
                "value": 176,
                "category": "Energy price"
            },
            {
                "year": "1993",
                "value": 37,
                "category": "Gas flarinl"
            },
            {
                "year": "1994",
                "value": 2539,
                "category": "Energy consumpion"
            },
            {
                "year": "1994",
                "value": 2278,
                "category": "Thermal comfort"
            },
            {
                "year": "1994",
                "value": 1133,
                "category": "Savings"
            },
            {
                "year": "1994",
                "value": 186,
                "category": "Energy price"
            },
            {
                "year": "1994",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1995",
                "value": 2560,
                "category": "Energy consumpion"
            },
            {
                "year": "1995",
                "value": 2359,
                "category": "Thermal comfort"
            },
            {
                "year": "1995",
                "value": 1151,
                "category": "Savings"
            },
            {
                "year": "1995",
                "value": 197,
                "category": "Energy price"
            },
            {
                "year": "1995",
                "value": 39,
                "category": "Gas flarinl"
            },
            {
                "year": "1996",
                "value": 2626,
                "category": "Energy consumpion"
            },
            {
                "year": "1996",
                "value": 2382,
                "category": "Thermal comfort"
            },
            {
                "year": "1996",
                "value": 1198,
                "category": "Savings"
            },
            {
                "year": "1996",
                "value": 203,
                "category": "Energy price"
            },
            {
                "year": "1996",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1997",
                "value": 2701,
                "category": "Energy consumpion"
            },
            {
                "year": "1997",
                "value": 2409,
                "category": "Thermal comfort"
            },
            {
                "year": "1997",
                "value": 1197,
                "category": "Savings"
            },
            {
                "year": "1997",
                "value": 209,
                "category": "Energy price"
            },
            {
                "year": "1997",
                "value": 40,
                "category": "Gas flarinl"
            },
            {
                "year": "1998",
                "value": 2763,
                "category": "Energy consumpion"
            },
            {
                "year": "1998",
                "value": 2343,
                "category": "Thermal comfort"
            },
            {
                "year": "1998",
                "value": 1224,
                "category": "Savings"
            },
            {
                "year": "1998",
                "value": 209,
                "category": "Energy price"
            },
            {
                "year": "1998",
                "value": 36,
                "category": "Gas flarinl"
            },
            {
                "year": "1999",
                "value": 2741,
                "category": "Energy consumpion"
            },
            {
                "year": "1999",
                "value": 2310,
                "category": "Thermal comfort"
            },
            {
                "year": "1999",
                "value": 1258,
                "category": "Savings"
            },
            {
                "year": "1999",
                "value": 217,
                "category": "Energy price"
            },
            {
                "year": "1999",
                "value": 35,
                "category": "Gas flarinl"
            },
            {
                "year": "2000",
                "value": 2845,
                "category": "Energy consumpion"
            },
            {
                "year": "2000",
                "value": 2327,
                "category": "Thermal comfort"
            },
            {
                "year": "2000",
                "value": 1289,
                "category": "Savings"
            },
            {
                "year": "2000",
                "value": 226,
                "category": "Energy price"
            },
            {
                "year": "2000",
                "value": 46,
                "category": "Gas flarinl"
            },
            {
                "year": "2001",
                "value": 2848,
                "category": "Energy consumpion"
            },
            {
                "year": "2001",
                "value": 2445,
                "category": "Thermal comfort"
            },
            {
                "year": "2001",
                "value": 1316,
                "category": "Savings"
            },
            {
                "year": "2001",
                "value": 237,
                "category": "Energy price"
            },
            {
                "year": "2001",
                "value": 47,
                "category": "Gas flarinl"
            },
            {
                "year": "2002",
                "value": 2832,
                "category": "Energy consumpion"
            },
            {
                "year": "2002",
                "value": 2518,
                "category": "Thermal comfort"
            },
            {
                "year": "2002",
                "value": 1342,
                "category": "Savings"
            },
            {
                "year": "2002",
                "value": 252,
                "category": "Energy price"
            },
            {
                "year": "2002",
                "value": 49,
                "category": "Gas flarinl"
            },
            {
                "year": "2003",
                "value": 2958,
                "category": "Energy consumpion"
            },
            {
                "year": "2003",
                "value": 2695,
                "category": "Thermal comfort"
            },
            {
                "year": "2003",
                "value": 1397,
                "category": "Savings"
            },
            {
                "year": "2003",
                "value": 276,
                "category": "Energy price"
            },
            {
                "year": "2003",
                "value": 48,
                "category": "Gas flarinl"
            },
            {
                "year": "2004",
                "value": 3043,
                "category": "Energy consumpion"
            },
            {
                "year": "2004",
                "value": 2906,
                "category": "Thermal comfort"
            },
            {
                "year": "2004",
                "value": 1443,
                "category": "Savings"
            },
            {
                "year": "2004",
                "value": 298,
                "category": "Energy price"
            },
            {
                "year": "2004",
                "value": 54,
                "category": "Gas flarinl"
            },
            {
                "year": "2005",
                "value": 3068,
                "category": "Energy consumpion"
            },
            {
                "year": "2005",
                "value": 3108,
                "category": "Thermal comfort"
            },
            {
                "year": "2005",
                "value": 1485,
                "category": "Savings"
            },
            {
                "year": "2005",
                "value": 320,
                "category": "Energy price"
            },
            {
                "year": "2005",
                "value": 60,
                "category": "Gas flarinl"
            },
            {
                "year": "2006",
                "value": 3091,
                "category": "Energy consumpion"
            },
            {
                "year": "2006",
                "value": 3293,
                "category": "Thermal comfort"
            },
            {
                "year": "2006",
                "value": 1534,
                "category": "Savings"
            },
            {
                "year": "2006",
                "value": 356,
                "category": "Energy price"
            },
            {
                "year": "2006",
                "value": 62,
                "category": "Gas flarinl"
            },
            {
                "year": "2007",
                "value": 3071,
                "category": "Energy consumpion"
            },
            {
                "year": "2007",
                "value": 3422,
                "category": "Thermal comfort"
            },
            {
                "year": "2007",
                "value": 1562,
                "category": "Savings"
            },
            {
                "year": "2007",
                "value": 382,
                "category": "Energy price"
            },
            {
                "year": "2007",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "2008",
                "value": 3103,
                "category": "Energy consumpion"
            },
            {
                "year": "2008",
                "value": 3587,
                "category": "Thermal comfort"
            },
            {
                "year": "2008",
                "value": 1630,
                "category": "Savings"
            },
            {
                "year": "2008",
                "value": 388,
                "category": "Energy price"
            },
            {
                "year": "2008",
                "value": 69,
                "category": "Gas flarinl"
            },
            {
                "year": "2009",
                "value": 3042,
                "category": "Energy consumpion"
            },
            {
                "year": "2009",
                "value": 3590,
                "category": "Thermal comfort"
            },
            {
                "year": "2009",
                "value": 1584,
                "category": "Savings"
            },
            {
                "year": "2009",
                "value": 415,
                "category": "Energy price"
            },
            {
                "year": "2009",
                "value": 66,
                "category": "Gas flarinl"
            },
            {
                "year": "2010",
                "value": 3107,
                "category": "Energy consumpion"
            },
            {
                "year": "2010",
                "value": 3812,
                "category": "Thermal comfort"
            },
            {
                "year": "2010",
                "value": 1696,
                "category": "Savings"
            },
            {
                "year": "2010",
                "value": 446,
                "category": "Energy price"
            },
            {
                "year": "2010",
                "value": 67,
                "category": "Gas flarinl"
            },
            {
                "year": "2011",
                "value": 3134,
                "category": "Energy consumpion"
            },
            {
                "year": "2011",
                "value": 4055,
                "category": "Thermal comfort"
            },
            {
                "year": "2011",
                "value": 1756,
                "category": "Savings"
            },
            {
                "year": "2011",
                "value": 494,
                "category": "Energy price"
            },
            {
                "year": "2011",
                "value": 64,
                "category": "Gas flarinl"
            },
            {
                "year": "2012",
                "value": 3200,
                "category": "Energy consumpion"
            },
            {
                "year": "2012",
                "value": 4106,
                "category": "Thermal comfort"
            },
            {
                "year": "2012",
                "value": 1783,
                "category": "Savings"
            },
            {
                "year": "2012",
                "value": 519,
                "category": "Energy price"
            },
            {
                "year": "2012",
                "value": 65,
                "category": "Gas flarinl"
            },
            {
                "year": "2013",
                "value": 3220,
                "category": "Energy consumpion"
            },
            {
                "year": "2013",
                "value": 4126,
                "category": "Thermal comfort"
            },
            {
                "year": "2013",
                "value": 1806,
                "category": "Savings"
            },
            {
                "year": "2013",
                "value": 554,
                "category": "Energy price"
            },
            {
                "year": "2013",
                "value": 68,
                "category": "Gas flarinl"
            },
            {
                "year": "2014",
                "value": 3280,
                "category": "Energy consumpion"
            },
            {
                "year": "2014",
                "value": 4117,
                "category": "Thermal comfort"
            },
            {
                "year": "2014",
                "value": 1823,
                "category": "Savings"
            },
            {
                "year": "2014",
                "value": 568,
                "category": "Energy price"
            },
            {
                "year": "2014",
                "value": 68,
                "category": "Gas flarinl"
            }
        ];
        if (this.state.is_login) {
            return (
                <div className="main_panel">
                    <div className="container_main">
                        <div style={{}}>
                            <div className="container_c6">
                                <div class="row">
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-10px" }} className="remove-part d-none p-0 pt-0 pr-1">
                                        <FontAwesomeIcon onClick={(event) => this.openModal3(0)} style={{ "color": "gray", "cursor": "pointer", "width": "20px", "height": "20px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => this.removeModal3(0)} style={{ "color": "gray", "cursor": "pointer", "width": "20px", "height": "20px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div class="col-8">
                                        <div class="numbers">
                                            <p class="text-sm mb-0 font-weight-bold">Number of sensors</p>
                                            <h5 class="font-weight-bolder mb-0">
                                                {this.state.sensor_number}
                                                <div className={this.state.loading0}>
                                                    <Spinner2 customText="Loading" />
                                                </div>
                                                <span class="text-success text-sm font-weight-bolder"></span>
                                            </h5>
                                            <div className="serials d-none" style={{ position: "relative" }}>
                                                <div className="serials_detail" style={{ position: "absolute", background: "white", "z-index": "900", "width": "350px", "border": "1px solid #ddd", "border-radius": "12px", "padding": "10px" }}>
                                                    <div className="serials_detail1">
                                                        {this.list_sensors()}
                                                    </div>
                                                    <div className="serials_detail3" style={{ "text-align": "left" }}>
                                                        <FontAwesomeIcon onClick={(event) => this.show_sensors1()} icon={faArrowLeft} className="arrow ml-3" style={{ "font-weight": "bold", "color": "black", "cursor": "pointer", "font-size": "24px" }} />
                                                    </div>
                                                    <div className="serials_detail2">

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-4 text-end">
                                        <div class="icon icon-shape bg-gr-primary shadow text-center border-radius-md" onClick={(event) => this.show_sensors()}>
                                            <FontAwesomeIcon onClick={(event) => this.show_sensors1()} icon={faInfoCircle} className="arrow2" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="container_c6">
                                <div class="row">
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-10px" }} className="remove-part d-none p-0 pt-0 pr-1">
                                        <FontAwesomeIcon onClick={(event) => this.openModal3(1)} style={{ "color": "gray", "cursor": "pointer", "width": "20px", "height": "20px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => this.removeModal3(1)} style={{ "color": "gray", "cursor": "pointer", "width": "20px", "height": "20px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div class="col-8">
                                        <div class="numbers">
                                            <p class="text-sm mb-0 font-weight-bold">Number of locations</p>
                                            <h5 class="font-weight-bolder mb-0">
                                                {this.state.sensor_location}
                                                <div className={this.state.loading1}>
                                                    <Spinner2 customText="Loading" />
                                                </div>
                                                <span class="text-success text-sm font-weight-bolder"></span>
                                            </h5>

                                        </div>
                                    </div>
                                    <div class="col-4 text-end">
                                        <div class="icon icon-shape bg-gr-primary shadow text-center border-radius-md">
                                            <FontAwesomeIcon onClick={(event) => this.show_sensors1()} icon={faInfoCircle} className="arrow2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container_c6">
                                <div class="row">
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-10px" }} className="remove-part d-none p-0 pt-0 pr-1">
                                        <FontAwesomeIcon onClick={(event) => this.openModal3(2)} style={{ "color": "gray", "cursor": "pointer", "width": "20px", "height": "20px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => this.removeModal3(2)} style={{ "color": "gray", "cursor": "pointer", "width": "20px", "height": "20px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div class="col-8">
                                        <div class="numbers">
                                            <p class="text-sm mb-0  font-weight-bold">Number of sensors type</p>
                                            <h5 class="font-weight-bolder mb-0">
                                                {this.state.sensor_type_number}
                                                <div className={this.state.loading2}>
                                                    <Spinner2 customText="Loading" />
                                                </div>
                                                <span class="text-success text-sm font-weight-bolder"></span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div class="col-4 text-end">
                                        <div class="icon icon-shape bg-gr-primary shadow text-center border-radius-md">
                                            <FontAwesomeIcon onClick={(event) => this.show_sensors1()} icon={faInfoCircle} className="arrow2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {this.listTopBoxes()}
                        </div>
                        <div className="newline"></div>
                        <div className="container_main mt-3 pb-5">
                            <div className="container_c0 text-center remove-part d-none" style={{ "min-height": "15vh" }}>
                                <FontAwesomeIcon onClick={(event) => this.openModal3()} icon={faPlusSquare} className="arrow2" style={{ "color": "black", "height": "100px", width: "100px" }} />
                            </div>
                        </div>

                    </div>
                    <div className="container_main d-none">
                        <div className="container_c2">
                            <ReactWeather
                                forecast="today"
                                apikey="ce826510895598fe6876888d108bdc24"
                                type="city"
                                city="Munich"
                            />
                        </div>
                        <div className="container_c3">
                            <Gauge {...config1} />
                        </div>
                        <div className="container_c2"><Line {...config} /> </div>
                    </div>

                    <div>
                        {this.listBoxes()}
                    </div>

                    <div id="newRows" >
                        {this.listBoxesNew()}
                    </div>
                    <div className="container_main mt-3 pb-5 remove-part d-none">
                        <div className="container_c0 text-center" style={{ "min-height": "15vh" }}>
                            <FontAwesomeIcon onClick={(event) => this.addBoxes()} icon={faPlusSquare} className="arrow2" style={{ "color": "black", "height": "100px", width: "100px" }} />
                        </div>
                    </div>

                    <div>

                        <Modal
                            isOpen={this.state.setIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <div style={{ "text-align": "right", "min-width": "300px" }} className="mb-4">
                                <button onClick={(event) => this.closeModal()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                            </div>
                            <div className="m-2">
                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Number Of Boxes</span>
                                <input id="nboxes" value="1" type="text" className="mr-4" style={{ border: "1px solid black", "border-radius": "5px" }} size="4" />
                                <button style={{ "border-radius": "7px" }} onClick={(event) => this.addBoxes()} >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>

                            </div>
                        </Modal>
                    </div>
                    <div>

                        <Modal
                            isOpen={this.state.setIsOpen2}
                            onAfterOpen={this.afterOpenModal2}
                            onRequestClose={this.closeModal2}
                            style={customStyles2}
                            contentLabel="Example Modal"
                        >
                            <div style={{ "text-align": "right", "min-width": "400px", "border-bottom": "1px solid gray" }} className="mb-2 pb-2">
                                <button onClick={(event) => this.closeModal2()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                            </div>
                            <div className="m-2">
                                <div className="d-none">
                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Title</span>
                                    <div className="newline mt-1"></div>
                                    <input id="box_title" type="text" className="ml-1 mr-4" placeholder="title" style={{ border: "1px solid black", width: "180px", "border-radius": "5px" }} size="4" />
                                    <div className="newline mt-3"></div>
                                </div>
                                <div id="level0" className="mb-3">

                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Element Type</span>
                                    <div className="newline mt-1"></div>

                                    <select className="ml-1" id="box_function" onChange={(event) => this.chooseOperation(event)} value={this.state.box_function} style={{ width: "180px", "border-radius": "5px" }}>
                                        <option value="-1">Choose Element type</option>
                                        <option value="0">Chart</option>
                                        <option value="1">Other</option>
                                    </select>

                                </div>
                                <div id="level11" className="d-none mb-3">
                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Location</span>
                                    <div className="newline mt-1"></div>
                                    <select className="ml-1" id="location_s" style={{ width: "180px", "border-radius": "5px" }}>
                                        <option value="">Choose location</option>
                                        {this.renderLocationOptions()}
                                    </select>
                                </div>

                                <div id="level1" className="d-none mb-3">

                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Chart Type</span>
                                    <div className="newline mt-1"></div>

                                    <select className="ml-1" id="box_chart" onChange={(event) => this.chooseOperation_chart(event)} value={this.state.box_chart} style={{ width: "180px", "border-radius": "5px" }}>
                                        <option value="0">Column Chart</option>
                                        <option value="1">Line   Chart</option>
                                        <option value="2">Bar   Chart</option>
                                    </select>

                                </div>


                                <div id="level2" className="d-none mb-3">

                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Parametr Type</span>
                                    <div className="newline mt-1"></div>
                                    <select className="ml-1" id="box_parametr" onChange={(event) => this.chooseOperation_parametr(event)} value={this.state.box_parametr} style={{ width: "180px", "border-radius": "5px" }}>
                                        <option value="0">Temprature</option>
                                        <option value="1">Pressure</option>
                                        <option value="2">Humidity</option>
                                        <option value="3">Mass (PM)</option>
                                        <option value="4">Voltage</option>
                                    </select>

                                </div>

                                <div id="level3" className="d-none mb-3">

                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Value Type</span>
                                    <div className="newline mt-1"></div>
                                    <select className="ml-1" id="box_value_type" onChange={(event) => this.chooseOperation_value_type(event)} value={this.state.box_value_type} style={{ width: "180px", "border-radius": "5px" }} multiple>
                                        <option value="0">Average</option>
                                        <option value="1">Max</option>
                                        <option value="2">Min</option>
                                    </select>

                                </div>


                                <div id="level4" className="d-none mb-4">

                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Type</span>
                                    <div className="newline mt-1"></div>

                                    <select className="ml-1" id="box_other" value={this.state.box_other} onChange={(event) => this.chooseOperation_other(event)} style={{ width: "180px", "border-radius": "5px" }}>
                                        <option value="0">Building Layout</option>
                                        <option value="1">Battery Percentage</option>
                                        <option value="2">Reward Function</option>
                                    </select>

                                </div>



                                <div className="newline mt-4"></div>
                                <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                                    <button style={{ "padding": "10px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.addItem()} >
                                        Add
                                    </button>
                                </div>

                            </div>

                        </Modal>
                    </div>

                    <div>

                        <Modal
                            isOpen={this.state.setIsOpen3}
                            onAfterOpen={this.afterOpenModal3}
                            onRequestClose={this.closeModal3}
                            style={customStyles2}
                            contentLabel="Example Modal"
                        >
                            <div style={{ "text-align": "right", "min-width": "400px", "border-bottom": "1px solid gray" }} className="mb-2 pb-2">
                                <button onClick={(event) => this.closeModal3()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                            </div>
                            <div className="m-2">

                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Title</span>
                                <div className="newline mt-1"></div>
                                <input id="box_title_2" type="text" className="ml-1 mr-4" placeholder="title" style={{ border: "1px solid black", width: "180px", "border-radius": "5px" }} size="4" />
                                <div className="newline mt-3"></div>


                                <div id="level2_0" className="mb-3">

                                    <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Parametr Type</span>
                                    <div className="newline mt-1"></div>
                                    <select className="ml-1" id="box_parametr_2" style={{ width: "180px", "border-radius": "5px" }}>
                                        <option value="0">Cell temperature</option>
                                        <option value="1">Air temperature</option>
                                        <option value="2">Pressure</option>
                                        <option value="3">Humidity</option>
                                        <option value="4">Voltage</option>
                                        <option value="5">PM 1 (MASS)</option>
                                        <option value="6">PM 2.5 (MASS)</option>
                                        <option value="7">PM 4 (MASS)</option>
                                        <option value="8">PM 10 (MASS)</option>
                                        <option value="9">CO2</option>
                                        <option value="10">TVOC</option>
                                    </select>

                                </div>



                                <div className="newline mt-4"></div>
                                <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                                    <button style={{ "padding": "10px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.addItemTop()} >
                                        Add
                                    </button>
                                </div>

                            </div>

                        </Modal>
                    </div>

                    <input type="hidden" id="row" />
                    <input type="hidden" id="col" />
                    <input type="hidden" id="boxes" />
                    <input type="hidden" id="boxes_top" />
                    <input type="hidden" id="edit" />
                </div>
            );
        }
    }
}




export default Home;