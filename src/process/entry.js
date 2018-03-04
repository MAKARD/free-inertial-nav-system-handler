const { app, BrowserWindow } = require("electron");

const SerialPort = require("serialport");
const DevSerialPort = require("serialport/test");

const config = require(`../../config/config.${process.env.NODE_ENV}`);

DevSerialPort.Binding.createPort("/dev/ROBOT", { echo: true, record: true });
SerialPort.list((err, ports) => {
    const port = new SerialPort(ports[0].comName);

    port.write("test message");

    port.on("data", (message) => {
        console.log(Buffer.from(message).toString());
    });
});

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500
    });

    mainWindow.loadURL(config.rendererUrl);

    mainWindow.on("closed", () => {
        mainWindow = undefined;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform.toString().toLowerCase() !== "darwin") {
        app.quit();
    }
});  // close window and minimize on MacOS

app.on("activate", () => {
    !mainWindow && createWindow();
}); // restore window
