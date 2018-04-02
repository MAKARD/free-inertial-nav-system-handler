import * as React from "react";

import { SensorAxis, InternalSensor, DataRepository } from "../../../calculations";

export interface ViewTextAreaProps {
    accelerometer: DataRepository;
    gyroscope: DataRepository;
}

const mapAxis = (repository: DataRepository): string => {
    return (
        `x: ${repository.get().map(({ axis: { x } }) => x)}\n` +
        `y: ${repository.get().map(({ axis: {y }}) => y)}\n` +
        `z: ${repository.get().map(({ axis: {z }}) => z)}\n`
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
