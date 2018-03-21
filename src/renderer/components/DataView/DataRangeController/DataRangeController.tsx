import * as React from "react";
import * as PropTypes from "prop-types";

import { DataRangeControllerContextTypes, DataRangeControllerContext } from "./DataRangeConrollerContext";
import { DataViewProviderContextTypes, DataViewProviderContext } from "../DataViewProviderContext";
import { LayoutContextTypes, LayoutContext } from "../../Layout/LayoutContext";

export interface DataRangeControllerState {
    step: number;
    minTime: number;
    maxTime?: number;
}

export class DataRangeController extends React.Component<{}, DataRangeControllerState> {
    public static readonly childContextTypes = DataRangeControllerContextTypes;
    public static readonly contextTypes = {
        ...DataViewProviderContextTypes,
        ...LayoutContextTypes
    };

    public readonly context: DataViewProviderContext & LayoutContext;
    public readonly state: DataRangeControllerState = {
        step: 250,
        minTime: 0
    };
    
    public getChildContext(): DataRangeControllerContext {
        return {
            sensors: this.context.activeSensorsList
            .map(({id, gyroscope, accelerometer}) => ({
                id,
                gyroscope: gyroscope.findInRange(this.state.minTime, this.state.maxTime, this.state.maxTime),
                accelerometer: gyroscope.findInRange(this.state.minTime, this.state.maxTime, this.state.maxTime),
            }))
        }
    }

    public render(): React.ReactNode {
        return (
            <div>

            </div>
        );
    }

    private get searchData() {
        const maxTime = this.state.maxTime > 
    }
    
}