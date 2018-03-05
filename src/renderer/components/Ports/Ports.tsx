import * as React from "react";
import Select from "react-select";
import { ipcRenderer } from "electron";

import { ipcRequests } from "../../data/ipcRequests";

export interface PortInterface {
    pnpId?: string;
    comName: string;
    vendorId?: string;
    productId?: string;
    locationId?: string;
    manufacturer?: string;
    serialNumber?: number;
}

export interface PortsState {
    ports: Array<PortInterface>;
    selectedPort: string;
    isListening: boolean;
}

export class Ports extends React.Component {
    public readonly state: PortsState = {
        ports: [],
        selectedPort: "",
        isListening: false
    };

    public componentDidMount() {
        const ports = ipcRenderer.sendSync(ipcRequests.availablePorts);
        if (!ports[0] || !ports[0].comName) {
            return;
        }

        this.setState({
            ports,
            selectedPort: ports[0].comName
        });

        ipcRenderer.on(ipcRequests.listenPort, this.handleListenPort);
    }

    public componentWillUnmount() {
        ipcRenderer.removeListener(ipcRequests.listenPort, this.handleListenPort);
    }

    public render(): JSX.Element {
        return (
            <div>
                <span>Avaliable ports:</span>
                <this.AvailablePorts />
                <button
                    type="button"
                    onClick={this.handleStartListenPort}
                    disabled={!this.state.selectedPort || this.state.isListening}
                >
                    Liten port
                </button>
                <button
                    type="button"
                    onClick={this.handleStopListenPort}
                    disabled={!this.state.isListening}
                >
                    Stop listen
                </button>
            </div>
        );
    }

    protected handleStartListenPort = (): void => {
        ipcRenderer.send(ipcRequests.openPort, this.state.selectedPort);
        this.setState({
            isListening: true
        });
    }

    protected handleStopListenPort = (): void => {
        ipcRenderer.send(ipcRequests.closePort);
        this.setState({
            isListening: false
        });
    }

    protected handleListenPort = (event, message): void => {
        console.log(message);
    }

    protected handlePortsReceived = (event, ports: Array<PortInterface>): void => {
        this.setState({
            ports,
            selectedPort: ports[0].comName
        });
    }

    protected handlePortChange = ({ value }): void => {
        this.setState({ selectedPort: value });
    }

    protected AvailablePorts: React.SFC<{}> = (): JSX.Element => {
        const mappedPorts = this.state.ports.map(({ comName }) => ({
            label: comName,
            value: comName
        }));

        return (
            <Select
                onChange={this.handlePortChange}
                value={this.state.selectedPort}
                options={mappedPorts}
                searchable={false}
                clearable={false}
                disabled={this.state.isListening}
            />
        );
    }
}
