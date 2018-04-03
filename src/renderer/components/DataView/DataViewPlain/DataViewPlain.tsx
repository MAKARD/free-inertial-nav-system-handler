import * as React from "react";
import * as PropTypes from "prop-types";
import { Tab, Header, TabsController } from "react-expand";

import { ViewTextArea } from "./VewTextArea";

import { DataRecordContext, DataRecordContextTypes } from "../../DataRecord";

export class DataViewPlain extends React.Component {
    public static readonly contextTypes = DataRecordContextTypes;

    public readonly context: DataRecordContext;

    public render(): React.ReactNode {
        return (
            <TabsController>
                <this.Headers />
                <this.Tabs />
            </TabsController>
        );
    }

    protected Headers: React.SFC<{}> = (): JSX.Element => {
        const list = this.context.activeSensorsList.map(({id}) => (
            <Header tabId={`sensor_view_plain_${id}`} key={id}>
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
        const list = this.context.activeSensorsList.map((sensor) => (
            <Tab tabId={`sensor_view_plain_${sensor.id}`} key={sensor.id}>
                <ViewTextArea gyroscope={sensor.gyroscope} accelerometer={sensor.accelerometer} />
            </Tab>
        ));

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }
}
