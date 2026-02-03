export interface Transaction {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string; // Denormalized for easier display
  amount: number;
  date: string;
  type: 'expense' | 'income';
  icon: string;
  iconColor: string;
  paymentMethod: string;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
}

export interface UserProfile {
  id: string;
  name: string;
  color: string; // Tailwind bg class for avatar
  textColor: string; // Tailwind text class
}

export interface ChartData {
  name: string;
  value: number;
}

export enum Tab {
  HOME = 'home',
  BUDGET = 'budget',
  TRANSACTIONS = 'transactions',
  CARDS = 'cards',
  PROFILE = 'profile',
}