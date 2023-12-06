
import React from "react";
import ReactWeather from 'react-open-weather';

import { Line } from '@ant-design/charts';
import { Gauge } from '@ant-design/plots';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Area } from '@ant-design/plots';
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



    /* renderRows(){
       console.log("renderRows");
       this.createRow();
     }*/


    render() {
        
            
        return (
            <div className="main_panel">
                <div className="container_main">
                   
                    <div className="">
                        
                    </div>
                   
                </div>
            </div>
        );
    }
}



export default Control;