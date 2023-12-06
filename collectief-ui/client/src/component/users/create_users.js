
import React, { useState, useRef } from "react";
import CheckLogin1 from '../CheckLogin'
import leftuser from '../../assets/image/leftuser.png'
import Cookies from 'universal-cookie'
import $ from 'jquery'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Create_users extends React.Component {

    constructor(props) {
      
      super(props);
      const cookies = new Cookies();
      this.state = {
        username:"",
        password:"",
        name:"",
        phone:"",
        position:"",
        address:"",
        country:"",
          companyname: "",
          user_type: "",
          location_id: "",
        user_location_id: "",
        location_types_parent: [],
        locationClusters: [],
        locationBuildings: [],
        locationUnits: [],
        token: cookies.get('token'),
        user_types: [{ id: "1", title: "Admin" }, { id: "2", title: "Cluster Manager" }, { id: "3", title: "Facility Manager" }, { id: "4", title: "End User" }]
      }
      this.setState({
        username:"",
        password: "",
        user_type: "",
        name:"",
        phone:"",
        position:"",
        address:"",
        country:"",
        companyname:"",
        token:cookies.get('token')
      });
      var ch = new CheckLogin1();
      if(!ch.check_token()){
        window.location.href = "/";
        return false;
      }
      
    }

    componentDidMount(){
       
        this.is_login();
    }


    is_login() {

        const cookies = new Cookies();
        var token = cookies.get('token');

        if (token != "") {
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
                        //alert(result.message)
                        if (result.message === 1) {
                            //alert(result.name)
                            this.setState({ user_type: result.user_type, user_location_id: result.location_id })
                            if (result.user_type == 1) {
                                this.setState({user_types : [{ id: "1", title: "Admin" }, { id: "2", title: "Cluster Manager" }, { id: "3", title: "Facility Manager" }, { id: "4", title: "End User" }] });
                            }
                            else if (result.user_type == 2) {
                                this.setState({ user_types: [ { id: "2", title: "Cluster Manager" }, { id: "3", title: "Facility Manager" }, { id: "4", title: "End User" }] });
                            }
                            else if (result.user_type == 3) {
                                this.setState({ user_types: [{ id: "3", title: "Facility Manager" }, { id: "4", title: "End User" }] });
                            }
                            else if (result.user_type == 4) {
                                this.setState({ user_types: [ { id: "4", title: "End User" }] });
                            }
                            //var [fullname, setCount] = useState({name:result.name});
                            //fullname = result.name;

                            //setState(result.name);
                            this.getBuildings(result.location_id);
                            this.getClusters(result.location_id);
                            this.getUnits(result.location_id);
                            return result.name;

                        }
                        else if (result.message === 0) {


                            return "";


                        }
                        console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

                        //if(result.message == "1")
                        //  window.location.href = "/dashboard";

                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        
                        return "";
                    }
                )
        } else {
            return "";
        }

    }


    showError(error){
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

    checkForm(){
      
      var check = true;

      if(this.state.username === ""){
        check = false;
        this.showError("Please enter Username");
      }

      if(this.state.password === ""){
        check = false;
        this.showError("Please enter Password");
      }

      if(this.state.name === ""){
        check = false;
        this.showError("Please enter Name");
      }

      
      
      if(this.state.phone === ""){
        check = false;
        this.showError("Please enter Phone number");
      }
    /*
      if(this.state.country === ""){
        check = false;
        this.showError("Please enter Country");
      }

      if(this.state.address === ""){
        check = false;
        this.showError("Please enter Address");
      }

      if(this.state.position === ""){
        check = false;
        this.showError("Please enter Position");
      }

      if (this.state.companyname === "") {
        check = false;
        this.showError("Please enter Company name");
      }
    */

      return check;
    }

    
    create_user(){
      const cookies = new Cookies();
      //cookies.set('token', result.token, { path: '/' });
      console.log("cookies="+cookies.get('token'));
      if(this.checkForm()){
        this.setState({token: cookies.get('token')})
      return fetch('http://'+global.config.vals.root.ip+':3002/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              token: cookies.get('token'), password: this.state.password, name: this.state.name, phone: this.state.phone, user_type: this.state.user_type, location_id: this.state.location_id, username: this.state.username
              })
      })
        .then(data => data.json())
        .then(
          (result) => {
            /*this.setState({
              isLoaded: true,
              items: result.items
            });*/
            $("#popup-root").html("");
            toast.success('User inserted successfully', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              });
              
              setTimeout(() => {
                window.location.href = "/users/list_users"
              }, 2000);
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
      }else{
        
      }
    }



    setName(val){
      this.setState({name:val})
    }
    
    setUserName(val){
      this.setState({username:val})
    }
    
    setPassword(val){
      this.setState({password:val})
    }

    setPhone(val){
      this.setState({phone:val})
    }

    setPosition(val){
      this.setState({position:val})
    }

    setAddress(val){
      this.setState({address:val})
    }

    setCountry(val){
      this.setState({country:val})
    }

    setCompanyName(val){
      this.setState({companyname:val})
    }

    renderUserTypesValues() {
        /*<option value="0">Cluster</option>
        <option value="1">Building</option>
        <option value="2">Unit</option>
        <option value="3">Room</option>*/
        var context = this;
        return this.state.user_types.map(function (o, i) {
            // var x = context.state.sensor_info[i].p_created_at.split("T");
            return (
                <option value={context.state.user_types[i].id}> {context.state.user_types[i].title}</ option>
            );
        });
    }


    CheckLocationType() {

        var user_type = $("#user_type").val()
        this.setState({ "user_type": user_type });
        if (user_type == 1) {
            $(".location_ids").addClass("d-none")
        }
        else if (user_type == 2) {
            //this.getClusters();
            $(".location_ids").removeClass("d-none")
            this.setState({ location_types_parent: this.state.locationClusters })
        }
        else if (user_type == 3) {
            //this.getBuildings();
            this.setState({ location_types_parent: this.state.locationBuildings })
            $(".location_ids").removeClass("d-none")
        }
        else if (user_type == 4) {
            //this.getRooms();
            this.setState({ location_types_parent: this.state.locationUnits })
            $(".location_ids").removeClass("d-none")
        }

    }


    renderUserTypes() {
        var context = this;
        return (
            <div>
                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }} id="location_parent_title"></span>
                <div className="newline mt-1"></div>
                <select className="ml-1" id="user_type" onClick={(event) => this.CheckLocationType()} style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                    <option value="-1">Choose User Type</option>
                    {context.renderUserTypesValues()}
                </select>
            </div>
        )
    }

    setLocation(id) {
        
        var checkedItems = [];
        $('.check_box_item:checked').each(function () {
            checkedItems.push($(this).val());
        });
        console.log("checkedItems", checkedItems)
        this.setState({ "location_id": checkedItems });
    }


    renderLocationValues() {
        /*<option value="0">Cluster</option>
        <option value="1">Building</option>
        <option value="2">Unit</option>
        <option value="3">Room</option>*/
        var context = this;
        return this.state.location_types_parent.map(function (o, i) {
            // var x = context.state.sensor_info[i].p_created_at.split("T");
            return (
                <div className="check_box_content" value={context.state.location_types_parent[i].id}><input className="check_box_item" type="checkbox" onClick={(event) => context.setLocation(context.state.location_types_parent[i].id)} id={"check_" + context.state.location_types_parent[i].id} value={context.state.location_types_parent[i].id} />&nbsp;&nbsp;&nbsp;{context.state.location_types_parent[i].title}</div>
            );
        });
    }


    renderLocations() {
        var context = this;
        return (
            <div className = "location_list">
                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }} id="location_parent_title"></span>
                <div className="newline mt-1"></div>
                
                    {context.renderLocationValues()}
               
            </div>
        )
    }

    /*
    
    
    renderLocations() {
        var context = this;
        return (
            <div>
                <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }} id="location_parent_title"></span>
                <div className="newline mt-1"></div>
                <select className="ml-1" onClick={(event) => this.setLocation()} multiple id="location" style={{ width: "90%", "padding": "8px", "border-radius": "5px" }}>
                    <option value="-1">Choose Location</option>
                    {context.renderLocationValues()}
                </select>
            </div>
        )
    }

    */


    getClusters(user_location_id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), type: 1 , location_id: user_location_id })
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
                        locationClusters: nt_tmp
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


    getBuildings(user_location_id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), type: 2 , location_id: user_location_id })
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
                        locationBuildings: nt_tmp
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


    getUnits(user_location_id) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/get_location_', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), type: 3 , location_id: user_location_id })
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
                        locationUnits: nt_tmp
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


  
    render() {
      var ch = new CheckLogin1();
      console.log("user=="+ch.check_token());
      if(!ch.check_token()){
          window.location.href = "/";
          return false;
      }else{
          return (
          <div className="main_panel">
            <div className="main_content text-left">
              <div className="main_content_left">
                <img src={leftuser}/>
              </div>
              <div className="main_content_right">
                <div className="user_info  ml-4">
                <div className="user_info_item">
                    <div className="user_title">
                        User type
                    </div>
                    <div className="newline"></div>
                    {this.renderUserTypes()}
                </div>
               
                <div className="user_info_item location_ids d-none">
                    <div className="user_title">
                        Location
                    </div>
                    <div className="newline"></div>
                    {this.renderLocations()}
                </div>
                <div className="newline"></div>
                <div className="user_info_item">
                    <div className="user_title">
                    Username (Email)
                    </div>
                    <div className="newline"></div>
                    <input type="text" required onChange={(e)=>(this.setUserName(e.target.value))} placeholder="Enter Your username" className="user_text"></input>
                  </div>
                  <div className="newline"></div>

                  <div className="user_info_item">
                    <div className="user_title">
                    Password
                    </div>
                    <div className="newline"></div>
                    <input type="password" required onChange={(e) => (this.setPassword(e.target.value))} placeholder="Enter Your password" className="user_text"></input>
                  </div>
                  <div className="newline"></div>

                  <div className="user_info_item">
                    <div className="user_title">
                    Your name
                    </div>
                    <div className="newline"></div>
                    <input type="text" required onChange={(e)=>(this.setName(e.target.value))} placeholder="Your name" className="user_text"></input>
                  </div>
                  <div className="newline"></div>

                 

                  <div className="user_info_item">
                    <div className="user_title">
                    phone number
                    </div>
                    <div className="newline"></div>
                    <input type="text" required placeholder="Enter phone number"  onChange={(e)=>(this.setPhone(e.target.value))} className="user_text"></input>
                  </div>
                  <div className="newline"></div>

                             
                  <div className="user_info_item">
                    <input type="button" className="user_submit" onClick={()=>(this.create_user())} value="Submit"></input>
                  </div>
                  

                  
                  
                  <div className="newline"></div>
                </div>
              </div>
            </div>
          </div>
          );
          /*
              <div className="user_info_item">
                    <div className="user_title">
                    Company address
                    </div>
                    <div className="newline"></div>
                    <input type="text" required placeholder="Enter your company address"  onChange={(e)=>(this.setAddress(e.target.value))} className="user_text"></input>
                  </div>
                  <div className="newline"></div>

                  <div className="user_info_item">
                    <div className="user_title">
                    Select country
                    </div>
                    <div className="newline"></div>
                    <input type="text" required placeholder="Select your country"  onChange={(e)=>(this.setCountry(e.target.value))} className="user_text"></input>
                              </div>
                               <div className="user_info_item">
                                  <div className="user_title">
                                      Unit name
                                  </div>
                                  <div className="newline"></div>
                                  <input placeholder="Company name" required type="text" onChange={(e) => (this.setCompanyName(e.target.value))} className="user_text"></input>
                              </div>
                              <div className="newline"></div>
                              
                  <div className="newline"></div>

                  <div className="user_info_item">
                    <div className="user_title">
                    Position
                    </div>
                    <div className="newline"></div>
                    <input type="text" required placeholder="Enter your position"  onChange={(e)=>(this.setPosition(e.target.value))} className="user_text"></input>
                  </div>
                  <div className="newline"></div>
           */
      }
    }

}

export default Create_users;