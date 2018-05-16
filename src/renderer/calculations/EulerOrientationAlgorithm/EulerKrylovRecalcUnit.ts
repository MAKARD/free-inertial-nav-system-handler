import { InternalSensor } from "../../sensors";
import { derivation } from "../derivation";

export interface WxyzInterface {
    Wxr: Array<number>;
    Wyr: Array<number>;
    Wzr: Array<number>;
    time: Array<number>;
}

export function EulerKrylovRecalcUnit(data: Array<InternalSensor>): WxyzInterface {
    const x = data.map(({ axis }) => axis.x);
    const y = data.map(({ axis }) => axis.y);
    const z = data.map(({ axis }) => axis.z);

    const time = data.map((prop) => prop.time);

    const xDerivate = derivation(x, time);
    const yDerivate = derivation(y, time);
    const zDerivate = derivation(z, time);

    return {
        time,
        Wxr: xDerivate.map((xD, i) => xD * Math.sin(y[i]) + zDerivate[i]),
        Wyr: yDerivate.map((yD, i) => Math.cos(y[i]) * xDerivate[i] * Math.cos(z[i]) + yD * Math.sin(z[i])),
        Wzr: z.map((zItem, i) => yDerivate[i] * Math.cos(zItem) - xDerivate[i] * Math.cos(y[i]) * Math.sin(zItem))
    };
}
