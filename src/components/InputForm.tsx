import React, { useState, useEffect } from "react";
import { CandidateInput } from "../types";
import { ResumeUploader } from "./ResumeUploader";
import { TranscriptUploader } from "./TranscriptUploader";
import { User, FileText, MessageSquareQuote, Search, RotateCcw, Loader2, Sparkles, AlertCircle, FileCheck, AlertTriangle, CheckSquare } from "lucide-react";

interface InputFormProps {
  initialValues: CandidateInput;
  onSubmit: (data: CandidateInput) => void;
  isLoading: boolean;
  onClear: () => void;
}

const AVAILABLE_FLAGS = [
  { id: "Lip Sync Mismatch", label: "Lip Sync Mismatch", desc: "Audio/video appeared out of sync" },
  { id: "Eye Contact Mismatch", label: "Eye Contact Mismatch", desc: "Unnatural or evasive eye movement (e.g. reading off-screen)" },
  { id: "External Assistance", label: "External Assistance", desc: "Suspected help from another person or device off-camera" },
  { id: "Scripted Responses", label: "Scripted Responses", desc: "Answers sounded rehearsed or unnaturally rehearsed" },
];

export const InputForm: React.FC<InputFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  onClear,
}) => {
  const [candidateName, setCandidateName] = useState(initialValues.candidateName);
  const [resumeSkills, setResumeSkills] = useState(initialValues.resumeSkills);
  const [interviewAnswer, setInterviewAnswer] = useState(initialValues.interviewAnswer);
  const [recruiterFlags, setRecruiterFlags] = useState<string[]>(initialValues.recruiterFlags || []);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [extractionSuccessMsg, setExtractionSuccessMsg] = useState<string | null>(null);
  const [transcriptSuccessMsg, setTranscriptSuccessMsg] = useState<string | null>(null);

  // Sync internal state if props change (e.g. clicking a Sample profile)
  useEffect(() => {
    setCandidateName(initialValues.candidateName);
    setResumeSkills(initialValues.resumeSkills);
    setInterviewAnswer(initialValues.interviewAnswer);
    setRecruiterFlags(initialValues.recruiterFlags || []);
    setValidationError(null);
    setExtractionSuccessMsg(null);
    setTranscriptSuccessMsg(null);
  }, [initialValues]);

  const toggleFlag = (flagId: string) => {
    setRecruiterFlags((prev) =>
      prev.includes(flagId) ? prev.filter((f) => f !== flagId) : [...prev, flagId]
    );
  };

  const handleResumeExtracted = (extractedText: string, fileName: string) => {
    setResumeSkills(extractedText);
    setExtractionSuccessMsg(`Successfully extracted skills from "${fileName}". Review or edit below.`);
    setValidationError(null);
  };

  const handleTranscriptExtracted = (extractedText: string, fileName: string) => {
    setInterviewAnswer(extractedText);
    setTranscriptSuccessMsg(`Successfully extracted transcript from "${fileName}". Review or edit below.`);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeSkills.trim() || !interviewAnswer.trim()) {
      setValidationError("Please provide both claimed resume skills and the interview response.");
      return;
    }
    setValidationError(null);
    onSubmit({
      candidateName: candidateName.trim() || "Unspecified Candidate",
      resumeSkills: resumeSkills.trim(),
      interviewAnswer: interviewAnswer.trim(),
      recruiterFlags,
      recruiter_flags: recruiterFlags,
    });
  };

  const handleReset = () => {
    setCandidateName("");
    setResumeSkills("");
    setInterviewAnswer("");
    setRecruiterFlags([]);
    setValidationError(null);
    setExtractionSuccessMsg(null);
    setTranscriptSuccessMsg(null);
    onClear();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
            <Search className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Candidate Evaluation Audit
            </h2>
            <p className="text-xs text-slate-500">
              Input candidate's claimed qualifications against verbatim interview transcripts
            </p>
          </div>
        </div>

        {(candidateName || resumeSkills || interviewAnswer) && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Inputs
          </button>
        )}
      </div>

      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Missing Input Fields</strong>
            <span>{validationError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Candidate Name Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            Candidate Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="candidate-name-input"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g., Jane Doe, John Smith"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-sm placeholder:text-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Resume Skills Section (Upload File OR Type Manually) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Resume Skills / Claimed Resume Experience
            </label>
            <span className="text-[11px] font-medium text-slate-400">
              {resumeSkills.length} chars
            </span>
          </div>

          {/* Option 1: File Upload (Drag and Drop / File Picker) */}
          <ResumeUploader
            onExtractSuccess={handleResumeExtracted}
            disabled={isLoading}
          />

          {extractionSuccessMsg && (
            <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{extractionSuccessMsg}</span>
            </div>
          )}

          {/* Option 2: Manual Text Area Input */}
          <textarea
            id="resume-skills-input"
            rows={3}
            value={resumeSkills}
            onChange={(e) => setResumeSkills(e.target.value)}
            placeholder="e.g., 5 years Python, Machine Learning, Django, AWS, Deep Learning models"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-sm placeholder:text-slate-400 transition-all outline-none leading-relaxed resize-y"
          />
        </div>

        {/* Interview Answer Section (Upload File OR Type Manually) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-slate-500" />
              Interview Answer / Verbatim Transcript
            </label>
            <span className="text-[11px] font-medium text-slate-400">
              {interviewAnswer.length} chars
            </span>
          </div>

          {/* Option 1: File Upload (Drag and Drop / File Picker) */}
          <TranscriptUploader
            onExtractSuccess={handleTranscriptExtracted}
            disabled={isLoading}
          />

          {transcriptSuccessMsg && (
            <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{transcriptSuccessMsg}</span>
            </div>
          )}

          {/* Option 2: Manual Text Area Input */}
          <textarea
            id="interview-answer-input"
            rows={4}
            value={interviewAnswer}
            onChange={(e) => setInterviewAnswer(e.target.value)}
            placeholder="Paste or edit the candidate's verbatim interview response..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 text-sm placeholder:text-slate-400 transition-all outline-none leading-relaxed resize-y"
          />
        </div>

        {/* Recruiter-Observed Flags Section */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Recruiter-Observed Flags (optional)
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Check any behaviors you personally noticed during the live interview
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {AVAILABLE_FLAGS.map((flag) => {
              const isChecked = recruiterFlags.includes(flag.id);
              return (
                <label
                  key={flag.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                    isChecked
                      ? "bg-indigo-50/90 border-indigo-300 text-indigo-950 shadow-2xs"
                      : "bg-white border-slate-200/80 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFlag(flag.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer shrink-0"
                  />
                  <div className="text-xs leading-tight">
                    <span className="font-bold block text-slate-800">{flag.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{flag.desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Persistent Advisory Disclaimer Strip */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-center gap-2 text-center shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>⚠️ Advisory only — this tool assists the recruiter's judgment and does not make hiring decisions.</span>
        </div>

        {/* Submit Action */}
        <div className="pt-1">
          <button
            type="submit"
            id="analyze-btn"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base text-white shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2.5 transition-all duration-200 ${
              isLoading
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 active:scale-[0.99] cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Running Impersonation & Technical Consistency Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Analyze Interview Response</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
