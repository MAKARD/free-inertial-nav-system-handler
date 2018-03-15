import * as PropTypes from "prop-types";

import { TypedClass } from "../TypedClass";

export interface SensorAxisProps {
    x: number;
    y: number;
    z: number;
}

export const SensorAxisPropTypes: {[P in keyof SensorAxisProps]: PropTypes.Validator<any>} = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired
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
