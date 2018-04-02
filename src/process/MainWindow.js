const { BrowserWindow } = require("electron");

const config = require(`../../config/config.${process.env.NODE_ENV}`);

const MainWindow = function ({ width, height, openDevTools }) {
    let mainWindow;
    const PortsController = new (require("./controllers/PortsController"))();
    const MemoryController = new (require("./controllers/MemoryController"))();

    const handleDidFinishLoad = () => {
        PortsController.unbindEvents();
        MemoryController.unbindEvents();
        
        PortsController.bindEvents();
        MemoryController.bindEvents();
        mainWindow.webContents.send("ready");
    }

    this.create = () => {
        if (mainWindow) {
            return;
        }

        mainWindow = new BrowserWindow({ width, height });

        mainWindow.loadURL(config.rendererUrl);

        // Install React Dev Tools
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer");

        installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
            console.log(`Added Extension:  ${name}`);
        }).catch((err) => {
            console.log("An error occurred: ", err);
        });

        mainWindow.once("closed", this.close);

        mainWindow.webContents.on("did-finish-load", handleDidFinishLoad);
        openDevTools && mainWindow.webContents.openDevTools();
    }

    this.close = () => {
        PortsController.unbindEvents();
        MemoryController.unbindEvents();
        mainWindow = undefined;
    }
}

module.exports = MainWindow;
