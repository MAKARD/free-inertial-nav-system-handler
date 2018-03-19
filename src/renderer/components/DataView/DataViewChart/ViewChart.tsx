import * as React from "react";
import * as PropTypes from "prop-types";
import { TimeSeries, TimeEvent } from "pondjs";
import { ChartContainer, ChartRow, YAxis, Charts, LineChart } from "react-timeseries-charts";

import { InternalSensor, Sensor } from "../../../calculations";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";

export interface ViewChartProps {
    sensor: Sensor;
    internalSensorName: "accelerometer" | "gyroscope";
}

export const ViewChartPropTypes: {[P in keyof ViewChartProps]: PropTypes.Validator<any>} = {
    sensor: PropTypes.instanceOf(Sensor).isRequired,
    internalSensorName: PropTypes.oneOf(["accelerometer", "gyroscope"]).isRequired
}

export class ViewChart extends React.Component<ViewChartProps> {
    public static readonly contextTypes = LayoutContextTypes;
    public static readonly propTypes = ViewChartPropTypes;
    public readonly context: LayoutContext;

    public render(): React.ReactNode {
        const series = new TimeSeries({
            name: this.props.internalSensorName + this.props.sensor.id,
            events: this.mappedDataAsEvents
        });

        if (!series.range()) {
            return null;
        }

        return (
            <ChartContainer
                timeRange={series.range()}
                format={this.handleFormatTimeAxis}
                width="1000"
                transition={500}
            >
                <ChartRow height="400">
                    <YAxis
                        min={Math.min(series.min("x"), series.min("y"), series.min("z"))}
                        max={Math.max(series.max("x"), series.max("y"), series.max("z"))}
                        type="linear"
                        transition={500}
                        id="y"
                    />
                    <Charts>
                        <LineChart
                            interpolation="curveBasis"
                            columns={["x", "y", "z"]}
                            series={series}
                            axis="y"
                        />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    }

    protected get mappedDataAsEvents(): Array<TimeEvent> {
        return this.props.sensor[this.props.internalSensorName]
            .map(({ time, axis }, i) => new TimeEvent(time, { ...axis }));
    }

    protected handleFormatTimeAxis = (date: Date): string => {
        return `${date.getTime() / 1000}c`
    }
}

