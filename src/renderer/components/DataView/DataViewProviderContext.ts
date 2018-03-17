import * as PropTypes from "prop-types";

import { SensorRepository } from "../../calculations";

export interface DataViewProviderContext {
    sensorsRepository: SensorRepository;
}

export const DataViewProviderContextTypes: {[P in keyof DataViewProviderContext]: PropTypes.Validator<any>} = {
    sensorsRepository: PropTypes.instanceOf(SensorRepository).isRequired
};
