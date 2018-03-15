import * as React from "react";
import * as Electron from "electron";

import { ipcRequests } from "../../data/ipcRequests";

import { Sensor, SensorDataProps, SensorProps } from "../../calculations";
import { DataViewProviderContextTypes, DataViewProviderContext } from "./DataViewProviderContext";

const maxSensorsCount = 3;
const sensorReadAttempts = 4; // 1s: 250ms * 4

export interface ActiveSensors {
    [id: number]: Array<boolean>;
}

export interface LostPackage {
    time: string;
    message: string;
}

export interface DataViewProviderState {
    lostPackages: Array<LostPackage>;
    activeSensors: ActiveSensors;
}

export class DataViewProvider extends React.Component<{}, DataViewProviderState> {
    public static readonly childContextTypes = DataViewProviderContextTypes;

    public state: DataViewProviderState = {
        lostPackages: [],
        activeSensors: this.defaultSensorsState
    };

    protected sensors: Array<Sensor> = this.createEmptySensorsArray();

    public getChildContext(): DataViewProviderContext {
        return {
            sensorsData: this.sensorsData,
            lostPackages: this.lostPackages,
            getSensorById: this.getSensorById,
            activeSensors: this.state.activeSensors
        }
    }

    public componentDidMount() {
        (window as any).lost = this.lostPackages;
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
            this.writeLostPackage(message);
            return this.forceUpdate();
        }

        this.state.activeSensors = this.defaultSensorsState;
        parsedMessage.forEach(({ id, data }) => {
            const founded = this.getSensorById(id);

            if (founded) {
                try {
                    founded.writeData(data);
                    // todo: watch for sensor state
                } catch (error) {
                    this.writeLostPackage(error);
                }
            } else {
                this.writeLostPackage(`sensor with id=${id} not found`);
            }
        });

        const disabledSensor = Object.keys(this.state.activeSensors)
            .find((key) => !this.state.activeSensors[key]);

        disabledSensor && this.writeLostPackage(`sensor with id=${disabledSensor} is disabled`);

        this.forceUpdate();
    }

    protected get lostPackages(): Array<LostPackage> {
        return this.state.lostPackages;
    }

    protected get sensorsData(): Array<Sensor> {
        return this.sensors;
    }

    protected getSensorById = (searchId: number): Sensor => this.sensors.find(({ id }) => id === searchId);

    private writeLostPackage = (message: string): void => {
        this.state.lostPackages.push({
            time: (new Date()).toLocaleTimeString(),
            message
        });
    }

    private createEmptySensorsArray(): Array<Sensor> {
        return (new Array(maxSensorsCount))
            .fill({})
            .map((x, i) => new Sensor({ id: i + 1 }));
    }

    private get defaultSensorsState() {
        const activeSensors = {};
        (new Array(maxSensorsCount))
            .fill({})
            .forEach((x, i) => activeSensors[i + 1] = new Array(sensorReadAttempts).fill(false));

        return activeSensors;
    }
}
