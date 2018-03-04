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
}

export class Ports extends React.Component {
    public readonly state: PortsState = {
        ports: [],
        selectedPort: ""
    };

    public componentDidMount() {
        ipcRenderer.send(ipcRequests.availablePorts);
        ipcRenderer.on(ipcRequests.availablePorts, this.handlePortsReceived);

        ipcRenderer.send(ipcRequests.listenPort);
        ipcRenderer.on(ipcRequests.listenPort, (...e) => {
            console.log(e);
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <span>Avaliable ports:</span>
                <this.AvailablePorts />
            </div>
        );
    }

    protected handlePortsReceived = (event, ports: Array<PortInterface>): void => {
        this.setState({
            ports,
            selectedPort: ports[0].comName
        });
    }

    protected AvailablePorts: React.SFC<{}> = (): JSX.Element => {
        if (!this.state.ports.length) {
            return <span>No ports</span>;
        }

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
            />
        );
    }

    protected handlePortChange = ({ value }): void => {
        ipcRenderer.send(ipcRequests.openPort, value);
        this.setState({
            selectedPort: value
        });
    }
}
