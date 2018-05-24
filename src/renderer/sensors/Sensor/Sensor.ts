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

  public dataLength: number = 0;
  public state: boolean = true;
  public id: string;

  public accelerometer: DataRepository;
  public gyroscope: DataRepository;
  public angles: DataRepository;

  public offsets: {[P in keyof typeof SensorType]: {[K in keyof SensorAxisProps]: string | number}};
  private attemptsList: Array<boolean> = [];
  private currentAttempt = 0;
  private timeTick = 0;

  private getRadiansAngels = toRadians(0.05);

  constructor(props: { id: string }) {
    super(props, { id: PropTypes.string.isRequired });

    this.id = props.id;

    let storageData: {[P in keyof typeof SensorType]: {[K in keyof SensorAxisProps]: string | number}};
    try {
      storageData = JSON.parse(localStorage.getItem(`${Sensor.storageOffsetsKey}_${this.id}`));
    } catch (error) {
      // ...
    }

    if (!storageData) {
      storageData = {
        accelerometer: { x: 0, y: 0, z: 0 },
        gyroscope: { x: 0, y: 0, z: 0 },
      };
    }

    this.offsets = storageData;

    this.attemptsList = (new Array(DataRecordControl.readAttemptsCount).fill(true));

    this.accelerometer = new DataRepository(DataRecordControl.activeRecordLimit, `acc_${this.id}`);
    this.gyroscope = new DataRepository(DataRecordControl.activeRecordLimit, `gyro_${this.id}`);
    this.angles = new DataRepository(DataRecordControl.activeRecordLimit, `angles_${this.id}`);
  }

  public saveOffsets = (): void => {
    localStorage.setItem(`${Sensor.storageOffsetsKey}_${this.id}`, JSON.stringify(this.offsets));
  }

  public writeData = (data: SensorDataProps, time: number): void | never => {
    this.checkTypes(data, SensorDataPropTypes);

    this.timeTick += time;

    if (this.state) {
      this.angles.put({ time: this.timeTick, axis: new SensorAxis(this.getRadiansAngels(data, time / 1000)) });
      this.accelerometer.put({
        time: this.timeTick,
        axis: new SensorAxis(this.applyOffset(this.offsets.accelerometer, data.acc))
      });
      this.gyroscope.put({
        time: this.timeTick,
        axis: new SensorAxis(this.applyOffset(this.offsets.gyroscope, data.gyro))
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
