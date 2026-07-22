import React from "react";
import { X, ShieldCheck, AlertCircle, FileCheck, HelpCircle } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                How Impersonation Risk Detection Works
              </h3>
              <p className="text-xs text-slate-500">
                AI Recruiter Assistance Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            With the rise of online remote interviews, recruiters face challenges with impersonation, external live assistance, or candidates reading scripted AI/textbook answers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Resume Depth Matching
              </div>
              <p className="text-xs text-slate-600">
                Compares claimed seniority (e.g., "5 years Deep Learning") against the technical detail supplied in the verbatim transcript.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Script & Teleprompter Signals
              </div>
              <p className="text-xs text-slate-600">
                Flags textbook definitions or generic AI-generated phrases used to mask a lack of hands-on project experience.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <div className="font-bold text-indigo-950 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Human-In-The-Loop Principle
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              This tool provides risk indicators and suggested follow-up questions to help recruiters verify authenticity. <strong>It does NOT make hiring or disqualification decisions automatically.</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
