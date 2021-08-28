import { Configuration } from "./types";

let isFirstRun = false;
let getConfiguration_mock: jest.Mock;
const displayWelcomeMessage_mock = jest.fn();
const exit_mock = jest.fn();
const askImportFolder_mock = jest.fn()

describe("index.ts", () => {
  beforeEach(() => {
    jest.mock("./lib/configurator", () => {
      getConfiguration_mock = jest.fn().mockReturnValue({
        isFirstRun,
        importPath: '',
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
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("gets configuration", () => {
    require("./index");
    expect(getConfiguration_mock).toHaveBeenCalled();
  });

  it("displays welcome message and exits if firstRun is true", () => {
    isFirstRun = true;
    require("./index");
    expect(displayWelcomeMessage_mock).toHaveBeenCalledWith(isFirstRun);
    expect(exit_mock).toHaveBeenCalled();
  });

  it("displays welcome message and does not exit if firstRun is false", () => {
    isFirstRun = false;
    require("./index");
    expect(displayWelcomeMessage_mock).toHaveBeenCalledWith(isFirstRun);
    expect(exit_mock).not.toHaveBeenCalled();
  });

  it("asks to confirm import folder", () => {
    require('./index');
    expect(askImportFolder_mock).toHaveBeenCalled();
  })
});
