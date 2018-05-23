import * as React from "react";
import Select from "react-select";

import { DataRecordContextTypes, DataRecordContext } from "../DataRecord";
import { Sensor } from "../../sensors";

interface SettingsState {
    selectedSensor?: Sensor;
}

export class Settings extends React.Component<{}, SettingsState> {
    public static readonly contextTypes = DataRecordContextTypes;

    public readonly context: DataRecordContext;

    constructor(props, context: DataRecordContext) {
        super(props, context);

        this.state = {
            selectedSensor: context.activeSensorsList[0]
        };
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Select
                    value={this.state.selectedSensor && this.state.selectedSensor.id}
                    onChange={this.handleSensorChange}
                    options={this.mappedSensors}
                    noResultsText="No sensors"
                    searchable={false}
                    clearable={false}
                />
                <div>
                    <h2>Accelerometer offset</h2>
                    <div>
                        <span>X</span>
                        <input
                            type="number"
                            value={this.state.selectedSensor && this.state.selectedSensor.offsetAccelerometer.x}
                            onChange={this.handleAccelerometerOffsetChange("x")}
                        />
                    </div>
                    <div>
                        <span>Y</span>
                        <input
                            type="number"
                            value={this.state.selectedSensor && this.state.selectedSensor.offsetAccelerometer.y}
                            onChange={this.handleAccelerometerOffsetChange("y")}
                        />
                    </div>
                    <div>
                        <span>Z</span>
                        <input
                            type="number"
                            value={this.state.selectedSensor && this.state.selectedSensor.offsetAccelerometer.z}
                            onChange={this.handleAccelerometerOffsetChange("z")}
                        />
                    </div>
                </div>
                <div>
                    <h2>Gyroscope offset</h2>
                    <div>
                        <span>X</span>
                        <input
                            type="number"
                            value={this.state.selectedSensor && this.state.selectedSensor.offsetGyroscope.x}
                            onChange={this.handleGyroscopeOffsetChange("x")}
                        />
                    </div>
                    <div>
                        <span>Y</span>
                        <input
                            type="number"
                            value={this.state.selectedSensor && this.state.selectedSensor.offsetGyroscope.y}
                            onChange={this.handleGyroscopeOffsetChange("y")}
                        />
                    </div>
                    <div>
                        <span>Z</span>
                        <input
                            type="number"
                            value={this.state.selectedSensor && this.state.selectedSensor.offsetGyroscope.z}
                            onChange={this.handleGyroscopeOffsetChange("z")}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    protected handleGyroscopeOffsetChange = (axis: "x" | "y" | "z") =>
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            if (!this.state.selectedSensor) {
                return;
            }

            this.state.selectedSensor.setOffsetGyroscope(axis, Number(event.currentTarget.value));
            this.forceUpdate();
        }

    protected handleAccelerometerOffsetChange = (axis: "x" | "y" | "z") =>
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            if (!this.state.selectedSensor) {
                return;
            }

            this.state.selectedSensor.setOffsetAccelerometer(axis, Number(event.currentTarget.value));
            this.forceUpdate();
        }

    protected handleSensorChange = ({ value }): void => {
        this.setState({
            selectedSensor: this.context.activeSensorsList.find(({ id }) => id === value)
        });
    }

    protected get mappedSensors() {
        return this.context.activeSensorsList.map(({ id }) => ({
            label: `Sensor ${id}`,
            value: id
        }));
    }
}
