const { app } = require("electron");

const MainWindow = new (require("./MainWindow"))({
    width: 800,
    height: 600,
    openDevTools: true
});

app.on("ready", MainWindow.create);
app.on("activate", MainWindow.create); // restore window
app.on("window-all-closed", () => {
    if (process.platform.toString().toLowerCase() !== "darwin") {
        app.quit();
    }
    MainWindow.close();
});  // close window and minimize on MacOS

