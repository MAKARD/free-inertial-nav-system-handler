const { ipcMain } = require("electron");
const SerialPort = require("serialport");

module.exports = (webContents) => {
    let port = {
        isOpen: false
    };

    // remove on prod
    let timer;

    const availablePorts = (event) => {
        SerialPort.list((error, ports) => {
            event.returnValue = ports;
        });
    };

    const closePort = () => {
        port.isOpen && port.close(() => {
            // remove on prod
            clearInterval(timer);
        });
    };

    const createBridge = (event, portName) => () => {
        port = new SerialPort(portName);
        /*
         remove on prod, replace with
         port.on("data", (message) => {
             webContents.send("listen-port", Buffer.from(message).toString());
         });
        */
        clearInterval(timer);
        timer = setInterval(() => {
            event.sender.send("listen-port", Buffer.from("message").toString());
        }, 2000);
    };

    const openPort = (event, portName) => {
        if (!portName) {
            return;
        }

        if (port.isOpen) {
            return port.close(createBridge(event, portName));
        }

        createBridge(event, portName)();
    }

    ipcMain.on("available-ports", availablePorts);

    ipcMain.on("close-port", closePort);

    ipcMain.on("open-port", openPort);

};
