import * as React from "react";

import { LayoutProps, LayoutPropTypes } from "./LayoutProps"

export class Layout extends React.Component<LayoutProps> {
    public static propTypes = LayoutPropTypes;

    public render(): JSX.Element {
        return <span>Hello, World from desktop app!</span>;
    }
}
