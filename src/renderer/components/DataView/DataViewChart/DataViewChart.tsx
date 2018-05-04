import * as React from "react";
import * as PropTypes from "prop-types";
import { saveSvgAsPng } from "save-svg-as-png";
import { Tab, Header, TabsController } from "react-expand";

import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";
import { DataRecordContext, DataRecordContextTypes } from "../../DataRecord";
import { ViewChart } from "./ViewChart";

export class DataViewChart extends React.Component {
    public static readonly contextTypes = {
        ...DataRecordContextTypes,
        ...LayoutContextTypes
    };

    public readonly context: DataRecordContext & LayoutContext;

    public render(): React.ReactNode {
        return (
            <div className="tabs">
                <TabsController>
                    <div className="tabs-header">
                        <this.Headers />
                    </div>
                    <this.Tabs />
                </TabsController>
            </div>
        );
    }

    protected handleSave = (): void => {
        const element = document.querySelector(".chart > svg");
        const date = new Date();
        element && saveSvgAsPng(
            element,
            `diagram-${date.toLocaleDateString()}-${date.toLocaleTimeString()}.png`
        );
    }

    protected Headers: React.SFC<{}> = (): JSX.Element => {
        const list = this.context.activeSensorsList.map(({ id }) => (
            <Header
                expandId={`sensor_view_chart_${id}`}
                className="btn btn_secondary"
                activeClassName="active"
                key={id}
            >
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
            <Tab className="chart-wrap" expandId={`sensor_view_chart_${sensor.id}`} key={sensor.id}>
                <TabsController>
                    <div className="btn-group">
                        <Header
                            className="btn btn_primary"
                            activeClassName="active"
                            expandId="gyroscope"
                        >
                            Gyroscope
                        </Header>
                        <Header
                            className="btn btn_primary"
                            activeClassName="active"
                            expandId="accelerometer"
                        >
                            Accelerometer
                        </Header>
                        <Header
                            className="btn btn_primary"
                            activeClassName="active"
                            expandId="angles"
                        >
                            Angles
                        </Header>
                    </div>
                    <Tab expandId="gyroscope" className="chart-view">
                        <ViewChart sensor={sensor} internalSensorName="gyroscope" />
                    </Tab>
                    <Tab expandId="angles" className="chart-view">
                        <ViewChart sensor={sensor} internalSensorName="angles" />
                    </Tab>
                    <Tab expandId="accelerometer" className="chart-view">
                        <ViewChart sensor={sensor} internalSensorName="accelerometer" />
                    </Tab>
                </TabsController>
            </Tab>
        ));

        return (
            <React.Fragment>
                <button
                    onClick={this.handleSave}
                    disabled={this.context.isPortListened}
                    className="btn btn_secondary"
                >
                    Save
                </button>
                {list}
            </React.Fragment>
        );
    }
}
