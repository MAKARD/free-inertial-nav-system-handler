import * as React from "react";
import * as Electron from "electron";
import { ExpandController } from "react-expand";

import { LayoutProps, LayoutPropTypes } from "./LayoutProps";
import { DataViewProvider, DataViewPlain } from "../DataView";
import { Header } from "./Partials";

export interface LayoutState {
    isReady: boolean;
}

export class Layout extends React.Component<LayoutProps> {
    public static propTypes = LayoutPropTypes;

    public readonly state: LayoutState = {
        isReady: false
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
            <div>
                <ExpandController>
                    <Header />
                    <DataViewProvider>
                        <DataViewPlain />
                    </DataViewProvider>
                </ExpandController>
            </div>
        );
    }
}
