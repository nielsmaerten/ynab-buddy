import { getConfiguration } from "./configuration";

describe("Configurator", () => {
  it("returns config object", () => {
    const config = getConfiguration();
    expect(config).toBeDefined();
  });
});
