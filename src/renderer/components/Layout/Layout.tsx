import * as React from "react";
import * as Electron from "electron";
import { ExpandController } from "react-expand";

import { Header } from "./Partials";

import { DataRecord } from "../DataRecord";
import { PerfomanceStat } from "../PerfomanceStat";
import { PortsControlProvider } from "../PortsControl";
import { DataViewPlain, DataViewChart } from "../DataView";

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
                <PerfomanceStat />
                <DataRecord>
                    <DataViewChart />
                    <DataViewPlain />
                </DataRecord>
            </ExpandController>
        );
    }

    protected handlePortStateChanged = (state: boolean): void => {
        this.setState({
            isPortListened: state
        });
    }
}
