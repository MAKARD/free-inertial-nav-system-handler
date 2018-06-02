const { ipcMain } = require("electron");

/*
 * On exporting dev serial port,
 * origin binding is replacing with develop bindings.
 * In that case system ports replaced with mocking ports
 */
const SerialPort = require("serialport");
// Write origin binding
SerialPort.originBinding = SerialPort.Binding;
SerialPort.MockBinding = require("serialport/test").Binding;
// Restore origin binding
SerialPort.Binding = SerialPort.originBinding;

// must be the same as on arduino
const delay = 540;

const PortsController = function () {
    port = {
        isOpen: false
    };

    devMode = false;
    DataEventMock = new (require("./DataEventMock"))();

    message = "";

    toggleDevMode = (event, state) => {
        devMode = state;

        if (state) {
            SerialPort.Binding = SerialPort.MockBinding;
            SerialPort.Binding.createPort("/dev/COM1", { echo: true, record: true });
            SerialPort.Binding.createPort("/dev/COM2", { echo: true, record: true });

        } else {
            SerialPort.Binding && SerialPort.Binding.reset();
            SerialPort.Binding = SerialPort.originBinding;
        }
    }

    availablePorts = (event) => {
        SerialPort.list((error, ports) => {
            event.returnValue = ports;
        });
    };

    closePort = () => {
        port.isOpen && port.close(() => {
            DataEventMock.stopEvent();
            port.removeListener("data", sendData);
        });
    };

    createBridge = (event, newPort) => () => {
        port = newPort;

        port.open(() => {
            devMode && DataEventMock.startEvent(port, delay);

            port.on("data", sendData(event));
        });
    };

    sendData = (event) => (data) => {
        const currentData = Buffer.from(data).toString().trim();

        if (currentData !== "$") {
            message += currentData;
        } else {
            event.sender.send("listen-port", message);
            message = "";
        }
    }

    openPort = (event, portName) => {
        if (!portName) {
            return;
        }

        const newPort = new SerialPort(portName, { echo: devMode, autoOpen: false });

        if (port.isOpen) {
            return port.close(createBridge(event, newPort));
        }

        createBridge(event, newPort)();
    };

    setDevDataType = (event, type) => {
        DataEventMock.dataType = type;
        DataEventMock.customData = undefined;
    }

    getDevDataType = (event) => {
        event.returnValue = DataEventMock.dataType;
    }

    setCustomDevData = (event, data) => {
        let validData;
        try {
            validData = data.split("$");

            validData.forEach((dataItem) => {
                const parsedData = JSON.parse(dataItem);

                parsedData.forEach(({ id, time, data }) => {
                    if (!["00", "01", "10", "11"].find((name) => id === name)) {
                        throw new Error("Provided data contains invalid ID. Valid is '00', '11', '10', '01'");
                    }

                    if (Number.isNaN(Number(time))) {
                        throw new Error("Provided data contains invalid time");
                    }

                    if (!data) {
                        throw new Error("Provided data does not contains 'data' field");
                    }

                    if (!data.acc) {
                        throw new Error("Provided data does not contains 'data.acc' field ");
                    }

                    if (!data.gyro) {
                        throw new Error("Provided data does not contains 'data.gyro' field ");
                    }

                    ["x", "y", "z"].map((name) => {
                        if (Number.isNaN(Number(data.acc[name]))) {
                            throw new Error(`Provided data contains not numeric 'data.acc.${name}' field`);
                        }

                        if (Number.isNaN(Number(data.gyro[name]))) {
                            throw new Error(`Provided data contains not numeric 'data.gyro.${name}' field`);
                        }
                    });
                })
            });
        } catch (error) {
            DataEventMock.dataType = "ROTATE_DATA";
            return event.sender.send("catch-custom-data-error", error.message);
        }

        DataEventMock.customData = validData;
        DataEventMock.dataType = "CUSTOM_DATA";
    }

    this.bindEvents = () => {
        ipcMain.on("set-custom-dev-data", setCustomDevData);
        ipcMain.on("set-dev-data-type", setDevDataType);
        ipcMain.on("get-dev-data-type", getDevDataType);
        ipcMain.on("available-ports", availablePorts);
        ipcMain.on("dev-mode", toggleDevMode);
        ipcMain.on("close-port", closePort);
        ipcMain.on("open-port", openPort);
    };

    this.unbindEvents = () => {
        ipcMain.removeListener("set-custom-dev-data", setCustomDevData);
        ipcMain.removeListener("set-dev-data-type", setDevDataType);
        ipcMain.removeListener("available-ports", availablePorts);
        ipcMain.removeListener("dev-mode", toggleDevMode);
        ipcMain.removeListener("close-port", closePort);
        ipcMain.removeListener("open-port", openPort);
        closePort();
        SerialPort.Binding.reset && SerialPort.Binding.reset();
    }
};

module.exports = PortsController;
