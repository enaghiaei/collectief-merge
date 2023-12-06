import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Control from './component/control/control';
import Calculator from './component/calculator/calculator';
import Notif from './component/notification/notification';
import Schedule from './component/scheduling/scheduling';
import Schedule_edit from './component/scheduling/scheduling_edit';
import List_sensors from './component/sensors/list_sensors';
import Assignment from './component/sensors/assignment';
import Locations from './component/sensors/locations';
import Clusters from './component/locations/clusters';
import Buildings from './component/locations/buildings';
import Units from './component/locations/units';
import Rooms from './component/locations/rooms';
import Create_users from './component/users/create_users';
import Edit_users from './component/users/edit_users';
import List_users from './component/users/list_users';
import Sri from './component/sri/sri';
import Home from './component/home';
import Home_detail from './component/home_detail';
import Login from './component/login';
import About from './component/about';
import Contact from './component/contact';
import Slider from './component/template/slider';
import Slider_other from './component/template/slider_other';
import Slider_facility from './component/template/slider_facility';
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

				is_login: false,
				user_type: -1
			};
		} else {
			this.state = {

				is_login: true,
				user_type: -1
			};
		}
	}

	componentDidMount() {
		this.is_login()
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
							this.setState({ is_login: true, user_type: result.user_type })
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
							<Route exact path='/home_detail' element={< Home_detail />}></Route>
							<Route exact path='/schedule/setting' element={< Schedule />}></Route>
							<Route exact path='/schedule/edit' element={< Schedule_edit />}></Route>
							<Route exact path='/control/setting' element={< Control />}></Route>
							<Route exact path='/sensors/list_sensors' element={< List_sensors />}></Route>
							<Route exact path='/users/list_users' element={< List_users />}></Route>
							<Route exact path='/users/edit_users' element={< Edit_users />}></Route>
							<Route exact path='/users/create_users' element={< Create_users />}></Route>
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
				if (this.state.user_type == 4) {
					return (
						<Router>
							<div className="App">
								<Header />
								<Slider />
								<Routes>
									<Route exact path='/' element={< Home />}></Route>
									<Route exact path='/home' element={< Home />}></Route>
									<Route exact path='/home_detail/:value' element={< Home_detail />}></Route>
									<Route exact path='/schedule/setting' element={< Schedule />}></Route>
									<Route exact path='/schedule/edit' element={< Schedule_edit />}></Route>
									<Route exact path='/control/setting' element={< Control />}></Route>
									<Route exact path='/sensors/list_sensors' element={< List_sensors />}></Route>
									<Route exact path='/sensors/locations/clusters' element={< Clusters />}></Route>
									<Route exact path='/sensors/locations/buildings' element={< Buildings />}></Route>
									<Route exact path='/sensors/locations/units' element={< Units />}></Route>
									<Route exact path='/sensors/locations/rooms' element={< Rooms />}></Route>
									<Route exact path='/users/list_users' element={< List_users />}></Route>
									<Route exact path='/users/create_users' element={< Create_users />}></Route>
									<Route exact path='/users/edit_users/:value' element={< Edit_users />}></Route>
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
				}
				else if (this.state.user_type == 3) {
					return (
						<Router>
							<div className="App">
								<Header />
								<Slider_facility />
								<Routes>
									<Route exact path='/' element={< Home />}></Route>
									<Route exact path='/home' element={< Home />}></Route>
									<Route exact path='/home_detail/:value' element={< Home_detail />}></Route>
									<Route exact path='/schedule/setting' element={< Schedule />}></Route>
									<Route exact path='/schedule/edit' element={< Schedule_edit />}></Route>
									<Route exact path='/control/setting' element={< Control />}></Route>
									<Route exact path='/sensors/list_sensors' element={< List_sensors />}></Route>
									<Route exact path='/sensors/locations/clusters' element={< Clusters />}></Route>
									<Route exact path='/sensors/locations/buildings' element={< Buildings />}></Route>
									<Route exact path='/sensors/locations/units' element={< Units />}></Route>
									<Route exact path='/sensors/locations/rooms' element={< Rooms />}></Route>
									<Route exact path='/users/list_users' element={< List_users />}></Route>
									<Route exact path='/users/create_users' element={< Create_users />}></Route>
									<Route exact path='/users/edit_users/:value' element={< Edit_users />}></Route>
									<Route exact path='/notification' element={< Notif />}></Route>
									<Route exact path='/about' element={< About />}></Route>
									<Route exact path='/contact' element={< Contact />}></Route>
									<Route exact path='/sensors/assignment' element={< Assignment />}></Route>
									<Route exact path='/calculator' element={< Calculator />}></Route>
									<Route exact path='/sensors/locations' element={< Locations />}></Route>
									<Route exact path='/login' element={< Login />}></Route>
									<Route exact path='/fr' element={< Fr />}></Route>
									<Route exact path='/sri' element={< Sri />}></Route>
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
				}
				else if (this.state.user_type == 1 || this.state.user_type == 2) {
					return (
						<Router>
							<div className="App">
								<Header />
								<Slider_other />
								<Routes>
									<Route exact path='/' element={< Home />}></Route>
									<Route exact path='/home' element={< Home />}></Route>
									<Route exact path='/home_detail/:value' element={< Home_detail />}></Route>
									<Route exact path='/schedule/setting' element={< Schedule />}></Route>
									<Route exact path='/schedule/edit' element={< Schedule_edit />}></Route>
									<Route exact path='/control/setting' element={< Control />}></Route>
									<Route exact path='/sensors/list_sensors' element={< List_sensors />}></Route>
									<Route exact path='/sensors/locations/clusters' element={< Clusters />}></Route>
									<Route exact path='/sensors/locations/buildings' element={< Buildings />}></Route>
									<Route exact path='/sensors/locations/units' element={< Units />}></Route>
									<Route exact path='/sensors/locations/rooms' element={< Rooms />}></Route>
									<Route exact path='/users/list_users' element={< List_users />}></Route>
									<Route exact path='/users/create_users' element={< Create_users />}></Route>
									<Route exact path='/users/edit_users/:value' element={< Edit_users />}></Route>
									<Route exact path='/notification' element={< Notif />}></Route>
									<Route exact path='/about' element={< About />}></Route>
									<Route exact path='/contact' element={< Contact />}></Route>
									<Route exact path='/sensors/assignment' element={< Assignment />}></Route>
									<Route exact path='/sensors/locations' element={< Locations />}></Route>
									<Route exact path='/login' element={< Login />}></Route>
									<Route exact path='/fr' element={< Fr />}></Route>
									<Route exact path='/sri' element={< Sri />}></Route>

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
				}

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
