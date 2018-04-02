import * as React from "react";
import * as PropTypes from "prop-types";
import { saveSvgAsPng } from "save-svg-as-png";
import { Tab, Header, TabsController } from "react-expand";

import { DataViewProviderContextTypes, DataViewProviderContext } from "./../DataViewProviderContext";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";
import { ViewChart } from "./ViewChart";

export class DataViewChart extends React.Component {
    public static readonly contextTypes = {
        ...DataViewProviderContextTypes,
        ...LayoutContextTypes
    };

    public readonly context: DataViewProviderContext & LayoutContext;

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <button
                    onClick={this.handleSave}
                    disabled={this.context.isPortListened}
                >
                    save
                </button>
                <TabsController>
                    <this.Headers />
                    <this.Tabs />
                </TabsController>
            </React.Fragment>
        );
    }

    protected handleSave = (): void => {
        saveSvgAsPng(document.querySelector(".chart > svg"), "diagram.png")
    }

    protected Headers: React.SFC<{}> = (): JSX.Element => {
        const list = this.context.activeSensorsList.map(({ id }) => (
            <Header tabId={`sensor_view_chart_${id}`} key={id}>
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
            <Tab tabId={`sensor_view_chart_${sensor.id}`} key={sensor.id}>
                <div>
                    <TabsController>
                        <Header tabId="gyroscope">
                            gyroscope
                        </Header>
                        <Header tabId="accelerometer">
                            accelerometer
                        </Header>
                        <Tab tabId="gyroscope">
                            <ViewChart sensor={sensor} internalSensorName="gyroscope" />
                        </Tab>
                        <Tab tabId="accelerometer">
                            <ViewChart sensor={sensor} internalSensorName="accelerometer" />
                        </Tab>
                    </TabsController>
                </div>
            </Tab>
        ));

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }
}
