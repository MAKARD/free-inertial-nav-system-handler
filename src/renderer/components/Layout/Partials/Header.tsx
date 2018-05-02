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
                <div className="control-menu">
                    <div className="control-menu__item">
                        <DevModeSwitcher >
                            DevMode
                        </DevModeSwitcher>
                    </div>
                </div>
                <div className="control-menu">
                    <div className="control-menu__item">
                        <AvailablePortsList
                            className="btn btn_primary"
                            placeholder="Select port"
                        />
                    </div>
                </div>
                <div className="control-menu">
                    <div className="control-menu__item">
                        <PortsListenControl
                            className="btn btn_primary"
                            stageStartChildren="Start"
                            stageStopChildren="Stop"
                        />
                    </div>
                </div>
                <div className="control-menu">
                    <div className="control-menu__item">
                        <UpdatePortsList className="btn btn_primary">
                            Refresh ports
                        </UpdatePortsList>
                    </div>
                </div>
            </header>
        );
    }
}
