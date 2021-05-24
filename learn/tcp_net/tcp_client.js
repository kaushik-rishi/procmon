const net = require("net");

const options = {
    port: 9090,
};

const client = net.createConnection(options, () => {
    client.write("Hello My dear TCP Connection !");
});

client.on("data", (data) => {
    console.log(data.toString());
    client.end();
});
