import * as React from "react";
import { ipcRenderer } from "electron";
import * as PropTypes from "prop-types";

import { ipcRequests } from "../../data/ipcRequests";
import {
    PortsControlProviderContext,
    PortsControlProviderContextTypes
} from "./PortsControlProviderContext";

export interface DevModeState {
    isActive: boolean;
}

export interface DevModeSwitcherProps extends React.HTMLProps<HTMLButtonElement> {
    stageStartChildren?: React.ReactNode,
    stageStopChildren?: React.ReactNode
}

export const DevModeSwitcherPropTypes: {[P in keyof DevModeSwitcherProps]: PropTypes.Validator<any>} = {
    stageStartChildren: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    stageStopChildren: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};

export class DevModeSwitcher extends React.Component<DevModeSwitcherProps, DevModeState> {
    public static readonly contextTypes = PortsControlProviderContextTypes;
    public static readonly propTypes = DevModeSwitcherPropTypes;

    public readonly context: PortsControlProviderContext;
    public readonly state: DevModeState = {
        isActive: false
    };

    public render(): JSX.Element {
        const { stageStartChildren, stageStopChildren, ...buttonProps } = this.props;

        return (
            <button
                type="button"
                {...buttonProps}
                onClick={this.handleModeChange}
                disabled={this.context.isPortBusy}
            >
                {this.state.isActive ? stageStopChildren : stageStartChildren}
            </button>
        );
    }

    protected handleModeChange = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        this.setState(({ isActive }) => ({
            isActive: !isActive
        }), () => {
            ipcRenderer.send(ipcRequests.devMode, this.state.isActive);
            this.context.fetchPortsList();
        });
    }
}
