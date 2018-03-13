import * as PropTypes from "prop-types";

import { Sensor, SensorAxisPropTypes } from "../../calculations";
import { ActiveSensors, LostPackage } from "./DataViewProvider";

export interface DataViewProviderContext {
    getSensorById: (id: number) => Sensor;
    lostPackages: Array<LostPackage>;
    activeSensors: ActiveSensors;
    sensorsData: Array<Sensor>;
}

export const DataViewProviderContextTypes: {[P in keyof DataViewProviderContext]: PropTypes.Validator<any>} = {
    activeSensors: PropTypes.object.isRequired,
    getSensorById: PropTypes.func.isRequired,
    sensorsData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            gyroscope: PropTypes.arrayOf(
                PropTypes.shape(SensorAxisPropTypes).isRequired
            ).isRequired,
            accelerometer: PropTypes.arrayOf(
                PropTypes.shape(SensorAxisPropTypes).isRequired
            ).isRequired
        }).isRequired
    ).isRequired,
    lostPackages: PropTypes.arrayOf(PropTypes.shape({
        time: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired
    })).isRequired
};
