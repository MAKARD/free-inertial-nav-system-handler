import * as React from "react";

import {
    AvailablePortsList,
    PortsListenControl,
    UpdatePortsList,
    DevModeSwitcher
} from "../../PortsControl";

export class Header extends React.Component {
    public render(): React.ReactNode {
        return (
            <header>
                <span>Available ports </span>
                <AvailablePortsList />
                <PortsListenControl
                    stageStartChildren={"start listen"}
                    stageStopChildren={"stop listen"}
                />
                <UpdatePortsList>
                    Refresh ports list
                </UpdatePortsList>
                <span>devMode</span>
                <DevModeSwitcher
                    stageStartChildren={"on"}
                    stageStopChildren={"off"}
                />
            </header>
        );
    }
}
