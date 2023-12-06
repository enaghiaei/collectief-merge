import React from "react";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import {store, useGlobalState} from 'state-pool';
  import 'react-toastify/dist/ReactToastify.css';
import right from '../../assets/image/right.png';
import left from '../../assets/image/left.png';
import menu_video from '../../assets/image/menu_video.png';
import menu_analyse from '../../assets/image/menu_analyse.png';
import menu_data from '../../assets/image/menu_data.png';
import menu_user from '../../assets/image/menu_user.png';
import menu_company from '../../assets/image/menu_company.png';
import menu_logout from '../../assets/image/menu_logout.png';
import menu_home from '../../assets/image/menu_home.png';
import menu_video_b from '../../assets/image/menu_video_b.png';
import menu_analyse_b from '../../assets/image/menu_analyse_b.png';
import menu_data_b from '../../assets/image/menu_data_b.png';
import menu_user_b from '../../assets/image/menu_user_b.png';
import menu_company_b from '../../assets/image/menu_company_b.png';
//import menu_logout_b from '../../assets/image/menu_logout.png';
import menu_home_b from '../../assets/image/menu_home_b.png';
import play_video from '../../assets/image/play_video.png';
import { ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus, faGear, faTemperature0, faPowerOff, faArrowRight, faArrowLeft, faInfo, faCircleInfo, faInfoCircle, faHome, faClock, faVolumeControlPhone } from '@fortawesome/free-solid-svg-icons';
const menus = [{ title: "Dashboard", icon: <FontAwesomeIcon icon={faHome} className="arrow3" />, icon_b: <FontAwesomeIcon icon={faHome} className="arrow3-b" />, uri: "/home" }, { title: "Scheduling", uri: "/scheduling", icon: <FontAwesomeIcon icon={faClock} className="arrow3" />, icon_b: <FontAwesomeIcon icon={faClock} className="arrow3-b" /> }, { title: "Control Panel", uri: "/control", icon: <FontAwesomeIcon icon={faVolumeControlPhone} className="arrow3" />, icon_b: <FontAwesomeIcon icon={faVolumeControlPhone} className="arrow3-b" /> }, { title: "Logout", uri: "", icon: <FontAwesomeIcon icon={faPowerOff} className="arrow3" />, icon_b: <FontAwesomeIcon icon={faPowerOff} className="arrow3-b" /> }];

class Slider extends React.Component {
  
  constructor(props) {
  
    super(props);
    this.togglemenu= this.togglemenu.bind(this);
    this.state = {
      isActive: false,
      menu_: false,
      menus:menus,
      current: 0
    }      
    
  }

  componentDidMount(){

    var cookies = new Cookies();

    if(cookies.get('menu_') === "true"){

      this.togglemenu();

    }  

  }

  togglemenu(){
    
    console.log("x");
    console.log(this.page_size);
    const currentState = this.state.isActive;
    const [width, height] = [window.innerWidth, window.innerHeight];
    console.log(width);
    this.setState({ isActive: !currentState });
    if(this.state.menu_){
      var cookies = new Cookies();
      cookies.set('menu_', 'false', { path: '/' });
      this.setState({ menu_: false });
    }else{
      var cookies = new Cookies();
      cookies.set('menu_', 'true', { path: '/' });
      this.setState({ menu_: true });
    }
    if(this.state.isActive){
      this.setState({
        divstyle : {          
           width: width*0.13
        }      });
    }else{
      this.setState({
        divstyle : {          
           width: width*0.05
        }      });
    }

  }

  
  logout() {

    var cookies = new Cookies();
    //cookies.set('token', result.token, { path: '/' });
    console.log("cookies="+cookies.get('token'));
    return fetch('http://'+global.config.vals.root.ip+':3001/logout', {
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

  choose_menu(id){

    this.setState({ current: id });
    const worker = new Worker('./worker.js');
    var k =0;

    switch(id){

      case 0:
        window.location.href = "/home";
        break;
      case 1:
            window.location.href = "/schedule/setting";
        break;
      case 2:
            window.location.href = "/control/setting";
        break;
      case 3:
        window.location.href = "/show_data";
        break;
      case 4:
        window.location.href = "/data_list_projects";
        break;
      case 5:
        window.location.href = "/list_users";
        break;
      case 6:
        this.logout();
        break;

    }
    
  }

  render_menus(){
    
    var context = this;

    return  context.state.menus.map(function(o, i) {

      return (context.set_menu(i));      

    });
    
  }

  set_menu(id){

    console.log(window.location.pathname);
    console.log(menus[id].title);
    console.log("indexOf==="+window.location.pathname.indexOf(menus[id].title.toLocaleLowerCase()));

    if(window.location.pathname.indexOf(menus[id].uri.toLocaleLowerCase()) !== -1 && menus[id].uri != ""){

      return (<div class="menu-item border-right-n" title={menus[id].title}  onClick={() => this.choose_menu(id)}>
         
          {menus[id].icon_b}
          
        <div class={this.state.isActive ? 'menu-item-text-b hide': 'menu-item-text-b'}>
          {menus[id].title}
        </div>
        </div>
      );

    }else{

      return (<div class="menu-item" title={menus[id].title}  onClick={() => this.choose_menu(id)}>
          {menus[id].icon}
        <div class={this.state.isActive ? 'menu-item-text hide': 'menu-item-text'}>
          {menus[id].title}
        </div>
      </div>
      );

    }

  }

  render() {
    
    var context = this;
    return (
      
      <div class={this.state.isActive ? 'menu menu-close': 'menu menu-open'} style={this.state.divstyle}>
        <input type="hidden" id="menu_stat" value={this.state.menu_}/>
        <div class="menu-crtl">
          <img src={this.state.isActive ? right : left} class={this.state.isActive ? 'menu-h-close': 'menu-h-open'} onClick={(e) =>this.togglemenu()}/>
        </div>
        
        {this.render_menus()}
        
      </div>
      
    );
  }

}

export default Slider;
