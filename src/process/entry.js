const { app, BrowserWindow } = require("electron");

const SerialPort = require("serialport");
// remove on prod
const DevSerialPort = require("serialport/test");

const config = require(`../../config/config.${process.env.NODE_ENV}`);

const portsController = require("./controllers/portsController");

// remove on prod
DevSerialPort.Binding.createPort("/dev/ROBOT", { echo: true, record: true });

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

    mainWindow.webContents.on("did-finish-load", () => {
        portsController(mainWindow.webContents);

        mainWindow.webContents.send("ready");
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
