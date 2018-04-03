import * as React from "react";

import { LayoutContextTypes, LayoutContext } from "../Layout/LayoutContext";
import { DataRecordContextTypes, DataRecordContext } from "../DataRecord";
import { DataRecordControl } from "../../calculations";

export class MathlabUnloader extends React.Component {
    public static readonly contextTypes = {
        ...DataRecordContextTypes,
        ...LayoutContextTypes
    };

    public readonly context: DataRecordContext & LayoutContext;

    protected YAxisSheme = {
        internalSensor: ["gyroscope", "accelerometer"],
        axis: ["x", "y", "z"]
    };

    public render(): React.ReactNode {
        return (
            <button
                type="button"
                onClick={this.handleGenerate}
                disabled={this.context.isPortListened}
            >
                generate *.m - file
            </button>
        );
    }

    protected handleGenerate = (): void => {
        const timeAxis = (new Array(this.context.recordsCount))
            .fill("")
            .map((x, i) => i * DataRecordControl.readInterval)
        // x=0.1:0.01:10;

        const YAxis = {};
        (new Array(DataRecordControl.maxSensorsCount))
            .fill("")
            .forEach((x, sensorIndex) => {
                this.YAxisSheme.internalSensor.forEach((internalSensorName) => {
                    this.YAxisSheme.axis.forEach((axisName) => {
                        YAxis[`Sensor_${sensorIndex}_${internalSensorName}_${axisName}`] = timeAxis
                            .map((actualTime) => {
                                const founded = this.context.sensorsList[sensorIndex][internalSensorName]
                                    .get()
                                    .find(({ time }) => time === actualTime);

                                return founded
                                    ? founded.axis[axisName]
                                    : 0;
                            });
                    })
                })
            });
    }
}
