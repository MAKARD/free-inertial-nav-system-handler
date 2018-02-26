import * as PropTypes from "prop-types";

export interface LayoutProps {
    children?: any;
}

export const LayoutPropTypes: {[P in keyof LayoutProps]: PropTypes.Validator<any>} = {
    children: PropTypes.any
};
