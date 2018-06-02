import * as React from "react";
import * as Electron from "electron";

import { ipcRequests } from "../../data/ipcRequests";

import { DataRecordContext, DataRecordContextTypes } from "../DataRecord";

export class Simulation extends React.Component {
    public static readonly contextTypes = DataRecordContextTypes;

    public readonly context: DataRecordContext

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <div className="btn-group">
                    <button
                        type="button"
                        className={this.getButtonClassName("STATIC_DATA")}
                        onClick={this.getHandleDataTypeChange("STATIC_DATA")}
                    >
                        Static
                    </button>
                    <button
                        type="button"
                        className={this.getButtonClassName("ROTATE_DATA")}
                        onClick={this.getHandleDataTypeChange("ROTATE_DATA")}
                    >
                        Dynamic
                    </button>
                </div>
                <button type="button" onClick={this.getHandleSensorClick("11")}>
                    Sensor 11
                </button>
                <button type="button" onClick={this.getHandleSensorClick("00")}>
                    Sensor 00
                </button>
                <button type="button" onClick={this.getHandleSensorClick("01")}>
                    Sensor 01
                </button>
                <button type="button" onClick={this.getHandleSensorClick("10")}>
                    Sensor 10
                </button>
            </React.Fragment>
        );
    }

    protected getHandleDataTypeChange = (dataType: "STATIC_DATA" | "ROTATE_DATA") => () => {
        Electron.ipcRenderer.send(ipcRequests.setDevDataType, dataType);
    }

    protected getButtonClassName = (dataType: "STATIC_DATA" | "ROTATE_DATA"): string => {
        const type = Electron.ipcRenderer.sendSync(ipcRequests.getDevDataType);
        return `btn btn_primary${type === dataType ? " active" : ""}`;
    }

    protected getHandleSensorClick = (sensorId: string) => (): void => {
        const founded = this.context.sensorsList.find(({ id }) => id === sensorId);

        if (!founded) {
            return;
        }

        founded.fakeState = !founded.fakeState;
        founded.state = founded.fakeState;

        this.forceUpdate();
    }
}
