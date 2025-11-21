import React, { useState } from 'react';
import { Book, Play, CheckCircle, XCircle, Brain, X } from 'lucide-react';
import { evaluateQuizAnswer } from '../services/geminiService';
import { QuizResult } from '../types';

interface NotebookProps {
  savedWords: string[];
  onClose: () => void;
}

const Notebook: React.FC<NotebookProps> = ({ savedWords, onClose }) => {
  const [mode, setMode] = useState<'LIST' | 'QUIZ'>('LIST');
  const [currentQuizWord, setCurrentQuizWord] = useState<string | null>(null);
  const [quizInput, setQuizInput] = useState('');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = () => {
    if (savedWords.length === 0) return;
    const randomWord = savedWords[Math.floor(Math.random() * savedWords.length)];
    setCurrentQuizWord(randomWord);
    setQuizInput('');
    setQuizResult(null);
    setMode('QUIZ');
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuizWord || !quizInput.trim()) return;

    setLoading(true);
    try {
      const result = await evaluateQuizAnswer(currentQuizWord, quizInput);
      setQuizResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1c1917]/60 backdrop-blur-sm z-50 flex justify-end animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-lg bg-[#fdfbf7] h-full shadow-2xl border-l border-[#e5e0d0] flex flex-col relative">
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'}}></div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-[#e5e0d0] flex justify-between items-center bg-[#fffbf2]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2c3e50] text-[#d4af37] rounded-sm">
               <Book size={20} />
            </div>
            <h2 className="text-xl font-sans font-bold text-[#2c3e50] tracking-tight">
              {mode === 'LIST' ? '生词本' : '知识自测'}
            </h2>
          </div>
          <button onClick={onClose} className="text-[#a8a29e] hover:text-[#2c3e50] transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 p-6 overflow-y-auto">
        {mode === 'LIST' ? (
          <>
            <div className="flex-1">
              {savedWords.length === 0 ? (
                <div className="text-center py-32 text-[#a8a29e]">
                  <p className="font-sans text-base mb-2">暂无生词</p>
                  <p className="font-sans text-xs text-[#d6d3d1]">在查询单词时点击收藏按钮加入</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {savedWords.map((word, i) => (
                    <li key={i} className="flex items-center justify-between p-4 bg-white border border-[#e5e0d0] shadow-sm hover:border-[#d4af37] transition-colors group">
                      <span className="font-display text-xl text-[#2c3e50] font-bold capitalize">{word}</span>
                      <span className="text-[#e5e0d0] group-hover:text-[#d4af37] transition-colors">
                        <Book size={16}/>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-8">
              <button
                onClick={startQuiz}
                disabled={savedWords.length === 0}
                className="w-full py-4 bg-[#2c3e50] text-[#fefce8] font-sans font-bold tracking-widest uppercase text-sm shadow-lg hover:bg-[#1a252f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Play size={16} fill="currentColor" />
                开始测试
              </button>
            </div>
          </>
        ) : (
          // QUIZ MODE
          <div className="flex-1 flex flex-col h-full">
              <div className="mb-8 text-center">
                <span className="font-sans text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-2">请定义以下单词</span>
                <h3 className="text-5xl font-display font-bold text-[#1c1917] capitalize">{currentQuizWord}</h3>
              </div>

              {!quizResult ? (
                <form onSubmit={handleQuizSubmit} className="flex-1 flex flex-col">
                  <textarea
                    className="w-full flex-1 p-6 bg-white border border-[#e5e0d0] focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] focus:outline-none font-serif text-lg text-[#44403c] resize-none placeholder:text-[#d6d3d1] placeholder:font-sans"
                    placeholder="请输入你对该词的理解..."
                    value={quizInput}
                    onChange={(e) => setQuizInput(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !quizInput.trim()}
                    className="w-full mt-6 py-4 bg-[#2c3e50] text-[#fefce8] font-sans font-bold tracking-widest uppercase text-sm shadow-lg hover:bg-[#1a252f] transition-colors disabled:opacity-50"
                  >
                    {loading ? '评估中...' : '提交答案'}
                  </button>
                </form>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`p-6 border-l-4 mb-6 bg-white shadow-sm ${quizResult.isCorrect ? 'border-green-600' : 'border-red-800'}`}>
                    <div className="flex items-center gap-3 font-sans font-bold text-lg mb-3 text-[#2c3e50]">
                        {quizResult.isCorrect ? <CheckCircle className="text-green-600"/> : <XCircle className="text-red-800"/>}
                        {quizResult.isCorrect ? "理解正确" : "需要复习"}
                    </div>
                    <p className="font-serif text-[#44403c] leading-relaxed">{quizResult.feedback}</p>
                  </div>
                  
                  <div className="bg-[#f0f9ff] p-6 border border-[#bae6fd] relative overflow-hidden mb-8">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Brain size={64} className="text-[#0ea5e9]"/>
                    </div>
                    <div className="flex items-center gap-2 font-sans font-bold text-[#0369a1] uppercase tracking-widest text-xs mb-3">
                        <Brain size={16}/>
                        词源解析
                    </div>
                    <p className="font-serif text-[#0c4a6e] leading-relaxed relative z-10">
                        {quizResult.etymologyNote}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                        onClick={startQuiz}
                        className="w-full py-4 bg-[#2c3e50] text-[#fefce8] font-sans font-bold tracking-widest uppercase text-sm shadow hover:bg-[#1a252f] transition-colors"
                    >
                        下一个
                    </button>
                    <button
                        onClick={() => setMode('LIST')}
                        className="w-full py-3 text-[#78716c] hover:text-[#2c3e50] font-sans text-xs font-bold tracking-widest uppercase"
                    >
                        返回生词本
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Notebook;