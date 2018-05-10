import { Sensor, SensorProps, SensorDataProps } from "./Sensor";

export interface LostPackage {
    time: string;
    message: string;
}

export class DataRecordControl {
    public static readonly maxSensorsCount = 4;
    public static readonly readAttemptsCount = 4; // ~2s
    public static readonly activeRecordLimit = 40;

    public sensors: Array<Sensor> = this.emptySensorsArray;
    public lostPackages: Array<LostPackage> = [];

    public getSensorById = (searchId: string): Sensor | never => {
        const founded = this.sensors.find(({ id }) => id === searchId);

        if (!founded) {
            throw Error(`Sensor with id=${searchId} not found`);
        }

        return founded;
    }

    public writeSensorsData = (parsedMessage: Array<SensorProps>): void | never => {
        this.sensors.forEach((sensor) => {
            const founded = parsedMessage.find((parsedSensor) => parsedSensor.id === sensor.id);

            if (founded) {
                try {
                    sensor.writeData(founded.data, founded.time);
                } catch (error) {
                    this.writeLostPackage(error);
                }
            } else {
                sensor.notFound();
                this.writeLostPackage(`Sensor with id=${sensor.id} not found`);
            }

            !sensor.state && this.writeLostPackage(`Sensor with id=${sensor.id} is disabled`);
        });
    }

    public writeLostPackage = (message: string): void => {
        this.lostPackages.push({
            time: (new Date()).toLocaleTimeString(),
            message
        });
    }

    private get emptySensorsArray(): Array<Sensor> {
        return [
            new Sensor({ id: "00" }),
            new Sensor({ id: "01" }),
            new Sensor({ id: "10" }),
            new Sensor({ id: "11" })
        ]
    }
}
