import * as PropTypes from "prop-types";

import { SensorAxis, SensorAxisProps, SensorAxisPropTypes } from "./SensorAxis";
import { eulterAngles } from "../../calculations/eulerAngles";
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
  public dataLength: number = 0;
  public state: boolean = true;
  public id: string;

  public accelerometer: DataRepository;
  public gyroscope: DataRepository;
  public angles: DataRepository;

  private attemptsList: Array<boolean> = [];
  private currentAttempt = 0;
  private timeTick = 0;

  private getEulerAngels = eulterAngles(0.5);

  constructor(props: { id: string }) {
    super(props, { id: PropTypes.string.isRequired });

    this.id = props.id;
    this.attemptsList = (new Array(DataRecordControl.readAttemptsCount).fill(true));

    this.accelerometer = new DataRepository(DataRecordControl.activeRecordLimit, `acc_${this.id}`);
    this.gyroscope = new DataRepository(DataRecordControl.activeRecordLimit, `gyro_${this.id}`);
    this.angles = new DataRepository(DataRecordControl.activeRecordLimit, `angles_${this.id}`);
  }

  public writeData = (data: SensorDataProps, time: number): void | never => {
    this.checkTypes(data, SensorDataPropTypes);

    this.timeTick += time;

    if (this.state) {
      this.angles.put({ time: this.timeTick, axis: new SensorAxis(this.getEulerAngels(data, time / 100)) });
      this.accelerometer.put({ time: this.timeTick, axis: new SensorAxis(data.acc) });
      this.gyroscope.put({ time: this.timeTick, axis: new SensorAxis(data.gyro) });
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

}
