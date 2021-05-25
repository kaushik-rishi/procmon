// addIfNewDevice() -> socketserver/socketHandler.js

const addIfNewDevice = (macAddress) => {
    return new Promise((resolve, reject) => {
        Machine.findOne({
            macAddress,
        }).then((err, document) => {
            if (err) {
                throw err;
                reject(err.message);
            } else if (document !== null) {
                resolve("found");
            } else {
                let newMachine = new Machine({ macAddress });
                newMachine.save();
                resolve("created");
            }
        });
    });
    /*
     * usage
     * async () => {
     *  const response = await addIfNewDevice('00:00');
     *  console.log(response); // found
     * }
     */
};
