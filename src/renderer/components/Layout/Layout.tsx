import * as React from "react";
import * as Electron from "electron";

import { LayoutProps, LayoutPropTypes } from "./LayoutProps";
import { DataViewProvider } from "../DataView";
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
                <Header />
            </div>
        );
    }
}
