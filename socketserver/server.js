// socket.io server that will service both the node and react clients
// - socket.io
// - socket.io-redis
// - farmhash

// goal: entry point for the cluster and forking workers and socket.io handler
const cluster = require("cluster");
const coreCount = require("os").cpus.length; // actually thread count
