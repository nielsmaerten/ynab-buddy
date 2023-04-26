import * as ynab from "ynab";

export default async function loadCategories(API: ynab.api) {
    // Get a list of all budget ids
    const response = await API.budgets.getBudgets();
    const budgetIds = response.data.budgets.map((b) => b.id);

    // For each budget, get a list of all categories
    for (const budgetId of budgetIds) {
        const response = await API.categories.getCategories(budgetId);
        const categories = response.data.category_groups;
        debugger;
    }


    return response;
}