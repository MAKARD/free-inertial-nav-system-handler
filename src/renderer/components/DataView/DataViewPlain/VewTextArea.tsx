import * as React from "react";

import { SensorAxis } from "../../../calculations";

export interface ViewTextAreaProps {
    accelerometer: Array<SensorAxis>;
    gyroscope: Array<SensorAxis>;
}

const mapAxis = (array: Array<SensorAxis>) => {
    return (
        `x: ${array.map(({ x }) => x)}\n` +
        `y: ${array.map(({ y }) => y)}\n` +
        `z: ${array.map(({ z }) => z)}\n`
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
