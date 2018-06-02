import { SensorAxisProps } from "../../sensors";

type SensorData = Array<{ axis: SensorAxisProps; time: number }>;

export function DeltaCalcUnit(actual: SensorData, reference: SensorData): SensorData {
    return actual.map(({ axis, time }, i) => ({
        axis: {
            x: Math.abs(axis.x) - Math.abs(reference[i].axis.x),
            y: Math.abs(axis.y) - Math.abs(reference[i].axis.y),
            z: Math.abs(axis.z) - Math.abs(reference[i].axis.z)
        },
        time
    }));
}
