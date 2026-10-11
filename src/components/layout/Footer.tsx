import React from 'react';
import { Terminal, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060810] py-8 px-4 md:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-slate-300">OOP QUEST</span>
          <span>·</span>
          <span>Learn Java. Play the Game. Master OOP.</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>OpenJDK 17 Execution Engine</span>
          </span>
          <span>·</span>
<<<<<<< HEAD
          <span>18 Realms of Mastery</span>
=======
          <span>13 Realms of Mastery</span>
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
          <span>·</span>
          <span>© 2026 OOP Quest</span>
        </div>
      </div>
    </footer>
  );
};
