import React from "react"
import topright from "../../assets/image/topright.png"
import $ from "jquery";
import topright_v2 from "../../assets/image/topright.png"
import defaultlogo from "../../assets/image/defaultlogo6.png"
import defaultlogo1 from "../../assets/image/defaultlogo2.jpg"
import face from "../../assets/image/Face.png"
import company from "../../assets/image/company.png"
import magnifier from "../../assets/image/magnifier.png"
import down from "../../assets/image/down.png" 
import play_video from '../../assets/image/play_video.png';
import logout_b from '../../assets/image/menu_logout_b.png';
import {ProgressBar} from 'react-bootstrap';
import {store, useGlobalState} from 'state-pool';
import Cookies from 'universal-cookie';
import { Dropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faBars, faBell, faClose, faEdit, faPowerOff, faSave, faTableCells, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
var x_menu = 0;
class Header extends React.Component {
 
  constructor(props) {
  
    super(props);
   
    this.state = {
        fullname: "",
        location: "",
      topright: topright_v2,
      defaultlogo: defaultlogo,
      defaultlogoClass: "logo_v2",
      c_view:"d-inline",
        companies: [],
        notifications: [],
        count: 0,
        x: 0,
        user_type: -1
    }
    
    
  }
 
  componentDidMount(){
     
    this.is_login();
    this.companies();
      this.notifications();
      setInterval(() => {
          this.notifications()

      }, 260000);
    const cookies = new Cookies();
    if(window.location.pathname.indexOf("welcome") !== -1){
      cookies.remove("topright");
      cookies.remove("logo_type");
      cookies.remove("logo");
      cookies.remove("company_id");
    }
    var topright_c = cookies.get('topright');
    var topright = 'http://'+global.config.vals.root.ip+':3002/getTopRight?id='+topright_c
    var logo_c = cookies.get('logo');
    var logo_class = cookies.get('logo_type');
    if(logo_class == 0){
      logo_class = "logo"
    }else{
      logo_class = "logo_v2"
    }
    
    if(logo_c){
      if(logo_c.localeCompare("") !== 0 && logo_c.localeCompare("null") !== 0 && logo_c !== null)
        var logo = 'http://'+global.config.vals.root.ip+':3002/getLogo?id='+logo_c;
      else{
        logo = defaultlogo;
        logo_class = "logo_v2";
      }
    }else{
      logo = defaultlogo;
      logo_class = "logo_v2";
    }
    
    
    if(window.location.pathname.indexOf("welcome") !== -1)
      this.setState({topright:topright , defaultlogo:defaultlogo , defaultlogoClass:logo_class , topright :  topright_v2})
    else{
      this.setState({topright:topright , defaultlogo:logo , defaultlogoClass:logo_class , topright :  topright_v2})
      }
      $("#horizontal-menu").click(function () {
          if (x_menu % 2 == 1) {
              //alert($("#menu_stat").val());
              if ($("#horizontal-list").hasClass("d-none")) {
                  $("#horizontal-list").removeClass("d-none")
                  $("#node_user_type").css("right", "470px")
              } else {
                  $("#horizontal-list").addClass("d-none")
                  $("#node_user_type").css("right", "130px")
              }
          }
          x_menu++
          console.log("x_menu", x_menu)
      });
      $("#vertical-menu").click(function () {
          
      });
     
  }

  
  companies() {
    const cookies = new Cookies();
    //cookies.set('token', result.token, { path: '/' });
    console.log("cookies="+cookies.get('token'));
    return fetch('http://'+global.config.vals.root.ip+':3002/get_companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token:cookies.get('token')})
    })
      .then(data => data.json())
      .then(
        (result) => {
          /*this.setState({
            isLoaded: true,
            items: result.items
          });*/
          this.setState({            
            companies: result.result
          });
          this.setState({
            items: result.result
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


    notifications() {
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
                   
                    var nt_tmp = [];
                    var noti_count = 0;
                    var key = 0;
                    for (var key2 in result.result) {
                        if (result.result[key2].deleted == 0) {

                            nt_tmp[key] = {};
                            //console.log(key)
                            //console.log(result.result[key].sce)
                            //nt_tmp[key] = JSON.parse(result.result[key].sce)
                            nt_tmp[key].id = result.result[key2].id
                            nt_tmp[key].value = result.result[key2].value
                            nt_tmp[key].message = result.result[key2].message
                            nt_tmp[key].seen = result.result[key2].seen
                            nt_tmp[key].importance = result.result[key2].importance
                            var a = new Date(result.result[key2].date * 1000);
                            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            var year = a.getFullYear();
                            var month = months[a.getMonth()];
                            var date = a.getDate();
                            var hour = a.getHours();
                            var min = a.getMinutes();
                            var sec = a.getSeconds();
                            if (nt_tmp[key].seen == 0)
                                noti_count++;
                            if (min < 10)
                                min = "0" + min;
                            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
                            nt_tmp[key].date = time;

                            key++;

                        }
                        //time;

                    }

                    this.setState({
                        notifications: nt_tmp,
                        count: noti_count
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



is_login() {

  const cookies = new Cookies();
  var token = cookies.get('token');

  if(token != ""){
  var credentials = {token:token};
  console.log(credentials);
  return fetch('http://'+global.config.vals.root.ip+':3002/is_login', {
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
          this.setState({fullname:result.name, c_view: "d-none",user_type:result.user_type , location : result.location_title})
          //var [fullname, setCount] = useState({name:result.name});
          //fullname = result.name;
          
          //setState(result.name);
          return result.name;                 
          
        }
        else if(result.message === 0){

             
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
        this.setState({fullname:"Dear user", c_view: "d-inline", defaultlogo:defaultlogo , defaultlogoClass : "logo_v2"})
        return "";
      }
    )
  }else{
    return "";
  }
    
    }

    set_user_type() {
        if (this.state.user_type == 4) {
            return "Edge Node User"
        }
        else if (this.state.user_type == 3) {
            return "Facility manager"
        }
        else if (this.state.user_type == 2) {
            return "Cluster manager"
        }
        else if (this.state.user_type == 1) {
            return "Admin"
        }
    }
 
    logout() {

  var cookies = new Cookies();
  //cookies.set('token', result.token, { path: '/' });
  console.log("cookies="+cookies.get('token'));
  return fetch('http://'+global.config.vals.root.ip+':3002/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({token:cookies.get('token')})
  })
    .then(data => data.json())
    .then(
      (result) => {
        /*this.setState({
          isLoaded: true,
          items: result.items
        });*/
        console.log(result);
        if(result.message == "1"){

          toast.info('Logout was successful', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });          
          
            var cookies1 = new Cookies();
            cookies1.remove("token");
            cookies1.remove("topright");
            cookies1.remove("logo_type");
            cookies1.remove("logo");
            cookies1.remove("company_id");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
         
          
        }else{

          var cookies1 = new Cookies();
            cookies1.remove("token");
          setTimeout(() => {
           // window.location.href = "/";
          }, 2000);

        }

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


    setSeen(id) {
        $("#notification_list").addClass("show")
        $("#notification_list2").addClass("show")
        $(".dropdown-basic").attr("aria-expanded", "true")
        var cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/set_seen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token') ,  id : id})
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    this.notifications()
                    $("#notification_list").addClass("show")
                    $("#notification_list2").addClass("show")
                    $(".dropdown-basic").attr("aria-expanded","true")

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
        $("#notification_list").addClass("show")
        $("#notification_list2").addClass("show")
        $(".dropdown-basic").attr("aria-expanded", "true")
        var cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/set_delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), id: id })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    this.notifications()
                    $("#notification_list").addClass("show")
                    $("#notification_list2").addClass("show")
                    $(".dropdown-basic").attr("aria-expanded", "true")

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

  handleclick(company_id,topright,logo,logo_type,company_token,company_name){

    
    const cookies = new Cookies();
    cookies.set('topright', topright, { path: '/' });
    cookies.set('logo', logo, { path: '/' });
    cookies.set('logo_type', logo_type, { path: '/' });
    cookies.set('company_id', company_id, { path: '/' });
    cookies.set('company_token', company_token, { path: '/' });
    cookies.set('company_name', company_name, { path: '/' });
    cookies.set('full_name', this.state.fullname, { path: '/' });
    window.location.href = window.location.href;
  }

  renderCompanies(){

    var context = this;
    const cookies = new Cookies();
    var c_id = cookies.get("company_id");
      //alert(c_id)
      return (<Dropdown.Item className="dropdown_item border-bottom" ><b>Location tile:</b> {context.state.location}</Dropdown.Item>);            

    return  this.state.companies.map(function(o, i) {    
      console.log("i==="+i);
      console.log(context.state.companies[i].logo);
      if(parseInt(c_id) === parseInt(context.state.companies[i].company_id))
        return (<Dropdown.Item className="dropdown_item border-bottom selected_item"  onClick={(e)=>(context.handleclick(context.state.companies[i].company_id , context.state.companies[i].topright , context.state.companies[i].logo , context.state.companies[i].logo_type , context.state.companies[i].c_token , context.state.companies[i].name))}>{context.state.companies[i].name}</Dropdown.Item>); 
      else{
        return (<Dropdown.Item className="dropdown_item border-bottom"  onClick={(e)=>(context.handleclick(context.state.companies[i].company_id , context.state.companies[i].topright , context.state.companies[i].logo , context.state.companies[i].logo_type , context.state.companies[i].c_token , context.state.companies[i].name))}>{context.state.companies[i].name}</Dropdown.Item>);            
      }
    }
    )

  }

    renderNotifications() {

        var context = this;
        const cookies = new Cookies();
        var c_id = cookies.get("company_id");
        //alert(c_id)
        return this.state.notifications.map(function (o, i) {
            console.log("i===" + i);
            //console.log(context.state.notifications[i].logo);
            /*if (parseInt(c_id) === parseInt(context.state.notifications[i].company_id))
                return (<Dropdown.Item className="dropdown_item border-bottom selected_item" onClick={(e) => (context.handleclick())}>{context.state.notifications[i].name}</Dropdown.Item>);
            else {
                return (<Dropdown.Item className="dropdown_item border-bottom" onClick={(e) => (context.handleclick())}>{context.state.notifications[i].name}</Dropdown.Item>);
            }*/
            if (parseInt(context.state.notifications[i].importance) == 0) {
                if (parseInt(context.state.notifications[i].seen) == 0)
                    return (<Dropdown.Item id={"notif" + context.state.notifications[i].id} className="dropdown_item border-bottom" ><div style={{ "position": "relative", "right": "-8px", "float": "right", "text-align": "right" }}><FontAwesomeIcon icon={faClose} onClick={(e) => (context.setDelete(context.state.notifications[i].id))} className="close_notif" title="Close notification" style={{ "padding": "2px", "border": "1px solid gray", "border-radius": "15px", "width": "17px", "height": "17px" }} /></div><div className="newline"></div><div style={{ "position": "relative", "top": "-6px" }} onClick={(e) => (context.setSeen(context.state.notifications[i].id))} ><div className="mr-1" style={{ display: "inline-table", "background-color": "green", "width": "10px", "height": "30px", "font-weight": "bold" }}></div><div style={{ display: "inline-table", position: "relative", top: "-13px", "font-weight": "bold" }}>{context.state.notifications[i].message}<div className="newline"></div><div style={{ "font-weight": "normal", "color": "gray", "font-size": "14px" }}> {context.state.notifications[i].date}</div></div></div></Dropdown.Item>);
                else
                    return (<Dropdown.Item id={"notif" + context.state.notifications[i].id} className="dropdown_item border-bottom" ><div style={{ "position": "relative", "right": "-8px", "float": "right", "text-align": "right" }}><FontAwesomeIcon icon={faClose} onClick={(e) => (context.setDelete(context.state.notifications[i].id))} className="close_notif" title="Close notification" style={{ "padding": "2px", "border": "1px solid gray", "border-radius": "17px", "width": "17px", "height": "17px" }} /></div><div className="newline"></div><div style={{ "position": "relative", "top": "-6px" }} onClick={(e) => (context.setSeen(context.state.notifications[i].id))} ><div className="mr-1" style={{ display: "inline-table", "background-color": "green", "width": "10px", "height": "30px" }}></div><div style={{ display: "inline-table", position: "relative", top: "-13px" }}>{context.state.notifications[i].message}<div className="newline"></div><div style={{ "font-weight": "normal", "color": "gray", "font-size": "14px" }}> {context.state.notifications[i].date}</div></div></div></Dropdown.Item>);
            }
            else if (parseInt(context.state.notifications[i].importance) == 1) {
                if (parseInt(context.state.notifications[i].seen) == 0)
                    return (<Dropdown.Item id={"notif" + context.state.notifications[i].id} className="dropdown_item border-bottom" ><div style={{ "position": "relative", "right":"-8px", "float": "right", "text-align": "right" }}><FontAwesomeIcon icon={faClose} onClick={(e) => (context.setDelete(context.state.notifications[i].id))} className="close_notif" title="Close notification" style={{ "padding": "2px", "border": "1px solid gray", "border-radius": "15px", "width": "17px", "height": "17px" }} /></div><div className="newline"></div><div style={{ "position": "relative", "top": "-6px" }} onClick={(e) => (context.setSeen(context.state.notifications[i].id))} ><div  className="mr-1" style={{ display: "inline-table", "background-color": "yellow", "width": "10px", "height": "30px", "font-weight": "bold" }}></div><div style={{ display: "inline-table", position: "relative", top: "-13px", "font-weight": "bold" }}>{context.state.notifications[i].message}<div className="newline"></div><div style={{ "font-weight": "normal", "color": "gray", "font-size": "14px" }}> {context.state.notifications[i].date}</div></div></div></Dropdown.Item>);
                else
                    return (<Dropdown.Item id={"notif" + context.state.notifications[i].id} className="dropdown_item border-bottom" ><div style={{ "position": "relative", "right": "-8px", "float": "right", "text-align": "right" }}><FontAwesomeIcon icon={faClose} onClick={(e) => (context.setDelete(context.state.notifications[i].id))} className="close_notif" title="Close notification" style={{ "padding": "2px", "border": "1px solid gray", "border-radius": "17px", "width": "17px", "height": "17px" }} /></div><div className="newline"></div><div style={{ "position": "relative", "top": "-6px" }} onClick={(e) => (context.setSeen(context.state.notifications[i].id))} ><div className="mr-1" style={{ display: "inline-table", "background-color": "yellow", "width": "10px", "height": "30px" }}></div><div style={{ display: "inline-table", position: "relative", top: "-13px" }}>{context.state.notifications[i].message}<div className="newline"></div><div style={{ "font-weight": "normal", "color": "gray", "font-size": "14px" }}> {context.state.notifications[i].date}</div></div></div></Dropdown.Item>);
            }
            else if (parseInt(context.state.notifications[i].importance) == 2) {
                if (parseInt(context.state.notifications[i].seen) == 0)
                    return (<Dropdown.Item id={"notif" + context.state.notifications[i].id} className="dropdown_item border-bottom" ><div style={{ "position": "relative", "right": "-8px", "float": "right", "text-align": "right" }}><FontAwesomeIcon icon={faClose} onClick={(e) => (context.setDelete(context.state.notifications[i].id))} className="close_notif" title="Close notification" style={{ "padding": "2px", "border": "1px solid gray", "border-radius": "15px", "width": "17px", "height": "17px" }} /></div><div className="newline"></div><div style={{ "position": "relative", "top": "-6px" }} onClick={(e) => (context.setSeen(context.state.notifications[i].id))} ><div className="mr-1" style={{ display: "inline-table", "background-color": "red", "width": "10px", "height": "30px", "font-weight": "bold" }}></div><div style={{ display: "inline-table", position: "relative", top: "-13px", "font-weight": "bold" }}>{context.state.notifications[i].message}<div className="newline"></div><div style={{ "font-weight": "normal", "color": "gray", "font-size": "14px" }}> {context.state.notifications[i].date}</div></div></div></Dropdown.Item>);
                else
                    return (<Dropdown.Item id={"notif" + context.state.notifications[i].id} className="dropdown_item border-bottom" ><div style={{ "position": "relative", "right": "-8px", "float": "right", "text-align": "right" }}><FontAwesomeIcon icon={faClose} onClick={(e) => (context.setDelete(context.state.notifications[i].id))} className="close_notif" title="Close notification" style={{ "padding": "2px", "border": "1px solid gray", "border-radius": "17px", "width": "17px", "height": "17px" }} /></div><div className="newline"></div><div style={{ "position": "relative", "top": "-6px" }} onClick={(e) => (context.setSeen(context.state.notifications[i].id))} ><div className="mr-1" style={{ display: "inline-table", "background-color": "red", "width": "10px", "height": "30px" }}></div><div style={{ display: "inline-table", position: "relative", top: "-13px" }}>{context.state.notifications[i].message}<div className="newline"></div><div style={{ "font-weight": "normal", "color": "gray", "font-size": "14px" }}> {context.state.notifications[i].date}</div></div></div></Dropdown.Item>);
            }
        }
        )

    }
   


    save_() {

        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        var x = $("#boxes").val()
        var y = $("#boxes_top").val()
        if (x != "" && y != "") { 
        if (x == "") {
            x = "[]"
        }
        if (y == "") {
            y = "[]"
        }
        return fetch('http://' + global.config.vals.root.ip + ':3002/save_home', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "boxes": x, "boxes_top": y, "token": cookies.get('token') })
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
                    toast.success('The new LayOut is saved', {
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
    }

    setForEdit() {
        $(".remove-part").removeClass("d-none")
        $(".right-remove-part").removeClass("d-none")
        $(".edit-box").addClass("d-none")
        $(".save-box").removeClass("d-none")
    }


    setForSave() {
        $(".remove-part").addClass("d-none")
        $(".right-remove-part").addClass("d-none")
        $(".save-box").addClass("d-none")
        $(".edit-box").removeClass("d-none")
        this.save_()
    }

    
          
 render() {
  //const [fullname, setState] = useState("");
  //setState(fullnamenew);
  //var name = is_login();
  //var [fullname, ] = useState(fullname);

  //is_login();
     if (this.state.user_type == 4) {
         return (
             <div>
                 <div>

                     <div id="node_user_type" className="header_items00 pt-2 pb-2 pr-2 pl-2 d-none" style={{ opacity: "0.8", right: "470px", top: "23px", "padding": "3px", "border-radius": "6px", "font-weight": "bold", "letter-spacing": "1px" }}>
                         {this.set_user_type()}
                     </div>
                     <div className="header_items0" id="header_items0" style={{ right: "40px", top: "22px", color: "#fff", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                         <FontAwesomeIcon icon={faBars} id="horizontal-menu" className="horizontal-menu" style={{ "cursor": "pointer", width: "34px", height: "34px", "position": "relative", "top": "2px" }} />

                     </div>
                    
                     <div id='horizontal-list' style={{ "position": "relative", "right": "60px" }}>

                         <div className="header_items000 header-layout-box" style={{ opacity: "0.8", right: "340px", top: "22px", color: "#000", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "background-color": "#fff", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                             <FontAwesomeIcon icon={faTableCellsLarge} className="layout-box" style={{ "cursor": "pointer", width: "24px", height: "24px", "position": "relative", "top": "5px" }} />

                         </div>

                         <div className="header_items0" style={{ opacity: "0.8", right: "270px", top: "22px", color: "#000", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "background-color": "#fff", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                             <FontAwesomeIcon onClick={(event) => this.setForEdit()} icon={faEdit} className="edit-box" style={{ "cursor": "pointer", width: "24px", height: "24px", "position": "relative", "top": "5px" }} />
                             <FontAwesomeIcon onClick={(event) => this.setForSave()} icon={faSave} className="save-box d-none" style={{ "cursor": "pointer", width: "24px", height: "24px", "position": "relative", "top": "5px" }} />

                         </div>


                         <div className="header_items1">
                             <div className="heade_title_items2 ml-3">
                                 <div className={this.state.c_view}>

                                 </div>
                                 <div>

                                     <Dropdown id="notification_list">
                                         <Dropdown.Toggle variant="" id="dropdown-basic" className="dropdown-basic">
                                             <div style={{ "color": "red" }}>
                                                 <NotificationBadge count={this.state.count} effect={Effect.SCALE} />
                                             </div>
                                             <div style={{ opacity: "0.8", "display": "inline-table", color: "#000", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "background-color": "#fff", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                                                 <FontAwesomeIcon icon={faBell} style={{ "cursor": "pointer", width: "24px", height: "24px", "position": "relative", "top": "5px" }} />
                                             </div>

                                         </Dropdown.Toggle>

                                         <Dropdown.Menu id="notification_list2" className="drop_down_scroll">
                                             {this.renderNotifications()}
                                         </Dropdown.Menu>
                                     </Dropdown>

                                 </div>
                             </div>


                             <img src={down} className="ml-2 d-none" />


                         </div>

                         <div className="header_items2_0">

                             <div>
                                 <Dropdown>
                                     <Dropdown.Toggle variant="" id="dropdown-basic1">
                                         <img src={company} className="company_logo" />
                                     </Dropdown.Toggle>

                                     <Dropdown.Menu>
                                         {this.renderCompanies()}
                                     </Dropdown.Menu>
                                 </Dropdown>
                             </div>

                         </div>

                         <div className="header_items2">

                             <div className="heade_title_items2 ml-3">
                                 <div className={this.state.c_view}>

                                 </div>
                                 <div>

                                     <Dropdown>
                                         <Dropdown.Toggle variant="" id="dropdown-basic2">
                                             <img src={face} />

                                         </Dropdown.Toggle>

                                         <Dropdown.Menu>
                                             <Dropdown.Item className="dropdown_item title_head" >Name: {this.state.fullname}</Dropdown.Item>
                                             <Dropdown.Item className="dropdown_item title_head" >User Type: {this.set_user_type()}</Dropdown.Item>
                                             <Dropdown.Item className="dropdown_item py-3" onClick={(e) => (this.logout())}><FontAwesomeIcon icon={faPowerOff} className="mr-2" />Logout</Dropdown.Item>
                                         </Dropdown.Menu>
                                     </Dropdown>

                                 </div>
                             </div>


                             <img src={down} className="ml-2 d-none" />

                         </div>
                     </div>
                 </div>

                 <div class="topright_div">
                     <div className={this.state.c_view}>

                     </div>
                     <img src={this.state.topright} className="topright" />
                 </div>

                 <img src={this.state.defaultlogo} className={this.state.defaultlogoClass} />

             </div>

         );
     } else {
          return (
      <div>
          <div>
              
              <div id="node_user_type" className="header_items00 pt-2 pb-2 pr-2 pl-2 d-none" style={{ opacity: "0.8", right: "300px", top: "23px", "padding":"3px","border-radius":"6px","font-weight":"bold","letter-spacing":"1px"}}>
                  {this.set_user_type()}
              </div>
              <div className="header_items0" id="header_items0" style={{ right: "40px", top: "22px", color: "#fff", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                  <FontAwesomeIcon icon={faBars} id="horizontal-menu" className="horizontal-menu" style={{ "cursor": "pointer", width: "34px", height: "34px", "position": "relative", "top": "2px" }} />

              </div>
              <div id='horizontal-list'  style={{"position":"relative","right":"60px"}}>

                  <div className="header_items000 header-layout-box d-none" style={{ opacity: "0.8", right: "340px", top: "22px", color: "#000", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "background-color": "#fff", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                      <FontAwesomeIcon icon={faTableCellsLarge} className="layout-box" style={{ "cursor": "pointer", width: "24px", height: "24px", "position": "relative", "top": "5px" }} />

                  </div>

                  <div className="header_items0 d-none" style={{ opacity:"0.8",right: "270px", top: "22px", color: "#000", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "background-color": "#fff", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                      <FontAwesomeIcon onClick={(event) => this.setForEdit()} icon={faEdit} className="edit-box" style={{ "cursor": "pointer",width: "24px", height: "24px" , "position" : "relative" , "top" : "5px"}} />
                      <FontAwesomeIcon onClick={(event) => this.setForSave()} icon={faSave} className="save-box d-none" style={{"cursor":"pointer", width: "24px", height: "24px" , "position": "relative", "top": "5px" }} />

                  </div>
      

                  <div className="header_items1 d-none">
                      <div className="heade_title_items2 ml-3">
                          <div className={this.state.c_view}>

                          </div>
                          <div>

                              <Dropdown id="notification_list">
                                  <Dropdown.Toggle variant="" id="dropdown-basic" className="dropdown-basic">
                                      <div style={{ "color": "red" }}>
                                          <NotificationBadge count={this.state.count} effect={Effect.SCALE} />
                                      </div>
                                      <div style={{ opacity: "0.8", "display": "inline-table", color: "#000", "padding": "3px", "border-radius": "6px", "letter-spacing": "1px", "background-color": "#fff", "width": "40px", "height": "40px", "border-radius": "20px" }}>

                                          <FontAwesomeIcon icon={faBell} style={{ "cursor": "pointer", width: "24px", height: "24px", "position": "relative", "top": "5px" }} />
                                      </div>

                                  </Dropdown.Toggle>

                                  <Dropdown.Menu id="notification_list2" className="drop_down_scroll">
                                      {this.renderNotifications()}
                                  </Dropdown.Menu>
                              </Dropdown>

                          </div>
                      </div>


                      <img src={down} className="ml-2 d-none" />
                   

                  </div>

                  <div className="header_items2_0">
      
                      <div>
                          <Dropdown>
                              <Dropdown.Toggle variant="" id="dropdown-basic1">
                                  <img src={company} className="company_logo" />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  {this.renderCompanies()}
                              </Dropdown.Menu>
                          </Dropdown>
                      </div> 
        
                  </div>

                  <div className="header_items2">

                          <div className="heade_title_items2 ml-3">
                              <div className={this.state.c_view}>

                              </div>
                              <div>

                                  <Dropdown>
                                      <Dropdown.Toggle variant="" id="dropdown-basic2">
                                          <img src={face} />

                                      </Dropdown.Toggle>

                                      <Dropdown.Menu>
                                              <Dropdown.Item className="dropdown_item title_head" ><b>Name:</b> {this.state.fullname}</Dropdown.Item>
                                              <Dropdown.Item className="dropdown_item title_head" ><b>User Type:</b> {this.set_user_type()}</Dropdown.Item>
                                          <Dropdown.Item className="dropdown_item py-3" onClick={(e) => (this.logout())}><FontAwesomeIcon icon={faPowerOff} className="mr-2" />Logout</Dropdown.Item>
                                      </Dropdown.Menu>
                                  </Dropdown>

                              </div>
                          </div>


                          <img src={down} className="ml-2 d-none" />

                  </div>
              </div>
      </div>

      <div class="topright_div">
        <div className={this.state.c_view}>  
       
        </div>
        <img src={this.state.topright} className="topright"/>
      </div>
      
      <img src={this.state.defaultlogo} className={this.state.defaultlogoClass}/>
      
    </div>
    
  );
     }
}
}

export default Header;
