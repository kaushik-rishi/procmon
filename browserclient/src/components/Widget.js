import React from "react";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";

const Widget = ({ data }) => {
    // prettier-ignore
    const { cores, cpuLoad, cpuModel, cpuSpeed, freeMem, memUsage, osType, totalMem, uptime, usedMem } = data;
    return (
        <div>
            <Cpu info={cpuLoad} />
            <Mem
                info={{
                    freeMem,
                    totalMem,
                    usedMem,
                    memUsage,
                }}
            />
            <Info
                info={{
                    cores,
                    cpuModel,
                    cpuSpeed,
                    osType,
                    uptime,
                }}
            />
        </div>
    );
};

export default Widget;
