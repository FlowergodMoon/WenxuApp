export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
  type: TransactionType;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface AICategorizationResult {
  amount: number;
  category: string;
  description: string;
  date?: string;
  type: TransactionType;
}