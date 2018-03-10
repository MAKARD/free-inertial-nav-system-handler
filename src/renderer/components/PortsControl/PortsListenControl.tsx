import * as React from "react";
import * as PropTypes from "prop-types";

import {
    PortsControlProviderContext,
    PortsControlProviderContextTypes
} from "./PortsControlProviderContext";

export interface PortsListenControlProps extends React.HTMLProps<HTMLButtonElement> {
    stageStartChildren?: React.ReactNode,
    stageStopChildren?: React.ReactNode
}

export const PortsListenControlPropTypes: {[P in keyof PortsListenControlProps]: PropTypes.Validator<any>} = {
    stageStartChildren: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    stageStopChildren: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};

export class PortsListenControl extends React.Component<PortsListenControlProps> {
    public static readonly contextTypes = PortsControlProviderContextTypes;
    public static readonly propTypes = PortsListenControlPropTypes;

    public readonly context: PortsControlProviderContext;

    public render(): React.ReactNode {
        const { stageStartChildren, stageStopChildren, ...buttonProps } = this.props;

        return (
            <button
                type="button"
                {...buttonProps}
                onClick={this.handleClick}
                disabled={!this.context.selectedPort}
            >
                {this.context.isPortBusy ? stageStopChildren : stageStartChildren}
            </button>
        );
    }

    protected handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        this.context.isPortBusy
            ? this.context.stopListenPort()
            : this.context.startListenPort();
    }
}
