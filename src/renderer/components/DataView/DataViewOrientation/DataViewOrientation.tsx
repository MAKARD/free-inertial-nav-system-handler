import * as React from "react";
import Select from "react-select";
import { saveSvgAsPng } from "save-svg-as-png";

import { ViewChart } from "./ViewChart";
import { Sensor } from "../../../sensors";
import { DataRecordContextTypes, DataRecordContext } from "../../DataRecord";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";
import { OrientationCalcUnit, EulerKrylovRecalcUnit, DeltaCalcUnit } from "../../../calculations";

interface DataViewOrientationState {
    activeXSesnor?: Sensor;
    activeYSesnor?: Sensor;
    activeZSesnor?: Sensor;
    activeView: "Actual" | "Delta";
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
            activeView: "Actual"
        };
    }

    public render(): React.ReactNode {
        if (!this.context.activeSensorsList.length) {
            return <h3>No active sensors</h3>;
        }

        return (
            <div className="tabs">
                <div className="tabs-header">
                    {this.renderSelectList()}
                </div>
                <div className="btn-group">
                    <button
                        type="button"
                        onClick={this.handleViewChange("Actual")}
                        className={this.getButtonClassName("Actual")}
                    >
                        Actual
                    </button>
                    <button
                        type="button"
                        disabled={!this.isRefrenceAvailable}
                        onClick={this.handleViewChange("Delta")}
                        className={this.getButtonClassName("Delta")}
                    >
                        Delta
                    </button>
                </div>
                <span className="single-label">Average Δ:&nbsp;{this.deltaLabel}</span>
                <button
                    type="button"
                    onClick={this.handleSave}
                    className="btn btn_secondary right"
                    disabled={this.context.isPortListened}
                >
                    Save
                </button>
                <div className="chart-wrap">
                    <ViewChart
                        sensor={this.state.activeView === "Actual" ? this.calculated : this.delta}
                        id={this.id}
                    />
                </div>
            </div>
        );
    }

    protected renderSelectList = (): Array<JSX.Element> => [
        { axis: "X", name: "activeXSesnor" },
        { axis: "Y", name: "activeYSesnor" },
        { axis: "Z", name: "activeZSesnor" }
    ].map(({ axis, name }) => (
        <div className="header-item" key={axis}>
            <label>Axis {axis}</label>
            <Select
                className="btn btn_secondary header-item_content"
                onChange={this.getAxisHandleChange(name as any)}
                value={this.state[name] && this.state[name].id}
                options={this.mappedSensors}
                noResultsText="No sensors"
                searchable={false}
                clearable={false}
            />
        </div>
    ))

    protected handleViewChange = (activeView: DataViewOrientationState["activeView"]) => (): void => {
        this.setState({ activeView });
    }

    protected handleSave = (): void => {
        const element = document.querySelector(".chart > svg");
        const date = new Date();
        element && saveSvgAsPng(element, `diagram-${date.toLocaleDateString()}-${date.toLocaleTimeString()}.png`);
    }

    protected getAxisHandleChange = (axisName: keyof DataViewOrientationState) => ({ value }): void => {
        this.setState({ [axisName as any]: this.context.activeSensorsList.find(({ id }) => id === value) },
            () => DataViewOrientation.settings[axisName] = this.state[axisName]);
    }

    protected getButtonClassName = (name: DataViewOrientationState["activeView"]): string => {
        return `btn btn_primary${this.state.activeView === name ? " active" : ""}`;
    }

    protected get deltaLabel(): string {
        if (this.context.isPortListened) {
            return "Wait for end session";
        }

        if (!this.isRefrenceAvailable) {
            return "Orthogonal sensor is unavailable";
        }

        const reference = OrientationCalcUnit(EulerKrylovRecalcUnit(this.reference));
        const totalRelative = this.delta.reduce((prev, { axis }, i) => {
            // crutch. This values must be wrapped in Math.abs to correct calculation. delta is too big
            Object.keys(prev.delta).forEach((axisName) => {
                prev.delta[axisName] += axis[axisName];
                prev.reference[axisName] += reference[i].axis[axisName];
            });
            return prev;
        }, { delta: { x: 0, y: 0, z: 0 }, reference: { x: 0, y: 0, z: 0 } });

        Object.keys(totalRelative.reference).forEach((axis) => {
            totalRelative.reference[axis] /= reference.length;
            totalRelative.delta[axis] /= reference.length;
        });

        const reusult = (totalRelative.delta.x + totalRelative.delta.y + totalRelative.delta.z)
            * 100 / (totalRelative.reference.x + totalRelative.reference.y + totalRelative.reference.z);

        return `${(Math.abs(reusult) || 0).toFixed(4)} %`;
    }

    protected get id(): string {
        return [
            this.state.activeXSesnor.id,
            this.state.activeYSesnor.id,
            this.state.activeZSesnor.id,
            this.state.activeView
        ].join("");
    }

    protected get calculated() {
        return OrientationCalcUnit(EulerKrylovRecalcUnit(this.composedSensor as any));
    }

    protected get delta() {
        return DeltaCalcUnit(this.calculated, OrientationCalcUnit(EulerKrylovRecalcUnit(this.reference)));
    }

    protected get reference() {
        return this.context.activeSensorsList.find(({ id }) => id === "01").angles.pull();
    }

    protected get isRefrenceAvailable(): boolean {
        return !!this.context.activeSensorsList.find(({ id }) => id === "01");
    }

    protected get composedSensor() {
        !this.state.activeXSesnor && this.setState({ activeXSesnor: this.context.activeSensorsList[0] });
        !this.state.activeYSesnor && this.setState({ activeYSesnor: this.context.activeSensorsList[0] });
        !this.state.activeZSesnor && this.setState({ activeZSesnor: this.context.activeSensorsList[0] });

        const allX = this.state.activeXSesnor.angles.pull();
        const allY = this.state.activeYSesnor.angles.pull();
        const allZ = this.state.activeZSesnor.angles.pull();

        return Array(this.state.activeXSesnor.dataLength)
            .fill({})
            .map(({ }, i) => ({
                axis: { x: allX[i].axis.x, y: allY[i].axis.y, z: allZ[i].axis.z },
                time: allX[i].time
            }));
    }

    protected get mappedSensors() {
        return this.context.activeSensorsList.map(({ id }) => ({ label: `Sensor ${id}`, value: id }));
    }
}
