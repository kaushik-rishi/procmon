const cluster = require("cluster");

if (cluster.isMaster) {
    const worker = cluster.fork();
    worker.send("hello_from_master");
    worker.on("message", (msg) => {
        console.log(
            msg +
                " ---- gets the messages from the particular worker on sending back to master --- src: same worker's process | dest: worker listener in master"
        );
    });

    cluster.on("message", (msg) => {
        console.log(Object.keys(msg));
        console.log(
            "from worker ---- " +
                msg.id +
                " --- src: particular worker | dest: master"
        );
    });

    // console.log(Object.keys(cluster.workers));
} else {
    process.on("message", (msg) => {
        console.log(msg + "  ---- src: master | dest: curr worker");
        process.send("hello_from_child");
    });
}
