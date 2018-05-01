import * as React from "react";
import Select from "react-select";

import {
    PortsControlProviderContext,
    PortsControlProviderContextTypes
} from "./PortsControlProviderContext";

export class AvailablePortsList extends React.Component<React.HTMLProps<HTMLDivElement>> {
    public static readonly contextTypes = PortsControlProviderContextTypes;

    public readonly context: PortsControlProviderContext;

    public render(): React.ReactNode {
        return (
            <Select
                {...this.props}
                disabled={this.context.isPortBusy}
                value={this.context.selectedPort}
                onChange={this.handlePortChange}
                options={this.mappedPorts}
                className={this.className}
                noResultsText="No ports"
                searchable={false}
                clearable={false}
            />
        );
    }

    protected get className(): string {
        return [this.props.className, this.context.isPortBusy && "disabled"]
            .filter((name) => name)
            .join(" ")
            .trim();
    }

    protected get mappedPorts() {
        return this.context.portsList.map(({ comName }) => ({
            label: comName,
            value: comName
        }));
    }

    protected handlePortChange = ({ value }): void => {
        this.context.setActivePort(value);
    }
}
