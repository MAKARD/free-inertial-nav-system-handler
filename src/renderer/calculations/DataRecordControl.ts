import { Sensor, SensorProps, SensorDataProps } from "./Sensor";

export interface LostPackage {
    time: string;
    message: string;
}

export class DataRecordControl {
    public static readonly readInterval = 250; // ms
    public static readonly maxSensorsCount = 3;
    public static readonly readAttemptsCount = 4; // 1s: 250ms * 4
    public static readonly activeRecordLimit = 20;

    public sensors: Array<Sensor> = this.emptySensorsArray;
    public lostPackages: Array<LostPackage> = [];

    public getSensorById = (searchId: number): Sensor | never => {
        const founded = this.sensors.find(({ id }) => id === searchId);

        if (!founded) {
            throw Error(`Sensor with id=${searchId} not found`);
        }

        return founded;
    }

    public writeSensorsData = (parsedMessage: Array<SensorProps & { data: SensorDataProps; }>): void | never => {
        this.sensors.forEach((sensor) => {
            const founded = parsedMessage.find((parsedSensor) => parsedSensor.id === sensor.id);

            if (founded) {
                try {
                    sensor.writeData(founded.data);
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
        return (new Array(DataRecordControl.maxSensorsCount))
            .fill({})
            .map((x, i) => new Sensor({ id: i + 1 }));
    }
}
