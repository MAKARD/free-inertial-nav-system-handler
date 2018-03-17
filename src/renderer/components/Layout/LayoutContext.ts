import * as PropTypes from "prop-types";

export interface LayoutContext {
    isPortListened: boolean;
}

export const LayoutContextTypes: {[P in keyof LayoutContext]: PropTypes.Validator<any>} = {
    isPortListened: PropTypes.bool.isRequired
};
