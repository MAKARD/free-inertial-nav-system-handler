import * as React from "react";
import * as Electron from "electron";
import { Switch, Route, Redirect } from "react-router";
import { ExpandController, ControlledExpandElement } from "react-expand";

import { Header } from "./Partials";

import { Menu } from "../Menu";
import { DataRecord } from "../DataRecord";
import { PerfomanceStat } from "../PerfomanceStat";
import { PortsControlProvider } from "../PortsControl";
import { DataViewPlain, DataViewChart, DataViewOrientation } from "../DataView";

import { LayoutProps, LayoutPropTypes } from "./LayoutProps";
import { LayoutContextTypes, LayoutContext } from "./LayoutContext";
import { Settings } from "../Settings";

export interface LayoutState {
    isReady: boolean;
    isPortListened: boolean;
}

export class Layout extends React.Component<LayoutProps, LayoutState> {
    public static readonly childContextTypes = LayoutContextTypes;
    public static readonly propTypes = LayoutPropTypes;

    public readonly state: LayoutState = {
        isReady: false,
        isPortListened: false
    }

    public getChildContext(): LayoutContext {
        return {
            isPortListened: this.state.isPortListened
        };
    }

    public async componentWillMount() {
        Electron.ipcRenderer.once("ready", (): void => {
            this.setState({
                isReady: true
            });
        });
    }

    public render(): JSX.Element {
        if (!this.state.isReady) {
            return null;
        }

        return (
            <ExpandController>
                <PortsControlProvider onPortChangeState={this.handlePortStateChanged}>
                    <Header />
                </PortsControlProvider>
                <ControlledExpandElement expandId="menu">
                    <Menu />
                </ControlledExpandElement>
                <div className="content">
                    <DataRecord>
                        <Switch>
                            <Route path="/real-time-chart" component={DataViewChart} />
                            <Route path="/orientation-calc" component={DataViewOrientation} />
                            <Route path="/settings" component={Settings} />
                            <Redirect to="/real-time-chart" />
                        </Switch>
                    </DataRecord>
                </div>
            </ExpandController>
        );
    }

    protected handlePortStateChanged = (state: boolean): void => {
        this.setState({
            isPortListened: state
        });
    }
}
