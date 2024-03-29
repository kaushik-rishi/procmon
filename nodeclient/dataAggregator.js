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

// async function that returns the performanceData
const getPerformanceData = () => {
    return new Promise(async (resolve, reject) => {
        const totalMem = os.totalmem(); // bytes
        const freeMem = os.freemem(); // bytes
        const osType = os.type() == "Darwin" ? "Mac" : os.type();
        const uptime = os.uptime(); // seconds
        const cpus = os.cpus();

        const usedMem = totalMem - freeMem,
            memUsage = Math.floor((usedMem / totalMem) * 100) / 100;

        const cores = cpus.length;
        const cpuModel = cpus[0].model;
        const cpuSpeed = cpus[0].speed;
        const cpuLoad = await getCpuLoad();

        // prettier-ignore
        resolve({freeMem, totalMem, usedMem, memUsage, osType, uptime, cores, cpuModel, cpuSpeed, cpuLoad});
    });
};

const cpuAverage = () => {
    const cpus = os.cpus();

    let idleMs = 0;
    let totalMs = 0;

    cpus.forEach((core) => {
        idleMs += core.times.idle;
        for (let timeType in core.times) totalMs += core.times[timeType];
    });

    const cores = cpus.length;
    return {
        idle: idleMs / cores,
        total: totalMs / cores,
    };
};

const getCpuLoad = () => {
    return new Promise((resolve, reject) => {
        const start = cpuAverage();
        setTimeout(() => {
            const end = cpuAverage();
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;

            let cpuLoadPercent =
                100 - Math.floor((100 * idleDifference) / totalDifference);
            resolve(cpuLoadPercent);
        }, 100);
    });
};

const getExternalMACAddress = () => {
    let macAddress = null;
    const networkInterfaces = os.networkInterfaces();

    // [+] Remove this later [TESTING PURPOSES ONLY !!]
    if (process.env.RANDOM_MAC !== undefined) {
        let randomMacAddress;
        randomMacAddress = Math.random().toString(36).substring(7); // any random mac address
        randomMacAddress = Number(Math.random() > 0.5).toString(); // either 1 or 0
        randomMacAddress = Math.floor(Math.random() * 3) + 1; // 0, 1, 2
        // randomMacAddress = 1;

        // prettier-ignore
        // console.log(` Random generated MAC: ${randomMacAddress}`.black.bgYellow);
        return randomMacAddress;
    }

    for (let nI in networkInterfaces) {
        let nIdata = networkInterfaces[nI];
        // if it is not an internal network interface
        if (!nIdata[0].internal) {
            macAddress = nIdata[0].mac;
        }
    }
    return macAddress === null ? 1 : macAddress;
};

// performanceData().then(console.log);
module.exports = {
    getPerformanceData,
    getExternalMACAddress,
};
