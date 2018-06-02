import * as React from "react";
import { ExpandControl } from "react-expand";

import {
    PortsControlProviderContextTypes,
    PortsControlProviderContext,
    AvailablePortsList,
    PortsListenControl,
    UpdatePortsList,
    DevModeSwitcher,
} from "../../PortsControl";

export class Header extends React.Component {
    public static readonly contextTypes = PortsControlProviderContextTypes;

    public readonly context: PortsControlProviderContext;

    public render(): React.ReactNode {
        return (
            <header>
                <div className="control-menu">
                    <DevModeSwitcher >
                        DevMode
                    </DevModeSwitcher>
                </div>
                <div className="control-menu">
                    <AvailablePortsList
                        className="btn btn_primary"
                        placeholder="Select port"
                    />
                </div>
                <div className="control-menu">
                    <UpdatePortsList className="btn btn_primary">
                        Refresh ports
                    </UpdatePortsList>
                </div>
                <div className="control-menu">
                    <button
                        type="button"
                        className="btn btn_reload"
                        onClick={this.handleReload}
                        disabled={this.context.isPortBusy}
                    >
                        Reload
                    </button>
                </div>
                <div className="control-menu">
                    <PortsListenControl
                        className="btn btn_primary"
                        stageStartChildren="Start"
                        stageStopChildren="Stop"
                    />
                </div>
                <div className="control-menu right">
                    <ExpandControl expandId="menu" className="menu-control">
                        <span /><span /><span />
                    </ExpandControl>
                </div>
                <div className={`loader${this.context.isPortBusy ? " active" : ""}`} />
            </header>
        );
    }

    protected handleReload = () => location.reload();
}
