const io = require("socket.io-client");
const { port, machineClientAuthSecret } = require("../config.json");
const socket = io(`http://localhost:${port}`);
const {
    getPerformanceData,
    getExternalMACAddress,
} = require("./dataAggregator");

socket.on("connect", () => {
    let macAddress = getExternalMACAddress();

    // simple authorisation
    socket.emit("authSecret", machineClientAuthSecret);

    // send the performance data for every 1 second
    let performanceDataInterval = setInterval(() => {
        getPerformanceData().then((perfData) => {
            socket.emit("perf_data", perfData);
        });
    }, 1000);
});

socket.on("disconnect", () => {
    console.log("Node client lost connection with the server :-(");
});
