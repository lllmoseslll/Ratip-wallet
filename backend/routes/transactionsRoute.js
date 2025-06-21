import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionSummary,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/:user_id", getTransactions);

router.get("/summary/:user_id", getTransactionSummary);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

export default router;
