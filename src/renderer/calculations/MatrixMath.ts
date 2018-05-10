import { SensorAxisProps } from "../sensors";

export interface Row3 {
    c1: number;
    c2: number;
    c3: number;
}

export interface Column3 {
    r1: number;
    r2: number;
    r3: number;
}

export interface Matrinx3d {
    r1: Row3;
    r2: Row3;
    r3: Row3;
}

export class MatrixMath {
    public static createColumnVector(x: number, y: number, z: number): Column3 {
        return {
            r1: x,
            r2: y,
            r3: z
        };
    }

    public static directionalCosines(angle: number): { RX: Matrinx3d; RY: Matrinx3d; RZ: Matrinx3d } {
        return {
            RX: {
                r1: { c1: 1, c2: 0, c3: 0 },
                r2: { c1: 0, c2: Math.cos(angle), c3: -Math.sin(angle) },
                r3: { c1: 0, c2: Math.sin(angle), c3: Math.cos(angle) }
            },
            RY: {
                r1: { c1: Math.cos(angle), c2: 0, c3: Math.sin(angle) },
                r2: { c1: 0, c2: 1, c3: 0 },
                r3: { c1: -Math.sin(angle), c2: 0, c3: Math.cos(angle) }
            },
            RZ: {
                r1: { c1: Math.cos(angle), c2: -Math.sin(angle), c3: 0 },
                r2: { c1: Math.sin(angle), c2: Math.cos(angle), c3: 0 },
                r3: { c1: 0, c2: 0, c3: 1 }
            }
        }
    }

    public static rotateVector(matrix: Matrinx3d, vector: Column3): Column3 {
        const resultColumnVector = { r1: 0, r2: 0, r3: 0 };

        Object.keys(matrix).forEach((row) => {
            resultColumnVector[row] = Object.keys(matrix[row]).reduce((prev, column, i) => {
                return prev + matrix[row][column] * vector[`r${i + 1}`];
            }, 0);
        });

        return resultColumnVector;
    }

    public static toAngles(columnVector: Column3): SensorAxisProps {
        return {
            x: columnVector.r1,
            y: columnVector.r2,
            z: columnVector.r3
        };
    }
}
