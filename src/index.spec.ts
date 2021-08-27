const getConfiguration_mock = jest
  .fn()
  .mockReturnValue({ showConfigPrompt: true });
const displayWelcomeMessage_mock = jest.fn();
const exit_mock = jest.fn();

// TODO: Next steps:
/*
These tests have to be implemented:
- Define more mocks so that we can test all code currently in src/index.ts
- Ensure all 3 test cases properly validate what they're describing, and make them green
*/
describe("index.ts", () => {
  beforeAll(() => {
    jest.mock("./lib/configurator", () => {
      return {
        getConfiguration: getConfiguration_mock,
      };
    });
  });
  it("gets configuration", () => {
    require("./index");
    expect(getConfiguration_mock).toHaveBeenCalled();
  });

  it("displays welcome message according to firstRun", () => {
    //expect(displayWelcomeMessage_mock).toHaveBeenCalled();
  });

  it("exits if firstRun is true", () => {
    //expect(exit_mock).toHaveBeenCalled();
  });
});
