import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Bookmark, Command, Feather } from 'lucide-react';
import { analyzeWord } from './services/geminiService';
import WordCard from './components/WordCard';
import Notebook from './components/Notebook';
import { WordData } from './types';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [savedWords, setSavedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('lexicon_saved');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showNotebook, setShowNotebook] = useState(false);

  useEffect(() => {
    localStorage.setItem('lexicon_saved', JSON.stringify(savedWords));
  }, [savedWords]);

  const toggleSaveWord = (word: string) => {
    const lowerWord = word.toLowerCase();
    setSavedWords(prev => {
      if (prev.includes(lowerWord)) {
        return prev.filter(w => w !== lowerWord);
      } else {
        return [...prev, lowerWord];
      }
    });
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    if (command === '/add') {
        if (arg && !savedWords.includes(arg.toLowerCase())) {
            toggleSaveWord(arg);
        } else if (wordData && !savedWords.includes(wordData.word.toLowerCase())) {
             toggleSaveWord(wordData.word);
        }
        setInputValue('');
    } else if (command === '/list') {
        setShowNotebook(true);
        setInputValue('');
    } else if (command === '/test') {
        setShowNotebook(true);
        setInputValue('');
    } else {
        handleSearch(cmd);
    }
  };

  const handleSearch = async (word: string) => {
    if (!word.trim()) return;
    
    setLoading(true);
    setError(null);
    setWordData(null);

    try {
      const data = await analyzeWord(word);
      setWordData(data);
    } catch (err) {
      setError("未找到该词，请核对拼写后重试。");
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.startsWith('/')) {
        handleCommand(inputValue);
    } else {
        handleSearch(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f0e9] text-[#1c1917] pb-20 font-serif selection:bg-[#d4af37] selection:text-white">
      
      {/* Navbar */}
      <div className="sticky top-0 z-40 bg-[#f2f0e9]/90 backdrop-blur-sm border-b border-[#e5e0d0]">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-default">
                <div className="w-10 h-10 bg-[#2c3e50] flex items-center justify-center rounded-sm shadow-sm group-hover:bg-[#1a252f] transition-colors">
                    <Feather size={20} className="text-[#d4af37]" />
                </div>
                <div className="flex flex-col">
                    <span className="font-display font-bold text-xl tracking-wide text-[#2c3e50]">LexiconMaster</span>
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#78716c]">Etymology & Context</span>
                </div>
            </div>
            <button 
                onClick={() => setShowNotebook(true)}
                className="p-3 rounded-sm hover:bg-[#e5e0d0] text-[#57534e] relative transition-colors"
                aria-label="Open Notebook"
            >
                <Bookmark size={24} />
                {savedWords.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#b91c1c] rounded-full ring-2 ring-[#f2f0e9]"></span>
                )}
            </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {/* Search Area */}
        <div className="mb-12 relative z-30">
            <form onSubmit={onFormSubmit} className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[#a8a29e] group-focus-within:text-[#2c3e50] transition-colors">
                    {inputValue.startsWith('/') ? <Command size={20} /> : <Search size={20} />}
                </div>
                <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入单词探索词源..."
                    className="w-full pl-16 pr-6 py-6 bg-white rounded-sm shadow-[0_4px_20px_rgba(44,62,80,0.06)] border border-[#e5e0d0] focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] focus:outline-none font-display text-xl placeholder:font-sans placeholder:text-[#d6d3d1] transition-all text-[#2c3e50]"
                />
            </form>
            <div className="mt-3 text-center">
                 <p className="font-sans text-xs text-[#78716c] tracking-widest uppercase">
                    Commands: <span className="text-[#2c3e50] font-bold">/add</span>, <span className="text-[#2c3e50] font-bold">/list</span>, <span className="text-[#2c3e50] font-bold">/test</span>
                 </p>
            </div>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                <div className="w-16 h-16 border-4 border-[#e5e0d0] border-t-[#2c3e50] rounded-full animate-spin mb-6"></div>
                <p className="font-sans text-lg text-[#57534e]">正在检索中...</p>
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="p-6 bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] text-center mb-8 font-sans">
                {error}
            </div>
        )}

        {/* Content Card */}
        {!loading && wordData && (
            <WordCard 
              data={wordData} 
              isSaved={savedWords.includes(wordData.word.toLowerCase())}
              onSave={toggleSaveWord}
            />
        )}

        {/* Empty State */}
        {!loading && !wordData && !error && (
            <div className="text-center py-20 opacity-60">
                <Feather size={48} className="mx-auto mb-4 text-[#d6d3d1]" />
                <div className="font-sans text-xl text-[#a8a29e] mb-3">请输入单词开始</div>
            </div>
        )}
      </main>

      {/* Notebook/Quiz Overlay */}
      {showNotebook && (
          <Notebook 
            savedWords={savedWords} 
            onClose={() => setShowNotebook(false)} 
          />
      )}
    </div>
  );
};

export default App;