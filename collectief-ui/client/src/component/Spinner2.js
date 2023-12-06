import react from "react";
import "../assets/css/spinner2.css";

export default function Spinner2(props) {
    return (
        <div className="spinner-container2 text-center" >
     
            <svg width="100%"  viewBox="0 0 276 276" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <g id="spinner">
                    <circle id="bottom" cx="138" cy="138" r="114" stroke="#DBDBDB" stroke-width="18" />
                    <circle id="upper" cx="138" cy="138" r="123" stroke="#747779" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="373 100" style={{animationDuration:"2"+"s"}}/>
                </g>
            </svg>
            <p className="d-none">{props.customText}</p>
            </div>

    )
}