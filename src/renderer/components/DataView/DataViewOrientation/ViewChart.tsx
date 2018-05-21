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

import { InternalSensor, Sensor, Axis, SensorAxisProps } from "../../../sensors";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";
import { Legend } from "./Legend";

import { markerStyle, markerLabelStyle, lineChartStyle } from "../DataViewChart/helpers/stylers";
import { handleFormatTimeAxis, legendCategories, getMappedDataAsEvents } from "../DataViewChart/helpers/methods";

ChartRow.propTypes.trackerTimeFormat = PropTypes.any;
ChartRow.propTypes.timeFormat = PropTypes.any;

export interface ViewChartProps {
    sensor: Array<{ axis: SensorAxisProps; time: number }>
}

export interface ViewChartState {
    timeRange?: TimeRange;
    tracker?: {
        get: (key: string) => number;
        timestamp: () => Date;
    };
}

export class ViewChart extends React.Component<ViewChartProps, ViewChartState> {
    public static readonly contextTypes = LayoutContextTypes;

    public series = new TimeSeries({
        name: "orientation",
        events: [],
    });

    public readonly context: LayoutContext;

    public readonly state: ViewChartState = {
        timeRange: this.series.range()
    };

    public componentDidMount() {
        this.generateTimeSeries(this.props.sensor);
    }

    public componentWillReceiveProps(nextProps) {
        this.generateTimeSeries(nextProps.sensor);
    }

    public render(): React.ReactNode {
        if (!this.state.timeRange) {
            return <span>No data provided</span>;
        }

        return (
            <React.Fragment>
                <div className="legend-wrap">
                    <Legend axis={["x", "y", "z"]} />
                </div>
                <Resizable className="chart">
                    <ChartContainer
                        onTimeRangeChanged={this.handleTimeRangeChange}
                        onTrackerChanged={this.handleTrackerChanged}
                        enablePanZoom={!this.context.isPortListened}
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
                                    columns={["x", "y", "z"]}
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

    protected generateTimeSeries = (sensor): void => {
        this.series = new TimeSeries({
            name: "orientation",
            events: getMappedDataAsEvents(sensor as any)
        });

        this.setState({
            timeRange: this.series.range(),
        });
    }

    protected getTrackerInfo = (axis: string): string => (
        `[${this.state.tracker.timestamp().getTime() / 1000}c / ${this.state.tracker.get(axis)}]`
    );

    protected getAxisYLimit = (type: "min" | "max"): number => (
        Math[type].apply(Math, ["x", "y", "z"].map((axis) => this.series[type](axis)))
    )

    protected handleTimeRangeChange = (timeRange): void => this.setState({ timeRange });

    protected handleTrackerChanged = (time: Date): void => {
        if (!time) {
            return this.state.tracker && this.setState({ tracker: undefined });
        }

        this.setState({ tracker: this.series.atTime(time) });
    }

    protected get EventMarkers(): Array<JSX.Element> {
        return ["x", "y", "z"].map((axis) => (
            <EventMarker
                markerLabel={this.state.tracker && this.getTrackerInfo(axis)}
                markerLabelStyle={markerLabelStyle(axis)}
                markerStyle={markerStyle(axis)}
                event={this.state.tracker}
                markerLabelAlign="top"
                markerRadius={4}
                column={axis}
                type="point"
                key={axis}
                axis="y"
            />
        ));
    }
}
