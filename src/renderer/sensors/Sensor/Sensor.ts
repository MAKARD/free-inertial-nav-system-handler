import * as PropTypes from "prop-types";

import { SensorAxis, SensorAxisProps, SensorAxisPropTypes, Axis, SensorType } from "./SensorAxis";
import { toRadians } from "../../calculations/toRadians";
import { DataRecordControl } from "../DataRecordControl";
import { DataRepository } from "../DataRepository";
import { TypedClass } from "../TypedClass";

export interface SensorProps {
  data: SensorDataProps;
  time: number;
  id: string;
}

export interface SensorDataProps {
  gyro: SensorAxisProps;
  acc: SensorAxisProps;
}

export const SensorDataPropTypes: {[P in keyof SensorDataProps]: PropTypes.Validator<any>} = {
  gyro: PropTypes.shape(SensorAxisPropTypes).isRequired,
  acc: PropTypes.shape(SensorAxisPropTypes).isRequired
};

export const SensorPropTypes: {[P in keyof SensorProps]: PropTypes.Validator<any>} = {
  data: PropTypes.shape(SensorDataPropTypes).isRequired,
  time: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
};

export interface InternalSensor {
  axis: SensorAxis;
  time: number;
}

export class Sensor extends TypedClass {
  public static readonly storageOffsetsKey = "Sensor_offsets";
  public static readonly storageFiltersKey = "Sensor_filters";

  public dataLength: number = 0;
  public state: boolean = true;
  public id: string;
  public complementaryFilterCoefficient;

  public accelerometer: DataRepository;
  public gyroscope: DataRepository;
  public angles: DataRepository;

  public offsets: {[P in keyof typeof SensorType]: {[K in keyof SensorAxisProps]: string | number}};
  private attemptsList: Array<boolean> = [];
  private currentAttempt = 0;
  private getRadiansAngels;
  private timeTick = 0;

  constructor(props: { id: string }) {
    super(props, { id: PropTypes.string.isRequired });

    this.id = props.id;

    let storageOffsetData: {[P in keyof typeof SensorType]: {[K in keyof SensorAxisProps]: string | number}};
    try {
      storageOffsetData = JSON.parse(localStorage.getItem(`${Sensor.storageOffsetsKey}_${this.id}`));
    } catch (error) {
      // ...
    }

    let storageFiltersData: { complementaryFilterCoefficient: number };
    try {
      storageFiltersData = JSON.parse(localStorage.getItem(`${Sensor.storageFiltersKey}_${this.id}`));
    } catch (error) {
      // ...
    }

    if (!storageFiltersData) {
      storageFiltersData = {
        complementaryFilterCoefficient: 0.99
      }
    }

    this.complementaryFilterCoefficient = storageFiltersData.complementaryFilterCoefficient;
    this.getRadiansAngels = toRadians(this.complementaryFilterCoefficient);

    if (!storageOffsetData) {
      storageOffsetData = {
        accelerometer: { x: 0, y: 0, z: 0 },
        gyroscope: { x: 0, y: 0, z: 0 },
        angles: { x: 0, y: 0, z: 0 }
      };
    }

    this.offsets = storageOffsetData;

    this.attemptsList = (new Array(DataRecordControl.readAttemptsCount).fill(true));

    this.accelerometer = new DataRepository(DataRecordControl.activeRecordLimit, `acc_${this.id}`);
    this.gyroscope = new DataRepository(DataRecordControl.activeRecordLimit, `gyro_${this.id}`);
    this.angles = new DataRepository(DataRecordControl.activeRecordLimit, `angles_${this.id}`);
  }

  public saveOffsets = (): void => {
    localStorage.setItem(`${Sensor.storageOffsetsKey}_${this.id}`, JSON.stringify(this.offsets));
  }

  public saveFilters = (): void => {
    localStorage.setItem(`${Sensor.storageFiltersKey}_${this.id}`, JSON.stringify({
      complementaryFilterCoefficient: this.complementaryFilterCoefficient
    }));
  }

  public writeData = (data: SensorDataProps, time: number): void | never => {
    this.checkTypes(data, SensorDataPropTypes);

    this.timeTick += time;

    if (this.state) {
      const composedData = {
        gyro: this.applyOffset(this.offsets.gyroscope, data.gyro),
        acc: this.applyOffset(this.offsets.accelerometer, data.acc)
      };

      this.accelerometer.put({ time: this.timeTick, axis: new SensorAxis(composedData.acc) });
      this.gyroscope.put({ time: this.timeTick, axis: new SensorAxis(composedData.gyro) });

      this.angles.put({
        time: this.timeTick,
        axis: new SensorAxis(this.getRadiansAngels(composedData, time / 1000))
      });

      this.dataLength++;
    }

    this.attemptsList[this.currentAttempt] = true;
    this.interateAtempt();
  }

  public notFound = () => {
    this.attemptsList[this.currentAttempt] = false;

    this.interateAtempt();
  }

  private interateAtempt = () => {
    if (this.currentAttempt === DataRecordControl.readAttemptsCount) {
      this.currentAttempt = 0;
    } else {
      this.currentAttempt++;
    }

    this.state = !this.attemptsList.every((attempt) => !attempt);
  }

  private applyOffset =
    (offsetParams: {[P in keyof SensorAxisProps]: string | number}, data: SensorAxisProps): SensorAxisProps => {
      return {
        x: data.x - Number(offsetParams.x) || 0,
        y: data.y - Number(offsetParams.y) || 0,
        z: data.z - Number(offsetParams.z) || 0
      };
    }
}
