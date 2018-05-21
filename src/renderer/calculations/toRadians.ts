import { SensorAxisProps, SensorDataProps } from "../sensors";

export function toRadians(FK: number) {
    let gx = 0;
    let gy = 0;
    let gz = 0;

    return function (data: SensorDataProps, timeStep: number): SensorAxisProps {
        const { sqrt, atan2 } = Math;
        const { acc, gyro } = data;

        const arx = atan2(acc.x, sqrt(acc.y * acc.y + acc.z * acc.z));
        const ary = atan2(acc.y, sqrt(acc.x * acc.x + acc.z * acc.z));
        const arz = atan2(sqrt(acc.y * acc.y + acc.z * acc.z), 2);

        gx += (timeStep * gyro.x);
        gy += (timeStep * gyro.y);
        gz += (timeStep * gyro.z);

        return {
            x: (FK * arx) + ((1 - FK) * gx),
            y: (FK * ary) + ((1 - FK) * gy),
            z: (FK * arz) + ((1 - FK) * gz)
        };
    }
}
