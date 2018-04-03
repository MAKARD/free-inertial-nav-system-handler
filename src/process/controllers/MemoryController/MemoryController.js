const { ipcMain } = require("electron");

const MemoryController = function () {

    memoryUsage = (event) => {
        event.returnValue = process.memoryUsage();
    }

    this.bindEvents = () => {
        ipcMain.on("memory-usage", memoryUsage);
    };

    this.unbindEvents = () => {
        ipcMain.removeListener("memory-usage", memoryUsage);
    }
}

module.exports = MemoryController;
