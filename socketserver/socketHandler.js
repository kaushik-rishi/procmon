// when this function is exported, all the code in the file is run
// so we can safely connect to the DB here at the top
require("./dbConnector")();
const Machine = require("./models/Machine");

/*
 * see alternateImplementation.js for promise based
 * implementation of this function
 */
const addIfNewDevice = async (perfData) => {
    // prettier-ignore
    const { macAddress, freeMem, totalMem, usedMem, memUsage, osType, uptime, cores, cpuModel, cpuSpeed, cpuLoad,
    } = perfData;
    let machine = await Machine.findOne({
        macAddress,
    });

    if (machine !== null) {
        // already connected
        return "found";
    } else {
        // add to DB
        try {
            // prettier-ignore
            const machineData = { macAddress, freeMem, totalMem, usedMem, memUsage, osType, uptime, cores, cpuModel, cpuSpeed, cpuLoad,
            };
            console.log(machineData);
            let newMachine = await Machine.create(machineData);
            return "created";
        } catch (err) {
            console.log(
                `Error encountered while adding new machine to the DB\nMAC Address: ${macAddress}\nReason: ${err.message}`
            );
            throw err;
            return err;
        }
    }
};

module.exports = (io, socket) => {
    let macAddress;

    // io - socket.io server
    // socket - socket corresponding to the particular connection

    console.log(`🦴 Socket ID :  ${socket.id}`);

    socket.on("authSecret", async (secret) => {
        if (secret === "sample_nodeclient_secret") {
            socket.join("machines");
        } else if (secret === "sample_ui_secret") {
            socket.join("browsers");
            Machine.find((err, machines) => {
                // getting all the pre-existing machines
                machines.forEach((machine) => {
                    machine.isActive = false;
                    socket.emit("perf_data", machine);
                });

                if (err) {
                    // prettier-ignore
                    console.log("Failed to fetch all pre-existing devices from the database");
                    console.log(err.message);
                }
            });
        } else {
            // invalid key
            console.log("❌ Connection closed : Bad Auth");
            socket.disconnect(true);
        }
    });

    /*
     * a machine has connected, check to see if it is a new machine or it'was already running in our procmon
     * and it just went to "OFFLINE". The react browser client need's this info badly to resume the
     * process that has went offline. else if it a new machine we add it to the DB so a new component
     * will be rendered corresponding to the machine
     */

    socket.on("init_perf_data", async (initalData) => {
        macAddress = initalData.macAddress;
        console.log(await addIfNewDevice(initalData));

        console.log(`New connection ${macAddress}`);
    });

    socket.on("perf_data", (perfData) => {
        // emitting the performance data only to the browsers
        console.log("Tick ...");
        perfData.macAddress = macAddress;
        io.to("browsers").emit("perf_data", perfData);
    });
};
