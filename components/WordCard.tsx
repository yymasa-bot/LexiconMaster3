import React from 'react';
import { WordData } from '../types';
import { Volume2, BookOpen, Feather, Quote, Bookmark, Check } from 'lucide-react';

interface WordCardProps {
  data: WordData;
  isSaved: boolean;
  onSave: (word: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ data, isSaved, onSave }) => {
  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(data.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 animate-fade-in">
      
      {/* Main Card Container */}
      <div className="bg-[#fffbf2] rounded-sm shadow-xl border border-[#e5e0d0] overflow-hidden relative">
        {/* Decorative Top Border */}
        <div className="h-2 w-full bg-gradient-to-r from-[#2c3e50] via-[#d4af37] to-[#2c3e50]"></div>

        {/* Header Section */}
        <div className="p-8 md:p-10 text-center relative">
           {/* Save Button */}
           <button 
             onClick={() => onSave(data.word)}
             className={`absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
               isSaved 
                 ? "bg-[#2c3e50] text-[#d4af37] border-[#2c3e50]" 
                 : "bg-transparent text-[#78716c] border-[#d6d3d1] hover:border-[#2c3e50] hover:text-[#2c3e50]"
             }`}
           >
             {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
             <span className="text-xs font-sans font-bold tracking-wider uppercase">
               {isSaved ? "已收藏" : "收藏"}
             </span>
           </button>

          <h1 className="text-6xl md:text-7xl font-display font-bold text-[#1c1917] tracking-tight mb-4 capitalize">
            {data.word}
          </h1>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4 text-[#57534e]">
              <span className="font-serif text-lg italic">/{data.phonetics.ipa}/</span>
              <span className="w-1 h-1 rounded-full bg-[#d4af37]"></span>
              <span className="font-sans text-sm tracking-widest uppercase">{data.phonetics.syllables}</span>
            </div>
            
            <button
              onClick={playAudio}
              className="mt-4 flex items-center gap-2 text-[#d4af37] hover:text-[#b4942b] transition-colors font-sans text-xs font-bold tracking-widest uppercase border border-[#e5e0d0] px-4 py-1.5 rounded-full hover:bg-[#fcfaf5]"
            >
              <Volume2 size={14} />
              Pronounce
            </button>
            
            <p className="mt-4 text-[#78716c] italic font-serif text-sm">
              "{data.phonetics.tip}"
            </p>
          </div>
        </div>

        <hr className="border-[#e5e0d0] mx-8" />

        {/* Etymology Section */}
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-12 bg-[#d4af37]"></span>
            <h2 className="font-display text-2xl text-[#2c3e50] font-bold tracking-wide">词源与根源</h2>
            <span className="h-px w-12 bg-[#d4af37]"></span>
          </div>

          <div className="flex justify-center mb-6">
             <div className="bg-[#2c3e50] text-[#fefce8] px-6 py-2 rounded-sm font-mono text-sm tracking-wide shadow-md border border-[#1a252f]">
              {data.etymology.rootAnalysis}
            </div>
          </div>
          
          <div className="prose prose-lg text-[#44403c] font-serif leading-loose text-justify mx-auto">
            <p>{data.etymology.story}</p>
          </div>
        </div>

        {/* Cognate Network */}
        <div className="bg-[#f4f1ea] p-8 md:p-10 border-t border-b border-[#e5e0d0]">
           <div className="text-center mb-6">
             <h3 className="font-sans text-xs font-bold tracking-[0.2em] text-[#78716c] uppercase">同根词网</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.cognates.map((cognate, idx) => (
              <div key={idx} className="bg-white p-5 shadow-sm border border-[#e5e0d0] hover:shadow-md transition-shadow duration-300">
                <div className="font-display text-xl font-bold text-[#2c3e50] mb-2">{cognate.word}</div>
                <div className="text-sm text-[#57534e] leading-relaxed">{cognate.connection}</div>
              </div>
            ))}
           </div>
        </div>

        {/* Usage Section */}
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-12 bg-[#d4af37]"></span>
            <h2 className="font-display text-2xl text-[#2c3e50] font-bold tracking-wide">用法与语境</h2>
            <span className="h-px w-12 bg-[#d4af37]"></span>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Literature Quote - Updated to standard font */}
            <div className="relative pl-8 md:pl-12 border-l-4 border-[#d4af37]">
              <Quote className="absolute -left-3 -top-4 text-[#d4af37] bg-[#fffbf2] p-1" size={24} fill="currentColor"/>
              <blockquote className="font-serif text-xl md:text-2xl text-[#1c1917] leading-relaxed mb-4">
                "{data.usage.examples.literature.quote}"
              </blockquote>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 font-sans text-xs tracking-widest uppercase text-[#78716c]">
                <span className="font-bold text-[#2c3e50]">{data.usage.examples.literature.author}</span>
                <span className="hidden md:inline">—</span>
                <span>{data.usage.examples.literature.source}</span>
              </div>
            </div>

            {/* Modern Media - Updated to standard font */}
            <div className="bg-[#fcfbf9] p-6 border border-[#e5e0d0] relative">
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2c3e50] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                 Modern Context
               </div>
              <p className="text-lg text-[#44403c] font-sans font-medium mb-3 text-center">
                "{data.usage.examples.modern.quote}"
              </p>
              <p className="text-center font-sans text-xs text-[#78716c] uppercase tracking-wider">
                — {data.usage.examples.modern.source}
              </p>
            </div>

            {/* Synonyms */}
            <div>
              <div className="text-center mb-4">
                <h3 className="font-sans text-xs font-bold tracking-[0.2em] text-[#a8a29e] uppercase">近义词</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {data.usage.synonyms.map((syn, i) => (
                  <div key={i} className="group relative">
                    <span className="px-4 py-2 bg-[#e7e5e4] text-[#44403c] font-sans text-sm border border-[#d6d3d1] hover:bg-[#d4af37] hover:text-white hover:border-[#d4af37] transition-colors cursor-default rounded-sm">
                      {syn.word}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-3 bg-[#2c3e50] text-[#fefce8] text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-sans">
                      {syn.context}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Decorative */}
        <div className="h-2 w-full bg-[#2c3e50]"></div>
      </div>
    </div>
  );
};

export default WordCard;