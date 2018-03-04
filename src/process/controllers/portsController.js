const { ipcMain } = require("electron");
const SerialPort = require("serialport");

let port;
module.exports = (webContents) => {
    ipcMain.once("available-ports", () => {
        let portsList;
        SerialPort.list((error, ports) => {
            portsList = ports;
        }).then(() => {
            webContents.send("available-ports", portsList);
        });
    });

    ipcMain.on("open-port", (event, portName) => {
        port && port.isOpen && port.close();
       if (port && port.isOpen) {
           console.log(port.path)
       }
        port = new SerialPort(portName);
    });

    ipcMain.on("listen-port", (event) => {
        if (!port || !port.isOpen) {
            return webContents.send("listen-port", { error: "Port not opened" });
        }

        setInterval(() => {
            port.write("test", (error) => {
                error && webContents.send("listen-port", { error });
            });
        }, 1000);

        port.on("data", (message) => {
            webContents.send("listen-port", Buffer.from(message).toString());
        });
    });
};
