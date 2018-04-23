const DataMock = require("../../data/DataMock.js");

const DataEventMock = function () {
    let timer;
    let iterator = 0;
    const formattedData = DataMock.split("$");

    this.startEvent = async (port, delay) => {
        if (typeof delay !== "number") {
            throw Error("Delay must be number");
        }

        if (!port || !port.write) {
            throw Error("Port is invalid");
        }

        await new Promise((resolve) => {
            timer = setTimeout(() => {
                if (iterator === formattedData.length) {
                    iterator = 0;
                }

                let i = 0;
                while (i < formattedData[iterator].length) {
                    port.write(formattedData[iterator][i]);
                    i++;
                }
                iterator++;
                resolve();
            }, delay / 2);
        });

        await new Promise((resolve) => setTimeout(() => {
            port.write("$");
            resolve();
        }, delay / 2));

        if (timer !== undefined) {
            this.startEvent(port, delay);
        }
    }

    this.stopEvent = () => {
        iterator = 0;
        clearInterval(timer);
        timer = undefined;
    }
}

module.exports = DataEventMock;
