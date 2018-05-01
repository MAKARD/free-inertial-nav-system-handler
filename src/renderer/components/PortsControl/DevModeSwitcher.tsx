import * as React from "react";
import { ipcRenderer } from "electron";

import { ipcRequests } from "../../data/ipcRequests";
import {
    PortsControlProviderContext,
    PortsControlProviderContextTypes
} from "./PortsControlProviderContext";

export interface DevModeState {
    isActive: boolean;
}

export class DevModeSwitcher extends React.Component<React.HTMLProps<HTMLDivElement>, DevModeState> {
    public static readonly contextTypes = PortsControlProviderContextTypes;

    public readonly context: PortsControlProviderContext;
    public readonly state: DevModeState = {
        isActive: false
    };

    public render(): JSX.Element {
        return (
            <div {...this.props} className={this.className}>
                <span className="switcher-label">dev mode</span>
                <span className="switcher-handle" onClick={this.handleModeChange} />
            </div>
        );
    }

    protected get className(): string {
        return [
            "switcher",
            this.props.className,
            this.state.isActive && "active",
            this.context.isPortBusy && "disabled"
        ]
            .filter((name) => name)
            .join(" ")
            .trim();
    }

    protected handleModeChange = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (this.context.isPortBusy) {
            return;
        }
        this.props.onClick && this.props.onClick(event);

        this.setState(({ isActive }) => ({
            isActive: !isActive
        }), () => {
            ipcRenderer.send(ipcRequests.devMode, this.state.isActive);
            this.context.fetchPortsList();
        });
    }
}
