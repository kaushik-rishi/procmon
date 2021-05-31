const { networkInterfaces } = require("os");
const nets = networkInterfaces();

// assume that the device has only one network interface
// for getting the private IP Addressess of multiple network interfaces refer: https://stackoverflow.com/a/8440736
const getPrivateIp = () => {
    let privateIp = null;
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (!net.internal && net.family === "IPv4") {
                privateIp = net.address;
            }
        }
    }
    return privateIp;
};

module.exports = getPrivateIp;
