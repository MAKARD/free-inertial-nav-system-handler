import * as React from "react";
import * as Electron from "electron";

import { ipcRequests } from "../../data/ipcRequests";

import { DataRecordContext, DataRecordContextTypes } from "../DataRecord";

interface SimulationState {
    customData: string;
    errorMessage: string;
}

export class Simulation extends React.Component<{}, SimulationState> {
    public static readonly contextTypes = DataRecordContextTypes;
    public static readonly storageKey = "simulation-custom-data";

    public readonly context: DataRecordContext;
    public readonly state: SimulationState = {
        customData: localStorage.getItem(Simulation.storageKey) || "",
        errorMessage: ""
    };

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <div>
                    <span className="single-label">Simulation data type:</span>
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
                </div>
                <div className="flex-container-row">
                    <div className="triangle-container">
                        <div className="side side-top" >
                            <div className={this.getSwitcherClassName("11")}>
                                <span className="switcher-label">11</span>
                                <span className="switcher-handle" onClick={this.getHandleSensorClick("11")} />
                            </div>
                        </div>
                        <div className="triangle" >
                            <div className="side side-center">
                                <div className={this.getSwitcherClassName("01")}>
                                    <span className="switcher-label">01</span>
                                    <span className="switcher-handle" onClick={this.getHandleSensorClick("01")} />
                                </div>
                            </div>
                        </div>
                        <div className="side side-left">
                            <div className={this.getSwitcherClassName("10")}>
                                <span className="switcher-label">10</span>
                                <span className="switcher-handle" onClick={this.getHandleSensorClick("10")} />
                            </div>
                        </div>
                        <div className="side side-right">
                            <div className={this.getSwitcherClassName("00")}>
                                <span className="switcher-label">00</span>
                                <span className="switcher-handle" onClick={this.getHandleSensorClick("00")} />
                            </div>
                        </div>
                    </div>
                    <div className="textarea-container">
                        <textarea
                            value={this.state.customData}
                            placeholder="Paste custom data here"
                            onChange={this.handleCustomDataChange}
                        />
                        {this.state.errorMessage && (
                            <span className="error-container">
                                {this.state.errorMessage}
                            </span>
                        )}
                        <button type="button" onClick={this.setCustomData} className="btn btn_secondary right">
                            Apply
                        </button>
                        <button type="button" onClick={this.pretify} className="btn btn_secondary right">
                            Prettify
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    protected handleCustomDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({
            customData: event.currentTarget.value
        }, () => {
            localStorage.setItem(Simulation.storageKey, this.state.customData);
        });
    }

    protected pretify = (): void => {
        if (!this.state.customData) {
            return;
        }

        const parsed = [];
        let hasError = false;
        this.state.customData.split("$").forEach((data) => {
            let dataItem;
            try {
                dataItem = JSON.parse(data)
            } catch (error) {
                hasError = true;
                return this.onCustomDataWrong({}, error.message);
            }

            parsed.push(dataItem);
        });

        !hasError && this.setState({
            customData: parsed.map((data) => JSON.stringify(data, undefined, 4)).join("$"),
            errorMessage: ""
        });
    }

    protected setCustomData = (): void => {
        if (!this.state.customData) {
            return;
        }

        this.pretify();
        Electron.ipcRenderer.removeListener(ipcRequests.catchCustomDataError, this.onCustomDataWrong);
        Electron.ipcRenderer.send(ipcRequests.setCustomDevData, this.state.customData);
        Electron.ipcRenderer.on(ipcRequests.catchCustomDataError, this.onCustomDataWrong);
    }

    protected onCustomDataWrong = (event: Electron.Event | {}, errorMessage: string): void => {
        this.setState({ errorMessage });
    }

    protected getHandleDataTypeChange = (dataType: "STATIC_DATA" | "ROTATE_DATA") => (): void => {
        Electron.ipcRenderer.send(ipcRequests.setDevDataType, dataType);
    }

    protected getButtonClassName = (dataType: "STATIC_DATA" | "ROTATE_DATA"): string => {
        const type = Electron.ipcRenderer.sendSync(ipcRequests.getDevDataType);
        return `btn btn_primary${type === dataType ? " active" : ""}`;
    }

    protected getSwitcherClassName = (sensorId: string): string => {
        const founded = this.context.sensorsList.find(({ id }) => id === sensorId);

        if (!founded) {
            return "switcher";
        }

        return ["switcher", founded.fakeState && "active"]
            .filter((name) => name).join(" ").trim();
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
