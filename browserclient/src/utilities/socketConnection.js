import io from "socket.io-client";
const { port, uiClientAuthSecret } = require("../../../config.json");
const socket = io.connect(`http://localhost:${port}`);

socket.emit("authSecret", uiClientAuthSecret);

socket.on("connect", (socket) => {
    console.log("Browser client connected");
});

socket.on("disconnect", () => {
    console.log("Browser client disconnected");
});

export default socket;
