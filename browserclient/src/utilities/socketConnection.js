import io from "socket.io-client";
const port = 8181;
const uiClientAuthSecret = "sample_ui_secret";
const socket = io(`http://localhost:${port}`);

socket.emit("authSecret", uiClientAuthSecret);

socket.on("connect", (socket) => {
    console.log("Browser client connected");
});

socket.on("disconnect", () => {
    console.log("Browser client disconnected");
});

export default socket;
