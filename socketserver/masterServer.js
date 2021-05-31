// socket.io server that will service both the node and react clients
// - socket.io
// - socket.io-redis
// - farmhash

// goal: entry point for the cluster and forking workers and socket.io handler
//See https://github.com/elad/node-cluster-socket.io

const express = require("express");
const cluster = require("cluster");
const cors = require("cors");
const net = require("net");
const socketio = require("socket.io");
const socketHandler = require("./socketHandler");
require("dotenv").config({
    path: `${__dirname}/.env`,
});

const { port, uiPort } = require("../config.json");
// const port = 8181;
const num_processes = require("os").cpus().length;
const privateIp = require("./utils/getPrivateIp")();

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
            workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send("sticky-session:connection", connection);
    });

    server.listen(port, () => {
        console.log(`🦸 Master TCP Server started @ ${port}`);
    });
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(
                `👎️ The address/port is busy. Close any applications running on the port ${port}`
            );
            console.log("Retrying ...");
            setTimeout(() => {
                server.close();
                server.listen(port);
            }, 3000);
        }
    });
} else {
    let app = express();
    const server = app.listen(0, "localhost");
    console.log(`🚀 Worker up ${process.pid}`);

    app.use(cors());

    const corsOptions = {
        // origin: "http://localhost:3000", // only allow the server computer
        // TODO: allow all the computers in the network to access the server
        // PROBLEM: both the node client and the browser client connect to the very same server and we
        // may have different cors rules for different type of clients.
        // PROBLEM: no origin for node client (because they are not browsers)
        origin: function (origin, callback) {
            console.log("origin : " + origin);
            if (
                origin === undefined ||
                origin === `http://localhost:${uiPort}` ||
                origin === `http://${privateIp}:${uiPort}`
            ) {
                return callback(null, true);
            }
        },
        // origin: "*", // allow any ui client to connect
    };
    const io = socketio(server, {
        // Refer fixes.md ⭐️ Socket.io cors error
        cors: corsOptions, // CORS configuration options for the socket.io server
    });
    io.adapter(io_redis({ host: "localhost", port: 6379 }));
    io.on("connection", function (socket) {
        socketHandler(io, socket);
        console.log(`Connected to worker: ${cluster.worker.id}`); // 💜 of the program. This is why we have used the redis-adapter and all
    });
    process.on("message", function (message, connection) {
        if (message !== "sticky-session:connection") {
            return;
        }
        server.emit("connection", connection);
        connection.resume();
    });
}
