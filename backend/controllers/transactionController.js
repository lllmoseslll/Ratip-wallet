import { sql } from "../config/db.js";

export const getTransactions = async (req, res) => {
  try {
    const { user_id } = req.params;
    // console.log("Fetching transactions for user:", user_id);
    const transactions = await sql`
              SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC;
          `;
    return res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const { user_id } = req.params;

    const balanceResult = await sql`
           SELECT COALESCE(SUM(amount), 0) AS balance
           FROM transactions
           WHERE user_id = ${user_id};
           `;

    const incomeResult = await sql`
           SELECT COALESCE(SUM(amount), 0) AS income
           FROM transactions
           WHERE user_id = ${user_id} AND category = 'income' AND amount > 0;
           `;

    const expenseResult = await sql`
           SELECT COALESCE(SUM(amount), 0) AS expense
           FROM transactions
           WHERE user_id = ${user_id} AND category = 'expense' AND amount < 0;
           `;

    const summary = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    };

    return res.json(summary);
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const transaction = await sql`
              INSERT INTO transactions (user_id, title, amount, category)
              VALUES (${user_id}, ${title}, ${amount}, ${category})
              RETURNING *;
          `;

    console.log("Transaction created:", transaction[0]);

    return res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Transaction ID is required." });
    }

    const result = await sql`
          DELETE FROM transactions WHERE id = ${id} RETURNING *;
        `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    console.log("Transaction deleted:", result[0]);
    return res.json({
      message: "Transaction deleted",
      data: result[0],
    });
      
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
