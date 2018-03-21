import * as PropTypes from "prop-types";

import { InternalSensor, SensorAxisPropTypes } from "../../../calculations";

export interface DataRangeControllerContext {
    sensors: Array<{
        id: number;
        gyroscope: Array<InternalSensor>;
        accelerometer: Array<InternalSensor>;
    }>
}

export const DataRangeControllerContextTypes: {[P in keyof DataRangeControllerContext]: PropTypes.Validator<any>} = {
    sensors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        gyroscope: PropTypes.arrayOf(PropTypes.shape({
            time: PropTypes.number.isRequired,
            axis: PropTypes.shape(SensorAxisPropTypes).isRequired
        })).isRequired,
        accelerometer: PropTypes.arrayOf(PropTypes.shape({
            time: PropTypes.number.isRequired,
            axis: PropTypes.shape(SensorAxisPropTypes).isRequired
        })).isRequired
    })).isRequired
};
