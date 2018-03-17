import * as React from "react";
import * as Electron from "electron";

import { ipcRequests } from "../../data/ipcRequests";

import { Sensor, SensorDataProps, SensorProps, SensorRepository, InternalSensor } from "../../calculations";
import { DataViewProviderContextTypes, DataViewProviderContext } from "./DataViewProviderContext";

export class DataViewProvider extends React.Component {
    public static readonly childContextTypes = DataViewProviderContextTypes;

    protected repository = new SensorRepository();

    public getChildContext(): any {
        return {
            sensorsRepository: this.repository,
            activeSensorsList: this.repository.sensors.filter(({state}) => state)
        }
    }

    public componentDidMount() {
        Electron.ipcRenderer.on(ipcRequests.listenPort, this.handleListenPort);
    }

    public componentWillUnmount() {
        Electron.ipcRenderer.removeListener(ipcRequests.listenPort, this.handleListenPort);
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleListenPort = (event: Electron.Event, message: string): void => {
        let parsedMessage: Array<SensorProps & { data: SensorDataProps; }>;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            this.repository.writeLostPackage(message);
            return this.forceUpdate();
        }

        this.repository.writeSensorsData(parsedMessage);
        this.forceUpdate();
    }

}
