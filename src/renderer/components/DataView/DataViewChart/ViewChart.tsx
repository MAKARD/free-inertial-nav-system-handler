import * as React from "react";
import * as PropTypes from "prop-types";
import { TimeSeries, TimeEvent, TimeRange } from "pondjs";
import {
    ChartContainer,
    EventMarker,
    LineChart,
    Resizable,
    ChartRow,
    Charts,
    YAxis
} from "react-timeseries-charts";

import { InternalSensor, Sensor, Axis } from "../../../sensors";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";

import { markerStyle, markerLabelStyle, lineChartStyle } from "./helpers/stylers";
import { handleFormatTimeAxis, legendCategories, getMappedDataAsEvents } from "./helpers/methods";
import { Legend } from "./Legend";

ChartRow.propTypes.trackerTimeFormat = PropTypes.any;
ChartRow.propTypes.timeFormat = PropTypes.any;

export interface ViewChartProps {
    sensor: Sensor;
    internalSensorName: "accelerometer" | "gyroscope" | "angles";
}

export const ViewChartPropTypes: {[P in keyof ViewChartProps]: PropTypes.Validator<any>} = {
    sensor: PropTypes.instanceOf(Sensor).isRequired,
    internalSensorName: PropTypes.oneOf(["accelerometer", "gyroscope", "angles"]).isRequired
}

export interface ViewChartState {
    timeRange?: TimeRange;
    activeAxis: {
        [Axis.x]: boolean;
        [Axis.y]: boolean;
        [Axis.z]: boolean;
    };
    tracker?: {
        get: (key: string) => number;
        timestamp: () => Date;
    };
    all: boolean;
}

export class ViewChart extends React.Component<ViewChartProps, ViewChartState> {
    public static readonly contextTypes = LayoutContextTypes;
    public static readonly propTypes = ViewChartPropTypes;

    public series = new TimeSeries({
        name: this.props.internalSensorName + this.props.sensor.id,
        events: [],
    });

    public readonly context: LayoutContext;

    public readonly state: ViewChartState = {
        timeRange: this.series.range(),
        activeAxis: {
            [Axis.x]: true,
            [Axis.y]: true,
            [Axis.z]: true
        },
        all: false
    };

    public componentWillReceiveProps(nextProps: ViewChartProps) {
        if (!this.context.isPortListened) {
            if (!this.state.all) {
                this.series = new TimeSeries({
                    name: this.props.internalSensorName + this.props.sensor.id,
                    events: getMappedDataAsEvents(this.props.sensor[this.props.internalSensorName].pull())
                });

                this.setState({
                    timeRange: this.series.range(),
                    all: true
                });
            }

            if (this.props.internalSensorName === nextProps.internalSensorName) {
                return;
            }
        }

        this.series = new TimeSeries({
            name: this.props.internalSensorName + this.props.sensor.id,
            events: getMappedDataAsEvents(this.props.sensor[this.props.internalSensorName].get())
        });

        this.setState({
            timeRange: this.series.range(),
            all: false
        });
    }

    public componentDidUpdate() {
        dispatchEvent(new Event("resize"));
    }

    public render(): React.ReactNode {
        if (!this.state.timeRange) {
            return <h3>No data provided</h3>;
        }

        return (
            <React.Fragment>
                <div className="legend-wrap">
                    <Legend
                        axis={this.state.activeAxis}
                        onSelectionChange={this.handleActiveAxisChanged}
                    />
                </div>
                <Resizable className="chart">
                    <ChartContainer
                        onTimeRangeChanged={this.handleTimeRangeChange}
                        enablePanZoom={!this.context.isPortListened}
                        onTrackerChanged={this.handleTrackerChanged}
                        minTime={this.series.range().begin()}
                        maxTime={this.series.range().end()}
                        timeRange={this.state.timeRange}
                        format={handleFormatTimeAxis}
                        minDuration={250}
                    >
                        <ChartRow height="400" transition={500}>
                            <YAxis
                                min={this.getAxisYLimit("min")}
                                max={this.getAxisYLimit("max")}
                                transition={250}
                                type="linear"
                                id="y"
                            />
                            <Charts>
                                <LineChart
                                    columns={this.chartColumns}
                                    style={lineChartStyle()}
                                    series={this.series}
                                    axis="y"
                                />
                                {this.EventMarkers}
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
            </React.Fragment>
        );
    }

    protected get chartColumns(): Array<string> {
        return Object.keys(this.state.activeAxis).filter((axis) => this.state.activeAxis[axis]);
    }

    protected getTrackerInfo = (axis: string): string => (
        `[${this.state.tracker.timestamp().getTime() / 1000}c / ${this.state.tracker.get(axis)}]`
    );

    protected getAxisYLimit = (type: "min" | "max"): number => (
        Math[type].apply(Math, this.chartColumns.map((axis) => this.series[type](axis)))
    )

    protected handleTimeRangeChange = (timeRange): void => this.setState({ timeRange });

    protected handleActiveAxisChanged = (axis: string): void => {
        this.state.activeAxis[axis] = !this.state.activeAxis[axis];
        this.forceUpdate();
    }

    protected handleTrackerChanged = (time: Date): void => {
        if (!time) {
            return this.state.tracker && this.setState({ tracker: undefined });
        }

        this.setState({ tracker: this.series.atTime(time) });
    }

    protected get EventMarkers(): Array<JSX.Element> {
        return this.chartColumns.map((axis) => (
            <EventMarker
                markerLabel={this.state.tracker && this.getTrackerInfo(axis)}
                markerLabelStyle={markerLabelStyle(axis)}
                markerStyle={markerStyle(axis)}
                event={this.state.tracker}
                markerLabelAlign="bottom"
                markerRadius={4}
                column={axis}
                type="point"
                key={axis}
                axis="y"
            />
        ));
    }
}
