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

    return data.map(({ time, Wxr, Wyr, Wzr }, i) => {
        const commonProduct = Wzr * Math.cos(feedback) - Wyr * Math.sin(feedback);
        const x = xIntegrator(Wxr * Math.sin(feedback) + Wyr * Math.cos(feedback), time);

        return {
            time,
            axis: {
                x,
                y: yIntegrator(Math.cos(x) * commonProduct, time),
                z: feedback = zIntegrator(Wzr - Math.tan(x) * commonProduct, time)
            }
        }
    });
}
