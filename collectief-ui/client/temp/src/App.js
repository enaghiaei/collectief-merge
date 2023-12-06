import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Control from './component/control/control';
import Schedule from './component/scheduling/scheduling';
import Home from './component/home';
import About from './component/about';
import Contact from './component/contact';
import Slider from './component/template/slider';
import Fr from './component/fr';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import Header from './component/template/header';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<Header />
					<Slider />
					<Routes>
						<Route exact path='/' element={< Home />}></Route>
						<Route exact path='/home' element={< Home />}></Route>
						<Route exact path='/schedule/setting' element={< Schedule />}></Route>
						<Route exact path='/control/setting' element={< Control />}></Route>
						<Route exact path='/about' element={< About />}></Route>
						<Route exact path='/contact' element={< Contact />}></Route>
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
}

export default App;
