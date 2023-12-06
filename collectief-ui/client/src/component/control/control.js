
import React from "react";
import ReactWeather from 'react-open-weather';

import { Line } from '@ant-design/charts';
import { Gauge } from '@ant-design/plots';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Area } from '@ant-design/plots';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var rate = 0;
var comment = "";
class Control extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            items: [],
            loading: "text-center"
        };
        this.setState({
            items: [],
            loading: "text-center"
        });




    }

    save_comment(schedule, index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/save_comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "rate": rate, "comment": $("#comment").val()})
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
                    toast.success('The new comment is saved', {
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

    /* renderRows(){
       console.log("renderRows");
       this.createRow();
     }*/

    setStar(id) {
        for (var x = 1; x <= 5; x++) {
            $("#id" + x).css("color", "gray");
        }
        for (var x = 1; x <= id; x++) {
            $("#id" + x).css("color","#E9BC30");
        }
        rate = id;
    }


    render() {
        
            
        return (
            <div className="main_panel">
                <div className="container_main">

                    <div className="container_main_l1 text-center" style={{ "vertical-align": "middle", "min-height": "400px" }}>
                        <div style={{ display: "inline-table" , "text-align" : "left"}}>
                            <span style={{"font-weight":"bold"} }>Rating</span>
                            <div className="newline mt-1"></div>
                            <div className="ml-1">
                            <FontAwesomeIcon icon={faStar} id="id1" onClick={(event) => this.setStar(1)} className="circle mr-4" style={{ "width": "16px", "color": "gray", "border": "2px solid gray" , "cursor" : "pointer" }} />
                            <FontAwesomeIcon icon={faStar} id="id2" onClick={(event) => this.setStar(2)} className="circle mr-4" style={{ "width": "16px", "color": "gray", "border": "2px solid gray", "cursor": "pointer" }} />
                            <FontAwesomeIcon icon={faStar} id="id3" onClick={(event) => this.setStar(3)} className="circle mr-4" style={{ "width": "16px", "color": "gray", "border": "2px solid gray", "cursor": "pointer" }} />
                            <FontAwesomeIcon icon={faStar} id="id4" onClick={(event) => this.setStar(4)} className="circle mr-4" style={{ "width": "16px", "color": "gray", "border": "2px solid gray", "cursor": "pointer" }} />
                            <FontAwesomeIcon icon={faStar} id="id5" onClick={(event) => this.setStar(5)} className="circle mr-4" style={{ "width": "16px", "color": "gray", "border": "2px solid gray", "cursor": "pointer" }} />
                            </div>
                            <div className="newline" className="mt-3"></div>
                            <span style={{ "font-weight": "bold" }}>
                                What can we improve?
                            </span>
                            <div className="newline mt-1"></div>
                            <textarea cols="62" rows="10" style={{ border: "2px solid #B58816", "border-radius": "6px" }} id="comment" className="ml-1"></textarea>
                            <div className="newline"></div>
                        </div>
                        <div className="newline"></div>
                        <div className = "mt-3">
                            <button onClick={(event) => this.save_comment()} className="main_header_button" >Submit</button>
                        </div>
                        <div className="newline"></div>
                        <div className="mt-5 p-4" style={{ "box-shadow": "5px 10px #ddd","line-height":"36px","vertical-align": "middle", "display": "inline-table", "width": "50%", "text-align": "justify", "letterSpacing":"1px","border":"1px solid #ccc","border-radius":"10px"}}>
                            <b>Dear David</b>, Your experience in using our dashboard is valuable for us. We would appreciate if you take a few minutes to fill out our POE.
                            <br />
                            <div className="mt-4" style={{ "text-align": "center" }}>
                                <a href="mailto:daniel.nilsson@virtual.se">Click here to start POE</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}



export default Control;