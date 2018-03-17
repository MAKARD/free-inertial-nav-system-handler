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
        const list = this.activeSensorsArray.map(({id}) => (
            <Header tabId={`sensor_${id}`} key={id}>
                Sensor {id}
            </Header>
        ));

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }

    protected Tabs: React.SFC<{}> = (): JSX.Element => {
        const list = this.activeSensorsArray.map((sensor) => (
            <Tab tabId={`sensor_${sensor.id}`} key={sensor.id}>
                <ViewTextArea gyroscope={sensor.gyroscope} accelerometer={sensor.accelerometer} />
            </Tab>
        ));

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }

    private get activeSensorsArray() {
        return this.context.sensorsRepository.sensors.filter(({state}) => state);
    }
}
