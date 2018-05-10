import { TimeEvent } from "pondjs";

import { Axis, InternalSensor } from "../../../../sensors";

export const legendCategories = (axistState: { [key: string]: boolean }):
    Array<{ label: string; key: string }> => (
        Object.keys(Axis).map((key) => ({
            label: key,
            disabled: axistState[key],
            key
        }))
    )

export const getMappedDataAsEvents = (sensorData: Array<InternalSensor>): Array<TimeEvent> => (
    sensorData.map(({ time, axis }) => {
        return new TimeEvent(time, { ...axis });
    })
)

export const handleFormatTimeAxis = (date: Date): string => `${date.getTime() / 1000}c`;
