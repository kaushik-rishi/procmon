const cluster = require("cluster");
const http = require("http");
const threads = require("os").cpus().length;
const server = http.createServer((req, res) => {
    res.end(`Sample response from worker ${process.pid}`);
});

const spawnClusters = () => {
    if (cluster.isMaster) {
        for (let i = 0; i < threads; ++i) {
            cluster.fork();
        }
    } else {
        server.listen(8080, () => {
            console.log(`Worker ${process.pid} 🚀 @ http://localhost:8080`);
        });
    }
};

const spawnSingleServerInstance = () => {
    server.listen(8080, () => {
        console.log(`Worker ${process.pid} 🚀 @ http://localhost:8080`);
    });
};

// spawnClusters();
// spawnSingleServerInstance();
