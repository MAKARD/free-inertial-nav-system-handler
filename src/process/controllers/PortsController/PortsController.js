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

const PortsController = function () {
    port = {
        isOpen: false
    };

    devMode = false;
    DataEventMock = new (require("./DataEventMock"))();

    toggleDevMode = (event, state) => {
        devMode = state;

        if (state) {
            SerialPort.Binding = SerialPort.MockBinding;
            SerialPort.Binding.createPort("/dev/COM1", { echo: true, record: true });
        } else {
            SerialPort.Binding.reset();
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
            devMode && DataEventMock.stopEvent();

            port.removeListener("data", sendData);
        });
    };

    createBridge = (event, newPort) => () => {
        port = newPort;

        port.open(() => {
            devMode && DataEventMock.startEvent(port, 2000);

            port.on("data", sendData(event));
        });
    };

    sendData = (event) => (data) => {
        event.sender.send("listen-port", Buffer.from(data).toString());
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

    this.bindEvents = () => {
        ipcMain.on("available-ports", availablePorts);
        ipcMain.on("dev-mode", toggleDevMode);
        ipcMain.on("close-port", closePort);
        ipcMain.on("open-port", openPort);
    };

    this.unbindEvents = () => {
        ipcMain.removeListener("available-ports", availablePorts);
        ipcMain.removeListener("dev-mode", toggleDevMode);
        ipcMain.removeListener("close-port", closePort);
        ipcMain.removeListener("open-port", openPort);
    }
};

module.exports = PortsController;
