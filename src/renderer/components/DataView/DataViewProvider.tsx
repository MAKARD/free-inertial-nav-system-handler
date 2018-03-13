import * as React from "react";
import * as Electron from "electron";

import { ipcRequests } from "../../data/ipcRequests";

export interface DataViewProviderState {
    data: any; // todo: make own type of data. Something like DataRepository
}

export class DataViewProvider extends React.Component {
    public componentDidMount() {
        Electron.ipcRenderer.on(ipcRequests.listenPort, this.handleListenPort);
    }

    public componentWillUnmount() {
        Electron.ipcRenderer.removeListener(ipcRequests.listenPort, this.handleListenPort);
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleListenPort = (event: Electron.Event, message: string): void => {
        // tslint:disable-next-line
        console.log(message);
    }
}
