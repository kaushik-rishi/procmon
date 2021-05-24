module.exports = (io, socket) => {
    // io - socket.io server
    // socket - socket corresponding to the particular connection

    console.log(`Connected ${socket.id}`);
};
