const { BrowserWindow } = require("electron");

const config = require(`../../config/config.${process.env.NODE_ENV}`);

const MainWindow = function ({ width, height, openDevTools }) {
    let mainWindow;
    const PortsController = new (require("./controllers/PortsController"))();

    const handleDidFinishLoad = () => {
        PortsController.unbindEvents();
        PortsController.bindEvents();
        mainWindow.webContents.send("ready");
    }

    this.create = () => {
        if (mainWindow) {
            return;
        }

        mainWindow = new BrowserWindow({ width, height });

        mainWindow.loadURL(config.rendererUrl);
        mainWindow.once("closed", this.close);

        mainWindow.webContents.on("did-finish-load", handleDidFinishLoad);
        openDevTools && mainWindow.webContents.openDevTools();
    }

    this.close = () => {
        PortsController.unbindEvents();
        mainWindow = undefined;
    }
}

module.exports = MainWindow;
