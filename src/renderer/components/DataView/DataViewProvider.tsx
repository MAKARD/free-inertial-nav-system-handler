import * as React from "react";
import * as Electron from "electron";

import { ipcRequests } from "../../data/ipcRequests";

import { Sensor, SensorDataProps, SensorProps, DataRecordControl, InternalSensor } from "../../calculations";
import { DataViewProviderContextTypes, DataViewProviderContext } from "./DataViewProviderContext";

export class DataViewProvider extends React.Component {
    public static readonly childContextTypes = DataViewProviderContextTypes;

    protected dataRecordControl = new DataRecordControl();

    public getChildContext(): DataViewProviderContext {
        return {
            activeSensorsList: this.dataRecordControl.sensors.filter(({state}) => state)
        };
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
            this.dataRecordControl.writeLostPackage(message);
            return this.forceUpdate();
        }

        this.dataRecordControl.writeSensorsData(parsedMessage);
        this.forceUpdate();
    }
}
