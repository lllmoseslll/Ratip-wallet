import { useState, useCallback } from "react";
import { Alert } from "react-native";

export const useTransactions = (userId) => {
  const API_URL =
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }
  }, [userId, API_URL]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data); 
    } catch (error) {
      console.log("Error fetching summary:", error);
    }
  }, [userId, API_URL]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete transaction");
        }

        loadData();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        Alert.alert("Error", "Failed to delete transaction");
      }
    },
    [loadData, API_URL]
  );

  return {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction,
  };
};
