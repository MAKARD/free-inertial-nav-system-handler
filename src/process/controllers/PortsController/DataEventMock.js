const DataEventMock = function () {
    this.timer;

    this.startEvent = (port, delay) => {
        if (typeof delay !== "number") {
            throw Error("Delay must be number");
        }

        if (!port || !port.write) {
            throw Error("Port is invalid");
        }

        this.timer = setInterval(() => {
            port.write(new Date().toString());
        }, delay);
    }

    this.stopEvent = () => {
        clearInterval(this.timer);
    }
}

module.exports = DataEventMock;
