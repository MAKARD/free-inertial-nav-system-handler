import * as React from "react";

import { SensorAxis, InternalSensor } from "../../../calculations";

export interface ViewTextAreaProps {
    accelerometer: Array<InternalSensor>;
    gyroscope: Array<InternalSensor>;
}

const mapAxis = (array: Array<InternalSensor>): string => {
    return (
        `x: ${array.map(({ axis: { x } }) => x)}\n` +
        `y: ${array.map(({ axis: {y }}) => y)}\n` +
        `z: ${array.map(({ axis: {z }}) => z)}\n`
    );
}

export const ViewTextArea: React.SFC<ViewTextAreaProps> = (props): JSX.Element => (
    <React.Fragment>
        <div>
            <span>Accelerometer</span>
            <textarea value={mapAxis(props.accelerometer)} readOnly />
        </div>
        <div>
            <span>Gyroscope</span>
            <textarea value={mapAxis(props.gyroscope)} readOnly />
        </div>
    </React.Fragment>
);
