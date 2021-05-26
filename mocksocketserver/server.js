const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
require("./dbConnector")();
const Machine = require("./Machine");
const io = socketio(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", async (socket) => {
    const machines = await Machine.find();

    machines.forEach((machine, index) => {
        if (index % 2 == 1) socket.emit("perf_data", machine);
    });
    console.log(socket.id);
});

app.get("/", (req, res) => {
    res.send("hi");
});

server.listen(8181, () => {
    console.log("🚀");
});
