// when this function is exported, all the code in the file is run
// so we can safely connect to the DB here at the top
require("./dbConnector")();

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

    /*
     * a machine has connected, check to see if it is a new machine or it'was already running in our procmon
     * and it just went to "OFFLINE". The react browser client need's this info badly to resume the
     * process that has went offline. else if it a new machine we add it to the DB so a new component
     * will be rendered corresponding to the machine
     */

    socket.on("perf_data", (perfData) => {
        console.log(perfData);
    });
};
