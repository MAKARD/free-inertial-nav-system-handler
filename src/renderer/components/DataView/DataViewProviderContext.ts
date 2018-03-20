import * as PropTypes from "prop-types";

import { SensorRepository, Sensor } from "../../calculations";

export interface DataViewProviderContext {
    sensorsRepository: SensorRepository;
    activeSensorsList: Array<Sensor>;
}

export const DataViewProviderContextTypes: {[P in keyof DataViewProviderContext]: PropTypes.Validator<any>} = {
    sensorsRepository: PropTypes.instanceOf(SensorRepository).isRequired,
    activeSensorsList: PropTypes.arrayOf(PropTypes.instanceOf(Sensor)).isRequired
};
