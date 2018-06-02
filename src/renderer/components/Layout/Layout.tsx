import * as React from "react";
import * as Electron from "electron";
import { Switch, Route, Redirect } from "react-router";
import { ExpandController, ControlledExpandElement } from "react-expand";

import { Header, Menu } from "./Partials";

import { Offsets } from "../Offsets";
import { Simulation } from "../Simulation";
import { DataRecord } from "../DataRecord";
import { PerfomanceStat } from "../PerfomanceStat";
import { PortsControlProvider } from "../PortsControl";
import { DataViewPlain, DataViewChart, DataViewOrientation } from "../DataView";

import { LayoutProps, LayoutPropTypes } from "./LayoutProps";
import { LayoutContextTypes, LayoutContext } from "./LayoutContext";

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
                <div className="content">
                    <DataRecord>
                        <div className="main-view">
                            <Switch>
                                <Route path="/real-time-chart" component={DataViewChart} />
                                <Route path="/orientation-calc" component={DataViewOrientation} />
                                <Route path="/simulation" component={Simulation} />
                                <Route path="/offsets" component={Offsets} />
                                <Redirect to="/real-time-chart" />
                            </Switch>
                        </div>
                    </DataRecord>
                    <ControlledExpandElement expandId="menu" className="menu-element">
                        <Menu />
                    </ControlledExpandElement>
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
