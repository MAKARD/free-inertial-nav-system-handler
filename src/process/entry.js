const { app, BrowserWindow } = require("electron");

const config = require(`../../config/config.${process.env.NODE_ENV}`);

const PortsController = require("./controllers/PortsController");

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500
    });

    const portsController = new PortsController();

    mainWindow.loadURL(config.rendererUrl);

    mainWindow.on("closed", () => {
        mainWindow = undefined;
    });

    mainWindow.webContents.once("did-finish-load", () => {
        portsController.bindEvents();
        
        mainWindow.webContents.send("ready");
    });

    mainWindow.webContents.openDevTools();
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
