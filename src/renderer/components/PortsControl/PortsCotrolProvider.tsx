import * as React from "react";
import Select from "react-select";
import { ipcRenderer } from "electron";

import { ipcRequests } from "../../data/ipcRequests";
import {
    PortsState,
    PortsControlProviderContext,
    PortsControlProviderContextTypes
} from "./PortsControlProviderContext";

export class PortsControlProvider extends React.Component {
    public static readonly childContextTypes = PortsControlProviderContextTypes;

    public readonly state: PortsState = {
        ports: [],
        selectedPort: "",
        isListening: false
    };

    public getChildContext(): PortsControlProviderContext {
        return {
            startListenPort: this.handleStartListenPort,
            stopListenPort: this.handleStopListenPort,
            fetchPortsList: this.handleFetchPortsList,
            setActivePort: this.handleSetActivePort,

            selectedPort: this.state.selectedPort,
            isPortBusy: this.state.isListening,
            portsList: this.state.ports,
        }
    }

    public componentDidMount() {
        this.handleFetchPortsList();
        ipcRenderer.on(ipcRequests.listenPort, this.handleListenPort);
    }

    public componentWillUnmount() {
        ipcRenderer.removeListener(ipcRequests.listenPort, this.handleListenPort);
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleSetActivePort = (selectedPort): void => {
        this.setState({ selectedPort });
    }

    protected handleFetchPortsList = (): void => {
        const ports = ipcRenderer.sendSync(ipcRequests.availablePorts);
        if (!ports[0] || !ports[0].comName) {
            return this.setState({ports: [], selectedPort: ""});
        }

        this.setState({
            ports,
            selectedPort: ports[0].comName
        });
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
}
