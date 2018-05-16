import { WxyzInterface } from "./EulerKrylovRecalcUnit";

import { SensorAxisProps } from "../../sensors";

const integrator = () => {
    let accumulator = 0;

    return (data: number, time: number) => accumulator += (data * time);
}

export function OrientationCalcUnit(data: WxyzInterface): Array<{ axis: SensorAxisProps; time: number }> {
    let feedback = 0;

    const xIntegrator = integrator();
    const yIntegrator = integrator();
    const zIntegrator = integrator();

    return Array(data.time.length)
        .fill({})
        .map(({ }, i) => {
            const commonProduct = data.Wzr[i] * Math.cos(feedback) - data.Wyr[i] * Math.sin(feedback);
            const x = xIntegrator(data.Wxr[i] * Math.sin(feedback) + data.Wyr[i] * Math.cos(feedback), data.time[i]);

            return {
                axis: {
                    x,
                    y: yIntegrator(Math.cos(x[i]) * commonProduct, data.time[i]),
                    z: feedback = zIntegrator(data.Wzr[i] - Math.tan(x[i]) * commonProduct, data.time[i])
                },
                time: data.time[i]
            }
        });
}
