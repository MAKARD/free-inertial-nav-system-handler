import * as React from "react";

import { Sensor, Axis, SensorType } from "../../sensors";
import { DataRecordContextTypes, DataRecordContext } from "../DataRecord";

export class Offsets extends React.Component {
    public static readonly contextTypes = DataRecordContextTypes;
    public static readonly inputWriteDelay = 500;

    public readonly context: DataRecordContext;

    public render(): React.ReactNode {
        return this.context.activeSensorsList.map(({ id }) => (
            <div className="table" key={id}>
                <span className="table-header">Sensor {id}</span>
                <div className="table-body">
                    <this.AxisCalibrationView
                        sensorType={SensorType.gyroscope}
                        sensorId={id}
                    />
                    <this.AxisCalibrationView
                        sensorType={SensorType.accelerometer}
                        sensorId={id}
                    />
                </div>
            </div>
        ));
    }

    protected AxisCalibrationView: React.SFC<{ sensorType: SensorType, sensorId: string }> = (props): JSX.Element => {
        const list = Object.keys(Axis).map((axisName: keyof typeof Axis) => (
            <span className="cell" key={axisName}>
                <this.AxisCalibrationInput
                    {...props}
                    axis={axisName}
                />
            </span>
        ));

        return (
            <div className="column">
                <span className="row">{props.sensorType}</span>
                <div className="row">
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
}
