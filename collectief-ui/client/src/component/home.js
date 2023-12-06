
import React from "react";
//import ReactWeather from 'react-open-weather';
import { Column, G2 } from '@ant-design/plots';
import { deepMix } from '@antv/util';
import { Line } from '@ant-design/charts';
import { Gauge } from '@ant-design/plots';

import { Bar } from '@ant-design/plots';
import { Liquid } from '@ant-design/plots';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import homepic from './../assets/image/home.png';
import b1 from './../assets/image/b1.png';
import b2 from './../assets/image/b2.png';
import b3 from './../assets/image/b3.png';
import b4 from './../assets/image/b4.png';
import w1 from './../assets/image/w1.png';
import w2 from './../assets/image/w2.png';
import w3 from './../assets/image/w3.png';
import w4 from './../assets/image/w4.png';
import collectief_logo from './../assets/image/collectief_logo.jpg';
import collectief_logo4 from './../assets/image/collectief_logo5.png';
import Cookies from 'universal-cookie';
import { Area } from '@ant-design/plots';
import $, { parseJSON } from "jquery";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon,faClock, faCalendarAlt, faCalendarWeek, faLightbulb, faCalendar, faCalendarTimes, faAdd, faMinus, faGear, faTemperature0, faPowerOff, faArrowRight, faArrowLeft, faInfo, faCircleInfo, faInfoCircle, faPlusSquare, faClose, faCheck, faTrashAlt, faPlusCircle, faPlus, faEdit, faPenClip, faPen, faWindowClose, faSun, faWind, faLocation, faLocationPin, faMapLocationDot, faBuilding, faHome, faTemperature, faTemperatureHigh, faTint, faCloud, faCompressAlt, faSmog, faBatteryFull } from '@fortawesome/free-solid-svg-icons';
import Spinner2 from "./Spinner2"
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import GoogleMapReact from 'google-map-react';
//import { MapContainer, TileLayer } from 'react-leaflet';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


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
var context3;
var building_str = {
    "brigId": "22040368",
    "building_name": "Guy Ourisson Building (GOB)",
    "coordinates": [
        35.1414598117012,
        33.37997421169489
    ],
    "_comment": "the buildingId is set to 9 for all pilots in Cyprus, no difference detected on the collectief API",
    "buildingId": 9,
    "zones": {
        "B09Z01": {
            "title":"B09Z01",
            "sensors": {
                "sph_p": {
                    "22050333": [
                        "co2"
                    ],
                    "22040319": [
                        "t_rh_0"
                    ]
                }
            },
            "actuators": {},
            "indicators": {}
        },
        "B09Z02": {
            "title": "B09Z02",
            "sensors": {
                "sph_p": {
                    "22050334": [
                        "co2"
                    ],
                    "22040320": [
                        "t_rh_0"
                    ]
                }
            },
            "actuators": {},
            "indicators": {}
        },
        "B09Z03": {
            "title": "B09Z03",
            "sensors": {
                "sph_p": {
                    "22050335": [
                        "co2"
                    ],
                    "22040321": [
                        "t_rh_0"
                    ]
                }
            },
            "actuators": {},
            "indicators": {}
        },
        "B09Z04": {
            "title": "B09Z04",
            "sensors": {
                "sph_p": {
                    "22040322": [
                        "t_rh_0"
                    ]
                }
            },
            "actuators": {},
            "indicators": {}
        },
        "B09Z05": {
            "title": "B09Z05",
            "sensors": {
                "sph_p": {
                    "22040324": [
                        "t_rh_0"
                    ]
                }
            },
            "actuators": {},
            "indicators": {}
        },
        "B09Z06": {
            "title": "B09Z06",
            "sensors": {
                "sph_p": {
                    "22040325": [
                        "t_rh_0"
                    ]
                }
            },
            "actuators": {},
            "indicators": {}
        },
        "B09Z07": {
            "title": "B09Z07",
            "sensors": {
                "sph_p": {
                    "22040326": [
                        "t_rh_0"
                    ]
                }
            },
            "actuators": {},
            "indicators": {}
        }
    }
};
class Home extends React.Component {

    constructor(props) {

        super(props);
        context3 = this
        this.state = {
            items: [],
            data5_sensor_7d: [],
            data5_sensor_30d: [],
            data5_sensor_365d: [],
            sensor_location: [],
            loading: "text-center",
            modalIsOpen: false,
            setIsOpen: false,
            modalIsOpen2: false,
            setIsOpen2: false,
            modalIsOpen3: false,
            setIsOpen3: false,
            sensor_info: [],
            sensor_detail: [],
            top_boxes: [],
            top_boxes_all: [],
            box_function: -1,
            source_type: -1,
            box_chart: 0,
            box_other: 0,
            box_parametr: 0,
            dark:"dark",
            box_value_type: [0, 1],
            box_title: "",
            data5: [{ "year": "1300", "value": "100", "category": "0x" }],
            data6: [{ "year": "1300", "value": "100", "category": "0x" }],
            boxes: [],
            rows: [],
            sri_chart: [],
            sri_title: "SRI",
            sri_val: 0,
            source_type: -1,
            rows_new: [],
            boxes_new: [],
            box_titles: [],
            location_title: [],
            is_login: false,
            location_list: [],
            group_type: 1,
            sensor_location_cunt: "",
            top_boxes_stat: "remove-part p-0 pt-0 pr-1 d-none",
            user_type: -1,
            weather: {},
            forecastday: [],
            forecastnow: {},
            buildings: [],
            current_location_id: -1,
            total_building: 1,
            current_location_title: "---",
            country: "-",
            region: "-",
            name: "-",
            color: "#000"

        };
        this.setState({
            items: [],
            current_location_id: -1,
            modalIsOpen: false,
            setIsOpen: false,
            modalIsOpen2: false,
            setIsOpen2: false,
            modalIsOpen3: false,
            setIsOpen3: false,
            loading: "text-center",
            sensor_info: [],
            sensor_detail: [],
            top_boxes: [],
            top_boxes_all: [],
            rows_new: [],
            boxes_new: [],
            group_type: 1,
            building: [],
            data5: [{ "year": 0, "value": 0, "category": 0 }],
            data6: [{ "year": 0, "value": 0, "category": 0 }],
            temperature: `<div className={this.state.loading}>  
                  <Spinner3 customText="Loading"/>
                  </div>`
        });
        //this.temperature_per_hour();
        this.is_login()
        this.get_weather3(building_str.coordinates[0], building_str.coordinates[1])
        this.temperature_per_hour_sensor_48h()


    }
    jQuerycode = () => {
        $(".layout-box").click(function () {
            //alert("333")
            if (context3.state.group_type == 1) {
                context3.setState({
                    group_type: 0,
                    sensor_type_number: "-"
                })
                $(".header-layout-box").addClass("layout-box-bold")
                $(".layout-box").css("width", "20px")
                $(".layout-box").css("height", "20px")
            }
            else {
                context3.setState({
                    group_type: 1,
                    sensor_type_number: "-"
                })
                $(".header-layout-box").removeClass("layout-box-bold")
                $(".layout-box").css("width", "24px")
                $(".layout-box").css("height", "24px")
            }
        });
        $(".edit-box").click(function () {
            //alert("333")
            context3.setState({
                group_type: 0,
                sensor_type_number: "-"
            })
        });
        $(".save-box").click(function () {
            //alert("333")
            context3.setState({
                group_type: 1,
                sensor_type_number: "-"
            })
        });
    }
    componentDidMount() {
        this.getBuildings()
        this.jQuerycode()
        this.is_login()
        this.get_weather()
        this.get_sri()
        setTimeout(() => {
            this.sensors();
            this.get_measure_types();
            this.sensors_detail()
            this.sensors_type();
            this.locations();
            this.temperature();
            this.temperature_per_hour();
            this.temperature_per_hour_48h();
            this.temperature_per_hour_7d();
            this.temperature_per_hour_30d();
            this.temperature_per_hour_365d();
            this.temperature_per_hour_sensor();
            this.temperature_per_hour_sensor_48h();
            this.temperature_per_hour_sensor_7d();
            this.temperature_per_hour_sensor_30d();
            this.temperature_per_hour_sensor_365d();
            this.humidity_per_hour();
            this.humidity_per_hour_sensor();
            this.pm_per_hour();
            this.pm_per_hour_sensor();
            this.pressure_per_hour();
            this.pressure_per_hour_sensor();

            this.get_boxes();

            this.get_location();
            ;
        }, 100);
        setInterval(() => {
            //this.sensors();
            //this.sensors_type();
            //this.locations();
            this.temperature();
            this.temperature_per_hour();
            this.temperature_per_hour_48h();
            this.temperature_per_hour_7d();
            this.temperature_per_hour_30d();
            this.temperature_per_hour_365d();
            this.temperature_per_hour_sensor();
            this.humidity_per_hour();
            this.humidity_per_hour_sensor();
            this.temperature_per_hour_sensor_48h();
            this.temperature_per_hour_sensor_7d();
            this.temperature_per_hour_sensor_30d();
            this.temperature_per_hour_sensor_365d();
            this.pm_per_hour();
            this.pm_per_hour_sensor();
            this.pressure_per_hour();
            this.pressure_per_hour_sensor();
            this.sensors_detail()
        }, 30000);

        //this.xxxx()
    }

    SimpleMap() {

        const defaultProps = {
            center: {
                lat: 60.4720,
                lng: 8.4689
            },
            zoom: 8
        };

        const K_WIDTH = 40;
        const K_HEIGHT = 40;

        const greatPlaceStyle = {
            // initially any map object has left top corner at lat lng coordinates
            // it's on you to set object origin to 0,0 coordinates
            position: 'absolute',
            width: K_WIDTH,
            height: K_HEIGHT,
            left: -K_WIDTH / 2,
            top: -K_HEIGHT / 2,

            border: '5px solid #000',
            borderRadius: K_HEIGHT,
            backgroundColor: 'white',
            textAlign: 'center',
            color: '#ffbf1f',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 4
        };

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '35vh', width: '98%', position: 'relative', left: '5px' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyB5Kh6v1aSxzZKkwqMQRuwgony1HDJ0s80" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                >
                    {this.renderLocationOnMap()}

                </GoogleMapReact>
            </div>
        );
    }

    renderLocationOnMap() {
        const K_WIDTH = 20;
        const K_HEIGHT = 20;

        const greatPlaceStyle = {
            // initially any map object has left top corner at lat lng coordinates
            // it's on you to set object origin to 0,0 coordinates
            position: 'absolute',
            width: K_WIDTH,
            height: K_HEIGHT,
            left: -K_WIDTH / 2,
            top: -K_HEIGHT / 2,

            border: '0px solid #f44336',

            textAlign: 'center',
            color: '#CF9A19',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 4
        };

        const greatPlaceStyle2 = {
            // initially any map object has left top corner at lat lng coordinates
            // it's on you to set object origin to 0,0 coordinates
            position: 'absolute',
            width: K_WIDTH,
            height: K_HEIGHT,
            left: -K_WIDTH / 2,
            top: -K_HEIGHT / 2,

            border: '0px solid #f44336',

            textAlign: 'center',
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 4
        };
        var context = this;

        return this.state.buildings.map(function (o, i) {
           ////console.log(context.state.buildings[i])
            if (context.state.buildings[i].location.localeCompare("{}") < 0) {
               ////console.log(context.state.buildings[i].location)
                var x = JSON.parse(context.state.buildings[i].location)
                if (context.state.current_location_id == i)
                    return (
                        <div onClick={(event) => context.get_weather2(x.lat, x.lng, i, context.state.buildings[i].title)} lat={x.lat} lng={x.lng} style={greatPlaceStyle2} title={context.state.buildings[i].title}>
                            <FontAwesomeIcon icon={faLocation} className="location_size" />
                        </div>
                    );
                else
                    return (
                        <div onClick={(event) => context.get_weather2(x.lat, x.lng, i, context.state.buildings[i].title)} lat={x.lat} lng={x.lng} style={greatPlaceStyle} title={context.state.buildings[i].title}>
                            <FontAwesomeIcon icon={faLocationPin} className="location_size" />
                        </div>
                    );
            }
        });
    }


    getBuildings() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
       ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), type: 2 })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                   ////console.log(result.result)
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        ////console.log(key)
                        ////console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].title = result.result[key].title
                        nt_tmp[key].location = result.result[key].location
                        //nt_tmp[key].type = result.result[key].type
                        //nt_tmp[key].date = result.result[key].date

                    }
                    var x = JSON.parse(nt_tmp[0].location)
                   ////console.log("xxxxxxxxxxxxxxxxxxxxxxxxx", x)
                    this.get_weather2(x.lat, x.lng, 0, nt_tmp[0].title)
                    this.setState({
                        buildings: nt_tmp
                    }
                    );
                   ////console.log(result);
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


    get_sri() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
       ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_sri', {
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
                    try {
                       ////console.log(result.result)
                        var nt_tmp = [];
                        var yyy = JSON.parse(result.result);
                        var total_building = 0;
                        var total_sri = 0;
                        var class_sri = "";
                        for (var key2 in yyy) {
                            var zzz = JSON.parse(yyy[key2].calculation_data);
                            if (zzz.chart) {

                                var xxx = zzz.chart;
                                total_sri += parseInt(zzz.total_sri);
                                class_sri = zzz.class_sri
                               ////console.log("xxx", xxx)
                                var i = 0;
                                total_building++;
                                for (var key in xxx) {
                                    var index = i++;
                                    if (!nt_tmp[index]) {
                                        nt_tmp[index] = {};
                                        ////console.log(key)
                                        ////console.log(result.result[key].sce)
                                        //nt_tmp[key] = JSON.parse(result.result[key].sce)

                                        nt_tmp[index].value = parseInt(xxx[key].val);
                                        nt_tmp[index].year = xxx[key].title;
                                        nt_tmp[index].category = "";
                                    } else {
                                        nt_tmp[index].value += parseInt(xxx[key].val);
                                    }
                                    //nt_tmp[key].type = result.result[key].type
                                    //nt_tmp[key].date = result.result[key].date

                                }

                            }
                        }
                       ////console.log("nt_tmp", nt_tmp)
                       ////console.log("total_building", total_building)
                        for (var key in nt_tmp) {
                            nt_tmp[key].value = parseInt((nt_tmp[key].value / total_building).toFixed(0));
                        }
                        //sri_title: "SRI",
                        //    sri_val: 0
                        var total_sri_mid = total_sri / total_building
                       ////console.log("nt_tmp", nt_tmp)
                        this.setState({
                            get_sri: nt_tmp,
                            total_building: total_building,
                            sri_val: total_sri_mid.toFixed(0) + "%",
                            sri_title: "CLASS " + class_sri
                        }
                        );
                       ////console.log(result);
                    } catch (error) {

                    }
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


    /* xxxx() {
         var { data2222, isLoading2, errorMessage2 } = useOpenWeather({
             key: 'ce826510895598fe6876888d108bdc24',
             lat: '48.137154',
             lon: '11.576124',
             lang: 'en',
             unit: 'metric', // values are (metric, standard, imperial)
         });
     }*/

    /* renderRows(){
      ////console.log("renderRows");
       this.createRow();
     }*/


    sensors_detail() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
       ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_sensors_info', {
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
                       
                        sensor_detail: result.result
                    }
                    );
                    
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


    sensors() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
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
                        sensor_info_all: result.all,
                        loading0: "d-none"
                    }
                    );
                    ////console.log(result);
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


    get_measure_types() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_measure_types', {
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
                        measure_types: result.result
                    }
                    );
                    ////console.log(result);
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
        ////console.log("cookies=" + cookies.get('token'));
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
                    ////console.log(result);
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
        ////console.log("cookies=" + cookies.get('token'));
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
                    var yyy = ["Cell temperature", "Air temperature", "Atm. pressure", "Relative humidity", "Battery (V)", "PM 1 (MASS)", "PM 2.5 (MASS)", "PM 4 (MASS)", "PM 10 (MASS)", "CO2", "TVOC"]
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
                    ////console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",zzz)
                    //alert(result.result[0].av)
                    this.setState({
                        temperature: result.result[0].av.toFixed(2),
                        loading3: "d-none",
                        top_boxes_all: top_boxes_all
                    }
                    );
                    ////console.log(result);
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

    chooseOperation_source(e) {
        //alert($("#box_function").val())
        var box_function = $("#source_type").val()
        ////console.log("box_function", box_function)
        if (box_function == 0) {
            $("#level11").removeClass("d-none")
            $("#level11_1").addClass("d-none")
        } else {
            $("#level11_1").removeClass("d-none")
            $("#level11").addClass("d-none")
        }
        this.setState({

            source_type: e.target.value

        });
    }

    chooseOperation(e) {
        //alert($("#box_function").val())
        var box_function = $("#box_function").val()
        ////console.log("box_function", box_function)
        if (box_function == 0) {
            ////console.log("h0")
            $("#level4").addClass("d-none")
            $("#level3").removeClass("d-none")
            $("#level2").removeClass("d-none")
            $("#level1").removeClass("d-none")
            $("#level0_0").removeClass("d-none")
            //$("#level11").removeClass("d-none")
        }
        else if (box_function == 1) {
            ////console.log("h1")
            $("#level4").removeClass("d-none")
            $("#level3").addClass("d-none")
            $("#level2").addClass("d-none")
            $("#level1").addClass("d-none")
            $("#level0_0").addClass("d-none")
            $("#level11").addClass("d-none")
            $("#level11_1").addClass("d-none")
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

    openModal2(row, col, edit = 0) {
        //setIsOpen(true);
        //source_type
        $("#source_type").val(-1)
        $("#row").val(row)
        $("#col").val(col)
        $("#edit").val(edit)
        ////console.log("edittttttttttttt",edit)



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
            ////console.log("editttttttttttttxxxxxxxxxxxxxx", x)
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
        $("#source_type").val(-1)
    }

    closeModal2() {
        $("#source_type").val(-1)
        this.setState({
            setIsOpen2: false,
            box_function: -1,
            source_type: -1
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
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_12h', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5",data5)
                    this.setState({

                        data5_12h: data5,
                        data5: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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


    temperature_per_hour_48h() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_48h', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5",data5)
                    this.setState({

                        data5_48h: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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


    temperature_per_hour_7d() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_7d', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5",data5)
                    this.setState({

                        data5_7d: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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


    temperature_per_hour_30d() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_30d', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5",data5)
                    this.setState({

                        data5_30d: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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


    temperature_per_hour_365d() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_365d', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] +" per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].measure_name = result.result[key][key2]["measure_name"];
                                data5[i].measure_kind = result.result[key][key2]["measure_kind"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5",data5)
                    this.setState({

                        data5_365d: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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



    temperature_per_hour_sensor() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_sensor_12h', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5", data5)
                    this.setState({
                        
                        data5_sensor_12h: data5,
                        loading4: "d-none"
                    }
                    );
                    if ($("#t0").hasClass("date_pic_selected") || !$(".date_pic").hasClass("date_pic_selected")) {
                        this.setState({

                            data5_sensor: data5,
                            loading4: "d-none"
                        }
                        );
                    }
                    ////console.log(result);
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


    temperature_per_hour_sensor_48h() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_sensor_48h', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5", data5)
                    this.setState({

                        data5_sensor_48h: data5,
                        loading4: "d-none"
                    }
                    );
                    if ($("#t1").hasClass("date_pic_selected")) {
                        this.setState({

                            data5_sensor: data5,
                            loading4: "d-none"
                        }
                        );
                    }
                    ////console.log(result);
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


    temperature_per_hour_sensor_7d() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_sensor_7d', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5", data5)
                    this.setState({

                        data5_sensor_7d: data5,
                        loading4: "d-none"
                    }
                    );
                    if ($("#t1").hasClass("date_pic_selected")) {
                        this.setState({

                            data5_sensor: data5,
                            loading4: "d-none"
                        }
                        );
                    }
                    ////console.log(result);
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


    temperature_per_hour_sensor_30d() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_sensor_30d', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5", data5)
                    this.setState({

                        data5_sensor_30d: data5,
                        loading4: "d-none"
                    }
                    );
                    if ($("#t1").hasClass("date_pic_selected")) {
                        this.setState({

                            data5_sensor: data5,
                            loading4: "d-none"
                        }
                        );
                    }
                    ////console.log(result);
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


    temperature_per_hour_sensor_365d() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/temperature_per_hour_sensor_365d', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Temperature (℃) per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5", data5)
                    this.setState({

                        data5_sensor_365d: data5,
                        loading4: "d-none"
                    }
                    );
                    if ($("#t1").hasClass("date_pic_selected")) {
                        this.setState({

                            data5_sensor: data5,
                            loading4: "d-none"
                        }
                        );
                    }
                    ////console.log(result);
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
        ////console.log("cookies=" + cookies.get('token'));
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category3 = result.result[key][key2]["cl_id"];
                                data5[i].category = "Max Humidity (℃) per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Humidity (℃) per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Humidity (℃) per 10 minutes";
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



                    ////console.log("data5", data5)
                    this.setState({

                        data7: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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


    humidity_per_hour_sensor() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/humidity_per_hour_sensor', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                                data5[i].category = "Max Humidity (℃) per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Humidity (℃) per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Humidity (℃) per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data5", data5)
                    this.setState({

                        data7_sensor: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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
        ////console.log("cookies=" + cookies.get('token'));
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] + " per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] + " per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] + " per 10 minutes";
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



                    ////console.log("data88888888888888888888888888888888888", data5)
                    this.setState({

                        data8: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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


    pm_per_hour_sensor() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/pm_per_hour_sensor', {
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
                    // Temperature (℃) per 10 minutes
                    ////console.log(result.result);
                    var data5 = [];
                    var i = 0;

                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max " + result.result[key][key2]["measure_name"] + " per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average " + result.result[key][key2]["measure_name"] + " per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min " + result.result[key][key2]["measure_name"] + " per 10 minutes";
                                data5[i].category2 = "Min";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
                            } else {
                                data5[i] = {};
                                data5[i].year = key;
                                data5[i].value = key;
                                data5[i].category = "2x";
                            }
                            i++
                        }

                    }



                    ////console.log("data88888888888888888888888888888888888", data5)
                    this.setState({

                        data8_sensor: data5,
                        loading4: "d-none"
                    }
                    );
                    ////console.log(result);
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
        ////console.log("cookies=" + cookies.get('token'));
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
                    ////console.log(result.result);
                    var data5 = [];
                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[key] = {};
                                data5[key].year = result.result[key][key2]["range_title"];
                                data5[key].value = parseFloat(result.result[key][key2]["av"]);
                                data5[key].category = "Pressure (P) per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Pressure (P) per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Pressure (P) per 10 minutes";
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Pressure (P) per 10 minutes";
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

                    ////console.log(data5)
                    this.setState({

                        data6: data5,
                        loading6: "d-none"
                    }
                    );
                    ////console.log(result);
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


    pressure_per_hour_sensor() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/pressure_per_hour_sensor', {
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
                    ////console.log(result.result);
                    var data5 = [];
                    for (var key in result.result) {
                        for (var key2 in result.result[key]) {
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[key] = {};
                                data5[key].year = result.result[key][key2]["range_title"];
                                data5[key].value = parseFloat(result.result[key][key2]["av"]);
                                data5[key].category = "Pressure (P) per 10 minutes";
                                data5[key].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av"]);
                                data5[i].category = "Average Pressure (P) per 10 minutes";
                                data5[i].category2 = "Average";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_max"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_max"]);
                                data5[i].category = "Max Pressure (P) per 10 minutes";
                                data5[i].category2 = "Max";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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
                            ////console.log(key)
                            ////console.log(result.result[key])
                            ////console.log(result.result[key][key2])
                            if (result.result[key][key2]["av_min"] != "null") {
                                data5[i] = {};
                                data5[i].year = result.result[key][key2]["range_title"];
                                data5[i].value = parseFloat(result.result[key][key2]["av_min"]);
                                data5[i].category = "Min Pressure (P) per 10 minutes";
                                data5[i].category3 = result.result[key][key2]["sensor_serial"];
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

                    ////console.log(data5)
                    this.setState({

                        data6_sensor: data5,
                        loading6: "d-none"
                    }
                    );
                    ////console.log(result);
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
        ////console.log("cookies=" + cookies.get('token'));
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
                    this.setState({
                        sensor_location: result.result,
                        sensor_location_cunt: result.result.length,
                        loading1: "d-none"
                    }
                    );
                    ////console.log(result);
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
        if ($(".serials").hasClass("d-none")) {
            $(".serials").removeClass("d-none")
        } else {
            $(".serials").addClass("d-none")
        }
    }


    show_sensors_location() {
        //$(".serials_detail").html("");
        $(".serials_location_detail2").addClass("d-none");
        $(".serials_location_detail3").addClass("d-none");
        $(".serials_location_detail1").removeClass("d-none");
        if ($(".serials_location").hasClass("d-none")) {
            $(".serials_location").removeClass("d-none")
        } else {
            $(".serials_location").addClass("d-none")
        }
    }

    show_sensors1() {
        //$(".serials_detail").html("");
        $(".serials_detail2").addClass("d-none");
        $(".serials_detail3").addClass("d-none");
        $(".serials_detail1").removeClass("d-none");

    }


    show_sensors1_location() {
        //$(".serials_detail").html("");
        $(".serials_location_detail2").addClass("d-none");
        $(".serials_location_detail3").addClass("d-none");
        $(".serials_location_detail1").removeClass("d-none");

    }

    show_sensor_data(serial_id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_sensor_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serial: serial_id })
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
                    ////console.log(result);
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
                        str += `<div style="border-bottom: 1px solid #ccc;"><div style="display:inline-table;font-weight:bold;width:150px;text-align:left;">` + result.result[key].measure_name + `</div>` + `<div style="display:inline-table;font-weight:normal;width:100px">` + Number(result.result[key].measure_value).toFixed(2) + `</div><div style="display: inline-table; font-weight: normal; width: 70px">` + "" + x + "" + `</div><div style="clear:both;"></div></div>`;
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


    show_location_data(serial_id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ serial: serial_id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    $(".serials_location_detail1").addClass("d-none");
                    $(".serials_location_detail2").removeClass("d-none");
                    $(".serials_location_detail3").removeClass("d-none");
                    var str = ``;
                    ////console.log(result);
                    for (var key in result.result) {
                        var x = "";

                        str += `<div style="border-bottom: 1px solid #ccc;"><div style="display:inline-table;font-weight:bold;width:150px;text-align:left;">` + result.result[key].title + `</div>` + `<div style="display:inline-table;font-weight:normal;width:100px">` + result.result[key].sensor + `</div><div style="display: inline-table; font-weight: normal; width: 70px">` + "" + x + "" + `</div><div style="clear:both;"></div></div>`;
                    }
                    $(".serials_location_detail2").html(str);
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
            var connected = "Not Allocated"
            var status = "Sleep"
            var x = "day_stat_title";
            var x2 = "day_stat_title";
            for (var key2 in context.state.sensor_info_all) {
                if (context.state.sensor_info_all[key2].sensor_serial == context.state.sensor_info[key] && context.state.sensor_info_all[key2].ca_deleted == 0 && context.state.sensor_info_all[key2].cb_deleted == 0) {
                    connected = "Allocated"
                    x = "";
                    //status = "Alive"
                }
                if (context.state.sensor_info_all[key2].sensor_serial == context.state.sensor_info[key] && context.state.sensor_info_all[key2].status == 1) {
                    //connected = "Connected"
                    status = "Alive"
                    x2 = "";
                }
            }
            return (
                <div style={{ "border-bottom": "1px solid #ccc" }}>
                    <div className="day_stat_root2" onClick={(event) => context.show_sensor_data(context.state.sensor_info[key])}>
                        <div className="day_stat_title_tmp day_stat_title" style={{ "font-weight": "bold", "color": "black", "cursor": "pointer" }} id={"day_title_" + key}>
                            <div className="day_stat_title_tmp" style={{ "display": "inline-table", width: "33%" }}>
                                {context.state.sensor_info[key]}
                            </div>
                            <div className={x} style={{ "display": "inline-table", width: "33%" }}>
                                {connected}
                            </div>
                            <div className={x2} style={{ "display": "inline-table", width: "33%" }}>
                                {status}
                            </div>
                        </div>

                    </div>
                </div>
            );

        });
    }


    list_locations() {
        var context = this;
        return this.state.sensor_location.map(function (o, key) {

            return (
                <div style={{ "border-bottom": "1px solid #ccc" }}>
                    <div className="day_stat_root" onClick={(event) => context.show_location_data(context.state.sensor_location[key].id)}>
                        <div className="day_stat_title_tmp day_stat_title" style={{ "font-weight": "bold", "color": "black", "cursor": "pointer" }} id={"day_title_" + key}>
                            {context.state.sensor_location[key].title}
                        </div>

                    </div>
                </div>
            );
        });
    }





    get_boxes() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
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
                   // var result = {}
                   // result.result = JSON.parse('[{"row":0,"type":{"function":0,"chart":1,"parametr":0,"value_type":["Average","Max","Min"],"other":0,"location":"3","sensor":"","source_type":0},"column":0,"title":"B09Z01 Temprature Over Time","title_short":"B09Z01"},{"row":1,"type":{"function":0,"chart":1,"parametr":0,"value_type":["Average","Max","Min"],"other":0,"location":"4","sensor":"","source_type":0},"column":0,"title":"B09Z02 Temprature Over Time","title_short":"B09Z02"},{"row":2,"type":{"function":0,"chart":1,"parametr":0,"value_type":["Average","Max","Min"],"other":0,"location":"5","sensor":"","source_type":0},"column":0,"title":"B09Z03 Temprature Over Time","title_short":"B09Z03"},{"row":3,"type":{"function":0,"chart":1,"parametr":0,"value_type":["Average","Max","Min"],"other":0,"location":"6","sensor":"","source_type":0},"column":0,"title":"B09Z04 Temprature Over Time","title_short":"B09Z04"},{"row":4,"type":{"function":0,"chart":1,"parametr":0,"value_type":["Average","Max","Min"],"other":0,"location":"7","sensor":"","source_type":0},"column":0,"title":"B09Z05 Temprature Over Time","title_short":"B09Z05"},{"row":5,"type":{"function":0,"chart":1,"parametr":0,"value_type":["Average","Max","Min"],"other":0,"location":"8","sensor":"","source_type":0},"column":0,"title":"B09Z06 Temprature Over Time","title_short":"B09Z06"},{"row":6,"type":{"function":0,"chart":1,"parametr":0,"value_type":["Average","Max","Min"],"other":0,"location":"9","sensor":"","source_type":0},"column":0,"title":"B09Z07 Temprature Over Time","title_short":"B09Z07"}]');
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    ////console.log(result.result)
                    result = {
                        "result": [
                            {
                                "cb_id": 7,
                                "cb_title": null,
                                "cb_width": "0",
                                "cb_row": 0,
                                "cb_column": 0,
                                "cb_type": "[{\"row\":0,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"3\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z01 Temprature Over Time\",\"title_short\":\"B09Z01\"},{\"row\":1,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"4\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z02 Temprature Over Time\",\"title_short\":\"B09Z02\"},{\"row\":2,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"5\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z03 Temprature Over Time\",\"title_short\":\"B09Z03\"},{\"row\":3,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"6\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z04 Temprature Over Time\",\"title_short\":\"B09Z04\"},{\"row\":4,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"7\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z05 Temprature Over Time\",\"title_short\":\"B09Z05\"},{\"row\":5,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"8\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z06 Temprature Over Time\",\"title_short\":\"B09Z06\"},{\"row\":6,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"9\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z07 Temprature Over Time\",\"title_short\":\"B09Z07\"}]",
                                "cb_type_2": "[]",
                                "cb_deleted": 0,
                                "cb_user": 1,
                                "cb_default": 0,
                                "cb_date": "2023-11-17T12:56:10.000Z",
                                "user_id": 1,
                                "email": "collectief4@gmail.com",
                                "fullname": "sgz",
                                "phone_number": null,
                                "password": "25d55ad283aa400af464c76d713c07ad",
                                "is_active": 1,
                                "token": "1de57bbafded83ce3774ce0482f42bc0e",
                                "created_at": "2020-11-03T13:14:36.000Z",
                                "updated_at": "2023-04-15T08:45:46.000Z",
                                "user_type": 4,
                                "is_technical_support": 1,
                                "user_pic": null,
                                "owner": 0,
                                "is_admin": 1
                            }
                        ]
                    }
                    var nt_tmp = [];
                    var x = []
                    var y = []
                    var box_titles = []
                    for (var key in result.result) {

                        ////console.log(key)
                        ////console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        ////console.log("cb_default=====", result.result[key].cb_default)
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
                    ////console.log("nt_tmp", nt_tmp)
                    ////console.log("rows", rows)
                    for (var key in x) {
                        if (!rows_new[x[key].row]) {
                            rows_new[x[key].row] = {}
                            rows_new[x[key].row].c = 0;
                        }
                        rows_new[x[key].row].c++;
                        if (!box_titles.includes(x[key].title_short)) {
                            box_titles[box_titles.length] = x[key].title_short;
                        }
                    }

                    this.setState({
                        boxes: nt_tmp,
                        boxes_new: x,
                        box_titles: box_titles,
                        rows: rows,
                        rows_new: rows_new,
                        top_boxes: y
                    }
                    );
                    $("#boxes").val(JSON.stringify(x))
                    $("#boxes_top").val(JSON.stringify(y))
                    ////console.log(result);
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
        ////console.log("notification:::", this.state.notification)
        //{notification_operation[context1.state.boxes[key].operation]} {context1.state.boxes[key].value} {notification_unit[context1.state.boxes[key].type]}
        return this.state.rows.map(function (o, key) {
            //////console.log(context.state.temlate[key].position)
            ////console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
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
        ////console.log("row", row)
        ////console.log("col", col)
        ////console.log("boxes_new_old", boxes_new)

        var rows_new = this.state.rows_new;
        ////console.log("rows_new_old", rows_new)
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
        ////console.log("rows_new", rows_new)
        var g = (index) + (col);
        ////console.log("g==", g)
        ////console.log("index", index)
        if (index == 0) {
            g = (col);
        }
        boxes_new.splice(g, 1)
        this.setState({
            boxes_new: boxes_new,
            rows_new: rows_new
        })
        $("#boxes").val(JSON.stringify(this.state.boxes_new))
    }

    addItemHorizontal(row) {
        ////console.log("ROW === " , row)
        // newRows
        var rows_new = this.state.rows_new;
        ////console.log("rows_new.length", rows_new.length)
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

            ////console.log("boxes_old", boxes_new)
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
                ////console.log("flag", flag)
            }
            ////console.log("split_array2", split_array2)
            ////console.log("split_array", split_array)
            var split_array3 = split_array.concat(split_array2);
            ////console.log("split_array3", split_array3)
            $("#boxes").val(JSON.stringify(split_array3))
            ////console.log("boxes_new", boxes_new)
            this.setState({
                boxes_new: split_array3,
                rows_new: rows_new
            })
            ////console.log("nboxes", nboxes)
            var wAll = 90
            if (nboxes == 1) {
                wAll = 90
            }
            var width = wAll / parseInt(nboxes)
            var w = (width) + ""
            ////console.log("width", width)
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
            $("#boxes").val(JSON.stringify(this.state.boxes_new))
            $("#boxes_top").val(JSON.stringify(this.state.top_boxes))
            ////console.log(x)
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
            ////console.log(credentials);
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
                        ////console.log(result);
                        ////console.log("message=" + result.message);
                        if (result.message === 1) {
                            this.setState({ fullname: result.name, is_login: true, user_type: result.user_type, location_list: JSON.parse(result.location_list) })
                            return true;

                        }
                        else if (result.message === 0) {

                            ////console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                            const cookies = new Cookies();
                            cookies.remove('token');
                            window.location.href = "/";
                            return false;


                        } else {

                        }
                        ////console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

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
        ////console.log("row", row)
        ////console.log("col", col)
        ////console.log("boxes_new_old", boxes_new)

        var rows_new = this.state.rows_new;
        ////console.log("rows_new_old", rows_new)
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
        ////console.log("rows_new", rows_new)
        /*var g = (index) + (col);
       ////console.log("g==", g)
       ////console.log("index", index)
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
        ////console.log(selected);
        ////console.log(selected2);
        var box_function = parseInt($("#box_function").val())
        var box_chart = parseInt($("#box_chart").val())
        var box_parametr = parseInt($("#box_parametr").val())
        var source_type = parseInt($("#source_type").val())

        var box_value_type = selected2
        var box_other = parseInt($("#box_other").val())
        ////console.log("box_parametr", box_parametr)
        var box_title = $("#box_title").val()
        var location = $("#location_s").val()
        var sensor = $("#sensor_s").val()
        var col = parseInt($("#col").val())
        var row = parseInt($("#row").val())
        var boxes_new = this.state.boxes_new;
        if (box_function != "-1" && source_type != "-1" && (location != "" || sensor != "")) {
            var x = {};
            x.function = box_function
            x.chart = box_chart
            x.parametr = box_parametr
            x.value_type = box_value_type
            x.other = box_other
            x.location = location
            x.sensor = sensor
            x.source_type = source_type
            var location_title = "";
            for (var key in this.state.location_title) {
                if (parseInt(this.state.location_title[key].id) === parseInt(location)) {
                    location_title = this.state.location_title[key].title
                    ////console.log("location_title", location_title)
                }
            }
            ////console.log("xxxxxxxxxxxx", x)
            ////console.log("row", row)
            ////console.log("col", col)
            ////console.log("boxes_new_old", boxes_new)
            var rows_new = this.state.rows_new;
            //var rows = this.state.rows;
            var index = 0;
            for (var key in rows_new) {
                if (key < row) {
                    index += rows_new[key].c;
                }
            }
            var g = (index) + (col);
            ////console.log("g==", g)
            ////console.log("index", index)
            if (index == 0) {
                g = (col);
            }
            //for (var k = 0; k < column; k++) {

            // boxes_new[g] = {};
            boxes_new[g].row = row;
            boxes_new[g].type = x;
            //boxes_new[g].column = col;
            if (box_title == "")
                if (box_function == 0) {
                    if (parseInt(source_type) == 0)
                        box_title = location_title + " " + selected[0] + " Over Time"
                    else
                        box_title = "Sensor " + selected[0] + " with ID " + sensor + " Over Time"
                }
            if (box_title == "") {
                box_title = "-"
            }
            boxes_new[g].title = box_title;
            if (parseInt(source_type) == 0)
                boxes_new[g].title_short = location_title;
            else
                boxes_new[g].title_short = sensor;

            ////console.log("boxes_new", boxes_new)
            this.setState({
                boxes_new: boxes_new
            })
            $("#boxes").val(JSON.stringify(this.state.boxes_new))
            this.closeModal2()
        } else {
            toast.error('Please fill in required fields', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeonClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        //}
    }



    addItemTop() {

        var box_function = parseInt($("#box_function").val())
        var box_chart = parseInt($("#box_chart").val())
        var box_parametr = parseInt($("#box_parametr_2").val())
        var box_title = $("#box_title_2").val()

        ////console.log("box_parametr", box_parametr)
        ////console.log("Top", this.state.top_boxes_all)
        if (box_parametr != "") {
            var x = this.state.top_boxes;

            for (var key in this.state.top_boxes_all) {

                if (box_title == "") {
                    box_title = this.state.top_boxes_all[key].measure_name
                }
                if (box_parametr == 0) {
                    if (this.state.top_boxes_all[key].measure_name == "Cell temperature") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 1) {
                    if (this.state.top_boxes_all[key].measure_name == "Air temperature") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 2) {
                    if (this.state.top_boxes_all[key].measure_name == "Atm. pressure") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 3) {
                    if (this.state.top_boxes_all[key].measure_name == "Relative humidity") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 4) {
                    if (this.state.top_boxes_all[key].measure_name == "Battery (V)") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 5) {
                    if (this.state.top_boxes_all[key].measure_name == "PM 1 (MASS)") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 6) {
                    if (this.state.top_boxes_all[key].measure_name == "PM 2.5 (MASS)") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 7) {
                    if (this.state.top_boxes_all[key].measure_name == "PM 4 (MASS)") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 8) {
                    if (this.state.top_boxes_all[key].measure_name == "PM 10 (MASS)") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 9) {
                    if (this.state.top_boxes_all[key].measure_name == "CO2") {
                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
                if (box_parametr == 10) {
                    if (this.state.top_boxes_all[key].measure_name == "TVOC") {

                        var index = x.length;
                        x[index] = {};
                        x[index].title = this.state.top_boxes_all[key].measure_name
                        x[index].measure_name = this.state.top_boxes_all[key].measure_name
                        if (this.state.top_boxes_all[key] && this.state.top_boxes_all[key].av && this.state.top_boxes_all[key].av != "" && typeof this.state.top_boxes_all[key].av === 'number')
                            x[index].value = this.state.top_boxes_all[key].av.toFixed(2);
                        else
                            x[index].value = "-";
                    }
                }
            }
           ////console.log("x", x)
            this.setState({
                top_boxes: x,
                top_boxes_stat: "remove-part p-0 pt-0 pr-1"
            })
            $("#boxes_top").val(JSON.stringify(this.state.top_boxes))
            this.closeModal3()
        } else {
            toast.error('Please fill in required fields', {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeonClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        //}
    }

    listTopBoxes() {

        var context = this;
        var context1 = this;
        //                            <FontAwesomeIcon onClick={(event) => context.openModal3(key)} style={{ "color":"#ffbf1f","opacity":"0.7","cursor": "pointer", "width": "20px", "height": "20px" }} icon={faEdit} className="arrow pl-2" />

        return this.state.top_boxes.map(function (o, key) {
            var title = context.state.top_boxes[key].title
            if (context.state.top_boxes[key].title == "") {
                title = context.state.top_boxes[key].measure_name
            }
            var x = "-";
            context.state.top_boxes[key].value = "" + context.state.top_boxes[key].value;
            if (context.state.top_boxes[key] && context.state.top_boxes[key].value && context.state.top_boxes[key].value.split(".").length > 1) {
                x = context.state.top_boxes[key].value
            } else {
                x = (context.state.top_boxes[key].value)
            }
            return (
                <div className="container_c6">
                    <div class="row">
                        <div style={{ "text-align": "right", "position": "relative", "top": "-10px" }} className={context.state.top_boxes_stat}>
                            <FontAwesomeIcon onClick={(event) => context.removeM(key)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "20px", "height": "20px" }} icon={faWindowClose} className="arrow pl-2" />
                        </div>
                        <div class="col-8">
                            <div class="numbers">
                                <p class="text-sm mb-0 font-weight-bold">
                                    {title}
                                </p>
                                <h5 class="font-weight-bolder mb-0">
                                    {x}

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
        ////console.log("rows_new.length", rows_new.length)
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
            boxes_new[g].row = l;
            boxes_new[g].type = -1;
            boxes_new[g].column = k;
            boxes_new[g].title = "";
        }

        $("#boxes").val(JSON.stringify(boxes_new))

        this.setState({
            boxes_new: boxes_new,
            rows_new: rows_new
        })
        ////console.log("nboxes", nboxes)
        var wAll = 90
        if (nboxes == 1) {
            wAll = 90
        }
        var width = wAll / parseInt(nboxes)
        var w = (width) + ""
        ////console.log("width", width)
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
        ////console.log(x)
        //$("#newRows").append('<div class="container_main mt-3">' + x + '</div>')
        $("#boxes").val(JSON.stringify(this.state.boxes_new))
        $("#boxes_top").val(JSON.stringify(this.state.top_boxes))
        this.closeModal()
    }




    listBoxesNew() {
        var group_type = this.state.group_type
        if ($(".edit-box").hasClass("d-none")) {
            group_type = 0;
        }
        //alert(group_type)
        var context1 = this;
        var context = this;
        ////console.log(this.state.rows_new)
        ////console.log("group_type", group_type)
        ////console.log("notification:::", this.state.notification)
        //{notification_operation[context1.state.boxes[key].operation]} {context1.state.boxes[key].value} {notification_unit[context1.state.boxes[key].type]}
        if (group_type == 0) {
            if (this.state.rows_new.length > 0) {
                return this.state.rows_new.map(function (o, key) {
                    //////console.log(context.state.temlate[key].position)
                    var type = "";

                    if ($(".edit-box").hasClass("d-none")) {
                        ////console.log("in0000000000000000000000")
                        return (
                            <div>
                                <div className="container_main mt-3" style={{ "text-align": "left" }} id={"row_" + key}>
                                    <div style={{ "text-align": "center" }}>
                                        {context1.renderColumnsNew(key, "")}
                                        <div className="container_main right-remove-part" style={{ float: "right", "vertical-align": "middle", "margin": "1%", "margin-right": "0%", "margin-left": "0%", "position": "relative", "top": "190px" }} id={"row_add_" + key}>
                                            <div className="" style={{ "vertical-align": "middle" }}>
                                                <FontAwesomeIcon onClick={(event) => context1.addItemHorizontal(key)} style={{ "position": "relative", "color": "rgb(255, 191, 31)", "vertical-align": "middle", "cursor": "pointer", "width": "40px", "height": "40px" }} icon={faPlusCircle} className="arrow pl-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="newline"></div>
                            </div>


                        )
                    } else {
                        ////console.log("in0111111111111111111111111111")
                        return (
                            <div>
                                <div className="container_main mt-3" style={{ "text-align": "left" }} id={"row_" + key}>
                                    <div style={{ "text-align": "center" }}>
                                        {context1.renderColumnsNew(key, "")}
                                        <div className="container_main right-remove-part d-none" style={{ float: "right", "vertical-align": "middle", "margin": "1%", "margin-right": "0%", "margin-left": "0%", "position": "relative", "top": "190px" }} id={"row_add_" + key}>
                                            <div className="" style={{ "vertical-align": "middle" }}>
                                                <FontAwesomeIcon onClick={(event) => context1.addItemHorizontal(key)} style={{ "position": "relative", "color": "rgb(255, 191, 31)", "vertical-align": "middle", "cursor": "pointer", "width": "40px", "height": "40px" }} icon={faPlusCircle} className="arrow pl-2" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="newline"></div>
                            </div>


                        )
                    }

                }
                )
            } else {

            }
        } else {
            return this.state.box_titles.map(function (o, key) {
                //////console.log(context.state.temlate[key].position)
                var type = "";

                if ($(".edit-box").hasClass("d-none")) {
                    return (

                        <div className="container_main mt-3" style={{ "text-align": "left" }} id={"row_" + key}>
                            <div style={{ "text-align": "center" }}>
                                {context1.renderColumnsNew(key, context.state.box_titles[key])}
                                <div className="container_main right-remove-part" style={{ float: "right", "vertical-align": "middle", "margin": "1%", "margin-right": "0%", "margin-left": "0%" }} id={"row_add_" + key}>
                                    <div className="" style={{ "vertical-align": "middle" }}>
                                        <FontAwesomeIcon onClick={(event) => context1.addItemHorizontal(key)} style={{ "position": "relative", "color": "rgb(255, 191, 31)", "vertical-align": "middle", "cursor": "pointer", "width": "40px", "height": "40px" }} icon={faPlusCircle} className="arrow pl-2" />
                                    </div>
                                </div>
                            </div>

                        </div>



                    )
                } else {
                    return (

                        <div className="container_main mt-3" style={{ "text-align": "left" }} id={"row_" + key}>
                            <div style={{ "text-align": "center" }}>
                                {context1.renderColumnsNew(key, context.state.box_titles[key])}
                                <div className="container_main right-remove-part d-none" style={{ float: "right", "vertical-align": "middle", "margin": "1%", "margin-right": "0%", "margin-left": "0%" }} id={"row_add_" + key}>
                                    <div className="" style={{ "vertical-align": "middle" }}>
                                        <FontAwesomeIcon onClick={(event) => context1.addItemHorizontal(key)} style={{ "position": "relative", "color": "rgb(255, 191, 31)", "vertical-align": "middle", "cursor": "pointer", "width": "40px", "height": "40px" }} icon={faPlusCircle} className="arrow pl-2" />
                                    </div>
                                </div>
                            </div>

                        </div>



                    )
                }

            }
            )
        }

    }


    get_location() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_assignment_locations', {
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
                    ////console.log(result.result)
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        ////console.log(key)
                        ////console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].title = result.result[key].title
                        //nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_title: nt_tmp
                    }
                    );
                    ////console.log(result);
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


    get_weather2(lat, lon, index, title) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://api.weatherapi.com/v1/forecast.json?key=70f98c0a4cb24a0ba3183217230604&q=' + lat + ',' + lon + '&days=7&aqi=no&alerts=no', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(data => data.json())
            .then(
                (result) => {
                   ////console.log("result", result);
                    if (result.forecast) {
                        this.setState({
                            weather: result,
                            forecastday: result.forecast.forecastday,
                            forecastnow: result.current,
                            current_location_id: index,
                            current_location_title: title,
                            country: result.location.country,
                            region: result.location.region,
                            name: result.location.name
                        }
                        );
                    }
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    ////console.log(result.result)
                    /*var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        ////console.log(key)
                        ////console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].title = result.result[key].title
                        //nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_title: nt_tmp
                    }
                    );*/
                    ////console.log(result);
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


    get_weather3(lat, lon) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://api.weatherapi.com/v1/forecast.json?key=70f98c0a4cb24a0ba3183217230604&q=' + lat + ',' + lon + '&days=7&aqi=no&alerts=no', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(data => data.json())
            .then(
                (result) => {
                   ////console.log("result", result);
                    if (result.forecast) {
                        this.setState({
                            weather: result,
                            forecastday: result.forecast.forecastday,
                            forecastnow: result.current
                           
                        }
                        );
                    }
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    ////console.log(result.result)
                    /*var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        ////console.log(key)
                        ////console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].title = result.result[key].title
                        //nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_title: nt_tmp
                    }
                    );*/
                    ////console.log(result);
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


    get_weather() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        ////console.log("cookies=" + cookies.get('token'));
        return fetch('http://api.weatherapi.com/v1/forecast.json?key=70f98c0a4cb24a0ba3183217230604&q=london' + '&days=7&aqi=no&alerts=no', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(data => data.json())
            .then(
                (result) => {
                   ////console.log("result", result);
                    this.setState({
                        weather: result,
                        forecastday: result.forecast.forecastday,
                        forecastnow: result.current
                    }
                    );
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    ////console.log(result.result)
                    /*var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        ////console.log(key)
                        ////console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].title = result.result[key].title
                        //nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_title: nt_tmp
                    }
                    );*/
                    ////console.log(result);
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


    getStrMonth(month) {
        var x = ""
        if (month == "01")
            x = "Jan";
        else if (month == "02")
            x = "Feb";
        else if (month == "03")
            x = "Mar";
        else if (month == "04")
            x = "Apr";
        else if (month == "05")
            x = "May";
        else if (month == "06")
            x = "Jun";
        else if (month == "07")
            x = "Jul";
        else if (month == "08")
            x = "Aug";
        else if (month == "09")
            x = "Sep";
        else if (month == "10")
            x = "Oct";
        else if (month == "11")
            x = "Nov";
        else if (month == "12")
            x = "Dec";
        return x;
    }

    renderWeatherPerDay() {
        var context = this;
        if (context.state.forecastnow.condition)
            return (
                <div>
                   
                    <div className="newline"></div>

                    <div className="weather_day_title">
                        Weather
                    </div>
                    <div className="weather_day_value">
                        <img src={context.state.forecastnow.condition.icon} className="" />
                        {context.state.forecastnow.condition.text}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title">
                        Ambient temperature
                    </div>
                    <div className="weather_day_value">
                        {context.state.forecastnow.temp_c}{" C"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title">
                        Relative humidity

                    </div>
                    <div className="weather_day_value">
                        {context.state.forecastnow.humidity}{" %"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title">
                        Precipitations

                    </div>
                    <div className="weather_day_value">
                        {context.state.forecastnow.precip_in}{" mm"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title">
                        Wind speed

                    </div>
                    <div className="weather_day_value">
                        {context.state.forecastnow.wind_kph}{" km/h"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title">
                        Visibility (km)

                    </div>
                    <div className="weather_day_value">
                        {context.state.forecastnow.vis_km}{" km"}
                    </div>
                    <div className="newline"></div>


                </div>
            );
    }



    renderWeatherPerDay2() {
        var context = this;
        if (context.state.forecastnow.condition)
            return (
                <div className="mt-1">

                    <div className="newline"></div>

                    <div className="weather_day_title2">
                        Weather
                    </div>
                    <div className="weather_day_value2">
                        <img src={context.state.forecastnow.condition.icon} className="" />
                        {context.state.forecastnow.condition.text}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title2">
                        Ambient temperature
                    </div>
                    <div className="weather_day_value2">
                        {context.state.forecastnow.temp_c}{" C"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title2">
                        Relative humidity

                    </div>
                    <div className="weather_day_value2">
                        {context.state.forecastnow.humidity}{" %"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title2">
                        Precipitations

                    </div>
                    <div className="weather_day_value2">
                        {context.state.forecastnow.precip_in}{" mm"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title2">
                        Wind speed

                    </div>
                    <div className="weather_day_value2">
                        {context.state.forecastnow.wind_kph}{" km/h"}
                    </div>
                    <div className="newline"></div>

                    <div className="weather_day_title2">
                        Visibility (km)

                    </div>
                    <div className="weather_day_value2">
                        {context.state.forecastnow.vis_km}{" km"}
                    </div>
                    <div className="newline"></div>


                </div>
            );
    }


    renderWeather() {
        var context = this;
        return this.state.forecastday.map(function (o, i) {
           ////console.log("forcast", context.state.forecastday[i])
            var date = context.state.forecastday[i].date.split("-")
            var mstr = context.getStrMonth(date[1]);
            return (
                <div className="weather-column">
                    <div className="w-date">
                        {date[2]}
                    </div>
                    <div className="w-month">
                        {mstr}
                    </div>
                    <div className="newline"></div>
                    <div className="mt-2">
                        <div className="">
                            <img src={context.state.forecastday[i].day.condition.icon} className="" />
                        </div>
                        <div className="mt-3">
                            <div className="">
                                <div className="weather-icon-sm">
                                    <FontAwesomeIcon icon={faWind} />
                                </div>
                                <div className="weather-value">
                                    {context.state.forecastday[i].day.maxwind_kph}{"Km/h"}
                                </div>
                            </div>
                            <div className="">
                                <div className="weather-icon-sm">
                                    <FontAwesomeIcon icon={faSun} className="faSun" />
                                </div>
                                <div className="weather-value">
                                    {context.state.forecastday[i].day.totalprecip_mm}{"mm"}
                                </div>
                            </div>
                            <div className="">
                                <div className="weather-icon-sm">
                                    {"UV"}
                                </div>
                                <div className="weather-value">
                                    {context.state.forecastday[i].day.uv}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )
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


    renderSensorsOptions() {
        var context = this;
        return this.state.sensor_info.map(function (o, i) {
            return (
                <option value={context.state.sensor_info[i]}>{context.state.sensor_info[i]}</option>
            )
        }
        )
    }


    render_measure_types() {
        var context = this;
        return this.state.measure_types.map(function (o, i) {
            if (context.state.measure_types[i].measure_name.localeCompare("Air temperature") === 0) {
                return (
                    <option selected value={context.state.measure_types[i].measure_name}>{context.state.measure_types[i].measure_name}</option>
                )
            } else {
                return (<option value={context.state.measure_types[i].measure_name}>{context.state.measure_types[i].measure_name}</option>);

            }
        }
        )
    }

    renderGauge() {
        const config = {
            percent: (parseInt(this.state.sri_val)) / 100,
            range: {

                color: 'l(0) 0:#ffbf1f 1:#000000',
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
                title: {
                    offsetY: -36,
                    style: {
                        fontSize: '36px',
                        color: '#4B535E',
                    },
                    formatter: () => this.state.sri_val,
                },
                content: {
                    style: {
                        fontSize: '24px',
                        lineHeight: '44px',
                        color: '#BF8F17',
                    },
                    formatter: () => "" + this.state.sri_title,
                },
            },
        };
        return <Gauge {...config} />;
    }

    set_measure_type(zone) {
        // <div id={title_short + "_t0"} className="date_pic date_pic_selected m-2" onClick={(event) => this.set_data_for_chart(0, title_short)}>
        console.log("set_measure_type")
        for (var i = 0; i <= 4; i++) {
            console.log("i",i)
            if ($("#" + zone + "_t" + i).hasClass("date_pic_selected")) {
                console.log("zone in",zone)
                this.set_data_for_chart(i,zone)
            }
        }
    }



    renderColumnsNew(key2, title) {

        var context1 = this;
        ////console.log(key2)
        ////console.log("boxes_new----------------------------------", context1.state.boxes_new)
        ////console.log("title",title)
        ////console.log("notification:::", this.state.notification)
        var group_type = this.state.group_type
        if ($(".edit-box").hasClass("d-none")) {
            group_type = 0;
        }
        if (group_type == 0) {
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
        } else {
            if (group_type == 1) {
                container = "container_c0"
            }
        }
        //{notification_operation[context1.state.boxes[key].operation]} {context1.state.boxes[key].value} {notification_unit[context1.state.boxes[key].type]}
        /*x.function = box_function
        x.chart = box_chart
        x.parametr = box_parametr
        x.value_type = box_value_type*/
        return this.state.boxes_new.map(function (o, key) {
            //////console.log(context.state.temlate[key].position)

            var type = "";

            if ((title === "" && context1.state.boxes_new[key].row === key2) || (title !== "" && title === context1.state.boxes_new[key].title_short)) {
                var x5 = context1.state.data5
                var x5_sensor = context1.state.data5_sensor
                var x6 = context1.state.data6
                var x6_sensor = context1.state.data6_sensor
                var x7 = context1.state.data7
                var x7_sensor = context1.state.data7_sensor
                var x8 = context1.state.data8
                var x8_sensor = context1.state.data8_sensor
                ////console.log("x555555555",x5)
                ////console.log("x888888888", x8)
                var x5_new = [];
                var x6_new = [];
                var x7_new = [];
                var x8_new = [];


                for (var key3 in x6) {
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x6[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 0 && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x6[key3].category3)) {

                        x6_new[x6_new.length] = x6[key3]

                    }
                }

                for (var key3 in x6_sensor) {
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x6_sensor[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 1 && parseInt(context1.state.boxes_new[key].type.sensor) === parseInt(x6_sensor[key3].category3)) {

                        x6_new[x6_new.length] = x6_sensor[key3]

                    }
                }

                for (var key3 in x5) {

                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x5[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 0 && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x5[key3].category3)) {
                        x5_new[x5_new.length] = x5[key3]
                    }

                }


                for (var key3 in x5_sensor) {

                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x5_sensor[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 1 && parseInt(context1.state.boxes_new[key].type.sensor) === parseInt(x5_sensor[key3].category3)) {
                        x5_new[x5_new.length] = x5_sensor[key3]
                    }
                }

                for (var key3 in x7) {
                    ////console.log("loc_1*", x7[key3].category3)
                    ////console.log("loc_1#", context1.state.boxes_new[key].type.location)
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x7[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 0 && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x7[key3].category3)) {
                        ////console.log("&&&&&&&&&&&&&&&&&&&&&");
                        x7_new[x7_new.length] = x7[key3]
                    }
                }

                for (var key3 in x7_sensor) {
                    ////console.log("loc_1*", x7[key3].category3)
                    ////console.log("loc_1#", context1.state.boxes_new[key].type.location)
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x7_sensor[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 1 && parseInt(context1.state.boxes_new[key].type.sensor) === parseInt(x7_sensor[key3].category3)) {
                        ////console.log("&&&&&&&&&&&&&&&&&&&&&");
                        x7_new[x7_new.length] = x7_sensor[key3]
                    }
                }

                for (var key3 in x8) {
                    ////console.log("loc_1*", x8[key3].category3)
                    ////console.log("loc_1#", context1.state.boxes_new[key].type.location)
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x8[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 0 && parseInt(context1.state.boxes_new[key].type.location) === parseInt(x8[key3].category3)) {
                        x8_new[x8_new.length] = x8[key3]
                    }
                }

                for (var key3 in x8_sensor) {
                    ////console.log("loc_1*", x8[key3].category3)
                    ////console.log("loc_1#", context1.state.boxes_new[key].type.location)
                    if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(x8_sensor[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 1 && parseInt(context1.state.boxes_new[key].type.sensor) === parseInt(x8_sensor[key3].category3)) {
                        x8_new[x8_new.length] = x8_sensor[key3]
                    }
                }
                ////console.log("x555555555_new", x5_new)
                ////console.log("x888888888_new", x8_new)
                if (context1.state.boxes_new[key].type.function == 1) {




                    if (context1.state.boxes_new[key].type.other === 0) {
                        return (

                            <div className={container}>
                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "70%", display: "inline-table", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title_short}
                                    &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                        {context1.render_measure_types()}
                                    </select> Over Time
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <img src={homepic} style={{ width: "350px" }} />
                            </div>


                        )
                    } else if (context1.state.boxes_new[key].type.other === 1) {
                        return (

                            <div className={container}>
                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title_short}
                                    &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                        {context1.render_measure_types()}
                                    </select> Over Time
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "gray", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <Gauge {...config3} />
                            </div>


                        )
                    } else if (context1.state.boxes_new[key].type.other === 2) {
                        return (

                            <div className={container}>
                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "70%", display: "inline-table", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title_short}
                                    &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                        {context1.render_measure_types()}
                                    </select> Over Time
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "gray", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>
                                <Area {...config4} />

                            </div>


                        )
                    } else if (context1.state.boxes_new[key].type.other === 3) {
                        return (

                            <div className={container}>

                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title_short}
                                    &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                        {context1.render_measure_types()}
                                    </select> Over Time
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                    {context1.state.boxes_new[key].title_short}
                                    &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                        {context1.render_measure_types()}
                                    </select> Over Time
                                </div>
                                <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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
                                    <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faPlusCircle} className="arrow pl-2" />
                                    <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                </div>

                            </div>


                        )
                    }
                } else if (context1.state.boxes_new[key].type.function == 0) {
                    if (context1.state.boxes_new[key].type.parametr == 0) {
                        if (context1.state.boxes_new[key].type.chart == 1) {
                            if (context1.state.location_list.includes(context1.state.boxes_new[key].title_short) || context1.state.user_type === 3) {
                                return (
                                    <div className={container} style={{ "background-color": context1.state.color }}>

                                        <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "2px solid #eee", "padding": "5px", "letter-spacing": "2px" }}>
                                            {context1.state.boxes_new[key].title_short}
                                            &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} style={{ "border-radius": "10px", "border": "0px solid rgb(130, 97, 16)", "width": "200px", "background-color": "rgb(255, 191, 31)", "padding": "5px" }} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                                {context1.render_measure_types()}
                                            </select> Over Time
                                        </div>
                                        <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                            <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                            <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                        </div>
                                        <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                            <Spinner2 customText="Loading" />
                                        </div>
                                        {context1.renderChart(x5_new, context1.state.boxes_new[key].title_short, key)}

                                    </div>

                                )
                            }
                        } else if (context1.state.boxes_new[key].type.chart == 0) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                                    </div>
                                    <div className={context1.state.loading4} style={{ "text-align": "center" }}>
                                        <Spinner2 customText="Loading" />
                                    </div>
                                    {context1.renderChartBar(x5_new)}

                                </div>

                            )
                        }
                    }

                    else if (context1.state.boxes_new[key].type.parametr == 1) {
                        if (context1.state.boxes_new[key].type.chart == 1) {
                            return (
                                <div className={container}>

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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

                                    <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                        {context1.state.boxes_new[key].title_short}
                                        &nbsp;<select id={"id_" + context1.state.boxes_new[key].title_short} onClick={(event) => context1.set_measure_type(context1.state.boxes_new[key].title_short)}>
                                            {context1.render_measure_types()}
                                        </select> Over Time
                                    </div>
                                    <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                        <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                        <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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
                else {
                    return (

                        <div className={container}>

                            <div style={{ "text-align": "right" }} className="p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faPlusCircle} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>

                        </div>



                    )
                }
            }

        }
        )
        /*  <div className="container_main mt-3">
              
             
              <div className="container_c3 text-center">
                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                      Lowest Battery Percentage (V)
                  </div>
                  <Gauge {...config3} />
              </div>
              <div className="container_c4">
                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "70%", display: "inline-table", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>

                      Reward Function
                      </div>
                  <Area {...config4} />
                  
              </div>
          </div>
          <div className="container_main mt-3">

              <div className="container_c0 text-center">

                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                      Sensor Information
                  </div>
                  <div className={this.state.loading4} style={{"text-align":"center"} }>
                      <Spinner2 customText="Loading" />
                  </div>
                  {this.renderChart()}

              </div>   */
    }


    renderColumns(key2) {
        var context1 = this;
        ////console.log(key2)
        ////console.log("notification:::", this.state.notification)
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
            //////console.log(context.state.temlate[key].position)
            var type = "";
            ////console.log("key--in",key)
            if (context1.state.boxes[key].row === key2) {
                if (context1.state.boxes[key].type === 0) {
                    return (

                        <div className={container}>
                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "70%", display: "inline-table", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>
                            <img src={homepic} style={{ width: "350px" }} />
                        </div>


                    )
                } else if (context1.state.boxes[key].type === 1) {
                    return (

                        <div className={container}>
                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>
                            <Gauge {...config3} />
                        </div>


                    )
                } else if (context1.state.boxes[key].type === 2) {
                    return (

                        <div className={container}>
                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "70%", display: "inline-table", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
                            </div>
                            <Area {...config4} />

                        </div>


                    )
                } else if (context1.state.boxes[key].type === 3) {
                    return (

                        <div className={container}>

                            <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                                {context1.state.boxes[key].title}
                            </div>
                            <div style={{ "text-align": "right", "position": "relative", "top": "-70px", "right": "-10px" }} className="remove-part d-none p-1 pt-1 pr-1">
                                <FontAwesomeIcon onClick={(event) => context1.openModal2(key2, context1.state.boxes_new[key].column, 1)} style={{ "color": "#ffbf1f", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faEdit} className="arrow pl-2" />
                                <FontAwesomeIcon onClick={(event) => context1.removeModal2(key2, context1.state.boxes_new[key].column)} style={{ "color": "red", "opacity": "0.7", "cursor": "pointer", "width": "25px", "height": "25px" }} icon={faWindowClose} className="arrow pl-2" />
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
                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-table", "border-bottom": "1px solid gray", "letter-spacing": "2px" }}>
                      Lowest Battery Percentage (V)
                  </div>
                  <Gauge {...config3} />
              </div>
              <div className="container_c4">
                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "70%", display: "inline-table", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>

                      Reward Function
                      </div>
                  <Area {...config4} />
                  
              </div>
          </div>
          <div className="container_main mt-3">

              <div className="container_c0 text-center">

                  <div className="pb-2 mb-4" style={{ "font-weight": "bold", color: "rgb(130, 97, 16)", width: "100%", display: "inline-block", "border-bottom": "1px solid rgb(255, 191, 31)", "letter-spacing": "2px" }}>
                      Sensor Information
                  </div>
                  <div className={this.state.loading4} style={{"text-align":"center"} }>
                      <Spinner2 customText="Loading" />
                  </div>
                  {this.renderChart()}

              </div>   */
    }





    renderChart(data_tmp,title_short,key) {
        //+" ℃"
        /*
        xAxis: {
            range: [0, 1],
                tickCount: 1,
            },*/
        ////console.log(this.state.data5);
        for (var i = 0; i <= 4; i++) {
            if ($("#" + title_short + "_t" + i).hasClass("date_pic_selected")) {
                if (i == 0)
                    data_tmp = this.state.data5_12h;
                else if (i == 1)
                    data_tmp = this.state.data5_48h;
                else if (i == 2)
                    data_tmp = this.state.data5_7d;
                else if (i == 3)
                    data_tmp = this.state.data5_30d;
                else if (i == 4)
                    data_tmp = this.state.data5_365d;
            }
        }
        var data_filter = [];
        var x5_new = [];
        var context1 = this;
       //console.log("data_tmp", data_tmp)
        for (var key3 in data_tmp) {

            if (context1.state.boxes_new[key].type && context1.state.boxes_new[key].type.value_type && context1.state.boxes_new[key].type.value_type.includes(data_tmp[key3].category2) && parseInt(context1.state.boxes_new[key].type.source_type) == 0 && parseInt(context1.state.boxes_new[key].type.location) === parseInt(data_tmp[key3].category3)) {
                x5_new[x5_new.length] = data_tmp[key3]
            }

        }
        data_tmp = x5_new
        for (var key in data_tmp) {
            if ($("#id_" + title_short)) {
                if ($("#id_" + title_short).val()) {
                    if ($("#id_" + title_short).val().localeCompare(data_tmp[key].measure_name) === 0) {
                        data_filter[data_filter.length] = data_tmp[key];
                    }
                } else {
                    if (data_tmp[key].measure_name.localeCompare("Air temperature")) {
                        data_filter[data_filter.length] = data_tmp[key];
                    }
                }
            }
            else {
                //Air temperature
                if (data_tmp[key].measure_name.localeCompare("Air temperature")) {
                    data_filter[data_filter.length] = data_tmp[key];
                }
            }
        }

        const theme = G2.getTheme(this.state.dark);
      //console.log("data_filter", data_filter)
        var config44 = {
            "data": data_filter,
            xField: 'year',

            yField: 'value',

            seriesField: 'category',
            height: 460,
            width: 300,
            xAxis: {
                // type: 'timeCat',
                tickCount: 4,
            },
            meta: { range: [0, 1] },
            isStack: false,
            slider: {
                start: 0,
                end: 1,
            },
            animation: {
                appear: {
                    animation: 'path-in',
                    duration: 5000,
                },
            },
            legend: {
                position: 'top',
            },
            appendPadding: 10,
            theme: deepMix({}, theme, {
                components: {
                    scrollbar: {
                        // 默认样式
                        default: {
                            style: {
                                trackColor: 'rgba(255, 191, 31,0.05)',
                                thumbColor: 'rgba(255, 191, 31,0.25)',
                            },
                        },
                        // hover 时，可以设置滑块样式
                        hover: {
                            style: {
                                thumbColor: 'rgba(255,255,255,0.6)',
                            },
                        },
                    },
                },
            }),
            scrollbar: {
                type: 'horizontal',
            },
            annotations: [
                
                {
                    type: 'line',
                    start: ['min', 'median'],
                    end: ['max', 'median'],
                    style: {
                        stroke: '#F4664A',
                        lineDash: [2, 2],
                    },
                },
            ],
        };
        //faClock, faCalendarAlt, faCalendarWeek, faCalendar
        var x = "";
        if (data_filter[0]) {
            if (data_filter[0]["measure_kind"] === "Lux") {
                x = "Lm/m²";
            }
            else if (data_filter[0]["measure_kind"] === "Humidity") {
                x = "HR";
            }
            else if (data_filter[0]["measure_kind"] === "Temperature") {
                x = "℃";
            }
            else if (data_filter[0]["measure_kind"] === "Pressure") {
                x = "Pa";
            }
            else if (data_filter[0]["measure_kind"] === "Mass") {
                x = "μg/m³";
            }
            else if (data_filter[0]["measure_kind"] === "TVOC") {
                x = "PPB";
            }
            else if (data_filter[0]["measure_kind"] === "CO2") {
                x = "PPM";
            }
            else if (data_filter[0]["measure_kind"] === "Voltage") {
                x = "V";
            }
        }
        if (data_tmp.length > 0)
            return (
                <div style={{ "text-align": "left" }}>
                    <div id={title_short + "_t0"} className="date_pic date_pic_selected m-2" onClick={(event) => this.set_data_for_chart(0, title_short)}>
                        <FontAwesomeIcon icon={faClock} /> 12 hours
                    </div>
                    <div id={title_short + "_t1"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(1, title_short)} >
                        <FontAwesomeIcon icon={faClock} /> 48 hours
                    </div>
                    <div id={title_short + "_t2"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(2, title_short)}>
                        <FontAwesomeIcon icon={faCalendarWeek} /> week
                    </div>
                    <div id={title_short + "_t3"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(3, title_short)}>
                        <FontAwesomeIcon icon={faCalendarAlt}/> month
                    </div>
                    <div id={title_short + "_t4"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(4, title_short)}>
                        <FontAwesomeIcon icon={faCalendarTimes} /> year
                    </div>
                    <div style={{ "text-align": "left", "position": "relative", "top": "38px", "float": "left", "left": "5px", "font-weight": "bold", "color": this.state.color, "z-index": "30", "display":"inline-block" }}>{x}</div>
                    <Area {...config44} />
                </div>
            );
        else {
            return (< div  className='mt-5' ><div style={{ "text-align": "left" }}>
                <div id={title_short + "_t0"} className="date_pic date_pic_selected m-2" onClick={(event) => this.set_data_for_chart(0, title_short)}>
                    <FontAwesomeIcon icon={faClock} /> 12 hours
                </div>
                <div id={title_short + "_t1"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(1, title_short)} >
                    <FontAwesomeIcon icon={faClock} /> 48 hours
                </div>
                <div id={title_short + "_t2"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(2, title_short)}>
                    <FontAwesomeIcon icon={faCalendarWeek} /> week
                </div>
                <div id={title_short + "_t3"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(3, title_short)}>
                    <FontAwesomeIcon icon={faCalendarAlt} /> month
                </div>
                <div id={title_short + "_t4"} className="date_pic m-2" onClick={(event) => this.set_data_for_chart(4, title_short)}>
                    <FontAwesomeIcon icon={faCalendarTimes} /> year
                </div>
                <div className="newline"></div>
                <div style={{ "text-align": "center", "font-weight": "bold", "font-size": "25px", "letter-spacing": "4px" }}>
                    No Data
                </div>
            </div></div >);
        }
    }

    set_data_for_chart(type, title_short) {
        console.log(title_short)
        for (var i = 0; i <= 4; i++) {
            $("#" + title_short + "_t" + i).removeClass("date_pic_selected");
        }
       
        if (type == 0) {
           
            this.setState({

                data5_sensor: this.state.data5_sensor_12h,
                data5: this.state.data5_12h

            }
            );
            $("#" + title_short +"_t" + type).addClass("date_pic_selected");
            //set_data_for_chart(type, title_short)
        }
        else if (type == 1) {
            
            this.setState({

                data5_sensor: this.state.data5_sensor_48h,
                data5: this.state.data5_48h

            }
            );
            $("#" + title_short + "_t" + type).addClass("date_pic_selected");
            //set_data_for_chart(type, title_short)
        }
        else if (type == 2) {
            
            this.setState({

                data5_sensor: this.state.data5_sensor_7d,
                data5: this.state.data5_7d

            }
            );
            $("#" + title_short + "_t" + type).addClass("date_pic_selected");
            //set_data_for_chart(type, title_short)
        }
        else if (type == 3) {
            
            this.setState({

                data5_sensor: this.state.data5_sensor_30d,
                data5: this.state.data5_30d

            }
            );
            $("#" + title_short + "_t" + type).addClass("date_pic_selected");
            //set_data_for_chart(type, title_short)
        }
        else if (type == 4) { 
            
            this.setState({

                data5_sensor: this.state.data5_sensor_365d,
                data5: this.state.data5_365d

            }
            );
            $("#" + title_short + "_t" + type).addClass("date_pic_selected");
            //set_data_for_chart(type, title_short)
        }
    }


    renderChartColumn(data_tmp) {
        //+" ℃"
        ////console.log(this.state.data5);

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
        try {
            if (data_tmp.length > 0)
                return (
                    <Column {...config44} />
                );
            else {
                return (< div style={{ "text-align": "center", "font-weight": "bold", "font-size": "25px", "letter-spacing": "4px" }} className='mt-5' > No Data</div >);
            }
        } catch (err) {
           ////console.log(err)
        }
    }


    renderChartColumn2(data_tmp) {
        //+" ℃"
        ////console.log(this.state.data5);
        var config44 = {
            "data": data_tmp,
            xField: 'year',
            height: 380,
            width: 400,
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
        const config = {
            data: data_tmp,
            isGroup: false,
            xField: 'value',
            yField: 'year',

            /** 自定义颜色 */
            color: ['#ffbf1f', '#000'],
            range: {

                color: 'l(0) 0:#ffbf1f 1:#000000',
            },
            seriesField: 'category',
            marginRatio: 0,
            label: {
                // 可手动配置 label 数据标签位置
                position: 'middle',
                // 'left', 'middle', 'right'
                // 可配置附加的布局方法
                layout: [
                    // 柱形图数据标签位置自动调整
                    {
                        type: 'interval-adjust-position',
                    }, // 数据标签防遮挡
                    {
                        type: 'interval-hide-overlap',
                    }, // 数据标签文颜色自动调整
                    {
                        type: 'adjust-color',
                    },
                ],
            },
        };
        // return ;
        try {
            if (data_tmp.length > 0)
                return (
                    <Bar {...config} />
                );
            else {
                return (< div style={{ "text-align": "center", "font-weight": "bold", "font-size": "25px", "letter-spacing": "4px" }} className='mt-5' > No Data</div >);
            }
        } catch (err) {
           ////console.log(err)
        }
    }



    renderChartBar(data_tmp) {
        //+" ℃"
        ////console.log(this.state.data5);
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
        if (data_tmp.length > 0)
            return (
                <Bar {...config44} />
            );
        else {
            return (< div style={{ "text-align": "center", "font-weight": "bold", "font-size": "25px", "letter-spacing": "4px" }} className='mt-5' > No Data</div >);
        }
    }


    renderChart1() {
        ////console.log(this.state.data5);

    }

    inArray(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (haystack[i] == needle) return true;
        }
        return false;
    }

    renderBottomDashboard() {
        const config1 = {
            percent: 0.30,
            shape: 'diamond',
            outline: {
                border: 4,
                distance: 8,
            },
            wave: {
                length: 128,
            },
            pattern: {
                type: 'line',
                cfg: {
                    size: 9,
                    padding: 4,
                    rotation: 0,
                    fill: '#FFF',
                    isStagger: true,
                }
            },
            outline: {
                border: 4,
                distance: 4,
                style: {
                    stroke: '#000',
                    strokeOpacity: 0.65,
                },
            },
            wave: {
                length: 128,
            },
            theme: {
                styleSheet: {
                    brandColor: '#ffbf1f',
                },
            },
        };
        const config2 = {
            percent: 0.48,
            shape: 'diamond',
            outline: {
                border: 4,
                distance: 8,
            },
            wave: {
                length: 128,
            },
            pattern: {
                type: 'line',
            },
            outline: {
                border: 4,
                distance: 4,
                style: {
                    stroke: '#000',
                    strokeOpacity: 0.65,
                },
            },
            wave: {
                length: 128,
            },
            theme: {
                styleSheet: {
                    brandColor: '#ffbf1f',
                },
            },
        };
        const config3 = {
            percent: 0.27,
            shape: 'diamond',
            outline: {
                border: 4,
                distance: 8,
            },
            wave: {
                length: 128,
            },
            pattern: {
                type: 'line',
                cfg: {
                    size: 10,
                    padding: 4,
                    rotation: 0,
                    fill: '#FFF',
                    isStagger: true,
                }
            },
            outline: {
                border: 4,
                distance: 4,
                style: {
                    stroke: '#000',
                    strokeOpacity: 0.65,
                },
            },
            wave: {
                length: 128,
            },
            theme: {
                styleSheet: {
                    brandColor: '#ffbf1f',
                },
            },
        };
        const config4 = {
            percent: 0.84,
            shape: 'diamond',
            outline: {
                border: 4,
                distance: 8,
            },
            wave: {
                length: 128,
            },
            pattern: {
                type: 'line',
                cfg: {
                    size: 10,
                    padding: 4,
                    rotation: 0,
                    fill: '#FFF',
                    isStagger: true,
                }
            },
            outline: {
                border: 4,
                distance: 4,
                style: {
                    stroke: '#000',
                    strokeOpacity: 0.65,
                },
            },
            wave: {
                length: 128,
            },
            theme: {
                styleSheet: {
                    brandColor: '#ffbf1f',
                },
            },
        };

        return (
            <div className="mt-5 mb-5">
                <div className="l1 mt-5 pt-5">
                    <div className="liquid">
                        <div className="liquid_title  p-3">
                            Energy saving
                        </div>
                        <div className="newline"></div>
                        <Liquid {...config1} />
                    </div>
                    <div className="liquid">
                        <div className="liquid_title  p-3">
                            Energy flexibility
                        </div>
                        <div className="newline"></div>
                        <Liquid {...config2} />
                    </div>
                    <div className="liquid">
                        <div className="liquid_title  p-3">
                            Climate resilience
                        </div>
                        <div className="newline"></div>
                        <Liquid {...config3} />
                    </div>
                    <div className="liquid">
                        <div className="liquid_title  p-3">
                            Combined wellbeing
                        </div>
                        <div className="newline"></div>
                        <Liquid {...config4} />
                    </div>
                </div>
                <div className="l2 mt-5">
                    {this.renderLevel2("Thermal comfort", "Visual comfort")}
                </div>
                <div className="l3 mt-5 text-center">
                    {this.renderLevel3("Air quality")}
                </div>
                <div className="l4 mt-5 mb-5">
                    {this.renderLevel4("Sensors’ battery charge", "Data transmission efficiency (last 24h)")}
                </div>
            </div>
        );
    }

    renderLevel2(title1, title2) {
        const config5 = {
            percent: 0.55,
            shape: 'circle',
            outline: {
                border: 4,
                distance: 8,
            },
            wave: {
                length: 40,
            },
            pattern: {
                type: 'square',
                cfg: {
                    size: 10,
                    padding: 4,
                    rotation: 0,
                    fill: '#FFF',
                    isStagger: true,
                }
            },
            outline: {
                border: 4,
                distance: 4,
                style: {
                    stroke: '#000',
                    strokeOpacity: 0.65,
                },
            },
            wave: {
                length: 128,
            },
            theme: {
                styleSheet: {
                    brandColor: '#ffbf1f',
                },
            },
        };
        return (
            <div>
                <div className="l2-content text-center  mt-5">
                    <div className="l2-content-title  p-3">
                        {title1}
                    </div>
                    <div className="newline"></div>
                    <div className="inline_column-l">
                        <Liquid {...config5} />
                    </div>
                    <div className="inline_column-r">
                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-r">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, max
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    28 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-o">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, avg
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    23 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-g">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, min
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    19 C
                                </div>
                            </div>
                        </div>
                        <div className="newline"></div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                    </div>
                </div>
                <div className="l2-content">
                    <div className="l2-content-title  p-3">
                        {title2}
                    </div>
                    <div className="newline"></div>
                    <div className="inline_column-l">
                        <Liquid {...config5} />
                    </div>
                    <div className="inline_column-r">
                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-r">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, max
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    28 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-o">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, avg
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    23 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-g">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, min
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    19 C
                                </div>
                            </div>
                        </div>
                        <div className="newline"></div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                    </div>
                </div>
            </div>
        );
    }


    renderLevel4(title1, title2) {

        return (
            <div>
                <div className="l2-content mt-5">
                    <div className="l2-content-title  p-3">
                        {title1}
                    </div>

                    <div className="inline_column-r mt-5">
                        <div className="inline m-2 text-center">
                            <img src={b1} className="image_l4" />
                            <div className="newline"></div>
                            22 Sensors
                            <div className="newline"></div>
                            <div className="l4_optimal">
                                Optimal
                            </div>
                        </div>
                        <div className="inline m-2 text-center">
                            <img src={b2} className="image_l4" />
                            <div className="newline"></div>
                            22 Sensors
                            <div className="newline"></div>
                            <div className="l4_good">
                                Good
                            </div>
                        </div>
                        <div className="inline m-2 text-center">
                            <img src={b3} className="image_l4" />
                            <div className="newline"></div>
                            22 Sensors
                            <div className="newline"></div>
                            <div className="l4_low">
                                Low
                            </div>
                        </div>
                        <div className="inline m-2 text-center">
                            <img src={b4} className="image_l4" />
                            <div className="newline"></div>
                            22 Sensors
                            <div className="newline"></div>
                            <div className="l4_empty">
                                Empty
                            </div>
                        </div>

                    </div>
                </div>
                <div className="l2-content">
                    <div className="l2-content-title  p-3">
                        {title2}
                    </div>

                    <div className="inline_column-r mt-5">
                        <div className="inline m-2 text-center">
                            <img src={w1} className="image_l4" />
                            <div className="newline"></div>
                            22 Sensors
                            <div className="newline"></div>
                            <div className="l4_optimal text-center">
                                Optimal
                            </div>
                        </div>
                        <div className="inline m-2 text-center">
                            <img src={w2} className="image_l4" />
                            <div className="newline"></div>
                            6 Sensors
                            <div className="newline"></div>
                            <div className="l4_good text-center">
                                Good
                            </div>
                        </div>
                        <div className="inline m-2 text-center">
                            <img src={w3} className="image_l4" />
                            <div className="newline"></div>
                            2 Sensors
                            <div className="newline"></div>
                            <div className="l4_low text-center">
                                Poor
                            </div>
                        </div>
                        <div className="inline m-2 text-center">
                            <img src={w4} className="image_l4" />
                            <div className="newline"></div>
                            0 Sensors
                            <div className="newline"></div>
                            <div className="l4_empty text-center">
                                Inactive
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    renderLevel3(title1) {
        const config5 = {
            percent: 0.55,
            shape: 'diamond',
            outline: {
                border: 4,
                distance: 8,
            },
            wave: {
                length: 40,
            },
            pattern: {
                type: 'line',
                cfg: {
                    size: 10,
                    padding: 4,
                    rotation: 0,
                    fill: '#FFF',
                    isStagger: true,
                }
            },
            outline: {
                border: 4,
                distance: 4,
                style: {
                    stroke: '#000',
                    strokeOpacity: 0.65,
                },
            },
            wave: {
                length: 128,
            },
            theme: {
                styleSheet: {
                    brandColor: '#ffbf1f',
                },
            },
        };
        return (
            <div className="text-center mt-5">
                <div className="l3-content-title text-center p-3">
                    {title1}
                </div>
                <div className="newline"></div>
                <div className="l3-content text-right">


                    <div className="inline_column-r">
                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-r">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, max
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    28 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-o">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, avg
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    23 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-g">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, min
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    19 C
                                </div>
                            </div>
                        </div>
                        <div className="newline"></div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                    </div>
                </div>
                <div className="l3-content-middle">

                    <Liquid {...config5} />

                </div>
                <div className="l3-content">

                    <div className="inline_column-r">
                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-r">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, max
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    28 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-o">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, avg
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    23 C
                                </div>
                            </div>
                        </div>

                        <div className="value_content">
                            <div className="inline circle-wrapper">
                                <div className="circle-g">
                                </div>
                            </div>
                            <div className="inline">
                                <div className="circle-title">
                                    Temp, min
                                </div>
                                <div className="newline"></div>
                                <div className="circle-title">
                                    19 C
                                </div>
                            </div>
                        </div>
                        <div className="newline"></div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                        <div className="value_content">

                        </div>
                    </div>
                </div>
            </div>
        );
    }


    detailSri() {
        window.location.href = "/sri";
    }

    renderZoneInfo(zone) {
            /*"B02Z01": {
                "sensors": {
                    "sph_p": {
                        "22050183": [
                            "co2"
                        ],*/
            var zoneElements = [];
            var sensorTypes = [];
        
            var sensors = [];

            for (var key3 in building_str.zones[zone].sensors.sph_p) {
               ////console.log(key3)
               ////console.log(parseInt(key3))
                sensors[sensors.length] = parseInt(key3);
            }

           ////console.log(sensors)

            for (var key2 in this.state.sensor_detail) {
                if (!sensorTypes.includes(this.state.sensor_detail[key2].measure_name)) {
                    sensorTypes[sensorTypes.length] = this.state.sensor_detail[key2].measure_name;
                }
        }
       ////console.log("sensorTypes",sensorTypes)
        for (var key in sensorTypes) {
            var x = 0;
            var g = 0;
            var ind = 0;
                for (var key2 in this.state.sensor_detail) {
                   ////console.log(this.state.sensor_detail[key2].sensor_serial)
                    if (sensors.includes(this.state.sensor_detail[key2].sensor_serial)) {
                       ////console.log("in1")
                        if (sensorTypes[key].localeCompare(this.state.sensor_detail[key2].measure_name) === 0) {
                           ////console.log("in2")
                           ////console.log("val", this.state.sensor_detail[key2].measure_value)
                            x += parseFloat(this.state.sensor_detail[key2].measure_value);
                           ////console.log("x",x)
                            g++;
                            ind = key2;
                        }
                           
                    }
            }
           ////console.log(sensorTypes[key])
           ////console.log("g",g)  
           ////console.log("x", x) 
            //faTemperatureHigh, faTint, faCloud, faCompressAlt, faSmog, faBatteryFull,faLightbulb
            var key2 = ind;
            if (g > 0) {
                var z = x / g;
                if (this.state.sensor_detail[key2].measure_name.localeCompare("Cell temperature") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">&#8451;</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110" , "position" : "relative" , "top" : "5px" , "margin-left" : "3px" }} icon={faTemperatureHigh} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );

                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("Air temperature") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">&#8451;</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faTemperatureHigh} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("Lux 1") === 0 || this.state.sensor_detail[key2].measure_name.localeCompare("Lux 2") === 0 || this.state.sensor_detail[key2].measure_name.localeCompare("Lux 3") === 0 || this.state.sensor_detail[key2].measure_name.localeCompare("Lux 4") === 0 || this.state.sensor_detail[key2].measure_name.localeCompare("Lux 5") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width":"100px" }}> {z.toFixed(2)} <span class="wrap2-unit">Lm/m²</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faLightbulb} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("Battery (V)") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">V</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faBatteryFull} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("Atm. pressure") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">hPa</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faCompressAlt} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("Relative humidity") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">%</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faTint} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("CO2") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">ppm</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faCloud} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("TVOC") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">ppb</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faCloud} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else if (this.state.sensor_detail[key2].measure_name.localeCompare("PM 1 (MASS)") === 0 || this.state.sensor_detail[key2].measure_name.localeCompare("PM 2.5 (MASS)") === 0 || this.state.sensor_detail[key2].measure_name.localeCompare("PM 4 (MASS)") === 0 || this.state.sensor_detail[key2].measure_name.localeCompare("PM 10 (MASS)") === 0) {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)} <span class="wrap2-unit">μg/m³</span></div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faSmog} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
                else {
                    zoneElements.push(
                        <div className="wrap1">
                            <div className="wrap2">
                                <div style={{ display: "inline-block", "width": "75px" }}>{z.toFixed(2)}</div> <FontAwesomeIcon style={{ "width": "20px", "height": "20px", "color": "#826110", "position": "relative", "top": "5px", "margin-left": "3px" }} icon={faTemperatureHigh} />
                            </div>

                            <div className="wrap3">
                                {sensorTypes[key]}
                            </div>
                        </div>
                    );
                }
            }
            }

           ////console.log(zoneElements)

        

        return zoneElements;
        
    }
    
    set_detail(office) {
        //alert(office)
       ////console.log(office)
      
        window.location.href = "/home_detail/" + office;
    }

    renderZones() {

        var x = ``;;
        var zoneElements = [];
        for (var key in building_str.zones) {
            zoneElements.push();
        }
       // return zoneElements;
        var context = this;
        let arr = Object.values(building_str);
        let arr2 = Object.values(arr[5]);
       ////console.log(arr)
        return arr2.map(function (o, i) {
            if (context.state.location_list.includes(arr2[i]["title"]) || context.state.user_type === 3) { 
            return (<div key={i} id={"office_" + i} className="container_c2" style={{ "cursor": "pointer", "opacity": "0.9", "background-color": "#ffbf1f", backgroundImage: `url(${collectief_logo4})`, "background-position": "right bottom", "background-repeat": "no-repeat", "background-size": "150px 150px","border":"2px solid #000","border-radius":"15px" }}>
                <div className="" onClick={(event) => (context.set_detail(arr2[i]["title"]))}>
                    <div className="row-title">
                        {arr2[i]["title"]}
                    </div>
                    <div style={{ "text-align": "left" }} className="p-4">
                        {context.renderZoneInfo(arr2[i]["title"])}
                    </div>

                </div>
            </div>);
            }
        });
        
    }

    setDark(stat) {
        if (stat === 1) {
            $("#sun_mode").addClass("d-none")
            $("#dark_mode").removeClass("d-none")
            this.setState({dark:"light","color":"white"})
        }
        else {
            $("#dark_mode").addClass("d-none")
            $("#sun_mode").removeClass("d-none")
            this.setState({ dark: "dark", "color": "black" })
        }
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



        var data2 = [];
        var data3 = [];
        var data4 = [];
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


        if (this.state.user_type === 1) {
            var x = this.state.weather;
            var country = ""
            if (x.location && x.location.country)
                country = x.location.country
            return (
                <div className="main_panel">
                    <div className="container_main">
                        <div className="text-center">
                            <div className="container_c0">
                                <div class="row">

                                    <div className="home_l2 mt-4">
                                        {this.SimpleMap()}
                                    </div>
                                    <div className="newline"></div>
                                    <div className="newline"></div>
                                    <div className="text-center title_of_location2 pt-4">
                                        {this.state.country} . {this.state.region} . {this.state.name} . {this.state.current_location_title}
                                    </div>
                                    <div className="home_l1_left mt-4">
                                        <div className="p-2 text-center title_of_location">
                                            {this.state.current_location_title}
                                        </div>
                                        {this.renderWeather()}
                                    </div>
                                    <div className="home_l1_right">
                                        {this.renderWeatherPerDay()}
                                    </div>

                                </div>
                                <div class="row">
                                    {this.renderBottomDashboard()}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            )
        }
        else if (this.state.user_type === 2) {


            return (
                <div className="main_panel">
                    <div className="container_main">
                        <div className="text-center">
                            <div className="container_c0">
                                <div className="row m-5 mb-5">
                                    <div className="home_l1_left2 text-bold ">
                                        {this.renderChartColumn2(this.state.get_sri)}
                                    </div>
                                    <div className="home_l1_right2 pointer" onClick={(event) => this.detailSri()}>
                                        <div>
                                            <b>
                                                SRI Average
                                            </b>
                                        </div>
                                        {this.renderGauge()}
                                        <div className="text-right">
                                            <b>
                                                <button className="main_header_button">
                                                    See detail ...
                                                </button>
                                            </b>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mt-5">

                                    <div className="home_l2 mt-5">
                                        {this.SimpleMap()}
                                    </div>
                                    <div className="newline"></div>
                                    <div className="text-center title_of_location2 pt-4">
                                        {this.state.country} . {this.state.region} . {this.state.name} . {this.state.current_location_title}
                                    </div>
                                    <div className="home_l1_left mt-4">
                                        <div className="p-2 text-center title_of_location">
                                            {this.state.current_location_title}
                                        </div>
                                        {this.renderWeather()}
                                    </div>
                                    <div className="home_l1_right mt-4">
                                        {this.renderWeatherPerDay()}
                                    </div>
                                </div>
                                <div class="row">
                                    {this.renderBottomDashboard()}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            )
        }
        else if (this.state.user_type === 3) {
            return (
                <div className="main_panel">
                    <div className="container_main">
                        <div style={{}} dir="ltr">



                            <div className="container_c2" style={{ "opacity": "0.9", "background-color": "#D1A40B", backgroundImage: `url(${collectief_logo4})`, "background-position": "right bottom", "background-repeat": "no-repeat", "background-size": "150px 150px" }}>
                                <div className="">
                                    <div className="row-title2">

                                        <div>
                                            {building_str.building_name}
                                        </div>

                                    </div>
                                    <div>
                                        {this.renderWeatherPerDay2()}
                                    </div>
                                </div>
                            </div>
                            {this.renderZones()}
                            <div className="newline"></div>
                            <div className="text-center">
                                {this.listBoxes()}
                            </div>

                            <div id="newRows" >
                                <div style={{ "text-align": "left", "position": "relative", "left": "15px", "top": "15px" }}>
                                    <FontAwesomeIcon icon={faMoon} style={{ "font-size": "30px", "cursor": "pointer" }} id="dark_mode" className="d-none" onClick={(event) => this.setDark(0)} />
                                    <FontAwesomeIcon icon={faSun} style={{ "font-size": "30px", "cursor": "pointer" }} id="sun_mode" onClick={(event) => this.setDark(1)} />
                                    &nbsp;&nbsp;<span style={{ "coloe": "gray", "font-weight": "bold" }}>Dark/Light mode</span>
                                </div>
                                {this.listBoxesNew()}
                            </div>
                            <div className="newline"></div>
                            <div className="container_main remove-part d-none pb-3" style={{ "text-align": "left", "display": "inline-block", "background-color": "#fff", "opacity": "0.6", width: "92%", "float": "right", "border-radius": "10px", "border": "1px solid #ccc" }}>
                                <div style={{ "text-align": "center" }}>
                                    <div className=" text-center" style={{}}>
                                        <FontAwesomeIcon onClick={(event) => this.addBoxes()} icon={faPlus} className="arrow2" style={{ "color": "#ffbf1f", "height": "60px", width: "100px", "opacity": "1" }} />
                                    </div>
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

                                            <select className="ml-1" id="box_function" onChange={(event) => this.chooseOperation(event)} value={this.state.box_function} style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                                                <option value="-1">Choose Element type</option>
                                                <option value="0">Chart</option>
                                                <option value="1">Other</option>
                                            </select>

                                        </div>

                                        <div id="level0_0" className="d-none mb-3">

                                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Source Type</span>
                                            <div className="newline mt-1"></div>

                                            <select className="ml-1" id="source_type" onChange={(event) => this.chooseOperation_source(event)} value={this.state.source_type} style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                                                <option value="-1">Choose Source type</option>
                                                <option value="0">From Location</option>
                                                <option value="1">From Sensor</option>
                                            </select>

                                        </div>

                                        <div id="level11" className="d-none mb-3">
                                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Location</span>
                                            <div className="newline mt-1"></div>
                                            <select className="ml-1" id="location_s" style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
                                                <option value="">Choose location</option>
                                                {this.renderLocationOptions()}
                                            </select>
                                        </div>

                                        <div id="level11_1" className="d-none mb-3">
                                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Sensor</span>
                                            <div className="newline mt-1"></div>
                                            <select className="ml-1" id="sensor_s" style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
                                                <option value="">Choose sensor</option>
                                                {this.renderSensorsOptions()}
                                            </select>
                                        </div>

                                        <div id="level1" className="d-none mb-3">

                                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Chart Type</span>
                                            <div className="newline mt-1"></div>

                                            <select className="ml-1" id="box_chart" onChange={(event) => this.chooseOperation_chart(event)} value={this.state.box_chart} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
                                                <option value="0">Column Chart</option>
                                                <option value="1">Line   Chart</option>
                                                <option value="2">Bar   Chart</option>
                                            </select>

                                        </div>


                                        <div id="level2" className="d-none mb-3">

                                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Parametr Type</span>
                                            <div className="newline mt-1"></div>
                                            <select className="ml-1" id="box_parametr" onChange={(event) => this.chooseOperation_parametr(event)} value={this.state.box_parametr} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
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
                                            <select className="ml-1" id="box_value_type" onChange={(event) => this.chooseOperation_value_type(event)} value={this.state.box_value_type} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }} multiple>
                                                <option value="0">Average</option>
                                                <option value="1">Max</option>
                                                <option value="2">Min</option>
                                            </select>

                                        </div>


                                        <div id="level4" className="d-none mb-4">

                                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Type</span>
                                            <div className="newline mt-1"></div>

                                            <select className="ml-1" id="box_other" value={this.state.box_other} onChange={(event) => this.chooseOperation_other(event)} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
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


                                        <div className="newline mt-1"></div>



                                        <div id="level2_0" className="mb-3">

                                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Parametr Type</span>
                                            <div className="newline mt-1"></div>
                                            <select className="ml-1" id="box_parametr_2" style={{ width: "90%", "border-radius": "5px", "padding": "8px" }}>
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
                    </div>
                </div>
            );
        }
        else if (this.state.user_type === 4) {
            return (
                <div className="main_panel">
                    <div className="container_main">
                        <div style={{}} dir="ltr">
                            

                            
                            <div className="container_c2" style={{ "opacity": "0.9", "background-color": "#D1A40B", backgroundImage: `url(${collectief_logo4})`, "background-position": "right bottom", "background-repeat": "no-repeat", "background-size": "150px 150px" }}>
                                <div className="">
                                    <div className="row-title2">

                                        <div>
                                            {building_str.building_name}
                                        </div>
                                        
                                    </div>
                                    <div>
                                        {this.renderWeatherPerDay2()}
                                    </div>
                                </div>
                            </div>
                            {this.renderZones()}
                            <div className="newline"></div>
                            <div className="text-center">
                                {this.listBoxes()}
                            </div>

                            <div id="newRows" >
                                <div style={{"text-align":"left","position":"relative","left":"15px","top":"15px"}}>
                                    <FontAwesomeIcon icon={faMoon} style={{"font-size":"30px","cursor":"pointer"}} id="dark_mode" className="d-none" onClick={(event) => this.setDark(0)} />
                                    <FontAwesomeIcon icon={faSun} style={{ "font-size": "30px", "cursor": "pointer" }} id="sun_mode" onClick={(event) => this.setDark(1)} />
                                    &nbsp;&nbsp;<span style={{"coloe":"gray","font-weight":"bold"} }>Dark/Light mode</span>
                                </div>
                                {this.listBoxesNew()}
                            </div>
                            <div className="newline"></div>
                            <div className="container_main remove-part d-none pb-3" style={{ "text-align": "left", "display": "inline-block", "background-color": "#fff", "opacity": "0.6", width: "92%", "float": "right", "border-radius": "10px", "border": "1px solid #ccc" }}>
                                <div style={{ "text-align": "center" }}>
                                    <div className=" text-center" style={{}}>
                                        <FontAwesomeIcon onClick={(event) => this.addBoxes()} icon={faPlus} className="arrow2" style={{ "color": "#ffbf1f", "height": "60px", width: "100px", "opacity": "1" }} />
                                    </div>
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

                                                <select className="ml-1" id="box_function" onChange={(event) => this.chooseOperation(event)} value={this.state.box_function} style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                                                    <option value="-1">Choose Element type</option>
                                                    <option value="0">Chart</option>
                                                    <option value="1">Other</option>
                                                </select>

                                            </div>

                                            <div id="level0_0" className="d-none mb-3">

                                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Source Type</span>
                                                <div className="newline mt-1"></div>

                                                <select className="ml-1" id="source_type" onChange={(event) => this.chooseOperation_source(event)} value={this.state.source_type} style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                                                    <option value="-1">Choose Source type</option>
                                                    <option value="0">From Location</option>
                                                    <option value="1">From Sensor</option>
                                                </select>

                                            </div>

                                            <div id="level11" className="d-none mb-3">
                                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Location</span>
                                                <div className="newline mt-1"></div>
                                                <select className="ml-1" id="location_s" style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
                                                    <option value="">Choose location</option>
                                                    {this.renderLocationOptions()}
                                                </select>
                                            </div>

                                            <div id="level11_1" className="d-none mb-3">
                                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Sensor</span>
                                                <div className="newline mt-1"></div>
                                                <select className="ml-1" id="sensor_s" style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
                                                    <option value="">Choose sensor</option>
                                                    {this.renderSensorsOptions()}
                                                </select>
                                            </div>

                                            <div id="level1" className="d-none mb-3">

                                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Chart Type</span>
                                                <div className="newline mt-1"></div>

                                                <select className="ml-1" id="box_chart" onChange={(event) => this.chooseOperation_chart(event)} value={this.state.box_chart} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
                                                    <option value="0">Column Chart</option>
                                                    <option value="1">Line   Chart</option>
                                                    <option value="2">Bar   Chart</option>
                                                </select>

                                            </div>


                                            <div id="level2" className="d-none mb-3">

                                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Parametr Type</span>
                                                <div className="newline mt-1"></div>
                                                <select className="ml-1" id="box_parametr" onChange={(event) => this.chooseOperation_parametr(event)} value={this.state.box_parametr} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
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
                                                <select className="ml-1" id="box_value_type" onChange={(event) => this.chooseOperation_value_type(event)} value={this.state.box_value_type} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }} multiple>
                                                    <option value="0">Average</option>
                                                    <option value="1">Max</option>
                                                    <option value="2">Min</option>
                                                </select>

                                            </div>


                                            <div id="level4" className="d-none mb-4">

                                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Type</span>
                                                <div className="newline mt-1"></div>

                                                <select className="ml-1" id="box_other" value={this.state.box_other} onChange={(event) => this.chooseOperation_other(event)} style={{ width: "180px", "border-radius": "5px", width: "90%", "padding": "8px" }}>
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


                                            <div className="newline mt-1"></div>



                                            <div id="level2_0" className="mb-3">

                                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Parametr Type</span>
                                                <div className="newline mt-1"></div>
                                                <select className="ml-1" id="box_parametr_2" style={{ width: "90%", "border-radius": "5px", "padding": "8px" }}>
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
                    </div>
                </div>
            );
        }
    }
}

export default Home;