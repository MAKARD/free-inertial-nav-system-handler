import * as React from "react";

import { Sensor, Axis, SensorType } from "../../sensors";
import { DataRecordContextTypes, DataRecordContext } from "../DataRecord";

export class Offsets extends React.Component {
    public static readonly contextTypes = DataRecordContextTypes;
    public static readonly inputWriteDelay = 500;

    public readonly context: DataRecordContext;

    public render(): React.ReactNode {
        if (!this.context.activeSensorsList.length) {
            return <h3>No active sensors</h3>;
        }

        return this.context.activeSensorsList.map(({ id }) => (
            <div className="table" key={id}>
                <span className="table-header">Sensor {id}</span>
                <div className="table-body">
                    <div className="row">
                        <this.AxisCalibrationView
                            sensorType={SensorType.gyroscope}
                            sensorId={id}
                        />
                        <this.AxisCalibrationView
                            sensorType={SensorType.accelerometer}
                            sensorId={id}
                        />
                    </div>
                    <div className="row">
                        <this.FilterCalibrationView sensorId={id} />
                    </div>
                </div>
            </div>
        ));
    }

    protected FilterCalibrationView: React.SFC<{ sensorId: string }> = (props): JSX.Element => (
        <div className="column">
            <div className="row no-space">
                <span className="cell">complementary filter</span>
                <div className="cell no-space">
                    <input
                        value={this.getFilterValue(props.sensorId)}
                        onBlur={this.getBlurFilterHandler(props.sensorId)}
                        onChange={this.getChangeFilterHandler(props.sensorId)}
                    />
                </div>
            </div>
        </div>
    )

    protected AxisCalibrationView: React.SFC<{ sensorType: SensorType, sensorId: string }> = (props): JSX.Element => {
        const list = Object.keys(Axis).map((axisName: keyof typeof Axis) => (
            <span className="cell no-space" key={axisName}>
                <this.AxisCalibrationInput
                    {...props}
                    axis={axisName}
                />
            </span>
        ));

        return (
            <div className="column">
                <div className="row no-bottom">{props.sensorType}</div>
                <div className="row no-space">
                    {list}
                </div>
            </div>
        );
    }

    protected AxisCalibrationInput:
        React.SFC<{ axis: keyof typeof Axis, sensorType: SensorType, sensorId: string }> = (props): JSX.Element => (
            <input
                value={this.getOffsetValue(props.axis, props.sensorType, props.sensorId)}
                onBlur={this.getBlurOffsetHandler(props.axis, props.sensorType, props.sensorId)}
                onChange={this.getChangeOffsetHandler(props.axis, props.sensorType, props.sensorId)}
            />
        )

    protected getChangeFilterHandler = (sensorId: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        const founded = this.context.activeSensorsList.find(({ id }) => id === sensorId);

        if (!founded) {
            return;
        }

        founded.complementaryFilterCoefficient = event.currentTarget.value.replace(/[^0-9\.\-]/g, "");
        this.forceUpdate();
    }

    protected getBlurFilterHandler = (sensorId: string) => (): void => {
        const founded = this.context.activeSensorsList.find(({ id }) => id === sensorId);

        if (!founded) {
            return;
        }

        const value = parseFloat(founded.complementaryFilterCoefficient.toString()) || 0;

        founded.complementaryFilterCoefficient = value <= 1 && value >= 0 ? value : 0;
        this.forceUpdate();
        founded.saveFilters();
    }

    protected getChangeOffsetHandler = (axis: keyof typeof Axis, sensorType: SensorType, sensorId: string) =>
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            const founded = this.context.activeSensorsList.find(({ id }) => id === sensorId);

            if (!founded) {
                return;
            }

            founded.offsets[sensorType][axis] = event.currentTarget.value.replace(/[^0-9\.\-]/g, "");
            this.forceUpdate();
        }

    protected getBlurOffsetHandler = (axis: keyof typeof Axis, sensorType: SensorType, sensorId: string) =>
        (): void => {
            const founded = this.context.activeSensorsList.find(({ id }) => id === sensorId);

            if (!founded) {
                return;
            }

            founded.offsets[sensorType][axis] = parseFloat(founded.offsets[sensorType][axis].toString()) || 0;
            this.forceUpdate();
            founded.saveOffsets();
        }

    protected getOffsetValue = (axis: keyof typeof Axis, sensorType: SensorType, sensorId: string): string => {
        const founded = this.context.activeSensorsList.find(({ id }) => id === sensorId);

        return founded
            ? `${axis}: ${founded.offsets[sensorType][axis].toString()}`
            : `${axis}: 0`;
    }

    protected getFilterValue = (sensorId: string): string => {
        const founded = this.context.activeSensorsList.find(({ id }) => id === sensorId);

        return founded
            ? founded.complementaryFilterCoefficient.toString()
            : "0";
    }
}
