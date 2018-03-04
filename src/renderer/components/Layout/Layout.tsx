import * as React from "react";
import { ipcRenderer } from "electron";

import { LayoutProps, LayoutPropTypes } from "./LayoutProps"
import { Ports } from "../Ports";

export interface LayoutState {
    isReady: boolean;
}

export class Layout extends React.Component<LayoutProps> {
    public static propTypes = LayoutPropTypes;

    public readonly state: LayoutState = {
        isReady: false
    }

    public async componentWillMount() {
        ipcRenderer.on("ready", () => {
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
            <React.Fragment>
                <Ports />
            </React.Fragment>
        );
    }
}
