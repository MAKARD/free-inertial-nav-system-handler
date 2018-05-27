import * as React from "react";
import * as PropTypes from "prop-types";
import { saveSvgAsPng } from "save-svg-as-png";
import { Tab, Header, TabsController } from "react-expand";

import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";
import { DataRecordContext, DataRecordContextTypes } from "../../DataRecord";
import { SensorType } from "../../../sensors";
import { ViewChart } from "./ViewChart";

export interface DataViewChartState {
    activeInternalSensor: SensorType;
}

export class DataViewChart extends React.Component<{}, DataViewChartState> {
    public static lastActiveSensorId: string;
    public static lastActiveSensorType: SensorType = SensorType.accelerometer;

    public static readonly contextTypes = {
        ...DataRecordContextTypes,
        ...LayoutContextTypes
    };

    public readonly context: DataRecordContext & LayoutContext;
    public readonly state: DataViewChartState = {
        activeInternalSensor: DataViewChart.lastActiveSensorType
    };

    public render(): React.ReactNode {
        return (
            <div className="tabs">
                <TabsController defaultOpened={DataViewChart.lastActiveSensorId}>
                    <this.Headers />
                    <div className="btn-group">
                        <button
                            type="button"
                            onClick={this.handleInternalSensorChange(SensorType.gyroscope)}
                            className={this.getButtonClassName(SensorType.gyroscope)}
                        >
                            Gyroscope
                        </button>
                        <button
                            type="button"
                            onClick={this.handleInternalSensorChange(SensorType.accelerometer)}
                            className={this.getButtonClassName(SensorType.accelerometer)}
                        >
                            Accelerometer
                        </button>
                        <button
                            type="button"
                            onClick={this.handleInternalSensorChange(SensorType.angles)}
                            className={this.getButtonClassName(SensorType.angles)}
                        >
                            Angles
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={this.handleSave}
                        className="btn btn_secondary right"
                        disabled={this.context.isPortListened}
                    >
                        Save
                    </button>
                    <this.Tabs />
                </TabsController>
            </div>
        );
    }

    protected getButtonClassName = (name: DataViewChartState["activeInternalSensor"]): string => {
        return `btn btn_primary${this.state.activeInternalSensor === name ? " active" : ""}`;
    }

    protected handleSave = (): void => {
        const element = document.querySelector(".chart > svg");
        const date = new Date();
        element && saveSvgAsPng(
            element,
            `diagram-${date.toLocaleDateString()}-${date.toLocaleTimeString()}.png`
        );
    }

    protected handleInternalSensorChange = (name: DataViewChartState["activeInternalSensor"]) => (): void => {
        DataViewChart.lastActiveSensorType = name;
        this.setState({
            activeInternalSensor: name
        });
    }

    protected Headers: React.SFC<{}> = (): JSX.Element => {
        const list = this.context.activeSensorsList.map(({ id }) => (
            <Header
                onClick={this.getHandleHeaderTabClick(`sensor_view_chart_${id}`)}
                className="header-item btn btn_secondary"
                expandId={`sensor_view_chart_${id}`}
                activeClassName="active"
                key={id}
            >
                Sensor {id}
            </Header>
        ));

        return (
            <div className="tabs-header">
                {list}
            </div>
        );
    }

    protected Tabs: React.SFC<{}> = (): JSX.Element => {
        const list = this.context.activeSensorsList.map((sensor) => (
            <Tab className="chart-wrap" expandId={`sensor_view_chart_${sensor.id}`} key={sensor.id}>
                <ViewChart sensor={sensor} internalSensorName={this.state.activeInternalSensor} />
            </Tab>
        ));

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }

    private getHandleHeaderTabClick = (id: string) => () => {
        DataViewChart.lastActiveSensorId = id;
    }
}
