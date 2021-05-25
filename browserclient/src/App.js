import React, { useEffect, useState } from "react";
import socket from "./utilities/socketConnection";

const App = () => {
    const [performanceData, setPerformanceData] = useState({});
    useEffect(() => {
        socket.on("perf_data", (data) => {
            // console.log(data.cpuLoad);
            setPerformanceData(data);
        });
    }, []);
    return (
        <div>
            <code>{JSON.stringify(performanceData, null, 4)}</code>
        </div>
    );
};

export default App;
