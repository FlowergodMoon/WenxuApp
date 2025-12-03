import React, { useState, useRef, useEffect } from 'react';
import { Transaction, TransactionType, AICategorizationResult } from '../types';
import { ALL_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants';
import { parseNaturalLanguageTransaction, analyzeReceiptImage } from '../services/geminiService';
import { Mic, Image as ImageIcon, Send, Check, X, Loader2, Keyboard } from 'lucide-react';

interface AddTransactionProps {
  onAdd: (t: Transaction) => void;
  onClose: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd, onClose }) => {
  const [mode, setMode] = useState<'manual' | 'ai-text' | 'ai-image'>('manual');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  // AI Inputs
  const [aiText, setAiText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default category when type changes
  useEffect(() => {
    const cats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!cats.find(c => c.name === category)) {
      setCategory(cats[0].name);
    }
  }, [type]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description,
      date,
      type,
      createdAt: Date.now(),
    };

    onAdd(newTx);
    onClose();
  };

  const applyAIResult = (result: AICategorizationResult) => {
    setAmount(result.amount.toString());
    setType(result.type);
    setCategory(result.category); // Hope AI matches exact name, else user corrects
    setDescription(result.description);
    if (result.date) setDate(result.date);
    setMode('manual'); // Switch to manual for confirmation
  };

  const handleAITextSubmit = async () => {
    if (!aiText.trim()) return;
    setLoading(true);
    const result = await parseNaturalLanguageTransaction(aiText);
    setLoading(false);
    if (result) applyAIResult(result);
    else alert("无法识别，请重试");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
       const base64 = (reader.result as string).split(',')[1];
       const result = await analyzeReceiptImage(base64);
       setLoading(false);
       if (result) applyAIResult(result);
       else alert("图片分析失败");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto sm:rounded-2xl rounded-t-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
             {mode === 'manual' ? '记一笔' : mode === 'ai-text' ? 'AI 语音/文本' : '小票识别'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex p-2 bg-gray-50 gap-2">
          <button 
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            <Keyboard size={16} /> 普通
          </button>
          <button 
            onClick={() => setMode('ai-text')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'ai-text' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-400'}`}
          >
            <Mic size={16} /> 智能文本
          </button>
          <button 
            onClick={() => setMode('ai-image')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'ai-image' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400'}`}
          >
            <ImageIcon size={16} /> 小票
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="animate-spin mb-4 text-indigo-500" size={48} />
              <p>AI 正在思考中...</p>
            </div>
          ) : mode === 'manual' ? (
             <form id="add-form" onSubmit={handleManualSubmit} className="space-y-5">
               {/* Type Switcher */}
               <div className="flex bg-gray-100 rounded-xl p-1">
                 {(['expense', 'income'] as const).map(t => (
                   <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === t ? (t === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'bg-white text-emerald-500 shadow-sm') : 'text-gray-400'}`}
                   >
                     {t === 'expense' ? '支出' : '收入'}
                   </button>
                 ))}
               </div>

               {/* Amount */}
               <div>
                 <label className="block text-xs text-gray-400 font-medium mb-1 ml-1">金额</label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 font-light">¥</span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-3xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      step="0.01"
                      autoFocus
                    />
                 </div>
               </div>

               {/* Categories Grid */}
               <div>
                 <label className="block text-xs text-gray-400 font-medium mb-2 ml-1">分类</label>
                 <div className="grid grid-cols-4 gap-3">
                   {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                     <button
                       key={cat.id}
                       type="button"
                       onClick={() => setCategory(cat.name)}
                       className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${category === cat.name ? 'bg-indigo-50 ring-2 ring-indigo-500 ring-inset' : 'bg-gray-50 hover:bg-gray-100'}`}
                     >
                       <div className="text-2xl mb-1">{cat.icon}</div>
                       <div className={`text-xs font-medium ${category === cat.name ? 'text-indigo-700' : 'text-gray-500'}`}>{cat.name}</div>
                     </button>
                   ))}
                 </div>
               </div>

               {/* Details */}
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1 ml-1">日期</label>
                    <input 
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
                 <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1 ml-1">备注</label>
                    <input 
                      type="text"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="例如：午饭"
                      className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
               </div>
             </form>
          ) : mode === 'ai-text' ? (
            <div className="h-full flex flex-col">
               <textarea 
                 className="w-full flex-1 bg-gray-50 rounded-xl p-4 text-lg text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                 placeholder="输入一段话，例如：&#10;'今天中午吃了麦当劳花了45元'&#10;'收到工资20000元'"
                 value={aiText}
                 onChange={e => setAiText(e.target.value)}
               />
               <button 
                 onClick={handleAITextSubmit}
                 disabled={!aiText.trim()}
                 className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 <Send size={20} /> 识别
               </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-64 h-64 bg-gray-50 border-2 border-dashed border-emerald-300 rounded-3xl flex flex-col items-center justify-center text-emerald-500 cursor-pointer hover:bg-emerald-50 transition-colors"
               >
                 <ImageIcon size={64} className="mb-4 opacity-50" />
                 <span className="font-medium">点击上传小票图片</span>
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 accept="image/*" 
                 className="hidden" 
                 onChange={handleImageUpload}
               />
               <p className="text-gray-400 text-sm max-w-xs">
                 支持拍摄或上传超市小票、账单截图，AI 将自动提取金额和分类。
               </p>
            </div>
          )}
        </div>

        {/* Footer Actions (Only for Manual) */}
        {mode === 'manual' && (
          <div className="p-4 bg-white border-t border-gray-100">
            <button 
              type="submit" 
              form="add-form"
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} /> 确认保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTransaction;
