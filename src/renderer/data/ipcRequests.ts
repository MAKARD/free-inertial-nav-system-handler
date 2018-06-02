export enum ipcRequests {
    // ports
    availablePorts = "available-ports",
    listenPort = "listen-port",
    closePort = "close-port",
    openPort = "open-port",
    devMode = "dev-mode",

    catchCustomDataError = "catch-custom-data-error",
    setCustomDevData = "set-custom-dev-data",
    setDevDataType = "set-dev-data-type",
    getDevDataType = "get-dev-data-type",

    // memory
    memoryUsage = "memory-usage"
};
