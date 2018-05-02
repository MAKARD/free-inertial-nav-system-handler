import { styler } from "react-timeseries-charts";

import { Axis } from "../../../../sensors";

const colorScheme = {
    [Axis.y]: "#ffff00",
    [Axis.z]: "#dc082e",
    [Axis.x]: "#3bff00"
};

export const lineChartStyle = (): styler => (
    styler(Object.keys(Axis).map((key) => ({ key, color: colorScheme[key], width: 1 })))
)

export const markerLabelStyle = (axis: string) => ({
    fill: colorScheme[axis]
})

export const markerStyle = (axis: string) => ({
    fill: colorScheme[axis]
})
