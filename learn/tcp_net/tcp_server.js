const net = require("net");

const server = net.createServer((connection) => {
    console.log(`new client `);
    console.log(connection.address());

    connection.on("data", (data) => {
        connection.write(data + "\r\n");
    });

    connection.on("end", () => {
        console.log("client disconnected");
    });
});

server.listen(9090);
