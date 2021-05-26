const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true,
        unique: true,
    },
    freeMem: Number,
    usedMem: Number,
    totalMem: Number,
    memUsage: Number,
    osType: String,
    uptime: Number,
    cores: Number,
    cpuModel: String,
    cpuSpeed: Number,
    cpuLoad: Number,
});

const Machine = mongoose.model("Machine", MachineSchema);
module.exports = Machine;
