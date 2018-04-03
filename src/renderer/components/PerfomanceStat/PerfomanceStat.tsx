import * as Electron from "electron";
import * as React from "react";

import { ipcRequests } from "../../data/ipcRequests";

export interface PerfomanceStatState {
    rss: number;
    heapUsed: number;
    external: number;
    heapTotal: number;
}

export class PerfomanceStat extends React.Component<{}, PerfomanceStatState> {
    public readonly state: PerfomanceStatState = {
        rss: 0,
        heapUsed: 0,
        external: 0,
        heapTotal: 0
    };

    private intervalId: any;

    public componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState({ ...Electron.ipcRenderer.sendSync(ipcRequests.memoryUsage) });
        }, 250);
    }

    public componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div>
                    <span>heapUsed: {this.state.heapUsed / 1024 / 1024} MB</span>
                </div>
                <div>
                    <span>heapTotal: {this.state.heapTotal / 1024 / 1024} MB</span>
                </div>
                <div>
                    <span>rss: {this.state.rss / 1024 / 1024} MB</span>
                </div>
                <div>
                    <span>external: {this.state.external / 1024 / 1024} MB</span>
                </div>
            </div>
        );
    }
}
