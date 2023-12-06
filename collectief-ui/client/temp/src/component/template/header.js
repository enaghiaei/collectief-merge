import React from "react"
import topright from "../../assets/image/topright.png"
import Spinner2 from "../spinner2"
import topright_v2 from "../../assets/image/topright_b.png"
import defaultlogo from "../../assets/image/v_m.png"
import defaultlogo1 from "../../assets/image/defaultlogo.png"
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
  import { faPowerOff } from '@fortawesome/free-solid-svg-icons'

class Header extends React.Component {
  
  constructor(props) {
  
    super(props);
   
    this.state = {
      fullname: "",
      topright: topright_v2,
      defaultlogo: defaultlogo,
      defaultlogoClass: "logo_v2",
      c_view:"d-inline",
      companies:[]
    }
    
    
  }
 
  componentDidMount(){
    
    this.is_login();
    this.companies();
    const cookies = new Cookies();
    if(window.location.pathname.indexOf("welcome") !== -1){
      cookies.remove("topright");
      cookies.remove("logo_type");
      cookies.remove("logo");
      cookies.remove("company_id");
    }
    var topright_c = cookies.get('topright');
    var topright = 'http://'+global.config.vals.root.ip+':3001/getTopRight?id='+topright_c
    var logo_c = cookies.get('logo');
    var logo_class = cookies.get('logo_type');
    if(logo_class == 0){
      logo_class = "logo"
    }else{
      logo_class = "logo_v2"
    }
    
    if(logo_c){
      if(logo_c.localeCompare("") !== 0 && logo_c.localeCompare("null") !== 0 && logo_c !== null)
        var logo = 'http://'+global.config.vals.root.ip+':3001/getLogo?id='+logo_c;
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
    
  }

  
  companies() {
    const cookies = new Cookies();
    //cookies.set('token', result.token, { path: '/' });
    console.log("cookies="+cookies.get('token'));
    return fetch('http://'+global.config.vals.root.ip+':3001/get_companies', {
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



is_login() {

  const cookies = new Cookies();
  var token = cookies.get('token');

  if(token != ""){
  var credentials = {token:token};
  console.log(credentials);
  return fetch('http://'+global.config.vals.root.ip+':3001/is_login', {
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
        console.log("message="+result.message);
        if(result.message === 1){   
          this.setState({fullname:result.name, c_view: "d-none"})
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



 render() {
  //const [fullname, setState] = useState("");
  //setState(fullnamenew);
  //var name = is_login();
  //var [fullname, ] = useState(fullname);
  //is_login();
  return (
    <div>
      <div className="header_items0">

        <img src={magnifier}/>

      </div>

      <div className="header_items1">

        <div>
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic1">
            <img src={company} className="company_logo"/>
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
              <Dropdown.Toggle variant="" id="dropdown-basic">
              <img src={face}/>
            
              </Dropdown.Toggle>
            
              <Dropdown.Menu>
              <Dropdown.Item className="dropdown_item title_head" >{this.state.fullname}</Dropdown.Item> 
                <Dropdown.Item className="dropdown_item py-3" onClick={(e)=>(this.logout())}><FontAwesomeIcon icon={faPowerOff} className="mr-2"/>Logout</Dropdown.Item>            
              </Dropdown.Menu>
            </Dropdown>

          </div>  
        </div>
        
        
        <img src={down} className="ml-2 d-none"/>
        
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

export default Header;
