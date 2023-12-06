
import React from "react";



class Fr extends React.Component {

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
            <div className="APP">
               Hello
            </div>
        );
    }
}



export default Fr;