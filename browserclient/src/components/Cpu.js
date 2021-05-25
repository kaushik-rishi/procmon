import React from "react";
import drawCircle from "../scripts/canvasLoadAnimation";

const Cpu = ({ info: cpuLoad }) => {
    // console.log(cpuLoad);

    const canvas = document.querySelector("canvas");
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
                <canvas
                    className='canvas-cpu'
                    width='200'
                    height='200'></canvas>
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
