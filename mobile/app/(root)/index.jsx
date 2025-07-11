import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SignOutButton } from "../../components/SignOutButton";
import { useEffect } from "react";
import { useTransactions } from "../../hooks/useTransaction";

export default function Page() {
  const { user } = useUser();

  const { summary, transactions, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("User ID:", user.id);

  console.log("Transactions:", transactions);
  console.log("Summary:", summary);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text>Balance: {summary.balance}</Text>
        <Text>Income: {summary.income}</Text>
        <Text>Expense: {summary.expense}</Text>
        <Text>Transactions: {transactions.length}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
