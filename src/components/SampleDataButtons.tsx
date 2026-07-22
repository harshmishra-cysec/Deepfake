import React from "react";
import { SAMPLE_CANDIDATES } from "../data/samples";
import { SampleCandidate } from "../types";
import { UserCheck, ShieldAlert, AlertTriangle, ArrowRight } from "lucide-react";

interface SampleDataButtonsProps {
  onSelectSample: (sample: SampleCandidate) => void;
  selectedSampleId?: string;
}

export const SampleDataButtons: React.FC<SampleDataButtonsProps> = ({
  onSelectSample,
  selectedSampleId,
}) => {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-3 h-3 text-emerald-600" /> Low Risk
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Medium Risk
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" /> High Risk
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            Try Pre-loaded Sample Candidates
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any profile below to quickly populate and evaluate realistic interview responses.
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400">3 Demo Profiles</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_CANDIDATES.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          return (
            <button
              key={sample.id}
              id={`sample-btn-${sample.id}`}
              onClick={() => onSelectSample(sample)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 group relative flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                  : "bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {sample.name}
                  </span>
                  {getRiskBadge(sample.expectedRisk)}
                </div>
                <div className="text-xs font-medium text-slate-500 mb-2">
                  {sample.title}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                <span>Load Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
