import React, { useEffect, useState } from "react";
import socket from "./utilities/socketConnection";

import Widget from "./components/Widget";

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
            <Widget data={performanceData} />
        </div>
    );
};

export default App;
