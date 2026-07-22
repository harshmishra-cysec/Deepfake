import React, { useState } from "react";
import { AnalysisResult, RiskLevel } from "../types";
import { RiskGauge } from "./RiskGauge";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  Download,
  Copy,
  Check,
  Printer,
  Info,
  Calendar,
  User,
  Sparkles,
  FileText
} from "lucide-react";

interface ResultsPanelProps {
  result: AnalysisResult;
  candidateName: string;
  resumeSkills: string;
  interviewAnswer: string;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  candidateName,
  resumeSkills,
  interviewAnswer,
}) => {
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [recruiterNotes, setRecruiterNotes] = useState("");

  const getBadgeStyle = (level: RiskLevel) => {
    switch (level) {
      case "Low":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
          title: "Low Impersonation Risk",
          subtitle: "Interview response aligns well with resume qualifications",
        };
      case "Medium":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-800",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          title: "Medium / Moderate Risk",
          subtitle: "Some technical gaps or ambiguous depth detected; follow-up advised",
        };
      case "High":
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-800",
          icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
          title: "High Impersonation Risk",
          subtitle: "Significant technical disparity or scripted definition patterns detected",
        };
      default:
        return {
          bg: "bg-slate-100 border-slate-300 text-slate-700",
          icon: <Info className="w-5 h-5 text-slate-600" />,
          title: "Evaluated",
          subtitle: "Audit complete",
        };
    }
  };

  const badgeStyle = getBadgeStyle(result.risk_level);

  const parseReason = (reasonStr: string) => {
    const match = reasonStr.match(/^\[([^\]]+)\]:\s*(.*)$/);
    if (match) {
      return { category: match[1], text: match[2] };
    }
    return { category: null, text: reasonStr };
  };

  const handleCopyQuestion = (question: string, index: number) => {
    navigator.clipboard.writeText(question);
    setCopiedQuestionIndex(index);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  const handleDownloadTxt = () => {
    const reportContent = `
===================================================
DEEPFAKE INTERVIEW ALERT AUDIT REPORT
===================================================
Candidate Name: ${candidateName}
Audit Timestamp: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Risk Level: ${result.risk_level} Risk
Risk Score: ${result.risk_score} / 100

---------------------------------------------------
CLAIMED RESUME EXPERIENCE / SKILLS:
---------------------------------------------------
${resumeSkills}

---------------------------------------------------
VERBATIM INTERVIEW RESPONSE TRANSCRIPT:
---------------------------------------------------
${interviewAnswer}

---------------------------------------------------
AUDIT FINDINGS & RISK REASONS:
---------------------------------------------------
${result.reasons.map((r, i) => `[${i + 1}] ${r}`).join("\n\n")}

---------------------------------------------------
RECOMMENDED PROBING QUESTIONS:
---------------------------------------------------
${result.followup_questions.map((q, i) => `[Q${i + 1}] ${q}`).join("\n\n")}

${recruiterNotes ? `---------------------------------------------------\nRECRUITER NOTES:\n---------------------------------------------------\n${recruiterNotes}\n\n` : ""}
===================================================
ADVISORY DISCLAIMER:
⚠️ Advisory only — this tool assists the recruiter's judgment and does not make hiring decisions.
===================================================
`.trim();

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${candidateName.replace(/\s+/g, "_")}_Interview_Audit_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const text = `
DEEPFAKE INTERVIEW ALERT REPORT
==================================
Candidate: ${candidateName}
Date: ${new Date().toLocaleDateString()}
Risk Level: ${result.risk_level} Risk
Risk Score: ${result.risk_score} / 100

KEY REASONS:
${result.reasons.map((r, i) => `${i + 1}. ${r}`).join("\n")}

RECOMMENDED FOLLOW-UP QUESTIONS:
${result.followup_questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

RECRUITER NOTES:
${recruiterNotes || "None provided"}

Disclaimer: ⚠️ Advisory only — this tool assists the recruiter's judgment and does not make hiring decisions.
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div id="results-section" className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Banner: Candidate & Risk Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <User className="w-3.5 h-3.5 text-indigo-500" /> Candidate Evaluation Result
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {candidateName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Audited on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Risk Level Badge & Score */}
        <div className={`px-5 py-3 rounded-xl border flex items-center gap-3.5 shrink-0 ${badgeStyle.bg}`}>
          <div className="p-2 rounded-lg bg-white/90 shadow-sm shrink-0">
            {badgeStyle.icon}
          </div>
          <div>
            <div className="font-extrabold text-lg leading-snug">
              {result.risk_level} Risk
            </div>
            <div className="text-xs opacity-90 font-bold">
              Numeric Score: {result.risk_score} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Disclaimer Strip */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2 text-center shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>⚠️ Advisory only — this tool assists the recruiter's judgment and does not make hiring decisions.</span>
      </div>

      {/* Grid: Risk Gauge + Key Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gauge */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[310px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Impersonation Risk Gauge
          </h3>
          <RiskGauge score={result.risk_score} level={result.risk_level} />
          <p className="text-xs font-medium text-slate-600 text-center max-w-xs mt-3 leading-relaxed">
            {badgeStyle.subtitle}
          </p>
        </div>

        {/* Right Column: Reasons List with Signal Categories */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                Audit Findings & Signal Analysis
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {result.reasons.length} Signal Reasons
              </span>
            </div>

            <ul className="space-y-3">
              {result.reasons.map((reason, idx) => {
                const { category, text } = parseReason(reason);
                return (
                  <li
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-start gap-2.5 bg-white p-4 rounded-xl border border-slate-200/80 text-sm text-slate-800 leading-relaxed shadow-2xs"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      {category && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/70 shrink-0">
                          {category}
                        </span>
                      )}
                    </div>
                    <span className="flex-1 text-slate-700 font-medium leading-relaxed sm:mt-0">
                      {text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Suggested Follow-up Questions Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-xl p-6 sm:p-7 shadow-lg border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Suggested Follow-up Questions
              </h3>
              <p className="text-xs text-slate-400">
                Targeted questions specific to this candidate's responses to verify flagged gaps
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 self-start sm:self-auto">
            {result.followup_questions.length} Probing Questions
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {result.followup_questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-start gap-3 text-sm text-slate-200 leading-relaxed">
                <span className="text-indigo-400 font-bold shrink-0">Q{idx + 1}.</span>
                <span>{q}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyQuestion(q, idx)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/80 hover:bg-indigo-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
              >
                {copiedQuestionIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Question</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recruiter Custom Notes */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Recruiter Audit Notes (Optional)
        </label>
        <textarea
          rows={2}
          value={recruiterNotes}
          onChange={(e) => setRecruiterNotes(e.target.value)}
          placeholder="Add human observation notes e.g., candidate paused heavily when asked about TensorFlow hyperparameter tuning..."
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Plain Text Download Button */}
          <button
            type="button"
            id="download-report-btn"
            onClick={handleDownloadTxt}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download Report (.txt)</span>
          </button>

          {/* Copy Text Summary */}
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            {copiedSummary ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied Report!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          {/* Browser Print / PDF Option */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 font-semibold text-sm transition-colors cursor-pointer shrink-0"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Print / PDF</span>
          </button>
        </div>

        {/* Required Disclaimer */}
        <div className="text-xs text-slate-500 text-center sm:text-right max-w-xs leading-tight">
          <p className="inline-flex items-center gap-1 font-medium">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            This tool assists recruiter judgment and does not make hiring decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

