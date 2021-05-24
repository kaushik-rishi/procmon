// socket.io server that will service both the node and react clients
// - socket.io
// - socket.io-redis
// - farmhash

// goal: entry point for the cluster and forking workers and socket.io handler
const cluster = require("cluster");
const coreCount = require("os").cpus.length; // actually thread count

//See https://github.com/elad/node-cluster-socket.io

const express = require("express");
const helmet = require("helmet");
const cluster = require("cluster");
const net = require("net");
const socketio = require("socket.io");
// const socketMain = require("./socketMain");

const port = 8181;
const num_processes = require("os").cpus().length;

const io_redis = require("socket.io-redis");
const farmhash = require("farmhash");

if (cluster.isMaster) {
    let workers = [];

    let spawn = (i) => {
        workers[i] = cluster.fork();

        workers[i].on("exit", function (code, signal) {
            console.log("respawning worker", i);
            spawn(i);
        });
    };

    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    const worker_index = (ip, len) => {
        return farmhash.fingerprint32(ip) % len;
    };

    // in this case, we are going to start up a tcp connection via the net
    // module INSTEAD OF the http module. Express will use http, but we need
    // an independent tcp port open for cluster to work. This is the port that
    // will face the internet
    const server = net.createServer({ pauseOnConnect: true }, (connection) => {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        let worker =
            workers[worker_index(connection.remoteAddress, num_processes)];
        worker.send("sticky-session:connection", connection);
    });
    server.listen(port);
    console.log(`Master listening on port ${port}`);
} else {
    // Note we don't use a port here because the master listens on it for us.
    // let app = express();
    // app.use(express.static(__dirname + '/public'));
    // app.use(helmet());

    // Don't expose our internal server to the outside world.
    const server = app.listen(0, "localhost");
    // console.log("Worker listening...");
    const io = socketio(server);

    // Tell Socket.IO to use the redis adapter. By default, the redis
    // server is assumed to be on localhost:6379. You don't have to
    // specify them explicitly unless you want to change them.
    // redis-cli monitor
    io.adapter(io_redis({ host: "localhost", port: 6379 }));

    // Here you might use Socket.IO middleware for authorization etc.
    // on connection, send the socket over to our module with socket stuff
    io.on("connection", function (socket) {
        socketMain(io, socket);
        // console.log(`connected to worker: ${cluster.worker.id}`);
    });

    // Listen to messages sent from the master. Ignore everything else.
    process.on("message", function (message, connection) {
        if (message !== "sticky-session:connection") {
            return;
        }

        // Emulate a connection event on the server by emitting the
        // event with the connection the master sent us.
        server.emit("connection", connection);

        connection.resume();
    });
}
