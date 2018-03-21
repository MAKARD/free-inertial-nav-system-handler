import * as React from "react";
import * as PropTypes from "prop-types";
import { TimeSeries, TimeEvent, TimeRange } from "pondjs";
import {
    ChartContainer,
    EventMarker,
    LineChart,
    Resizable,
    ChartRow,
    Legend,
    Charts,
    styler,
    YAxis
} from "react-timeseries-charts";

import { InternalSensor, Sensor, Axis } from "../../../calculations";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";

export interface ViewChartProps {
    sensor: Sensor;
    internalSensorName: "accelerometer" | "gyroscope";
}

export const ViewChartPropTypes: {[P in keyof ViewChartProps]: PropTypes.Validator<any>} = {
    sensor: PropTypes.instanceOf(Sensor).isRequired,
    internalSensorName: PropTypes.oneOf(["accelerometer", "gyroscope"]).isRequired
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
}

export class ViewChart extends React.Component<ViewChartProps, ViewChartState> {
    public static readonly contextTypes = LayoutContextTypes;
    public static readonly propTypes = ViewChartPropTypes;
    public static readonly colorScheme = {
        [Axis.y]: "green",
        [Axis.z]: "blue",
        [Axis.x]: "red"
    };

    public series = new TimeSeries({
        name: this.props.internalSensorName + this.props.sensor.id,
        events: this.mappedDataAsEvents
    });

    public readonly context: LayoutContext;

    public readonly state: ViewChartState = {
        timeRange: this.series.range(),
        activeAxis: {
            [Axis.x]: true,
            [Axis.y]: true,
            [Axis.z]: true
        }
    };

    public componentWillReceiveProps() {
        if (!this.context.isPortListened) {
            return;
        }

        this.series = new TimeSeries({
            name: this.props.internalSensorName + this.props.sensor.id,
            events: this.mappedDataAsEvents
        });

        this.setState({ timeRange: this.series.range() });
    }

    public render(): React.ReactNode {
        if (!this.state.timeRange) {
            return null;
        }

        return (
            <React.Fragment>
                <Legend
                    onSelectionChange={this.handleActiveAxisChanged}
                    categories={this.legendCategories}
                    style={this.legendStyle}
                />
                <Resizable className="chart">
                    <ChartContainer
                        onTimeRangeChanged={this.handleTimeRangeChange}
                        enablePanZoom={!this.context.isPortListened}
                        onTrackerChanged={this.handleTrackerChanged}
                        minTime={this.series.range().begin()}
                        maxTime={this.series.range().end()}
                        format={this.handleFormatTimeAxis}
                        timeRange={this.state.timeRange}
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
                                    style={this.lineChartStyle}
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

    protected get legendCategories(): Array<{ label: string; key: string }> {
        return Object.keys(Axis).map((key) => ({ label: `axis ${key}`, key }));
    }

    protected get legendStyle(): styler {
        return styler(Object.keys(Axis).map((key) => ({ key, color: ViewChart.colorScheme[key], width: 1 })));
    }

    protected get chartColumns(): Array<string> {
        return Object.keys(this.state.activeAxis).filter((axis) => this.state.activeAxis[axis]);
    }

    protected get lineChartStyle(): styler {
        return styler(Object.keys(Axis).map((key) => ({ key, color: ViewChart.colorScheme[key], width: 2 })));
    }

    protected get mappedDataAsEvents(): Array<TimeEvent> {
        return this.props.sensor[this.props.internalSensorName]
            .get()
            .map(({ time, axis }, i) => new TimeEvent(time, { ...axis }));
    }

    protected getTrackerInfo = (axis: string): string => (
        `Time: ${this.state.tracker.timestamp().getTime() / 1000}c;
        Value: ${this.state.tracker.get(axis)}`
    );

    protected getAxisYLimit = (type: "min" | "max"): number => (
        Math[type].apply(Math, this.chartColumns.map((axis) => this.series[type](axis)))
    )

    protected handleFormatTimeAxis = (date: Date): string => `${date.getTime() / 1000}c`;

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
                markerLabelStyle={{ fill: ViewChart.colorScheme[axis] }}
                markerStyle={{ fill: ViewChart.colorScheme[axis] }}
                event={this.state.tracker}
                markerLabelAlign="top"
                markerRadius={3}
                column={axis}
                type="point"
                key={axis}
                axis="y"
            />
        ))
    }
}
