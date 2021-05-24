module.exports = (io, socket) => {
    // io - socket.io server
    // socket - socket corresponding to the particular connection

    console.log(`Connected ${socket.id}`);

    socket.on("authSecret", (secret) => {
        if (secret === "sample_nodeclient_secret") {
            socket.join("machines");
        } else if (secret === "sample_ui_secret") {
            socket.join("browser");
        } else {
            // invalid key
            socket.disconnect(true);
        }
    });

    socket.on("perf_data", (perfData) => {
        console.log(perfData);
    });
};
