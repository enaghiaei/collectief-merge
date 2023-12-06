
import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';


import menu_project_b from '../../assets/image/menu_video_b.png';
import info from '../../assets/image/info.png';
import action from '../../assets/image/action.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faExchange, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import $ from "jquery";
import Modal from 'react-modal';

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
let subtitle;
class Home_l1 extends React.Component {

    constructor(props) {
    
      super(props);
        this.state = {
            items: [],
            modalIsOpen3: false,
            setIsOpen3: false,
            modalIsOpen2: false,
            setIsOpen2: false,
            box_function2: -1,
            box_function3: -1,
            loading: "text-center",
            sensor_info: []
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
        this.sensors();
        setInterval(() => {
            this.sensors();
            
        }, 20000);
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


    create_projects(){
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
                        console.log("today",today)
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
                        
                        console.log("x",x)
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


    show_project_new(context,token){
      window.location.href = `/list_projects/show_project?token=${token}`;
      //return <Redirect to="/list_projects/show_projects" />
      //context.props.history.push('/list_projects/show_projects', { id: token });
    }

    renderRows(){
      var context = this; 
        return this.state.sensor_info.map(function(o, i) {
       // var x = context.state.sensor_info[i].p_created_at.split("T");
        return (<tr>
          <td>
          {(i+1)}
            </td>
           
          <td>
                {context.state.sensor_info[i].sensor_serial}
            </td>
            <td>
                {context.state.sensor_info[i].measure_name}
            </td>
            <td>
                {Number(context.state.sensor_info[i].measure_value).toFixed(2)}
            </td>
            <td>
                {context.state.sensor_info[i].measure_kind}
            </td>
            <td>
                {context.state.sensor_info[i].sensor_type}
            </td>
            <td>
                {context.state.sensor_info[i].channel}
            </td>
            <td>
                {context.state.sensor_info[i].timestamp}
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
  
  
    render() {
        //

        //var ch = new CheckLogin1();
        //if (!ch.check_token()) {
        if(1 == 2){
            //window.location.href = "/";
            //return false;
        }else{
            <div>
                <div className="home_l1_left">

                </div>
                <div className="home_l1_right">

                </div>
                <div className="newline"></div>
                <div className="home_l2">

                </div>
                
            </div>
        }
    }

}

export default Home_l1;