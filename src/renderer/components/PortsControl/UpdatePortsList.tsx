import * as React from "react";

import {
    PortsControlProviderContext,
    PortsControlProviderContextTypes
} from "./PortsControlProviderContext";

export class UpdatePortsList extends React.Component<React.HTMLProps<HTMLButtonElement>> {
    public static readonly contextTypes = PortsControlProviderContextTypes;

    public readonly context: PortsControlProviderContext;

    public render(): React.ReactNode {
        return (
            <button
                type="button"
                {...this.props}
                onClick={this.handleClick}
                disabled={this.context.isPortBusy}
            >
                {this.props.children}
            </button>
        )
    }

    protected handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        this.context.fetchPortsList();
    }
}
