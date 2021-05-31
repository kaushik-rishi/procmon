var express = require("express"),
    cluster = require("cluster"),
    http = require("http"),
    https = require("https"),
    sio = require("socket.io"),
    fs = require("fs");

var httpPort = 3000,
    httpsPort = 4000,
    num_processes = require("os").cpus().length,
    httpsOptions = {
        key: fs.readFileSync("pkey.pem"),
        cert: fs.readFileSync("cert.pem"),
    };

if (cluster.isMaster) {
    // This stores our workers. We need to keep them to be able to reference
    // them based on source IP address. It's also useful for auto-restart,
    // for example.
    var workers = [];

    // Helper function for spawning worker at index 'i'.
    var spawn = function (i) {
        workers[i] = cluster.fork();

        // Optional: Restart worker on exit
        workers[i].on("exit", function (code, signal) {
            console.log("respawning worker", i);
            spawn(i);
        });
    };

    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
        spawn(i);
    }

    // Helper function for getting a worker index based on IP address.
    // This is a hot path so it should be really fast. The way it works
    // is by converting the IP address to a number by removing non numeric
    // characters, then compressing it to the number of slots we have.
    //
    // Compared against "real" hashing (from the sticky-session code) and
    // "real" IP number conversion, this function is on par in terms of
    // worker index distribution only much faster.
    var worker_index = function (ip, len) {
        var s = "";
        for (var i = 0, _len = ip.length; i < _len; i++) {
            if (!isNaN(ip[i])) {
                s += ip[i];
            }
        }

        return Number(s) % len;
    };

    // Create the outside facing server listening on our http port.
    var httpServer = http.createServer();
    httpServer.on("connection", function (connection) {
        //pauseOnConnect
        connection.pause();

        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        if (connection.remoteAddress) {
            var worker =
                workers[_workerIndex(connection.remoteAddress, numProcesses)];
            worker.send(eventMessage, connection);
        }
    });
    httpServer.listen(httpPort, function () {
        console.log("http-Server up and running at %s port", httpPort);
    });

    // Create the outside facing server listening on our https port.
    var httpsServer = https.createServer(httpsOptions);
    httpsServer.on("connection", function (connection) {
        //pauseOnConnect
        connection.pause();

        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        if (connection.remoteAddress) {
            var worker =
                workers[worker_index(connection.remoteAddress, num_processes)];
            worker.send("sticky-session:https-connection", connection);
        }
    });
    httpsServer.listen(httpsPort, function () {
        console.log("https-Server up and running at %s port", httpsPort);
    });
} else {
    // Note we don't use a port here because the master listens on it for us.
    var app = new express();
    app.get("/", function (req, res) {
        res.send("Hello World!");
    });

    // Here you might use middleware, attach routes, etc.

    // Don't expose our internal server to the outside.
    var httpServer = http.createServer(app).listen(0, "localhost"),
        httpsServer = https
            .createServer(httpsOptions, app)
            .listen(0, "localhost"),
        io = sio(httpServer);
    io.attach(httpsServer);

    // Here you might use Socket.IO middleware for authorization etc.

    // Listen to messages sent from the master. Ignore everything else.
    process.on("message", function (message, connection) {
        if (
            (message !== "sticky-session:connection" &&
                message !== "sticky-session:https-connection") ||
            !connection
        ) {
            return;
        }

        switch (message) {
            case "sticky-session:connection":
                // Emulate a connection event on the http server by emitting the
                // event with the connection the master sent us.
                httpServer.emit("connection", connection);
                break;
            case "sticky-session:https-connection":
                // Emulate a connection event on the https server by emitting the
                // event with the connection the master sent us.
                httpsServer.emit("connection", connection);
                break;
        }

        connection.resume();
    });
}
