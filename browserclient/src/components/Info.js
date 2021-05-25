import React from "react";

const Info = ({ info }) => {
    // console.log(info);
    let { osType, uptime, cpuModel, cores, cpuSpeed } = info;
    uptime = Math.floor(uptime);

    return (
        <div className='p-4 border'>
            <h5>Operating System</h5>
            <p>{osType}</p>
            <div className='border-top my-3'></div>
            <h5>Uptime</h5>
            <p>{uptime}</p>
            <div className='border-top my-3'></div>
            <h5>CPU Information</h5>
            <p>
                <b>Type: </b>
                {cpuModel}
            </p>
            <p>Cores: {cores}</p>
            <p>
                <b>Clock Speed: </b>
                {cpuSpeed}
            </p>
        </div>
    );
};

export default Info;
