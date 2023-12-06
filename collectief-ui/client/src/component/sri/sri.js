
import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Gauge } from '@ant-design/plots';
import { Bar } from '@ant-design/plots';

import menu_project_b from '../../assets/image/menu_video_b.png';
import info from '../../assets/image/info.png';
import action from '../../assets/image/action.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignRight, faArrowPointer, faArrowRight, faArrows, faBox, faBuilding, faClose, faEdit, faExchange, faIndent, faPieChart, faPlus, faRemove, faStar, faStarOfDavid } from '@fortawesome/free-solid-svg-icons';
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
let current_id_for_edit = 0;
let current_location_id = -1;
let current_sensor_id = -1;
class Sri extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            items: [],
            modalIsOpen3: false,
            setIsOpen3: false,
            modalIsOpen4: false,
            setIsOpen4: false,
            modalIsOpen5: false,
            setIsOpen5: false,
            modalIsOpen2: false,
            setIsOpen2: false,
            box_function2: -1,
            box_function3: -1,
            loading: "text-center",
            sensor_info: [],
            assignment: [],
            location_title: [],
            get_sri: [],
            nt_tmp: []
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
        //this.get_location();
        //this.get_assignment();
        //setInterval(() => {

        //this.sensors();

        //}, 20000);
        this.get_sri();

    }


    get_sri() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
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
                    console.log(result.result)
                    var nt_tmp = [];
                    var yyy = JSON.parse(result.result);
                    var total_building = 0;
                    var total_sri = 0;
                    var class_sri = "";
                    var index = 0;
                    console.log("yyy", yyy)
                    for (var key2 in yyy) {
                        var zzz = JSON.parse(yyy[key2].calculation_data);
                        if (zzz.chart) {

                            var xxx = zzz.chart;
                            total_sri = zzz.total_sri
                            class_sri = zzz.class_sri
                            console.log("xxx", xxx)
                            var i = 0;
                            total_building++;
                            if (!nt_tmp[index]) {
                                nt_tmp[index] = {};
                            }
                            class_sri = zzz.class_sri
                            nt_tmp[index].value = parseInt(total_sri);
                            nt_tmp[index].title =  yyy[key2].cl_title;
                            nt_tmp[index].class = class_sri;
                            index++;

                        }
                    }
                    console.log("nt_tmp", nt_tmp)
                    for (var key in nt_tmp) {
                        //nt_tmp[key].value = nt_tmp[key].value / total_building;
                    }
                    //sri_title: "SRI",
                    //    sri_val: 0
                    console.log("nt_tmp", nt_tmp)
                    this.setState({
                        get_sri: nt_tmp,
                        nt_tmp: nt_tmp,
                        total_building: total_building,                      
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


    renderGauge(data) {
        const config = {
            percent: data.value/100,
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
                    formatter: () => data.value,
                },
                content: {
                    style: {
                        fontSize: '24px',
                        lineHeight: '44px',
                        color: '#4B535E',
                    },
                    formatter: () => data.class,
                },
            },
        };
        return <Gauge {...config} />;
    }

    renderChartColumn2(data_tmp) {
        //+" ℃"
        //console.log(this.state.data5);
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
        const config = {
            data: data_tmp,
            isGroup: false,
            xField: 'value',
            yField: 'year',

            /** 自定义颜色 */
            // color: ['#1383ab', '#c52125'],
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
            console.log(err)
        }
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

    openModal5(id) {
        //setIsOpen(true);
        current_id_for_edit = id;
       
        for (var key in this.state.assignment) {
            if (current_id_for_edit == this.state.assignment[key].id) {
                //alert("*")
                console.log("sensor", this.state.assignment[key].sensor)
                //$("#sensor_e_e").val(parseInt(this.state.assignment[key].sensor))
                //$("#location_s_e").val(parseInt(this.state.assignment[key].location))
                current_sensor_id = this.state.assignment[key].sensor;
                current_location_id = this.state.assignment[key].location_id;
                //$("#location_s_e").selectedIndex = 2;
                //alert(this.state.assignment[key].title)
            }
        }

        this.setState({
            setIsOpen5: true
        });
      
    }

    afterOpenModal5() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }


    closeModal5() {

        this.setState({
            setIsOpen5: false
           
        });
    }


    openModal4(id) {
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
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_sensors_all', {
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

    disconnect(id) {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/disconnect_sensor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token') , id:id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    var nt_tmp = [];
                    for (var key in result.result) {
                        nt_tmp[key] = {};
                        //console.log(key)
                        //console.log(result.result[key].sce)
                        //nt_tmp[key] = JSON.parse(result.result[key].sce)
                        nt_tmp[key].id = result.result[key].id
                        nt_tmp[key].title = result.result[key].title
                        nt_tmp[key].sensor = result.result[key].sensor
                        nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        assignment: nt_tmp
                    }
                    );
                   

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

    renderGaugeList() {
        var context = this;
        return this.state.nt_tmp.map(function (o, i) {
            return (
                <div className="m-4 inline-table">
                    <div className="header-of-page2">
                        <FontAwesomeIcon icon={faPieChart} className = "pr-2 building" />{context.state.nt_tmp[i].title}
                    </div>
                    <div className="newline"></div>
                    <div>
                        {context.renderGauge(context.state.nt_tmp[i])}
                    </div>
                </div>
                );
        });
    }

    renderRows() {
        var context = this;
        return this.state.assignment.map(function (o, i) {
            // var x = context.state.sensor_info[i].p_created_at.split("T");
            return (<tr>
                <td>
                    {(i + 1)}
                </td>

                <td>
                    {context.state.assignment[i].title}
                </td>
                <td>
                    {context.state.assignment[i].sensor}
                </td>
                <td>
                    {context.state.assignment[i].date}
                </td>
                <td onClick={(e) => context.openModal4(context.state.assignment[i].id)}>
                    {<FontAwesomeIcon icon={faRemove} className="arrow3 hand" />}
                </td>
                <td onClick={(e) => context.openModal5(context.state.assignment[i].id)}>
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

    save_assign(schedule, index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        if ($("#sensor_s").val() != "" && $("#location_s").val()) {
            return fetch('http://' + global.config.vals.root.ip + ':3002/save_assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "location": $("#location_s").val(), "sensor": $("#sensor_s").val() })
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
                        $("#sensor_s").val("")
                        $("#location_s").val("")
                        if (result.token > 0) {
                            this.get_assignment();

                            toast.success('The new Assignment is saved', {
                                position: "top-right",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });

                            this.closeModal3()
                        } else {
                            toast.error('Already assigned', {
                                position: "top-right",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
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
        } else {
            toast.error('Please choose location and sensor', {
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


    edit_assign() {
       
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/edit_assignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "location": $("#location_s_e").val(), "sensor": $("#sensor_e_e").val(), "id": current_id_for_edit })
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
                    
                    if (result.token > 0) {
                        this.get_assignment();

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
                    } else {
                        toast.error('Fault', {
                            position: "top-right",
                            autoClose: 2500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
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

    get_assignment() {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_assignment', {
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
                        nt_tmp[key].location_id = result.result[key].location_id
                        nt_tmp[key].title = result.result[key].title
                        nt_tmp[key].sensor = result.result[key].sensor
                        nt_tmp[key].date = result.result[key].date

                    }
                    this.setState({
                        assignment: nt_tmp
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
            if (context.state.location_title[i].id)
                return (
                <option value={context.state.location_title[i].id}>{context.state.location_title[i].title}</option>
                )
            else
                return (
                    <option value={context.state.location_title[i].id}>{context.state.location_title[i].title}</option>
                )
        }
            )
    }

    renderSensorOptions() {
        var context = this;
        return this.state.sensor_info.map(function (o, i) {
            if (context.state.sensor_info[i].sensor_serial)
                return (
                    <option value={context.state.sensor_info[i].sensor_serial}>{context.state.sensor_info[i].sensor_serial}</option>
                )
            else {
                return (
                    <option value={context.state.sensor_info[i].sensor_serial}>{context.state.sensor_info[i].sensor_serial}</option>
                )
            }
        }
        )
    }


    renderLocationOptionsEdit() {
        var context = this;
        return this.state.location_title.map(function (o, i) {
            if (context.state.location_title[i].id == current_location_id)
                return (
                    <option value={context.state.location_title[i].id} selected>{context.state.location_title[i].title}</option>
                )
            else
                return (
                    <option value={context.state.location_title[i].id}>{context.state.location_title[i].title}</option>
                )
        }
        )
    }

    renderSensorOptionsEdit() {
        var context = this;
        return this.state.sensor_info.map(function (o, i) {
            if (context.state.sensor_info[i].sensor_serial == current_sensor_id)
                return (
                    <option value={context.state.sensor_info[i].sensor_serial} selected>{context.state.sensor_info[i].sensor_serial}</option>
                )
            else {
                return (
                    <option value={context.state.sensor_info[i].sensor_serial}>{context.state.sensor_info[i].sensor_serial}</option>
                )
            }
        }
        )
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
                            <div className = "header-of-page mb-5">                              
                                    Building's SRI                                
                            </div>
                            <div className = "newline"></div>
                            <div className="inline-table">
                                {this.renderGaugeList()}
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

                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Title</span>
                            <div className="newline mt-1"></div>
                            <input id="title" type="text" className="ml-1 mr-4" placeholder="title" style={{ border: "1px solid black", width: "180px", "border-radius": "5px" }} size="4" />
                            <div className="newline mt-3"></div>





                            <div className="newline mt-4"></div>
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
                        isOpen={this.state.setIsOpen3}
                        onAfterOpen={this.afterOpenModal3}
                        onRequestClose={this.closeModal3}
                        style={customStyles3}
                        contentLabel="Example Modal"
                    >
                        <div style={{ "text-align": "right", "min-width": "400px", "border-bottom": "1px solid gray" }} className="mb-2 pb-2">
                            <button onClick={(event) => this.closeModal3()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                        </div>
                        <div className="m-2">

                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Location</span>
                            <div className="newline mt-1"></div>
                            <select className="ml-1" id="location_s" style={{ width: "90%" , "padding" : "8px" , "border-radius": "5px" }}>
                                <option value="">Choose location</option>
                                {this.renderLocationOptions()}
                            </select>
                            <div className="newline mt-3"></div>


                            <div id="level2_0" className="mb-3">

                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Sensor</span>
                                <div className="newline mt-1"></div>
                                <select className="ml-1" id="sensor_s" style={{ width: "90%" , "padding": "8px" , "border-radius": "5px" }}>
                                    <option value="">Choose sensor</option>
                                    {this.renderSensorOptions()}
                                </select>

                            </div>



                            <div className="newline mt-4"></div>
                            <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                                <button style={{ "padding": "10px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.save_assign()} >
                                    Add
                                </button>
                            </div>

                        </div>

                    </Modal>
                </div>


                <div>

                    <Modal
                        isOpen={this.state.setIsOpen5}
                        onAfterOpen={this.afterOpenModal5}
                        onRequestClose={this.closeModal5}
                        style={customStyles5}
                        contentLabel="Example Modal"
                    >
                        <div style={{ "text-align": "right" , "min-width": "400px" , "border-bottom" : "1px solid gray" }} className="mb-2 pb-2">
                            <button onClick={(event) => this.closeModal5()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                        </div>
                        <div className="m-2">

                            <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Location</span>
                            <div className="newline mt-1"></div>
                            <select className="ml-1" id="location_s_e" style={{ width: "180px", "border-radius": "5px" }}>
                                <option value="">Choose location</option>
                                {this.renderLocationOptionsEdit()}
                            </select>
                            <div className="newline mt-3"></div>


                            <div id="level2_0" className="mb-3">

                                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Sensor</span>
                                <div className="newline mt-1"></div>
                                <select className="ml-1" id="sensor_e_e" style={{ width: "180px", "border-radius": "5px" }}>
                                    <option value="">Choose sensor</option>
                                    {this.renderSensorOptionsEdit()}
                                </select>

                            </div>



                            <div className="newline mt-4"></div>
                            <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                                <button style={{ "padding": "10px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.edit_assign()} >
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
                                Are you sure to disconnect it?
                            </b>
                            <div className="newline mt-3"></div>


                           
                            </div>



                            <div className="newline mt-4"></div>
                        <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                            <button className="mr-2" style={{ "padding": "5px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#aaa", "color": "white", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.closeModal4()} >
                                    Cancel
                            </button>
                            <button style={{ "padding": "5px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.disconnect()} >
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

export default Sri;