import * as React from "react";
import * as PropTypes from "prop-types";
import { LineChart, XAxis, YAxis, CartesianGrid, Line, ResponsiveContainer } from "recharts";

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
    public static readonly range = 80;

    public readonly context: LayoutContext;

    public render(): React.ReactNode {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={this.chartData}
                    key={this.props.sensor[this.props.internalSensorName].length}
                >
                    <XAxis
                        tickCount={ViewChart.range}
                        domain={this.domainData}
                        ticks={this.ticks}
                        scale="linear"
                        dataKey="time"
                        type="number"
                    />
                    <YAxis type="number" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line isAnimationActive={false} type="natural" dataKey="axis.x" stroke="#8884d8" dot={false} />
                    <Line isAnimationActive={false} type="natural" dataKey="axis.y" stroke="#82ca9d" dot={false} />
                    <Line isAnimationActive={false} type="natural" dataKey="axis.z" stroke="#d14" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    protected get chartData(): Array<InternalSensor> {
        const left = this.props.sensor.dataLength - ViewChart.range;
        const offset = left <= 0 ? 0 : left;

        return this.props.sensor.getPartOfData(
            offset, ViewChart.range + offset
        )[this.props.internalSensorName];
    }

    protected get domainData(): Array<string | number> {
        const left = this.props.sensor.dataLength - ViewChart.range;
        const offset = left <= 0 ? 0 : left;

        const limit = ViewChart.range > this.props.sensor.dataLength
            ? this.props.sensor.dataLength
            : ViewChart.range + offset

        return [
            this.internalSensor[offset]
                ? this.internalSensor[offset].time
                : 0,
            this.internalSensor[limit]
                ? this.internalSensor[limit].time
                : "data-max"
        ];
    }

    protected get ticks(): Array<number> {
        return this.chartData.map(({ time }) => time);
    }

    protected get internalSensor(): Array<InternalSensor> {
        return this.props.sensor[this.props.internalSensorName];
    }
}
