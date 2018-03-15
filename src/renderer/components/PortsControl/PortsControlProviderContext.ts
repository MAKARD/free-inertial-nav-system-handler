import * as PropTypes from "prop-types";

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

export interface PortsControlProviderContext {
    setActivePort: (comName: string) => void;
    fetchPortsList: () => void;
    stopListenPort: () => void;
    startListenPort: () => void;

    portsList: PortsState["ports"];
    selectedPort?: string;
    isPortBusy: boolean;
}

export const PortsControlProviderContextTypes:
    {[P in keyof PortsControlProviderContext]: PropTypes.Validator<any>} = {
        startListenPort: PropTypes.func.isRequired,
        stopListenPort: PropTypes.func.isRequired,
        fetchPortsList: PropTypes.func.isRequired,
        setActivePort: PropTypes.func.isRequired,

        portsList: PropTypes.arrayOf(PropTypes.object).isRequired,
        isPortBusy: PropTypes.bool.isRequired,
        selectedPort: PropTypes.string
    };
