import React from "react";
import drawCircle from "../scripts/canvasLoadAnimation";

const Mem = ({ info }) => {
    // console.log(info);
    let { freeMem, totalMem, usedMem, memUsage } = info;
    memUsage *= 100;
    const factor = 1024 * 1024 * 1024;

    // console.log(cpuLoad);

    const canvas = document.querySelector("canvas.mem");
    drawCircle(canvas, memUsage);
    return (
        <div className='d-flex flex-column justify-content-center align-items-center m-4 p-2'>
            <h3>Memory Usage</h3>
            <div
                style={{
                    width: "200px",
                    height: "200px",
                    position: "relative",
                }}>
                <canvas
                    className='canvas-cpu mem'
                    width='200px'
                    height='200px'></canvas>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translateX(-50%) translateY(-50%)",
                    }}>
                    {memUsage}%
                </div>
            </div>

            <div className='mt-4'>
                <div>
                    Total Memory: {Math.floor((totalMem / factor) * 100) / 100}
                    gb
                </div>
                <div>
                    Free Memory: {Math.floor((freeMem / factor) * 100) / 100} gb
                </div>
                <div>
                    Used Memory: {Math.floor((usedMem / factor) * 100) / 100} gb
                </div>
            </div>
        </div>
    );
};

export default Mem;
