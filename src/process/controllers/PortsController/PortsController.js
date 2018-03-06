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
    this.port = {
        isOpen: false
    };

    this.devMode = false;
    this.DataEventMock =  new (require("./DataEventMock"))();

    this.toggleDevMode = (event, state) => {
        this.devMode = state;

        if (state) {
            SerialPort.Binding = SerialPort.MockBinding;
            SerialPort.Binding.createPort("/dev/COM1", { echo: true, record: true });
        } else {
            SerialPort.Binding.reset();
            SerialPort.Binding = SerialPort.originBinding;
        }
    }

    this.availablePorts = (event) => {
        SerialPort.list((error, ports) => {
            event.returnValue = ports;
        });
    };

    this.closePort = () => {
        this.port.isOpen && this.port.close(() => {
           this.DataEventMock.stopEvent();
        });
    };

    this.createBridge = (event, newPort) => () => {
        this.port = newPort;

        this.port.open(() => {
            this.devMode && this.DataEventMock.startEvent(event, 2000);

            this.port.once("data", (data) => {
                event.sender.send("listen-port", Buffer.from(data).toString());
            });
        });
    };

    this.openPort = (event, portName) => {
        if (!portName) {
            return;
        }

        const newPort = this.devMode
            ? new SerialPort(portName, { echo: true, autoOpen: false })
            : new SerialPort(portName, { autoOpen: false });

        if (this.port.isOpen) {
            return this.port.close(this.createBridge(event, newPort));
        }

        this.createBridge(event, newPort)();
    };

    this.bindEvents = () => {
        ipcMain.on("available-ports", this.availablePorts);
        ipcMain.on("dev-mode", this.toggleDevMode);
        ipcMain.on("close-port", this.closePort);
        ipcMain.on("open-port", this.openPort);
    };
};

module.exports = PortsController;
