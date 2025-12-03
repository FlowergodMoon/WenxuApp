import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, List as ListIcon, Wallet } from 'lucide-react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Transaction } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';

const App: React.FC = () => {
  // Persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('wenxuji_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'list'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize status bar
  useEffect(() => {
    const initStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch (error) {
          console.error('Status bar configuration error:', error);
        }
      }
    };
    initStatusBar();
  }, []);

  useEffect(() => {
    localStorage.setItem('wenxuji_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (confirm('确定删除这条记录吗？')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="app-container">
      {/* Header - Absolutely fixed at top */}
      <header className="app-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">文须记</h1>
            <p className="text-xs text-gray-500">WenXuJi</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Current Balance</p>
          <p className="font-bold text-gray-800">
            ¥{transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0).toFixed(2)}
          </p>
        </div>
      </header>

      {/* Main Content - Scrollable area between header and nav */}
      <main className="app-main">
        <div className="max-w-2xl mx-auto p-4 pb-8">
          {currentView === 'dashboard' ? (
            <Dashboard transactions={transactions} />
          ) : (
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          )}
        </div>
      </main>

      {/* Bottom Navigation - Absolutely fixed at bottom */}
      <nav className="app-nav">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutDashboard size={24} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">概览</span>
          </button>

          <div className="w-12"></div> {/* Spacer for FAB */}

          <button
            onClick={() => setCurrentView('list')}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${currentView === 'list' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ListIcon size={24} strokeWidth={currentView === 'list' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">明细</span>
          </button>
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="app-fab">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 bg-gray-900 hover:bg-black text-white rounded-full shadow-xl shadow-gray-400/50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddTransaction onAdd={addTransaction} onClose={() => setIsAddModalOpen(false)} />
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* 应用容器 - 完全固定 */
        .app-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #f8fafc;
          color: #0f172a;
          font-family: 'Noto Sans SC', sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* 头部 - 固定高度，不参与滚动 */
        .app-header {
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 100;
          padding: calc(env(safe-area-inset-top, 0px) + 1rem) 1.5rem 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* 主内容区域 - 可滚动，带回弹效果 */
        .app-main {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* 底部导航 - 固定高度，不参与滚动 */
        .app-nav {
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid #f1f5f9;
          z-index: 100;
          padding: 0.5rem 1.5rem calc(env(safe-area-inset-bottom, 20px)) 1.5rem;
        }

        /* 浮动按钮 */
        .app-fab {
          position: fixed;
          right: 1.5rem;
          bottom: calc(env(safe-area-inset-bottom, 20px) + 5.5rem);
          z-index: 90;
        }

        @media (min-width: 768px) {
          .app-fab {
            right: calc(50% - 300px);
          }
        }
      `}</style>
    </div>
  );
};

export default App;
