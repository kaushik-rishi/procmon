// goal: captures the local performance data

// Modules
/*
    - farmhash
    - socket.io-client
*/
// Details to grab ?
/*
    * Current CPU Load
    * Memory Usage
        - Total memory
        - Free memory
    * Operating system type
    * Uptime
    * Processor Information
        - Type
        - Core count
        - Clock speed
*/

const os = require("os");

/*
Object.keys(os).forEach((key) => {
    console.log(key);
    console.log(os[key]);
    console.log("----------------------------------\n");
});
*/

const totalMemory = os.totalmem(); // bytes
const freeMemory = os.freemem(); // bytes
const osType = os.type() == "Darwin" ? "Mac" : os.type();
const uptime = os.uptime(); // seconds
const cpus = os.cpus();

const usedMem = totalMemory - freeMemory,
    memUsage = Math.floor((usedMem / totalMemory) * 100) / 100;

const cores = cpus.length; // logical cpu cores = threads = 2 * cores
const cpuModel = cpus[0].model;
const cpuSpeed = cpus[0].speed;

function cpuAverage() {
    const cpus = os.cpus();

    // get ms in each mode, BUT this is since the reboot
    // so get it now and get it in every 100ms and then compare

    let idleMs = 0;
    let totalMs = 0;

    cpus.forEach((core) => {
        idleMs += core.times.idle;
        for (let type in core.times) totalMs += core.times[type];
    });

    return {
        idle: idleMs / cores,
        total: totalMs / cores,
    };
}

// we will get the current time and wait a 100ms and grab the second times
function getCpuLoad() {
    const start = cpuAverage();
    setTimeout(() => {
        const end = cpuAverage();
        const idleDifference = end.idle - start.idle;
        const totalDifference = end.total - start.total;
        console.log(idleDifference + " " + totalDifference);
    }, 100);
}

getCpuLoad();
