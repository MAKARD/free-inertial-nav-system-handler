import * as React from "react";
import Select from "react-select";

import { ViewChart } from "./ViewChart";
import { Sensor } from "../../../sensors";
import { DataRecordContextTypes, DataRecordContext } from "../../DataRecord";
import { OrientationCalcUnit, EulerKrylovRecalcUnit } from "../../../calculations";

interface DataViewOrientationState {
    activeXSesnor?: Sensor;
    activeYSesnor?: Sensor;
    activeZSesnor?: Sensor;
}

export class DataViewOrientation extends React.Component<{}, DataViewOrientationState> {
    public static readonly contextTypes = DataRecordContextTypes;

    public readonly context: DataRecordContext;

    constructor(props, context: DataRecordContext) {
        super(props, context);

        this.state = {
            activeXSesnor: context.activeSensorsList[0],
            activeYSesnor: context.activeSensorsList[0],
            activeZSesnor: context.activeSensorsList[0]
        };
    }

    public render(): React.ReactNode {
        if (!this.context.activeSensorsList.length) {
            return <span>No active sensors</span>;
        }

        return (
            <div>
                <div>
                    <span>Axis X</span>
                    <Select
                        value={this.state.activeXSesnor && this.state.activeXSesnor.id}
                        onChange={this.getAxisHandleChange("activeXSesnor")}
                        options={this.mappedSensors}
                        noResultsText="No sensors"
                        searchable={false}
                        clearable={false}
                    />
                </div>
                <div>
                    <span>Axis Y</span>
                    <Select
                        value={this.state.activeYSesnor && this.state.activeYSesnor.id}
                        onChange={this.getAxisHandleChange("activeYSesnor")}
                        options={this.mappedSensors}
                        noResultsText="No sensors"
                        searchable={false}
                        clearable={false}
                    />
                </div>
                <div>
                    <span>Axis Z</span>
                    <Select
                        value={this.state.activeZSesnor && this.state.activeZSesnor.id}
                        onChange={this.getAxisHandleChange("activeZSesnor")}
                        options={this.mappedSensors}
                        noResultsText="No sensors"
                        searchable={false}
                        clearable={false}
                    />
                </div>
                <ViewChart sensor={this.calculated} />
            </div>
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

    protected getAxisHandleChange = (axisName: string) => ({ value }): void => {
        this.setState({
            [axisName]: this.context.activeSensorsList.find(({ id }) => id === value)
        } as any);
    }

    protected get mappedSensors() {
        return this.context.activeSensorsList.map(({ id }) => ({
            label: `Sensor ${id}`,
            value: id
        }));
    }
}
