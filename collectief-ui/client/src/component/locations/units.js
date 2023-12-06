
import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import GoogleMapReact from 'google-map-react';
import menu_project_b from '../../assets/image/menu_video_b.png';
import info from '../../assets/image/info.png';
import action from '../../assets/image/action.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faEdit, faExchange, faEye, faEyeLowVision, faPlus, faRemove, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import $ from "jquery";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
const customStyles3 = {
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
const customStyles5 = {
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
let id_for_edit = -1;
let id_for_close = -1;
let id_for_access = -1;
let title_edit = "";
let location_type_edit = -1;
let type_values = ["Cluster", "Building", "Unit", "Sub-unit"]
class Units extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            items: [],
            users_access: [],
            modalIsOpen3: false,
            setIsOpen3: false,
            modalIsOpen4: false,
            setIsOpen4: false,
            modalIsOpen5: false,
            setIsOpen5: false,
            modalIsOpen6: false,
            setIsOpen6: false,
            modalIsOpen2: false,
            setIsOpen2: false,
            box_function2: -1,
            box_function3: -1,
            loading: "text-center",
            sensor_info: [],
            location_title: [],
            title_edit: "",
            location_types: [],
            location_types_parent: [],
            lat: -1,
            lng: -1

        };
        this.setState({
            items: [],
            loading: "text-center",
            sensor_info: [],
            temperature: `<div className={this.state.loading}>  
                  <Spinner3 customText="Loading"/>
                  </div>`
        });


    }

    componentDidMount() {
        //this.sensors();
        this.get_location();
        this.get_location_types();
        this.set_buttons();
        //setInterval(() => {

        //this.sensors();

        //}, 20000);

    }

    setLocation(e) {
        console.log(e)
        console.log(e.lat)
        console.log(e.lng)

        this.setState({ lat: e.lat, lng: e.lng })
        console.log(e.lat)
        console.log(e.lng)
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

            border: '5px solid #f44336',
            borderRadius: K_HEIGHT,
            backgroundColor: 'white',
            textAlign: 'center',
            color: '#3f51b5',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 4
        };

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '35vh', width: '92%', position: 'relative', left: '5px' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyB5Kh6v1aSxzZKkwqMQRuwgony1HDJ0s80" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    onClick={(event) => (this.setLocation(event))}
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

            border: '5px solid #f44336',
            borderRadius: K_HEIGHT,
            backgroundColor: 'white',
            textAlign: 'center',
            color: '#3f51b5',
            fontSize: 16,
            fontWeight: 'bold',
            padding: 4
        };
        return (
            <div lat={this.state.lat} lng={this.state.lng} style={greatPlaceStyle}>
                {''}
            </div>
        );
    }

    openModal2() {
        //setIsOpen(true);
        this.setState({
            setIsOpen2: true
        });
    }

    afterOpenModal2() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal2() {

        this.setState({
            setIsOpen2: false,
            box_function2: -1
        });
    }


    openModal4(id) {
        id_for_close = id;

        //setIsOpen(true);
        this.setState({
            setIsOpen4: true
        });
    }

    afterOpenModal4() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal4() {

        this.setState({
            setIsOpen4: false

        });
    }


    openModal6(id) {
        id_for_access = id;
        this.get_users_access()
        //setIsOpen(true);
        this.setState({
            setIsOpen6: true
        });
    }

    afterOpenModal6() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal6() {

        this.setState({
            setIsOpen6: false

        });
    }


    openModal5(id) {
        id_for_edit = id;
        console.log(this.state.location_title)
        //alert(id_for_edit)
        for (var key in this.state.location_title) {
            if (this.state.location_title[key].id == id_for_edit) {
                $("#title_edit").val(this.state.location_title[key].title)
                title_edit = this.state.location_title[key].title;
                location_type_edit = this.state.location_title[key].type;
                this.setState({ "title_edit": title_edit })
                //alert(this.state.location_title[key].title)
            }
        }
        //setIsOpen(true);
        this.setState({
            setIsOpen5: true
        });
    }

    afterOpenModal5() {
        $("#title_edit").val(title_edit)
        $("#location_type_edit").val(location_type_edit)
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal5() {

        this.setState({
            setIsOpen5: false

        });
    }


    openModal3() {
        //setIsOpen(true);
        this.setState({
            setIsOpen3: true
        });
    }

    afterOpenModal3() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal3() {

        this.setState({
            setIsOpen3: false,
            box_function3: -1
        });
    }


    create_projects() {
        //return <Redirect to="/list_projects/create_projects" />
        window.location.href = "/list_projects/create_projects";
    }

    sensors() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
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
                        sensor_number: result.result.length,
                        sensor_info: result.result,
                        loading: "d-none"
                    }
                    );
                    console.log(result);
                    var d = new Date();
                    var utcDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
                    let date = utcDate;
                    let today = date.toLocaleDateString();

                    console.log("today", today);
                    var s = date.getSeconds();
                    var m = date.getMinutes();
                    var h = date.getHours();
                    if (s < 10) {
                        s = "0" + s;
                    }
                    if (m < 10) {
                        m = "0" + m;
                    }
                    if (h < 10) {
                        h = "0" + h;
                    }
                    var current_time = h + ":" + m + ":" + s;
                    $("#last_update").html(today + " " + current_time)
                    {
                        //alert( pro_id );

                        var d = new Date();
                        var utcDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
                        let date = utcDate;
                        let today = date.toLocaleDateString();
                        console.log("today", today)
                        var today_tmp = today.split("/");
                        console.log("today_tmp", today_tmp)
                        let today1 = today_tmp[0];
                        let today2 = today_tmp[1];
                        let today3 = today_tmp[2];

                        var s = date.getSeconds();
                        var m = date.getMinutes();
                        var h = date.getHours();
                        var x = today3 + "-" + today1 + "-" + today2 + " " + h + ":" + m + ":" + s;
                        if (s < 10) {
                            s = "0" + s;
                        }
                        if (m < 10) {
                            m = "0" + m;
                        }
                        if (h < 10) {
                            h = "0" + h;
                        }

                        console.log("x", x)
                        //let today = date.toLocaleTimeString();

                        var current_time = h + ":" + m + ":" + s;
                        $("#last_update").html(today + " " + current_time)
                        // $(".header_text").click();
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


    show_project_new(context, token) {
        window.location.href = `/list_projects/show_project?token=${token}`;
        //return <Redirect to="/list_projects/show_projects" />
        //context.props.history.push('/list_projects/show_projects', { id: token });
    }

    renderUsersAccess() {
        var context = this;
        return this.state.users_access.map(function (o, i) {
            // var x = context.state.sensor_info[i].p_created_at.split("T");
            return (
                <div className="m-1" style={{ "text-align": "right", "display": "inline-table", "border-radius": "10px", "padding": "6px", "padding-right": "6px", "padding-top": "0px", "border": "1px solid gray" }}>
                    <div dir="rtl" onClick={(e) => context.delete_(context.state.users_access[i].id)}>
                        <FontAwesomeIcon icon={faClose} className="hand close_notif mt-1" />
                    </div>
                    {context.state.users_access[i].email}
                </div>
            );
        });
    }


    set_buttons() {
        const cookies = new Cookies();
        var user_type = cookies.get('user_type');
        if (user_type == 1) {
            $("#cluster_b").removeClass("d-none")
            $("#building_b").removeClass("d-none")
            $("#unit_b").removeClass("d-none")
            $("#room_b").removeClass("d-none")
        }
        else if (user_type == 2) {
            $("#cluster_b").addClass("d-none")
            $("#building_b").removeClass("d-none")
            $("#unit_b").removeClass("d-none")
            $("#room_b").removeClass("d-none")
        }
        else if (user_type == 3) {
            $("#cluster_b").addClass("d-none")
            $("#building_b").removeClass("d-none")
            $("#unit_b").removeClass("d-none")
            $("#room_b").removeClass("d-none")
        }
        else if (user_type == 4) {
            $("#cluster_b").addClass("d-none")
            $("#building_b").addClass("d-none")
            $("#unit_b").removeClass("d-none")
            $("#room_b").removeClass("d-none")
        }
    }

    renderRows() {
        var context = this;
        return this.state.location_title.map(function (o, i) {
            // var x = context.state.sensor_info[i].p_created_at.split("T");
            var x = "-";
            x = type_values[parseInt(context.state.location_title[i].type) - 1];
            if (x == "") {
                x = "-";
            }
            var l = context.state.location_title[i].location_detail;
            var cluster = "-"
            var building = "-"
            if (l && l.cluster)
                cluster = l.cluster
            if (l && l.building)
                building = l.building
            console.log("type_value", parseInt(context.state.location_title[i].type))
            return (<tr>
                <td>
                    {(i + 1)}
                </td>

                <td>
                    {context.state.location_title[i].title}
                </td>
                <td>
                    {building}
                </td>
                <td>
                    {cluster}
                </td>
                
                <td>
                    {x}
                </td>
                <td>
                    {context.state.location_title[i].date}
                </td>
                <td onClick={(e) => context.openModal6(context.state.location_title[i].id)}>
                    {<FontAwesomeIcon icon={faUserPlus} className="arrow3 hand" />}
                </td>
                <td onClick={(e) => context.openModal4(context.state.location_title[i].id)}>
                    {<FontAwesomeIcon icon={faRemove} className="arrow3 hand" />}
                </td>
                <td onClick={(e) => context.openModal5(context.state.location_title[i].id)}>
                    {<FontAwesomeIcon icon={faEdit} className="arrow3 hand" />}
                </td>


            </tr>);
        });
        /*
          <td>
          {<img src={action}></img>}
          </td>
          <td>
          
          </td>
          */
        //{<img src={info} style={{cursor:"pointer"}} value={context.state.items[i].p_token} onClick={(e) =>context.show_project_new(context,context.state.items[i].p_token)}></img>}
        var x = "";
        return (<tr>
            <td>
                0
            </td>
            <td>
                1
            </td>
            <td>
                2
            </td>
            <td>
                3
            </td>
            <td>
                4
            </td>
            <td>
                5
            </td>
        </tr>);

    }

    /* renderRows(){
       console.log("renderRows");
       this.createRow();
     }*/

    save_location(schedule, index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        if ($("#location_type").val() != "-1" && $("#title").val() != "") {
            return fetch('http://' + global.config.vals.root.ip + ':3002/save_location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "title": $("#title").val(), "type": $("#location_type").val(), "parent": $("#location_parent").val(), lat: this.state.lat, lng: this.state.lng })
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
                        $("#title").val("")
                        this.get_location();
                        toast.success('The new Location is saved', {
                            position: "top-right",
                            autoClose: 2500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        this.closeModal2()
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
        } else {
            if ($("#title").val() === "")
                toast.error('Please enter title of location', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            if ($("#location_type").val() === "-1")
                toast.error('Please enter type of location', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        }
    }


    save_access(schedule, index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        if ($("#user_email").val() != "") {
            return fetch('http://' + global.config.vals.root.ip + ':3002/save_access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "user": $("#user_email").val(), "id": id_for_access })
            })
                .then(data => data.json())
                .then(
                    (result) => {
                        /*this.setState({
                          isLoaded: true,
                          items: result.items
                        });*/
                        this.get_users_access()
                        console.log(result)
                        for (var x = 1; x <= 5; x++) {
                            $("#id" + x).css("color", "gray");
                        }
                        $("#user_email").val("")
                        this.get_location();
                        toast.success('Done', {
                            position: "top-right",
                            autoClose: 2500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        this.closeModal2()
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
        } else {
            if ($("#user_email").val() === "")
                toast.error('Please enter email of user', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

        }
    }


    edit_location(schedule, index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/edit_location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "title": $("#title_edit").val(), "type": $("#location_type_edit").val(), id: id_for_edit })
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
                    $("#title").val("")
                    this.get_location();
                    toast.success('Done', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    this.closeModal5()
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


    remove_location(schedule, index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/remove_location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "id": id_for_close })
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
                    $("#title").val("")
                    this.get_location();
                    toast.success('Done', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    this.closeModal4()
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


    get_location() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_units', {
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
                        nt_tmp[key].type = result.result[key].type
                        nt_tmp[key].date = result.result[key].date
                        nt_tmp[key].location_detail = JSON.parse(result.result[key].location_detail)
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


    getClusters() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), type: 1 })
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
                        //nt_tmp[key].type = result.result[key].type
                        //nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_types_parent: nt_tmp
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


    getBuildings() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
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
                    console.log(result.result)
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        //console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].title = result.result[key].title
                        //nt_tmp[key].type = result.result[key].type
                        //nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_types_parent: nt_tmp
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


    getRooms() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), type: 3 })
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
                        //nt_tmp[key].type = result.result[key].type
                        //nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        location_types_parent: nt_tmp
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



    get_location_types() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_types', {
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


                    }
                    this.setState({
                        location_types: nt_tmp
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


    get_users_access() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_users_access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), id: id_for_access })
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
                        nt_tmp[key].email = result.result[key].email


                    }
                    this.setState({
                        users_access: nt_tmp
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


    delete_(id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/delete_user_access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), id: id_for_access, id2: id })
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
                        nt_tmp[key].email = result.result[key].email


                    }
                    this.setState({
                        users_access: nt_tmp
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


    setEditText(event) {
        title_edit = event.target.value;
        this.setState({ "title_edit": title_edit })
    }

    renderLocationTypes() {
        /*<option value="0">Cluster</option>
        <option value="1">Building</option>
        <option value="2">Unit</option>
        <option value="3">Room</option>*/
        var context = this;
        return this.state.location_types.map(function (o, i) {
            // var x = context.state.sensor_info[i].p_created_at.split("T");
            return (
                <option value={context.state.location_types[i].id}> {context.state.location_types[i].title}</ option>
            );
        });
    }


    renderLocationParents() {
        /*<option value="0">Cluster</option>
        <option value="1">Building</option>
        <option value="2">Unit</option>
        <option value="3">Room</option>*/
        var context = this;
        return this.state.location_types_parent.map(function (o, i) {
            // var x = context.state.sensor_info[i].p_created_at.split("T");
            return (
                <option value={context.state.location_types_parent[i].id}> {context.state.location_types_parent[i].title}</ option>
            );
        });
    }



    CheckLocationType() {

        var location_type = $("#location_type").val()

        if (location_type == 1) {
            $("#parent_location").addClass("d-none")
            $("#building_location").addClass("d-none")
        }
        else if (location_type == 2) {
            this.getClusters();
            $("#parent_location").removeClass("d-none")
            $("#building_location").removeClass("d-none")
        }
        else if (location_type == 3) {
            this.getBuildings();
            $("#parent_location").removeClass("d-none")
            $("#building_location").addClass("d-none")
        }
        else if (location_type == 4) {
            this.getRooms();
            $("#parent_location").removeClass("d-none")
            $("#building_location").addClass("d-none")
        }

    }

    renderLocationTypesParent() {
        var context = this;
        return (
            <div>
                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }} id="location_parent_title"></span>
                <div className="newline mt-1"></div>
                <select className="ml-1" id="location_parent" style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                    <option value="-1">Choose Parent</option>
                    {context.renderLocationParents()}
                </select>
            </div>
        )
    }

    createLocation() {
        window.location.href = "/sensors/locations";
        //return false;
    }

    showClusters() {
        window.location.href = "/sensors/locations/clusters";
        //return false;
    }


    showBuildings() {
        window.location.href = "/sensors/locations/buildings";
    }

    showUnits() {
        window.location.href = "/sensors/locations/units";
    }

    showRooms() {
        window.location.href = "/sensors/locations/rooms";
    }


    render() {
        //

        //var ch = new CheckLogin1();
        //if (!ch.check_token()) {
        if (1 == 2) {
            //window.location.href = "/";
            //return false;
        } else {
            return (<div className="main_panel">
                <div className="container_main">
                    <div className="main_info">
                        <div className="container_main_l1 text-center" style={{ "vertical-align": "middle" }}>
                            <div className="text-left mb-3">
                                <button value="" onClick={(event) => this.createLocation()} className="main_header_button inline-table m-2"><FontAwesomeIcon icon={faPlus} className="icon-white inline-table" style={{ "padding-right": "8px" }} /> Create location </button>
                                <button value="" id="cluster_b" onClick={(event) => this.showClusters()} className="main_header_button inline-table m-2 d-none"><FontAwesomeIcon icon={faEye} className="icon-white inline-table" style={{ "padding-right": "8px" }} /> Clusters </button>
                                <button value="" id="building_b" onClick={(event) => this.showBuildings()} className="main_header_button inline-table m-2 border-bold d-none"><FontAwesomeIcon icon={faEye} className="icon-white inline-table" style={{ "padding-right": "8px" }} /> Buldings </button>
                                <button value="" id="unit_b" onClick={(event) => this.showUnits()} className="main_header_button inline-table m-2 border_bold d-none"><FontAwesomeIcon icon={faEye} className="icon-white inline-table" style={{ "padding-right": "8px" }} /> Units </button>
                                <button value="" id="room_b" onClick={(event) => this.showRooms()} className="main_header_button inline-table m-2 d-none"><FontAwesomeIcon icon={faEye} className="icon-white inline-table" style={{ "padding-right": "8px" }} /> Sub-unit </button>
                            </div>
                            <div className="text-left d-none" style={{ "vertical-align": "middle" }}>
                                <span style={{ "color": "#000;", "font-weight": "bold" }} >
                                    Last Update:
                                </span>
                                <div id="last_update" className="ml-1" style={{ "letter-spacing": "2px", "font-weight": "bold", "display": "inline-table", "background-color": "white" }} >

                                </div>
                            </div>
                            <table className="table mt-5">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Unit</th>
                                       
                                        <th>Building</th>
                                        <th>Cluster</th>
                                        <th>Type of Location</th>
                                        <th>Date</th>
                                        <th>Add/Edit Access</th>
                                        <th>Delete</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderRows()}
                                </tbody>
                            </table>
                            <div className={this.state.loading}>

                            </div>
                        </div>
                    </div>
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


                            <div className="newline mt-3"></div>

                            <div className="m-2" id="location">
                                <select className="ml-1" id="location_type" onClick={(event) => this.CheckLocationType()} style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                                    <option value="-1">Choose Location Type</option>
                                    {this.renderLocationTypes()}
                                </select>
                            </div>
                            <div className="newline mt-1"></div>

                            <div className="m-2 d-none" id="parent_location">
                                {this.renderLocationTypesParent()}
                            </div>
                            <div className="m-2" id="location_title">
                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Title</span>
                                <div className="newline mt-1"></div>
                                <input id="title" type="text" className="ml-1 mr-4" placeholder="title" style={{ border: "1px solid black", width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                            </div>
                            <div className="newline mt-4"></div>
                            <div id="building_location" className="d-none">
                                {this.SimpleMap()}
                            </div>
                            <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                                <button style={{ "padding": "10px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.save_location()} >
                                    Add
                                </button>
                            </div>

                        </div>


                    </Modal>
                </div>

                <div>

                    <Modal
                        isOpen={this.state.setIsOpen6}
                        onAfterOpen={this.afterOpenModal6}
                        onRequestClose={this.closeModal6}
                        style={customStyles3}
                        contentLabel="Example Modal"
                    >
                        <div style={{ "text-align": "right", "min-width": "400px", "border-bottom": "1px solid gray" }} className="mb-2 pb-2">
                            <button onClick={(event) => this.closeModal6()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                        </div>
                        <div className="m-2">

                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Username</span>
                            <div className="newline mt-1"></div>
                            <input id="user_email" type="text" className="ml-1 mr-1" placeholder="Username" style={{ border: "1px solid black", width: "80%", "padding": "8px", "border-radius": "5px" }} size="4" />
                            <div style={{ "display": "inline-table" }}>
                                <button style={{ "padding": "10px", "padding-left": "14px", "padding-right": "14px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.save_access()} >
                                    Add
                                </button>
                            </div>
                            <div className="newline mt-3"></div>


                            <div id="level2_0" className="mb-1">

                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>List</span>
                                <div className="newline"></div>


                            </div>



                            <div className="newline mt-1"></div>
                            <div style={{ "text-align": "left", "border": "1px solid gray", "border-radius": "10px", "height": "200px", "overflow-y": "scroll" }} className="modal_width_div p-4">
                                {this.renderUsersAccess()}
                            </div>

                        </div>

                    </Modal>
                </div>

                <div>

                    <Modal
                        isOpen={this.state.setIsOpen5}
                        onAfterOpen={this.afterOpenModal5}
                        onRequestClose={this.closeModal5}
                        style={customStyles2}
                        contentLabel="Example Modal"
                    >
                        <div style={{ "text-align": "right", "min-width": "400px", "border-bottom": "1px solid gray" }} className="mb-2 pb-2">
                            <button onClick={(event) => this.closeModal5()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                        </div>
                        <div className="m-2">

                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Title</span>
                            <div className="newline mt-1"></div>
                            <input id="title_edit" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="title" style={{ border: "1px solid black", width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                            <div className="newline mt-3"></div>
                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Type</span>
                            <div className="newline mt-1"></div>
                            <select className="ml-1" id="location_type_edit" style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                                <option value="-1">Choose Location Type</option>
                                <option value="0">Cluster</option>
                                <option value="1">Building</option>
                                <option value="2">Unit</option>
                                <option value="3">Room</option>
                            </select>





                            <div className="newline mt-4"></div>
                            <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                                <button style={{ "padding": "10px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.edit_location()} >
                                    Edit
                                </button>
                            </div>

                        </div>

                    </Modal>
                </div>



                <div>

                    <Modal
                        isOpen={this.state.setIsOpen4}
                        onAfterOpen={this.afterOpenModal4}
                        onRequestClose={this.closeModal4}
                        style={customStyles3}
                        contentLabel="Example Modal"
                    >
                        <div style={{ "text-align": "right", "min-width": "400px", "border-bottom": "1px solid gray" }} className="mb-2 pb-2">
                            <button onClick={(event) => this.closeModal4()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                        </div>
                        <div className="m-2">


                            <div className="newline mt-1"></div>
                            <b>
                                Are you sure to remove it?
                            </b>
                            <div className="newline mt-3"></div>



                        </div>



                        <div className="newline mt-4"></div>
                        <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                            <button className="mr-2" style={{ "padding": "5px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#aaa", "color": "white", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.closeModal4()} >
                                Cancel
                            </button>
                            <button style={{ "padding": "5px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.remove_location()} >
                                Yes
                            </button>
                        </div>



                    </Modal>
                </div>


            </div>
            );
        }
    }

}

export default Units;