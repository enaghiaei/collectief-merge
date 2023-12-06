import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import CheckLogin1 from './CheckLogin';
import PropTypes from 'prop-types';

import v_m2 from './../assets/image//v_m.png';
import v_m3 from './../assets/image//v_m.png';
import v_m from "./../assets/image/defaultlogo6.png"
import topleft from './../assets/image//topleft.png';
import rightbottom from './../assets/image//rightbottom.png';
import google from './../assets/image//iconfinder_Google_12987451.png';

import collectief from './../assets/image//collectief_logo_new.jpg';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class Login extends React.Component {

  constructor(props) {
  
    super(props);
    
    
    
    console.log(global.config.vals.root.ip);
    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
    
  }

  componentDidMount(){
    this.is_login();
    
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
          console.log("message="+result.message);
          if(result.message === 1){   
            var ch = new CheckLogin1();
            if(ch.check_token()){
              window.location.href = "/home";      
              return false;
            }               
            
          }
          else if(result.message === 0){

            console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
              const cookies = new Cookies();
              cookies.remove('token'); 
              //window.location.href = "/";      
              return false;
            

          }
          console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
  
          //if(result.message == "1")
          //  window.location.href = "/welcome";
  
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



loginUser() {
    if (this.state.user != "" && this.state.password != "") {
        
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        // console.log("cookies=" + cookies.get('token')); // Pacman

        setTimeout(() => {
           // window.location.href = "/home";
        }, 1000);
  var credentials = {username:this.state.user,password:this.state.pass};
  console.log(credentials);
  return fetch('http://'+global.config.vals.root.ip+':3002/check_user', {
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
        if(result.message == "1"){   
            //if (1 == 1) { 
          toast.success('Login was successful', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });          
          const cookies = new Cookies();
            cookies.set('token', result.token, { path: '/' }); 
            cookies.set('user_type', result.user_type, { path: '/' }); 
          console.log("cookies="+cookies.get('token')); // Pacman
          
          setTimeout(() => {
            window.location.href = "/home";
          }, 2000);
          
        }else{
          toast.error('Invalid username or password', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        }

        //if(result.message == "1")
        //  window.location.href = "/welcome";

      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
       /* toast.error('Server is not available', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        this.setState({
          isLoaded: true,
          error
        });*/
          
          const cookies = new Cookies();
          //cookies.set('token', result.token, { path: '/' });
         // console.log("cookies=" + cookies.get('token')); // Pacman

          setTimeout(() => {
              window.location.href = "/home";
          }, 2000);
      }
    )
  }else{
    if(this.state.user === ""){
      toast.error('Please enter username', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    if(this.state.password === ""){
      toast.error('Please enter password', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }
    
 }

 loginUserG(){
   //$(".g-signin2").trigger();
 }

 setUserName(user){
  this.setState({
    user: user
  });
 }

 setPassword(pass){
  this.setState({
    pass:pass
  });
 }

 onSignIn(googleUser){
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
 }
 handleClick = (e) => {
  this.inputElement.click();
}

render() {
    
  return (
    
    <div className="login">
      <img src={topleft} className='topleft'></img>
      <img src={rightbottom} className='rightbottom'></img>
      <div class="container">
        <div class="row align-items-center">
          
          <div class="col-lg-12">
            
            <p class="d-flex justify-content-center bd-highlight login-top">
              <form>
                <div class="login_container grid">
                  <div class="row login_container_l2">
                    <div class="col col-left">
                                          <img src={collectief} id="left_img" class="left_img"/>
                    
                    </div>
                    <div class="col col-right">
                    <div class="text-left">
                      <img src={v_m} class="v_m mb-2"></img>  
                    </div>  
                    <div class="login_l1 text-left my-3">
                    Welcome back
                    </div>
                    <div class="login_l2 text-left">
                      
                    Login to your account
                    
                    </div>
                    <div class="text-left">
                      <label htmlFor="username" class="label_text">Username  </label>
                      <div>
                        <input type="text" class="input_text" onClick={e => this.setUserName(e.target.value)} onChange={e => this.setUserName(e.target.value)} name="username" id="username" />
                      </div>
                    </div>
                    <div class="text-left">
                      <div>
                        <label htmlFor="password" class="label_text">password </label>
                      </div>
                      <input type="password" class="input_text" name="password" id="password" onClick={e => this.setPassword(e.target.value)} onChange={e => this.setPassword(e.target.value)} />
                    </div>
                    <div class="row my-3">
                      <div class="col remember text-left">
                        <input type="checkbox"/>
                        <span class="remember_txt ml-1">Remember me</span>
                      </div>
                      <div class="col forgot text-left">
                        Forgot password?
                      </div>
                    </div>
                    <div class="text-left">               
                    <input type="button" onClick={(e) =>this.loginUser()} value="Login now" class="login_b" />
                    </div>
                    <div class="g-signin2 d-none" data-onsuccess="onSignIn" ref={div => this.inputElement = div}>   
                    </div>
                    
                    <div class="text-center">               
                    <div class="login_b2"  onClick={this.handleClick}> <img src={google} class="mr-2"></img>Or sign-in with google</div>
                    </div>
                    </div>
                    
                  </div>
                </div>
              </form>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
}
export default Login;
