const DataEventMock = function () {
    this.timer;

    this.startEvent = (event, delay) => {
        if (typeof delay !== "number") {
            throw Error("Delay must be number");
        }

        if (!event || !event.sender || (typeof event.sender.send !== "function")) {
            throw Error("Event is invalid object");
        }

        this.timer = setInterval(() => {
            event.sender.send("listen-port", Buffer.from("message").toString());
        }, delay);
    }

    this.stopEvent = () => {
        clearInterval(this.timer);
    }
}

module.exports = DataEventMock;
