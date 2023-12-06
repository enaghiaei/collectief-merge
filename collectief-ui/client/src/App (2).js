import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Control from './component/control/control';
import Notif from './component/notification/notification';
import Schedule from './component/scheduling/scheduling';
import Schedule_edit from './component/scheduling/scheduling_edit';
import List_sensors from './component/sensors/list_sensors';
import Assignment from './component/sensors/assignment';
import Locations from './component/sensors/locations';
import Home from './component/home';
import Login from './component/login';
import About from './component/about';
import Contact from './component/contact';
import Slider from './component/template/slider';
import Fr from './component/fr';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import Header from './component/template/header';
import Cookies from 'universal-cookie';
class App extends Component {
	constructor(props) {

		super(props);

		if (window.location.pathname !== "/") {
			//this.is_login()
			this.state = {

				is_login: true
			};
		} else {
			this.state = {

				is_login: true
			};
		}
	}


	is_login() {

		const cookies = new Cookies();
		var token = cookies.get('token');
		//alert(token)
		if (token != "" && token) {
			var credentials = { token: token };
			console.log(credentials);
			console.log(global.config.vals.root.ip)
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
						if (result.message === 1) {
							this.setState({ is_login: true })
							return true;

						}
						else if (result.message === 0) {

							console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
							const cookies = new Cookies();
							cookies.remove('token');
							if (window.location.pathname !== "/")
								window.location.href = "/";
							return false;


						} else {
							if (window.location.pathname !== "/")
								window.location.href = "/";
						}
						console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

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
			if (window.location.pathname !== "/")
				window.location.href = "/";
			return false;
		}

	}


	render() {

		if (window.location.pathname === "/") {
			return (
				<Router>
					<div className="App">

						<Routes>
							<Route exact path='/' element={< Login />}></Route>
							<Route exact path='/home' element={< Home />}></Route>
							<Route exact path='/schedule/setting' element={< Schedule />}></Route>
							<Route exact path='/schedule/edit' element={< Schedule_edit />}></Route>
							<Route exact path='/control/setting' element={< Control />}></Route>
							<Route exact path='/sensors/list_sensors' element={< List_sensors />}></Route>
							<Route exact path='/about' element={< About />}></Route>
							<Route exact path='/contact' element={< Contact />}></Route>
							<Route exact path='/notification' element={< Notif />}></Route>
							<Route exact path='/sensors/assignment' element={< Assignment />}></Route>
							<Route exact path='/sensors/locations' element={< Locations />}></Route>
							<Route exact path='/login' element={< Login />}></Route>
							<Route exact path='/fr' element={< Fr />}></Route>
						</Routes>

					</div>
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
				</Router>
			);
		} else {
			if (this.state.is_login) {
				return (
					<Router>
						<div className="App">
							<Header />
							<Slider />
							<Routes>
								<Route exact path='/' element={< Home />}></Route>
								<Route exact path='/home' element={< Home />}></Route>
								<Route exact path='/schedule/setting' element={< Schedule />}></Route>
								<Route exact path='/schedule/edit' element={< Schedule_edit />}></Route>
								<Route exact path='/control/setting' element={< Control />}></Route>
								<Route exact path='/sensors/list_sensors' element={< List_sensors />}></Route>
								<Route exact path='/notification' element={< Notif />}></Route>
								<Route exact path='/about' element={< About />}></Route>
								<Route exact path='/contact' element={< Contact />}></Route>
								<Route exact path='/sensors/assignment' element={< Assignment />}></Route>
								<Route exact path='/sensors/locations' element={< Locations />}></Route>
								<Route exact path='/login' element={< Login />}></Route>
								<Route exact path='/fr' element={< Fr />}></Route>
							</Routes>

						</div>
						<ToastContainer
							position="top-right"
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
						/>
					</Router>

				);
			} else {
				<Router>
					<div className="App">
					</div>
				</Router>
			}
		}

	}
}

export default App;
