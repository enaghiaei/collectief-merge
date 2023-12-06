
import React from "react";
import ReactWeather from 'react-open-weather';

import { Line } from '@ant-design/charts';
import { Gauge } from '@ant-design/plots';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Area } from '@ant-design/plots';
import { faClose, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
var rate = 0;
var comment = "";
const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        width: '70%',
        bottom: 'auto',
        marginRight: '-50%',
        'z-index':'300',
        transform: 'translate(-50%, -50%)',
        "border-radius": "10px"
    },
    overlay: {
        
        'z-index': '300'
      
    },
};
let subtitle;
class Calculator extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            items: [],
            loading: "text-center",
            modalIsOpen5: false,
            setIsOpen5: false
        };
        this.setState({
            items: [],
            loading: "text-center"
        });




    }


    openModal5() {
       // id_for_close = id;

        //setIsOpen(true);
        this.setState({
            setIsOpen5: true
        });
    }

    afterOpenModal5() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    closeModal5() {

        this.setState({
            setIsOpen5: false

        });
    }

    save_data(schedule, index) {
        const cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        var x = {};
        x.chart = {};
        x.chart.item1 = {};
        x.chart.item2 = {};
        x.chart.item3 = {};
        x.chart.item4 = {};
        x.chart.item5 = {};
        x.chart.item6 = {};
        x.chart.item7 = {};
        x.chart.item1.val = $("#item1").val()
        x.chart.item2.val = $("#item2").val()
        x.chart.item3.val = $("#item3").val()
        x.chart.item4.val = $("#item4").val()
        x.chart.item5.val = $("#item5").val()
        x.chart.item6.val = $("#item6").val()
        x.chart.item7.val = $("#item7").val()
        x.chart.item1.title = "Energy Efficiency"
        x.chart.item2.title = "Energy Flexibility and Storage"
        x.chart.item3.title = "Comfort"
        x.chart.item4.title = "Convenience"
        x.chart.item5.title = "Health,Well-being and Accessibility"
        x.chart.item6.title = "Maintenance and Fault Prediction"
        x.chart.item7.title = "Information to Occupants"
        x.total_sri = $("#total_sri").val()
        x.class_sri = $("#class_sri").val()
        return fetch('http://' + global.config.vals.root.ip + ':3002/update_sri', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token'), data: JSON.stringify(x)})
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
                    toast.success('The new SRI was saved', {
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
                        <div className="text-left mb-3">
                            <button value="" onClick={(event) => this.openModal5()} className="main_header_button inline-table m-2"><FontAwesomeIcon icon={faPlus} className="icon-white inline-table" style={{ "padding-right": "8px" }} /> Register Data </button>
                        </div>
                        <iframe width="100%" height="800" frameborder="0" scrolling="no" src="https://onedrive.live.com/embed?resid=A739990700C84BC8%211161&authkey=%21AK3jW2_iVFV83hk&em=2&AllowTyping=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True&edesNext=false&resen=false&ed1JS=false"></iframe>
                    </div>

                </div>
                <Modal
                    isOpen={this.state.setIsOpen5}
                    onAfterOpen={this.afterOpenModal5}
                    onRequestClose={this.closeModal5}
                    style={customStyles2}
                    contentLabel="Example Modal"
                >
                    <div style={{ "text-align": "right", "min-width": "400px", "border-bottom": "1px solid gray" }} className="mb-2 pb-2">
                        <button onClick={(event) => this.closeModal5()} style={{ "text-align": "right", "border": "0px", "width": "25px", "height": "25px", "background-color": "white" }}> <FontAwesomeIcon alt="Close" title="Close" onClick={(event) => this.show_sensors1()} style={{ "width": "30px", "height": "30px" }} icon={faClose} /></button>
                    </div>
                    <div className="m-2">

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}>Total SRI Score</span>
                        <div className="newline mt-1"></div>
                        <input id="total_sri" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Total SRI Score" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> SRI Class</span>
                        <div className="newline mt-1"></div>
                        <input id="class_sri" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="SRI Class" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> Energy Efficiency</span>
                        <div className="newline mt-1"></div>
                        <input id="item1" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Energy Efficiency" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> Energy Flexibility and Storage</span>
                        <div className="newline mt-1"></div>
                        <input id="item2" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Energy Flexibility and Storage" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> Comfort </span>
                        <div className="newline mt-1"></div>
                        <input id="item3" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Comfort" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> Convenience </span>
                        <div className="newline mt-1"></div>
                        <input id="item4" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Convenience" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> Health,Well-being and Accessibility</span>
                        <div className="newline mt-1"></div>
                        <input id="item5" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Health,Well-being and Accessibility" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> Maintenance and Fault Prediction</span>
                        <div className="newline mt-1"></div>
                        <input id="item6" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Maintenance and Fault Prediction" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>

                        <span className="mr-2" style={{ "color": "#000", "font-weight": "bold" }}> Information to Occupants </span>
                        <div className="newline mt-1"></div>
                        <input id="item7" type="text" onKeyDown={(event) => this.setEditText(event)} className="ml-1 mr-4" placeholder="Information to Occupants" style={{  width: "90%", "padding": "8px", "border-radius": "5px" }} size="4" />
                        <div className="newline mt-2"></div>
                       
                        <div className="newline mt-1"></div>
                       




                        <div className="newline mt-4"></div>
                        <div style={{ "text-align": "center", "border-top": "1px solid gray" }} className="pt-4">
                            <button style={{ "padding": "10px", "padding-left": "20px", "padding-right": "20px", "border-radius": "7px", "background-color": "#ffbf1f", "color": "#000", "border": "0px", "font-weight": "bold" }} onClick={(event) => this.save_data()} >
                                Save Data
                            </button>
                        </div>

                    </div>

                </Modal>
            </div>
        );
    }
}



export default Calculator;