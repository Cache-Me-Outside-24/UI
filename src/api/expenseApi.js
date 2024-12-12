const EXPENSE_SERVICE_API_BASE_URL =
  process.env.REACT_APP_EXPENSE_SERVICE_API_BASE_URL;

export async function createExpense(expense, splits) {
  try {
    console.log("Payload sent to API:", { expense, splits });
    const response = await fetch(`${EXPENSE_SERVICE_API_BASE_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expense, splits }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to create expense. Status: ${response.status}, Error: ${errorDetails.detail}`
      );
    }

    const data = await response.json();
    console.log("Expense created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}

export async function createExpenseAndGroup(expense, splits) {
  try {
    console.log("Payload sent to API:", { expense, splits });
    const response = await fetch(
      `${EXPENSE_SERVICE_API_BASE_URL}/expenses/create_expense_and_group`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expense, splits }),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Failed to create expense. Status: ${response.status}, Error: ${errorDetails.detail}`
      );
    }

    const data = await response.json();
    console.log("Expense created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}
