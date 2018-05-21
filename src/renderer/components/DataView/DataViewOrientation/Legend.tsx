import * as React from "react";
import * as PropTypes from "prop-types";

export interface LegendProps {
    axis: Array<string>;
}

export const LegendPropTypes: {[P in keyof LegendProps]: PropTypes.Validator<any>} = {
    axis: PropTypes.array.isRequired
};

export class Legend extends React.Component<LegendProps> {
    public static readonly propTypes = LegendPropTypes;

    public render(): React.ReactNode {
        return this.props.axis.map((name: string) => (
            <button
                key={name}
                type="button"
                className={this.getClassName(name)}
            >
                <span className="marker" />
                <span className="label">{name}</span>
            </button>
        ));
    }

    protected getClassName = (name: string): string => {
        return ["legend-item", name, "on"]
            .join(" ")
            .trim();
    }
}
