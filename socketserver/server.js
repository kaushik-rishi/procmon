// socket.io server that will service both the node and react clients
// - socket.io
// - socket.io-redis
// - farmhash

// goal: entry point for the cluster and forking workers and socket.io handler
//See https://github.com/elad/node-cluster-socket.io

const express = require("express");
const cluster = require("cluster");
const net = require("net");
const socketio = require("socket.io");
const socketHandler = require("./socketHandler");

const { port } = require("../config.json");
// const port = 8181;
const num_processes = require("os").cpus().length;

const io_redis = require("socket.io-redis");
const farmhash = require("farmhash");

if (cluster.isMaster) {
    let workers = [];

    let spawn = (i) => {
        workers[i] = cluster.fork();

        workers[i].on("exit", function (code, signal) {
            // prettier-ignore
            console.log(`🗡️ Worker ${workers[i].pid} died. respawning 💜 worker`, i);
            spawn(i);
        });
    };

    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    const worker_index = (ip, len) => {
        return farmhash.fingerprint32(ip) % len;
    };

    const server = net.createServer({ pauseOnConnect: true }, (connection) => {
        let worker =
            // workers[worker_index(connection.remoteAddress, num_processes)];
            workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send("sticky-session:connection", connection);
    });
    server.listen(port);
    console.log(`Master Node 🦸 up @ http://localhost:${port}`);
} else {
    let app = express();

    const server = app.listen(0, "localhost");
    console.log(`🚀 Worker up ${process.pid}`);
    const io = socketio(server);

    io.adapter(io_redis({ host: "localhost", port: 6379 }));

    io.on("connection", function (socket) {
        socketHandler(io, socket);
        console.log(`connected to worker: ${cluster.worker.id}`); // 💜 of the program. This is why we have used the redis-adapter and all
    });

    process.on("message", function (message, connection) {
        if (message !== "sticky-session:connection") {
            return;
        }

        server.emit("connection", connection);

        connection.resume();
    });
}
