import * as React from "react";
import { mount } from "enzyme";
import { expect } from "chai";

import { Layout } from "../../src/renderer/components";

describe("<Layout />", () => {
    it("Should render `Hello, World!`", () => {
        const wrapper = mount(
            <Layout />
        );

        expect(wrapper.getDOMNode().innerHTML).to.contain("Hello, World from desktop app!");
    });
});
