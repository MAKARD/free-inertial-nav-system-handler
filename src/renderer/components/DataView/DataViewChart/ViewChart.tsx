import * as React from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Line, ResponsiveContainer } from "recharts";

import { InternalSensor } from "../../../calculations";

export const ViewChart: React.SFC<{ data: Array<InternalSensor> }> = (props): JSX.Element => (
    <ResponsiveContainer width="100%" height="300">
        <LineChart data={props.data} key={props.data.length} >
            <XAxis type="number" dataKey="time" interval="preserveStartEnd" scale="linear"/>
            <YAxis type="number" />
            <CartesianGrid strokeDasharray="3 3" />
            <Line isAnimationActive={false} type="monotone" dataKey="axis.x" stroke="#8884d8" dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="axis.y" stroke="#82ca9d" dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="axis.z" stroke="#d14" dot={false} />
        </LineChart>
    </ResponsiveContainer>
);
