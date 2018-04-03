import * as React from "react";
import * as Electron from "electron";
import { ExpandController } from "react-expand";

import { Header } from "./Partials";
import { PerfomanceStat } from "../PerfomanceStat";
import { PortsControlProvider } from "../PortsControl";
import { LayoutProps, LayoutPropTypes } from "./LayoutProps";
import { LayoutContextTypes, LayoutContext } from "./LayoutContext";
import { DataViewProvider, DataViewPlain, DataViewChart } from "../DataView";

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
        }
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
                <PerfomanceStat />
                <PortsControlProvider onPortChangeState={this.handlePortStateChanged}>
                    <Header />
                </PortsControlProvider>
                <DataViewProvider>
                    <DataViewChart />
                    <DataViewPlain />
                </DataViewProvider>
            </ExpandController>
        );
    }

    protected handlePortStateChanged = (state: boolean): void => {
        this.setState({
            isPortListened: state
        });
    }
}
