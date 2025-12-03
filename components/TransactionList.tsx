import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { ALL_CATEGORIES } from '../constants';
import { Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    transactions.forEach(t => {
      const dateKey = t.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    // Sort dates descending
    return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  }, [transactions]);

  const getCategoryIcon = (catName: string) => {
    const cat = ALL_CATEGORIES.find(c => c.name === catName);
    return cat ? cat.icon : '📝';
  };
  
  const getCategoryColor = (catName: string) => {
     const cat = ALL_CATEGORIES.find(c => c.name === catName);
     return cat ? cat.color : 'bg-gray-100 text-gray-600';
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <div className="text-4xl mb-4">🍃</div>
        <p>暂无账单，快去记一笔吧！</p>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-6">
      {groupedTransactions.map(([date, txs]) => (
        <div key={date}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
            {new Date(date).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {txs.map((tx) => (
              <div key={tx.id} className="group flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${getCategoryColor(tx.category)}`}>
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{tx.category}</p>
                    <p className="text-sm text-gray-500 max-w-[150px] truncate">{tx.description || '无备注'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${tx.type === 'expense' ? 'text-gray-900' : 'text-emerald-600'}`}>
                    {tx.type === 'expense' ? '-' : '+'} {tx.amount.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => onDelete(tx.id)}
                    className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
