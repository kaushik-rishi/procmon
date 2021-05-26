import React from "react";
import drawCircle from "../scripts/canvasLoadAnimation";

const Cpu = ({ info: cpuLoad, macAddress }) => {
    // console.log(cpuLoad);

    const canvas = document.querySelector(`.canvas-cpu-${macAddress}`);
    const classname = `canvas-cpu-${macAddress}`;

    drawCircle(canvas, cpuLoad);
    return (
        <div className='d-flex flex-column justify-content-center align-items-center m-4 p-2'>
            <h3>CPU Load</h3>
            <div
                style={{
                    width: "200px",
                    height: "200px",
                    position: "relative",
                }}>
                <canvas width='200' height='200' className={classname}></canvas>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translateX(-50%) translateY(-50%)",
                    }}>
                    {cpuLoad}%
                </div>
            </div>
        </div>
    );
};

export default Cpu;
