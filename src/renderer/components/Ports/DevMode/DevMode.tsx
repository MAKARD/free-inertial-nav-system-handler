import * as React from "react";
import { ipcRenderer } from "electron";

import { ipcRequests } from "../../../data/ipcRequests";

export interface DevModeState {
    isActive: boolean;
}

export class DevMode extends React.Component<{}, DevModeState> {
    public readonly state: DevModeState = {
        isActive: false
    };

    public componentDidMount() {
        ipcRenderer.send("")
    }

    public render(): JSX.Element {
        return (
            <div>
                <span>DevMode</span>
                <button type="button" onClick={this.handleModeChange}>
                    {this.state.isActive ? "on" : "off"}
                </button>
            </div>
        );
    }

    protected handleModeChange = () => {
        this.setState(({ isActive }) => ({
            isActive: !isActive
        }), () => {
            ipcRenderer.send(ipcRequests.devMode, this.state.isActive);
        });
    }
}
