import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow;

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500
    });

    mainWindow.loadURL(process.env.remote);

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
    !mainWindow &&  createWindow();
}); // restore window
