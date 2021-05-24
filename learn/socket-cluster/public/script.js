let socket = io();
socket.on("connect", () => {
    console.log(`User id ${socket.id}`);
});

socket.on("message", (data) => {
    console.log("recieved new message");
    console.log(data);
});

function sendMsg(msg) {
    socket.emit("message", {
        msg,
    });
}
