import * as ynab from "ynab";
import { Configuration } from "../types";
import { collectStats } from "./stats";
import { UPDATE_CHECK_URL } from "../constants";

jest.mock("ynab");

// Mock some sample data
const budgetMockData = {
  data: {
    budgets: [
      { id: "1", name: "Budget 1" },
      { id: "2", name: "Budget 2" },
    ],
  },
};

const categoryMockData = {
  data: {
    category_groups: ["Category 1", "Category 2"],
  },
};

const mockAPI = {
  budgets: {
    getBudgets: jest.fn().mockResolvedValue(budgetMockData),
  },
  categories: {
    getCategories: jest.fn().mockResolvedValue(categoryMockData),
  },
};

(global as any).fetch = jest.fn();

beforeEach(() => {
  (ynab.API as jest.Mock).mockClear();
  (ynab.API as jest.Mock).mockImplementation(() => mockAPI);
  (global as any).fetch.mockClear();
  mockAPI.budgets.getBudgets.mockClear();
  mockAPI.categories.getCategories.mockClear();
});

describe("collectStats", () => {
  it("should call YNAB API and POST data to endpoint if stats are allowed", async () => {
    const config = {
      ynab: { token: "token" },
      stats: "true",
    } as Configuration;

    await collectStats(config);
    expect(mockAPI.budgets.getBudgets).toHaveBeenCalled();
    expect((global as any).fetch).toHaveBeenCalledWith(
      UPDATE_CHECK_URL,
      expect.any(Object)
    );
  });

  it("should not call YNAB API if stats are not allowed", async () => {
    const config = {
      ynab: { token: "token" },
      stats: "false",
    } as Configuration;

    await collectStats(config);
    expect(mockAPI.budgets.getBudgets).not.toHaveBeenCalled();
    expect((global as any).fetch).not.toHaveBeenCalled();
  });
});
