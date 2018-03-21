import * as PropTypes from "prop-types";

import { Sensor } from "../../calculations";

export interface DataViewProviderContext {
    activeSensorsList: Array<Sensor>;
}

export const DataViewProviderContextTypes: {[P in keyof DataViewProviderContext]: PropTypes.Validator<any>} = {
    activeSensorsList: PropTypes.arrayOf(PropTypes.instanceOf(Sensor)).isRequired
};
