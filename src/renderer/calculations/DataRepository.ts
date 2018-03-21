import { InternalSensor } from "./Sensor";

export class DataRepository {
    private readonly activeRecordLimit: number;
    public readonly storageId: string;

    private activeRecords: Array<InternalSensor> = [];

    constructor(activeRecordLimit: number, id: string) {
        this.activeRecordLimit = activeRecordLimit;

        this.storageId = id;
    }

    public findInRange = (minTime: number, maxTime: number, step?: number): Array<InternalSensor> | never => {
        const minTimeIndex = this.getTimeIndex(minTime);
        const maxTimeIndex = this.getTimeIndex(maxTime);

        const rawData = this.pull();
        const composedData = step
            ? rawData.filter(({ time }) => !(time % step))
            : rawData;

        return composedData.slice(minTimeIndex, maxTimeIndex);
    }

    public put = (data: InternalSensor): void => {
        if (this.activeRecords.length === this.activeRecordLimit) {
            this.activeRecords.splice(0, 1);
        }

        this.activeRecords.push(data);
        this.push(data);
    }

    public get = (): Array<InternalSensor> => {
        return this.activeRecords;
    }

    private getTimeIndex(searchTime: number): number | never {
        const founded = this.pull().findIndex(({ time }) => time === searchTime);

        if (founded === -1) {
            throw Error(`Record in time ${searchTime} not found`);
        }

        return founded;
    }

    private push = (data: InternalSensor): void => {
        localStorage.setItem(
            this.storageId,
            this.storedData.replace("]", `${this.pull().length ? "," : ""}${JSON.stringify(data)}]`)
        );
    }

    private pull = (): Array<InternalSensor> => {
        return JSON.parse(this.storedData);
    }

    private get storedData(): string {
        return localStorage.getItem(this.storageId) || "[]";
    }
}
