import { InternalSensor } from "./Sensor";

export class DataRepository {
    public readonly storageId: string;

    private readonly activeRecordLimit: number;
    private activeRecords: Set<InternalSensor> = new Set();

    constructor(activeRecordLimit: number, id: string) {
        this.activeRecordLimit = activeRecordLimit;

        this.storageId = id;
    }

    public put = (data: InternalSensor): void => {
        if (this.activeRecords.size === this.activeRecordLimit) {
            this.activeRecords.delete(Array.from(this.activeRecords)[0]);
        }

        this.activeRecords.add(data);
        this.push(data);
    }

    public get = (): Array<InternalSensor> => {
        return Array.from(this.activeRecords);
    }

    public pull = (): Array<InternalSensor> => {
        return JSON.parse(this.storedData.replace(",]", "]"));
    }

    public clear = (): void => {
        localStorage.removeItem(this.storageId);
    }

    private push = (data: InternalSensor): void => {
        localStorage.setItem(
            this.storageId,
            this.storedData.replace("]", `${JSON.stringify(data)},]`)
        );
    }

    private get storedData(): string {
        return localStorage.getItem(this.storageId) || "[]";
    }
}
