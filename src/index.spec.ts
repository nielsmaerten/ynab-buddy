import { Configuration } from "./types";

let isFirstRun: any = "";
let getConfiguration_mock: jest.Mock;
const displayWelcomeMessage_mock = jest.fn();
const exit_mock = jest.fn();
const askImportFolder_mock = jest.fn()

describe("index.ts", () => {
  beforeEach(() => {
    jest.mock("./lib/configurator", () => {
      getConfiguration_mock = jest.fn().mockReturnValue({
        isFirstRun,
        importFolder: {
          exists: false,
        },
      } as Configuration);
      return {
        getConfiguration: getConfiguration_mock,
      };
    });
    jest.mock("./lib/cli", () => {
      return {
        displayWelcomeMessage: displayWelcomeMessage_mock,
        askImportFolder: askImportFolder_mock
      };
    });
    jest.mock("process", () => {
      return {
        exit: exit_mock,
      };
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("gets configuration", () => {
    require("./index");
    expect(getConfiguration_mock).toHaveBeenCalled();
  });

  it("displays welcome message and exits if firstRun is true", () => {
    isFirstRun = true;
    jest.resetModules();
    require("./index");
    expect(displayWelcomeMessage_mock).toHaveBeenCalledWith(isFirstRun);
    expect(exit_mock).toHaveBeenCalled();
  });

  it("displays welcome message and does not exit if firstRun is false", () => {
    isFirstRun = false;
    jest.resetModules();
    require("./index");
    expect(displayWelcomeMessage_mock).toHaveBeenCalledWith(isFirstRun);
    expect(exit_mock).not.toHaveBeenCalled();
  });

  it("asks for an import folder if no default given", () => {
    // TODO
  })
});
