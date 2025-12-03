import { Category } from './types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: '餐饮', icon: '🍔', color: 'bg-orange-100 text-orange-600', type: 'expense' },
  { id: 'transport', name: '交通', icon: '🚗', color: 'bg-blue-100 text-blue-600', type: 'expense' },
  { id: 'shopping', name: '购物', icon: '🛍️', color: 'bg-pink-100 text-pink-600', type: 'expense' },
  { id: 'entertainment', name: '娱乐', icon: '🎮', color: 'bg-purple-100 text-purple-600', type: 'expense' },
  { id: 'housing', name: '居住', icon: '🏠', color: 'bg-indigo-100 text-indigo-600', type: 'expense' },
  { id: 'medical', name: '医疗', icon: '💊', color: 'bg-red-100 text-red-600', type: 'expense' },
  { id: 'other_expense', name: '其他', icon: '📝', color: 'bg-gray-100 text-gray-600', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: '工资', icon: '💰', color: 'bg-green-100 text-green-600', type: 'income' },
  { id: 'bonus', name: '奖金', icon: '💎', color: 'bg-emerald-100 text-emerald-600', type: 'income' },
  { id: 'investment', name: '理财', icon: '📈', color: 'bg-cyan-100 text-cyan-600', type: 'income' },
  { id: 'other_income', name: '其他', icon: '🧧', color: 'bg-gray-100 text-gray-600', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const GEMINI_MODEL_FLASH = 'gemini-2.5-flash';
