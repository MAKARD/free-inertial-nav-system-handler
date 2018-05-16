import * as React from "react";
import * as Electron from "electron";
import * as PropTypes from "prop-types";

import { ipcRequests } from "../../data/ipcRequests";

import { DataRecordControl, SensorProps, SensorDataProps, Sensor } from "../../sensors";

export interface DataRecordContext {
    activeSensorsList: Array<Sensor>;
    sensorsList: Array<Sensor>;
    recordsCount: number;
}

export const DataRecordContextTypes: {[P in keyof DataRecordContext]: PropTypes.Validator<any>} = {
    activeSensorsList: PropTypes.arrayOf(PropTypes.instanceOf(Sensor)).isRequired,
    sensorsList: PropTypes.arrayOf(PropTypes.instanceOf(Sensor)).isRequired,
    recordsCount: PropTypes.number.isRequired
};

export interface DataRecordState {
    recordsCount: number;
}

export class DataRecord extends React.Component {
    public static readonly childContextTypes = DataRecordContextTypes;

    public state: DataRecordState = {
        recordsCount: 0
    };

    protected dataRecordControl = new DataRecordControl();

    public getChildContext(): DataRecordContext {
        return {
            activeSensorsList: this.dataRecordControl.sensors.filter(({ state }) => state),
            sensorsList: this.dataRecordControl.sensors,
            recordsCount: this.state.recordsCount
        };
    }

    public componentDidMount() {
        this.dataRecordControl.sensors[0].angles.pull()[0].axis
        this.dataRecordControl.sensors.forEach(({ gyroscope, accelerometer, angles }) => {
            angles.clear();
            gyroscope.clear();
            accelerometer.clear();
        });
        Electron.ipcRenderer.on(ipcRequests.listenPort, this.handleListenPort);
    }

    public componentWillUnmount() {
        Electron.ipcRenderer.removeListener(ipcRequests.listenPort, this.handleListenPort);
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleListenPort = (event: Electron.Event, message: string): void => {
        let parsedMessage: Array<SensorProps & { data: SensorDataProps; time: number }>;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            this.dataRecordControl.writeLostPackage(message);
            return this.forceUpdate();
        }

        this.dataRecordControl.writeSensorsData(parsedMessage);
        this.state.recordsCount++;
        this.forceUpdate();
    }
}
