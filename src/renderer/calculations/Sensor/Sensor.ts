import * as PropTypes from "prop-types";

import { SensorAxis, SensorAxisProps, SensorAxisPropTypes } from "./SensorAxis";
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

export class Sensor extends TypedClass {
  public id: number;

  public gyroscope: Array<SensorAxis> = [];
  public accelerometer: Array<SensorAxis> = [];

  constructor(props: SensorProps) {
    super(props, SensorPropTypes);

    this.id = props.id;
  }

  public writeData = (data: SensorDataProps): void | never => {
    this.checkTypes(data, SensorDataPropTypes);

    this.gyroscope.push(new SensorAxis(data.gyro));
    this.accelerometer.push(new SensorAxis(data.acc));
  }

  public getPartOfData = (offset: number, limit: number): {
    accelerometer: Array<SensorAxisProps>,
    gyroscope: Array<SensorAxisProps>
  } => ({
    accelerometer: this.accelerometer.slice(offset, limit),
    gyroscope: this.gyroscope.slice(offset, limit)
  });

}
