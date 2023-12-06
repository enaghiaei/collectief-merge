import react from "react";
import "../assets/css/spinner3.css";

export default function Spinner3(props) {
    
    return (
        <div className="spinner-container3">

            <svg width="87" height="50" viewBox="0 0 87 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="loader_bars">
                    <g id="upperbar">
                        <rect id="1_2" width="67" height="14" rx="7" fill="#1B33A1" />
                    </g>
                    <g id="middlebar">
                        <rect id="Rectangle 2" x="20" y="18" width="67" height="14" rx="7" fill="#3048B6" />
                    </g>
                    <g id="bottombar">
                        <rect id="3_2" y="36" width="67" height="14" rx="7" fill="#4E65CE" />
                    </g>
                </g>
            </svg>


            <p></p>
        </div>

    )
}