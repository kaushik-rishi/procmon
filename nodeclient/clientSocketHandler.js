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

    // send init data
    getPerformanceData().then((perfData) => {
        perfData.macAddress = macAddress;
        socket.emit("init_perf_data", perfData);
    });

    // send the performance data for every 1 second
    let performanceDataInterval = setInterval(() => {
        getPerformanceData().then((perfData) => {
            // [+] DEBUG_LOGS: incrementabl building of event listeners on disconnect and reconnect
            // console.log("alive");
            // console.log(socket.disconnected);
            perfData.macAddress = macAddress;
            perfData.isActive = true;
            socket.emit("perf_data", perfData);
        });
    }, 1000);

    socket.on("disconnect", () => {
        // Clear the interval if the socket is disconnected
        // [+] BUGFIX: prevents incremental build up of event listeners
        clearInterval(performanceDataInterval);
        console.log("Node client lost connection with the server.");
    });
});
