import * as React from "react";
import { NavLink } from "react-router-dom";

export class Menu extends React.Component {
    public render(): React.ReactNode {
        return (
            <menu className="menu-element">
                <li className="menu-item">
                    <NavLink to="/real-time-chart">
                        Real-time chart
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/orientation-calc">
                        Orientation calculation
                    </NavLink>
                </li>
                <li className="menu-item">
                    <NavLink to="/settings">
                        Settings
                    </NavLink>
                </li>
            </menu>
        );
    }
}
