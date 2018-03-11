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

        if (iterator === formattedData.length) {
            iterator = 0;
        }

        timer = setInterval(() => {
            port.write(JSON.stringify(formattedData[iterator]));
            iterator++;
        }, delay);
    }

    this.stopEvent = () => {
        clearInterval(timer);
    }
}

module.exports = DataEventMock;
