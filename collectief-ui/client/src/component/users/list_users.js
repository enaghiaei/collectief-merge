
import React from "react";
import Cookies from 'universal-cookie';

import menu_user_b from '../../assets/image/menu_user_b.png';
import info from '../../assets/image/info.png';
import action from '../../assets/image/action.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faExchange, faPlus, faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Spinner3 from "../Spinner3"

class List_users extends React.Component {

    constructor(props) {
    
      super(props);
      this.state = {
          items:[],
          loading: "text-center",
          user_types: [{ id: "1", title: "Admin" }, { id: "2", title: "Cluster Manager" }, { id: "3", title: "Facility Manager" }, { id: "4", title: "End User" }]
      };
      this.setState({
        items: [],
        loading:"text-center"
      });
     // var ch = new CheckLogin1();
      //console.log("user=="+ch.check_token());
      
    
    }

    componentDidMount(){
        this.is_login();
        setTimeout(() => {
            this.users();
        }, 2000);
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
            if(result.message === "1"){   

              return true;                 
              
            }else if(result.message === "0"){

              if(token != ""){
                const cookies = new Cookies();
                cookies.remove('token');       
                return false;
              }
              return true; 

            }
    
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
      }else{
        return true;
      }
        
     }


    create_users(){
      window.location.href = "/users/create_users";
    }

    users() {
      const cookies = new Cookies();
      //cookies.set('token', result.token, { path: '/' });
      console.log("cookies="+cookies.get('token'));
      return fetch('http://'+global.config.vals.root.ip+':3002/get_users_v2', {
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
              items: result.result,
              loading:"d-none"
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

    edit_user(token) {
        window.location.href = "/users/edit_users/" + token;
    }

    renderRows(){
      var context = this; 
      return  this.state.items.map(function(o, i) {
          var x = context.state.items[i].created_at.split("T");
          console.log(context.state.items[i])
          var user_type = "";
          for (var key in context.state.user_types) {
              if (context.state.user_types[key].id == context.state.items[i].user_type) {
                  user_type = context.state.user_types[key].title
              }
          }
          var xx = {};
          //if (context.state.items[i].location_detail != "")
          //   xx = JSON.parse(context.state.items[i].location_detail)
          var cluster = "-"
          var building = "-"
          var unit = "-"
          if (xx && xx.cluster) {
              cluster = xx.cluster
          }
          if (xx && xx.building) {
              building = xx.building
          }
          if (xx && xx.unit) {
              unit = xx.unit
          }
        return (<tr>
          <td>
          {(i+1)}
          </td>
          <td>
          {context.state.items[i].fullname}
          </td>
          <td>
            {context.state.items[i].email}
          </td>
          <td>
            {user_type}
          </td>
           
          <td>
          {x[0]}
          </td>
          <td>
          {x[1].replace(".000Z","")}
          </td>
            <td>
                {<img style= {{"cursor" : "pointer"}} onClick={(event) => context.edit_user(context.state.items[i].token)} src={action}></img>}
          </td>
          <td>
          {<img src={info}></img>}
          </td>
        </tr>);
      });
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
  
        if(1 == 2){
            //window.location.href = "/";
            //return false;
        }else{
            return (
            <div className="main_panel">
              <div className="main_content">
                        <div className="main_header">
                            <FontAwesomeIcon icon={faUserGroup} className="main_header_img2" />
                  <span className="main_header_txt">Users</span>
                  <div className="newline mt-4"></div>
                  <button className="main_header_button"  onClick={() => this.create_users()}>
                                <FontAwesomeIcon className="icon-white" icon={faPlus} style={{"padding-right":"8px"}}/> 
                    New user
                  </button>
                </div>
                <div className="main_info">
                  <table className="table mt-4">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                       
                        <th>Date</th>
                        <th>Time</th>                       
                        <th>Action</th>
                        <th>Info</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.renderRows()}
                    
                    </tbody>
                  </table>
                  <div className={this.state.loading}>  
                  <Spinner3 customText="Loading"/>
                  </div>
                </div>
              </div>
            </div>
              );
        }
        /* <th>Cluster</th>
                        <th>Building</th>
                        <th>Unit</th> */
    }

}

export default List_users;