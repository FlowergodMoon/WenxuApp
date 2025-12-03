import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Transaction, MonthlyStats } from '../types';
import { ALL_CATEGORIES } from '../constants';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#ec4899', '#10b981', '#ef4444', '#6b7280'];

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const stats: MonthlyStats = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += curr.amount;
      } else {
        acc.totalExpense += curr.amount;
      }
      acc.balance = acc.totalIncome - acc.totalExpense;
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: 0 });
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const groups: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });
    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      setLoadingAdvice(true);
      getFinancialAdvice(transactions)
        .then(setAdvice)
        .catch(() => setAdvice('无法连接智能助手'))
        .finally(() => setLoadingAdvice(false));
    }
  }, [transactions.length]); // Only refresh advice when transaction count changes significantly (naive check)

  return (
    <div className="pb-24 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-emerald-600 text-sm font-medium mb-1">本月收入</p>
          <p className="text-2xl font-bold text-emerald-700">¥{stats.totalIncome.toFixed(0)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
          <p className="text-red-600 text-sm font-medium mb-1">本月支出</p>
          <p className="text-2xl font-bold text-red-700">¥{stats.totalExpense.toFixed(0)}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wide font-medium mb-1">总结余</p>
          <p className={`text-4xl font-extrabold ${stats.balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
             ¥{stats.balance.toFixed(2)}
          </p>
      </div>

      {/* AI Advice */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="flex items-center gap-2 mb-3">
           <Sparkles size={18} className="text-yellow-300" />
           <h3 className="font-bold text-sm uppercase tracking-wide">文须记 AI 简报</h3>
        </div>
        <p className="text-sm leading-relaxed opacity-90">
          {loadingAdvice ? "正在分析您的消费习惯..." : (advice || "暂无足够数据进行分析。")}
        </p>
      </div>

      {/* Charts */}
      {expenseByCategory.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">支出构成</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
             {expenseByCategory.slice(0, 4).map((item, idx) => (
               <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                 {item.name} {((item.value / stats.totalExpense) * 100).toFixed(0)}%
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
