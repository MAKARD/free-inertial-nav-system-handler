const request = require("request");

const DataEventMock = function () {
    let timer;
    let iterator = 0;
    let formattedData;

    this.customData;
    this.dataType = "ROTATE_DATA";

    const getData = () => new Promise((resolve) => {
        request.get(process.env[this.dataType], (error, response, body) => resolve(body));
    });

    this.startEvent = async (port, delay) => {
        if (this.customData) {
            formattedData = this.customData;
        }

        if (!formattedData && this.dataType !== "CUSTOM_DATA") {
            formattedData = (await getData()).split("$");
        }

        if (typeof delay !== "number") {
            throw Error("Delay must be number");
        }

        if (!port || !port.write) {
            throw Error("Port is invalid");
        }

        await new Promise((resolve) => {
            timer = setTimeout(() => {
                if (!formattedData) {
                    iterator = 0;
                    resolve();
                    return;
                }

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
        formattedData = undefined;
    }
}

module.exports = DataEventMock;
