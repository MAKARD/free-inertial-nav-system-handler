import "../../styles/main.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { Layout } from "./components";

const container = document.getElementById("content-overlay");

if (!container) {
    // tslint:disable-next-line
    console.error("Can not found element for mounting Layout!");
} else {
    ReactDOM.render(
        <BrowserRouter>
            <Layout />
        </BrowserRouter>,
        container
    );
}
