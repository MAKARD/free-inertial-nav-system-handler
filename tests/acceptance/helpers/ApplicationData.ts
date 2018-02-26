import * as path from "path";

let electronPath = path.join(__dirname, "../../..", "node_modules/.bin/electron");

if (process.platform.toString().toLocaleLowerCase() === "win32") {
    electronPath += ".cmd";
}

export const ApplicationData = {
    path: electronPath,
    args: ["./build/process/entry.js"]
}
