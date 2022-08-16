#!/usr/bin/node

require("colors");
const io = require("socket.io-client");
const ora = require("ora");
const validator = require("validator");

const {
    port: portServer,
    machineClientAuthSecret,
    privateIpServer,
} = require("../config.json");

// TODO: change slice limit when the application is packaged to npm
process.argv = process.argv.slice(2);

// TODO: Change this to server id input from the command line
const serverUrl = process.argv[0];
if (!validator.isURL(serverUrl)) {
    console.log("❌ Please enter a valid server url.");
    process.exit(1);
}

// const socket = io(`http://${privateIpServer}:${portServer}`);
const socket = io(serverUrl);
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
    const spinner = ora(`Streaming data to the server ...`);
    spinner.start();
    let performanceDataInterval = setInterval(() => {
        getPerformanceData().then((perfData) => {
            // [+] DEBUG_LOGS: incremental building of event listeners on disconnect and reconnect
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
        spinner.fail("Disconnected from the server");
    });
});
