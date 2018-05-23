import { InternalSensor } from "../../sensors";

export type WxyzInterface = Array<{
    time: number;
    Wxr: number;
    Wyr: number;
    Wzr: number;
}>;

const derivate = () => {
    let prevU = 0;

    return (dataU: number, time: number) => {
        const deltaU = dataU - prevU;

        prevU = dataU;

        return deltaU / time;
    }
}

export function EulerKrylovRecalcUnit(data: Array<InternalSensor>): WxyzInterface {
    const xDerivate = derivate();
    const yDerivate = derivate();
    const zDerivate = derivate();

    return data.map(({ time, axis }) => {
        const xDerivateResult = xDerivate(axis.x, time);
        const yDerivateResult = yDerivate(axis.y, time);
        const zDerivateResult = zDerivate(axis.z, time);

        return {
            time,
            Wxr: xDerivateResult * Math.sin(axis.y) + zDerivateResult,
            Wyr: Math.cos(axis.y) * xDerivateResult * Math.cos(axis.z) + yDerivateResult * Math.sin(axis.z),
            Wzr: yDerivateResult * Math.cos(axis.z) - xDerivateResult * Math.cos(axis.y) * Math.sin(axis.z)
        }
    });
}
