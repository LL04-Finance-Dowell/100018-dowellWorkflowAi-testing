import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./style.css";

const ProgressBar = ({ durationInMS, finalWidth }) => {
    const statusRef = useRef(null);
    const [ currentStatus, setCurrentStatus ] = useState("0");

    useEffect(() => {
        function move() {
            if (!statusRef.current) return

            var width = 1;
            var intervalPerRun = durationInMS / 100; 
            var id = setInterval(frame, intervalPerRun ? intervalPerRun : 100);

            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                } else {
                    setCurrentStatus(width)
                    width++; 
                    statusRef.current.style.width = width + '%'; 
                }
            }
        }

        move()

    }, [durationInMS])

    return <>
        <div className="progress__Bar__Wrapper">
            <div id={"progress__Bar__Container__Id"} ref={statusRef} className="progress__Bar__Container" style={{ width: `${currentStatus}%` }}>{finalWidth ? finalWidth : currentStatus}%</div>
        </div>
    </>
}

export default ProgressBar;