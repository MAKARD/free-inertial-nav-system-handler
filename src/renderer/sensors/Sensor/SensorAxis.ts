import * as PropTypes from "prop-types";

import { TypedClass } from "../TypedClass";

export enum Axis {
    x = "x",
    y = "y",
    z = "z"
}

export interface SensorAxisProps {
    [Axis.x]: number;
    [Axis.y]: number;
    [Axis.z]: number;
}

export const SensorAxisPropTypes: {[P in keyof SensorAxisProps]: PropTypes.Validator<any>} = {
    [Axis.x]: PropTypes.number.isRequired,
    [Axis.y]: PropTypes.number.isRequired,
    [Axis.z]: PropTypes.number.isRequired
}

export class SensorAxis extends TypedClass {
    public x: number;
    public y: number;
    public z: number;

    constructor(props: SensorAxisProps) {
        super(props, SensorAxisPropTypes);

        this.z = props.z;
        this.x = props.x;
        this.y = props.y;
    }
}
