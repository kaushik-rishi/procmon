// goal: captures the local performance data

/*
# Modules
    - farmhash
    - socket.io-client
*/

/*
# Details to grab ?
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

const performanceData = () => {
    const totalMemory = os.totalmem(); // bytes
    const freeMemory = os.freemem(); // bytes
    const osType = os.type() == "Darwin" ? "Mac" : os.type();
    const uptime = os.uptime(); // seconds
    const cpus = os.cpus();

    const usedMem = totalMemory - freeMemory,
        memUsage = Math.floor((usedMem / totalMemory) * 100) / 100;

    const cores = cpus.length;
    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;
};

function cpuAverage() {
    const cpus = os.cpus();

    let idleMs = 0;
    let totalMs = 0;

    cpus.forEach((core) => {
        idleMs += core.times.idle;
        for (let timeType in core.times) totalMs += core.times[timeType];
    });

    return {
        idle: idleMs / cores,
        total: totalMs / cores,
    };
}

function getCpuLoad() {
    const start = cpuAverage();
    setTimeout(() => {
        const end = cpuAverage();
        const idleDifference = end.idle - start.idle;
        const totalDifference = end.total - start.total;

        console.log(100 - Math.floor((100 * idleDifference) / totalDifference));
    }, 100);
}
