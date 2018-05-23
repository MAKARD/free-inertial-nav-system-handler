import * as React from "react";
import Select from "react-select";
import { saveSvgAsPng } from "save-svg-as-png";

import { ViewChart } from "./ViewChart";
import { Sensor } from "../../../sensors";
import { DataRecordContextTypes, DataRecordContext } from "../../DataRecord";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";
import { OrientationCalcUnit, EulerKrylovRecalcUnit } from "../../../calculations";

interface DataViewOrientationState {
    activeXSesnor?: Sensor;
    activeYSesnor?: Sensor;
    activeZSesnor?: Sensor;
    activeMethod: "Euler" | "Poisson";
}

export class DataViewOrientation extends React.Component<{}, DataViewOrientationState> {
    public static readonly contextTypes = {
        ...DataRecordContextTypes,
        ...LayoutContextTypes
    };
    public static settings: Partial<DataViewOrientationState> = {};

    public readonly context: DataRecordContext & LayoutContext;

    constructor(props, context: DataRecordContext) {
        super(props, context);

        this.state = {
            activeXSesnor: DataViewOrientation.settings.activeXSesnor || context.activeSensorsList[0],
            activeYSesnor: DataViewOrientation.settings.activeYSesnor || context.activeSensorsList[0],
            activeZSesnor: DataViewOrientation.settings.activeZSesnor || context.activeSensorsList[0],
            activeMethod: "Euler"
        };
    }

    public render(): React.ReactNode {
        if (!this.context.activeSensorsList.length) {
            return <h3>No active sensors</h3>;
        }

        return (
            <div className="tabs">
                <div className="tabs-header">
                    <div className="header-item">
                        <label>Axis X</label>
                        <Select
                            value={this.state.activeXSesnor && this.state.activeXSesnor.id}
                            onChange={this.getAxisHandleChange("activeXSesnor")}
                            className="btn btn_secondary header-item_content"
                            options={this.mappedSensors}
                            noResultsText="No sensors"
                            searchable={false}
                            clearable={false}
                        />
                    </div>
                    <div className="header-item">
                        <label>Axis Y</label>
                        <Select
                            value={this.state.activeYSesnor && this.state.activeYSesnor.id}
                            onChange={this.getAxisHandleChange("activeYSesnor")}
                            className="btn btn_secondary header-item_content"
                            options={this.mappedSensors}
                            noResultsText="No sensors"
                            searchable={false}
                            clearable={false}
                        />
                    </div>
                    <div className="header-item">
                        <label>Axis Z</label>
                        <Select
                            value={this.state.activeZSesnor && this.state.activeZSesnor.id}
                            onChange={this.getAxisHandleChange("activeZSesnor")}
                            className="btn btn_secondary header-item_content"
                            options={this.mappedSensors}
                            noResultsText="No sensors"
                            searchable={false}
                            clearable={false}
                        />
                    </div>
                </div>
                <div className="btn-group">
                    <button
                        type="button"
                        onClick={this.handleMethodChange("Euler")}
                        className={this.getButtonClassName("Euler")}
                    >
                        Euler
                    </button>
                    <button
                        disabled
                        type="button"
                        onClick={this.handleMethodChange("Poisson")}
                        className={this.getButtonClassName("Poisson")}
                    >
                        Poisson
                    </button>
                </div>
                <button
                    type="button"
                    onClick={this.handleSave}
                    className="btn btn_secondary right"
                    disabled={this.context.isPortListened}
                >
                    Save
                </button>
                <div className="chart-wrap">
                    <ViewChart sensor={this.calculated} id={this.id}/>
                </div>
            </div>
        );
    }

    protected get id(): string {
        return `${this.state.activeXSesnor.id}${this.state.activeYSesnor.id}${this.state.activeZSesnor.id}`;
    }

    protected getButtonClassName = (name: DataViewOrientationState["activeMethod"]): string => {
        return `btn btn_primary${this.state.activeMethod === name ? " active" : ""}`;
    }

    protected handleMethodChange = (activeMethod: DataViewOrientationState["activeMethod"]) => () => {
        this.setState({ activeMethod });
    }

    protected handleSave = (): void => {
        const element = document.querySelector(".chart > svg");
        const date = new Date();
        element && saveSvgAsPng(
            element,
            `diagram-${date.toLocaleDateString()}-${date.toLocaleTimeString()}.png`
        );
    }

    protected get calculated() {
        return OrientationCalcUnit(EulerKrylovRecalcUnit(this.composedSensor as any));
    }

    protected get composedSensor() {
        if (!this.state.activeXSesnor) {
            this.setState({
                activeXSesnor: this.context.activeSensorsList[0]
            });
        }

        if (!this.state.activeYSesnor) {
            this.setState({
                activeYSesnor: this.context.activeSensorsList[0]
            });
        }

        if (!this.state.activeZSesnor) {
            this.setState({
                activeZSesnor: this.context.activeSensorsList[0]
            });
        }

        const allX = this.state.activeXSesnor.angles.pull();
        const allY = this.state.activeYSesnor.angles.pull();
        const allZ = this.state.activeZSesnor.angles.pull();

        return Array(this.state.activeXSesnor.dataLength)
            .fill({})
            .map(({ }, i) => ({
                axis: {
                    x: allX[i].axis.x,
                    y: allY[i].axis.y,
                    z: allZ[i].axis.z
                },
                time: allX[i].time
            }));
    }

    protected getAxisHandleChange = (axisName: keyof DataViewOrientationState) => ({ value }): void => {
        this.setState({
            [axisName as any]: this.context.activeSensorsList.find(({ id }) => id === value)
        }, () => {
            DataViewOrientation.settings[axisName] = this.state[axisName];
        });
    }

    protected get mappedSensors() {
        return this.context.activeSensorsList.map(({ id }) => ({
            label: `Sensor ${id}`,
            value: id
        }));
    }
}
