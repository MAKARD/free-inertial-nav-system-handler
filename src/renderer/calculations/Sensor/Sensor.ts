import * as PropTypes from "prop-types";

import { SensorAxis, SensorAxisProps, SensorAxisPropTypes } from "./SensorAxis";
import { SensorRepository } from "../SensorRepository";
import { TypedClass } from "../TypedClass";

export interface SensorProps {
  id: number;
}

export interface SensorDataProps {
  acc: SensorAxisProps;
  gyro: SensorAxisProps;
}

export const SensorPropTypes: {[P in keyof SensorProps]: PropTypes.Validator<any>} = {
  id: PropTypes.number.isRequired
};

export const SensorDataPropTypes: {[P in keyof SensorDataProps]: PropTypes.Validator<any>} = {
  acc: PropTypes.shape(SensorAxisPropTypes).isRequired,
  gyro: PropTypes.shape(SensorAxisPropTypes).isRequired
};

export interface InternalSensor {
  time: number;
  axis: SensorAxis;
}

export class Sensor extends TypedClass {
  public id: number;

  public state: boolean = true;

  public gyroscope: Array<InternalSensor> = [];
  public accelerometer: Array<InternalSensor> = [];

  private attemptsList: Array<boolean> = [];
  private currentAttempt = 0;
  private timeTick = 0;

  constructor(props: SensorProps) {
    super(props, SensorPropTypes);

    this.id = props.id;
    this.attemptsList = (new Array(SensorRepository.readAttemptsCount).fill(true));
  }

  public writeData = (data: SensorDataProps): void | never => {
    this.checkTypes(data, SensorDataPropTypes);

    if (this.state) {
      this.gyroscope.push({ time: this.timeTick, axis: new SensorAxis(data.gyro) });
      this.accelerometer.push({ time: this.timeTick, axis: new SensorAxis(data.acc) });
    }

    this.attemptsList[this.currentAttempt] = true;
    this.interateAtempt();
  }

  public notFound = () => {
    this.attemptsList[this.currentAttempt] = false;

    this.interateAtempt();
  }

  public getPartOfData = (offset: number, limit: number): {
    accelerometer: Array<InternalSensor>,
    gyroscope: Array<InternalSensor>
  } => ({
    accelerometer: this.accelerometer.slice(offset, limit),
    gyroscope: this.gyroscope.slice(offset, limit)
  });

  private interateAtempt = () => {
    if (this.currentAttempt === this.attemptsList.length) {
      this.currentAttempt = 0;
    } else {
      this.currentAttempt++;
    }

    this.state = !this.attemptsList.every((attempt) => !attempt);
    this.timeTick += SensorRepository.readInterval;
  }

}
