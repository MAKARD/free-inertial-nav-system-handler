import * as React from "react";
import { NavLink } from "react-router-dom";

export class Menu extends React.Component {
    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <NavLink to="/real-time-chart" className="btn btn_secondary">
                    Real-time chart
                </NavLink>
                <NavLink to="/orientation-calc" className="btn btn_secondary">
                    Orientation chart
                </NavLink>
                <NavLink to="/offsets" className="btn btn_secondary">
                    Offsets
                </NavLink>
            </React.Fragment>
        );
    }
}
