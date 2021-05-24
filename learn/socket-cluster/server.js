const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

app.use(express.static("./public"));

const socketio = require("socket.io");
const io = socketio(server);

io.on("connection", (socket) => {
    console.log(cluster.worker.id);
    console.log(`a user connected ${socket.id}`);

    socket.on("message", (data) => {
        console.log(data);
        io.emit("message", data);
    });
});
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

console.log(cluster.isMaster);
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server

    server.listen(8080, () => {
        console.log("server @ http://localhost:8080");
    });

    console.log(`Worker ${process.pid} started`);
}
