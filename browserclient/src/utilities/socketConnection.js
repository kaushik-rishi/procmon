import io from "socket.io-client";
import { serverUrl } from "../config";
const uiClientAuthSecret = "sample_ui_secret";
const socket = io(serverUrl);

socket.emit("authSecret", uiClientAuthSecret);

socket.on("connect", (socket) => {
    console.log("Browser client connected");
});

socket.on("disconnect", () => {
    console.log("Browser client disconnected");
});

export default socket;
