import * as PropTypes from "prop-types";

import { SensorAxis, SensorAxisProps, SensorAxisPropTypes } from "./SensorAxis";
import { DataRecordControl } from "../DataRecordControl";
import { DataRepository } from "../DataRepository";
import { TypedClass } from "../TypedClass";

export interface SensorProps {
  id: number;
}

export interface SensorDataProps {
  acc: SensorAxisProps;
  gyro: SensorAxisProps;
  angles: SensorAxisProps;
}

export const SensorPropTypes: {[P in keyof SensorProps]: PropTypes.Validator<any>} = {
  id: PropTypes.number.isRequired
};

export const SensorDataPropTypes: {[P in keyof SensorDataProps]: PropTypes.Validator<any>} = {
  acc: PropTypes.shape(SensorAxisPropTypes).isRequired,
  gyro: PropTypes.shape(SensorAxisPropTypes).isRequired,
  angles: PropTypes.shape(SensorAxisPropTypes).isRequired
};

export interface InternalSensor {
  time: number;
  axis: SensorAxis;
}

export class Sensor extends TypedClass {
  public id: number;
  public state: boolean = true;
  public dataLength: number = 0;

  public angles: DataRepository;
  public gyroscope: DataRepository;
  public accelerometer: DataRepository;

  private attemptsList: Array<boolean> = [];
  private currentAttempt = 0;
  private timeTick = 0;

  constructor(props: SensorProps) {
    super(props, SensorPropTypes);

    this.id = props.id;
    this.attemptsList = (new Array(DataRecordControl.readAttemptsCount).fill(true));

    this.angles = new DataRepository(DataRecordControl.activeRecordLimit, `angles_${this.id}`);
    this.accelerometer = new DataRepository(DataRecordControl.activeRecordLimit, `acc_${this.id}`);
    this.gyroscope = new DataRepository(DataRecordControl.activeRecordLimit, `gyro_${this.id}`);
  }

  public writeData = (data: SensorDataProps): void | never => {
    this.checkTypes(data, SensorDataPropTypes);

    if (this.state) {
      this.angles.put({ time: this.timeTick, axis: new SensorAxis(data.angles) });
      this.gyroscope.put({ time: this.timeTick, axis: new SensorAxis(data.gyro) });
      this.accelerometer.put({ time: this.timeTick, axis: new SensorAxis(data.acc) });
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
    this.timeTick += DataRecordControl.readInterval;
  }

}
