import * as React from "react";
import * as PropTypes from "prop-types";
import { Tab, Header, TabsController } from "react-expand";

import { ViewTextArea } from "./VewTextArea";
import { DataViewProviderContextTypes, DataViewProviderContext } from "./../DataViewProviderContext";

export class DataViewPlain extends React.Component {
    public static readonly contextTypes = DataViewProviderContextTypes;

    public readonly context: DataViewProviderContext;

    public render(): React.ReactNode {
        return (
            <TabsController>
                <this.Headers />
                <this.Tabs />
            </TabsController>
        );
    }

    protected Headers: React.SFC<{}> = (): JSX.Element => {
        const list = this.activeSensorsArray.map((key) => (
            <Header tabId={`sensor_${key}`} key={key}>
                Sensor {key}
            </Header>
        ));

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }

    protected Tabs: React.SFC<{}> = (): JSX.Element => {
        const list = this.activeSensorsArray.map((key) => (
            <Tab tabId={`sensor_${key}`} key={key}>
                <ViewTextArea data={this.context.getSensorById(Number(key))} />
            </Tab>
        ));

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }

    private get activeSensorsArray() {
        return Object.keys(this.context.activeSensors)
            .filter((key) => this.context.activeSensors[key]);
    }
}
