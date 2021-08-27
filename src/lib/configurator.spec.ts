import { getConfiguration } from "./configurator"

describe("Configurator", () => {
    it("returns config object", () => {
        const config = getConfiguration();
        expect(config).toBeDefined();
    })
})