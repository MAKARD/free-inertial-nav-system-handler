const mockRowData = require("../../data/DataMock.json");

const DataEventMock = function () {
    let timer;
    let iterator = 0;
    /*
        One premise contains data from 3 sensors
        Example data must be according formatted
     */
    const formattedData = mockRowData
        .map((e, i) => i % 3 ? null : mockRowData.slice(i, i + 3))
        .filter((e) => !!e);

    this.startEvent = (port, delay) => {
        if (typeof delay !== "number") {
            throw Error("Delay must be number");
        }

        if (!port || !port.write) {
            throw Error("Port is invalid");
        }

        timer = setInterval(() => {
            if (iterator === formattedData.length) {
                iterator = 0;
            }

            port.write(JSON.stringify(formattedData[iterator]));
            iterator++;
        }, delay);
    }

    this.stopEvent = () => {
        iterator = 0;
        clearInterval(timer);
    }
}

module.exports = DataEventMock;
