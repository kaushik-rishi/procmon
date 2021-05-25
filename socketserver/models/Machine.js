const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true,
        unique: true,
    },
});

const Machine = mongoose.model("Machine", MachineSchema);
module.exports = Machine;
