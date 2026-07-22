import React from "react";
import { AnalysisHistoryItem, RiskLevel } from "../types";
import { History, UserCheck, ShieldAlert, AlertTriangle, Trash2, ChevronRight } from "lucide-react";

interface AnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onSelectHistoryItem: (item: AnalysisHistoryItem) => void;
  onClearHistory: () => void;
  selectedId?: string;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  selectedId,
}) => {
  if (history.length === 0) return null;

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <UserCheck className="w-3 h-3 text-emerald-600" /> Low ({level})
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Medium
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
            <ShieldAlert className="w-3 h-3 text-rose-600" /> High ({level})
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Recent Session Evaluations ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Session History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? "bg-indigo-50/60 border-indigo-500 shadow-sm ring-1 ring-indigo-500"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200"
              }`}
            >
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm truncate">
                  {item.candidateName}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {item.timestamp}
                </div>
                <div className="mt-2">{getRiskBadge(item.risk_level)}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
