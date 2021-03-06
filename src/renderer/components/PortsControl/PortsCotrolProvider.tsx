import * as React from "react";
import * as Electron from "electron";
import * as PropTypes from "prop-types";

import { ipcRequests } from "../../data/ipcRequests";
import {
    PortsState,
    PortsControlProviderContext,
    PortsControlProviderContextTypes
} from "./PortsControlProviderContext";

export interface PortsControlProviderProps {
    onPortChangeState: (state: boolean) => void;
}

export const PortsControlProviderPropTypes: {[P in keyof PortsControlProviderProps]: PropTypes.Validator<any>} = {
    onPortChangeState: PropTypes.func.isRequired,
}

export class PortsControlProvider extends React.Component<PortsControlProviderProps> {
    public static readonly childContextTypes = PortsControlProviderContextTypes;
    public static readonly propTypes = PortsControlProviderPropTypes;

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
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleSetActivePort = (selectedPort: string): void => {
        this.setState({ selectedPort });
    }

    protected handleFetchPortsList = (): void => {
        const ports = Electron.ipcRenderer.sendSync(ipcRequests.availablePorts);
        if (!ports[0] || !ports[0].comName) {
            return this.setState({ports: [], selectedPort: ""});
        }

        this.setState({
            ports,
            selectedPort: ports[0].comName
        });
    }

    protected handleStartListenPort = (): void => {
        Electron.ipcRenderer.send(ipcRequests.openPort, this.state.selectedPort);
        this.setState({
            isListening: true
        }, () => {
            this.props.onPortChangeState(this.state.isListening);
        });
    }

    protected handleStopListenPort = (): void => {
        Electron.ipcRenderer.send(ipcRequests.closePort);
        this.setState({
            isListening: false
        }, () => {
            this.props.onPortChangeState(this.state.isListening);
        });
    }
}
