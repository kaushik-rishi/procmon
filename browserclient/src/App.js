import React, { useEffect, useState } from "react";
import socket from "./utilities/socketConnection";
import { Container } from "react-bootstrap";
import Widget from "./components/Widget";

const App = () => {
    const [performanceDatas, setPerformanceDatas] = useState({});
    /*
    - a dictionary that maps the mac addresses to the data
    peformanceDatas = {
        '1': {
            cpuLoad: ...
        },
        '2': {
            cpuLoad: ...
        }
    }
    */
    useEffect(() => {
        socket.on("perf_data", (data) => {
            // console.log(data);
            // console.log(data.macAddress);
            // console.log(data.cpuLoad);
            const newData = {};
            newData[data.macAddress] = data;
            setPerformanceDatas((prevPerfDatas) => {
                return { ...prevPerfDatas, ...newData };
                /*
                 * BUG1: Not working
                 * const newPerfDatas = prevPerfDatas;
                 * newPerfDatas[data.macAddress] = data;
                 * return newPerfDatas;
                 * BUG2: Not working
                 * prevPerfDatas[data.macAddress] = data;
                 * console.log(prevPerfDatas);
                 * return prevPerfDatas;
                 */
            });
        });
    }, []);

    let widgetList = [];
    Object.entries(performanceDatas).forEach(([macAddress, perfData]) => {
        widgetList.push(<Widget key={macAddress} data={perfData} />);
    });

    return <Container>{widgetList}</Container>;
};

export default App;
