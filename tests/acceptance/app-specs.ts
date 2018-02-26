import { expect } from "chai";
import { Application } from "spectron";

import { ApplicationData } from "./helpers/ApplicationData";

// tslint:disable
describe("Application launch", function() {
    this.timeout(10000);
    let app: Application;

    beforeEach(async () => {
        app = new Application(ApplicationData);
        await app.start();
    })

    afterEach(async () => {
        if (app && app.isRunning()) {
            await app.stop();
        }
    })

    it("Should create one window on start", async () => {
        expect(await app.client.getWindowCount()).to.equals(1);
    })

    it("Should contains `Hello world` on start", async () => {
       await app.client.waitUntilWindowLoaded();
       expect(
           await app.client.$("#content-overlay > span").getText()
        ).to.equal("Hello, World from desktop app!");
    })

});
