import * as React from "react";
import * as PropTypes from "prop-types";

export interface LegendProps {
    axis: {
        [key: string]: boolean;
    };
    onSelectionChange: (name: string) => void;
}

export const LegendPropTypes: {[P in keyof LegendProps]: PropTypes.Validator<any>} = {
    axis: PropTypes.object.isRequired,
    onSelectionChange: PropTypes.func.isRequired
};

export class Legend extends React.Component<LegendProps> {
    public static readonly propTypes = LegendPropTypes;

    public render(): React.ReactNode {
        return Object.keys(this.props.axis).map((name: string) => (
            <button
                key={name}
                type="button"
                onClick={this.handleClick(name)}
                className={this.getClassName(name)}
            >
                <span className="marker" />
                <span className="label">{name}</span>
            </button>
        ));
    }

    protected handleClick = (name: string) => (): void => {
        this.props.onSelectionChange(name);
    }

    protected getClassName = (name: string): string => {
        return ["legend-item", name, this.props.axis[name] ? "on" : "off"]
            .join(" ")
            .trim();
    }
}
