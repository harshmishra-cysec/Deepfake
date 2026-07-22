import React from "react";
import { ShieldCheck, Info, Sparkles, FileSearch } from "lucide-react";

interface HeaderProps {
  onOpenInfo: () => void;
  totalEvaluated: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInfo, totalEvaluated }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white py-6 px-4 sm:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Deepfake Interview Alert Tool
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-indigo-400" /> AI-Assisted
              </span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base mt-0.5">
              AI-powered impersonation risk detection for recruiters
            </p>
          </div>
        </div>

        {/* Actions & Metrics */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {totalEvaluated > 0 && (
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <FileSearch className="w-4 h-4 text-indigo-400" />
              <span>Session Evaluated: <strong className="text-white">{totalEvaluated}</strong></span>
            </div>
          )}

          <button
            onClick={onOpenInfo}
            id="how-it-works-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-sm font-medium transition-colors"
          >
            <Info className="w-4 h-4 text-indigo-400" />
            <span>How It Works</span>
          </button>
        </div>
      </div>
    </header>
  );
};
