import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SampleDataButtons } from "./components/SampleDataButtons";
import { InputForm } from "./components/InputForm";
import { ResultsPanel } from "./components/ResultsPanel";
import { AnalysisHistory } from "./components/AnalysisHistory";
import { InfoModal } from "./components/InfoModal";
import { CandidateInput, AnalysisResult, AnalysisHistoryItem, SampleCandidate } from "./types";
import { SAMPLE_CANDIDATES } from "./data/samples";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function App() {
  const [candidateInput, setCandidateInput] = useState<CandidateInput>({
    candidateName: "",
    resumeSkills: "",
    interviewAnswer: "",
  });

  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  // Load history from localStorage
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("deepfake_alert_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("deepfake_alert_history", JSON.stringify(history));
    } catch {
      // Storage unavailable fallback
    }
  }, [history]);

  // Handle preset sample candidate selection
  const handleSelectSample = (sample: SampleCandidate) => {
    setSelectedSampleId(sample.id);
    setCandidateInput({
      candidateName: sample.name,
      resumeSkills: sample.resumeSkills,
      interviewAnswer: sample.interviewAnswer,
    });
    setErrorMessage(null);
  };

  // Clear inputs
  const handleClearInputs = () => {
    setSelectedSampleId(undefined);
    setCandidateInput({
      candidateName: "",
      resumeSkills: "",
      interviewAnswer: "",
    });
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Run AI analysis request
  const handleAnalyze = async (data: CandidateInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Minimum delay for realistic analysis UX feedback
    const startTime = Date.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const result: AnalysisResult = await res.json();

      // Ensure at least 1.2s delay for spinner feedback
      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) {
        await new Promise((r) => setTimeout(r, 1200 - elapsed));
      }

      const fullResult = {
        ...result,
        candidateName: data.candidateName,
        analyzedAt: new Date().toLocaleTimeString(),
      };

      setAnalysisResult(fullResult);

      // Save to history
      const historyItem: AnalysisHistoryItem = {
        id: `eval-${Date.now()}`,
        candidateName: data.candidateName,
        resumeSkills: data.resumeSkills,
        interviewAnswer: data.interviewAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...fullResult,
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById("results-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setErrorMessage("Failed to perform analysis. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setCandidateInput({
      candidateName: item.candidateName,
      resumeSkills: item.resumeSkills,
      interviewAnswer: item.interviewAnswer,
    });
    setAnalysisResult({
      risk_score: item.risk_score,
      risk_level: item.risk_level,
      reasons: item.reasons,
      followup_questions: item.followup_questions,
      candidateName: item.candidateName,
      analyzedAt: item.timestamp,
    });
    setSelectedSampleId(undefined);

    setTimeout(() => {
      const el = document.getElementById("results-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("deepfake_alert_history");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation / Header */}
      <Header
        onOpenInfo={() => setIsInfoOpen(true)}
        totalEvaluated={history.length}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Sample Data Presets Banner */}
        <SampleDataButtons
          onSelectSample={handleSelectSample}
          selectedSampleId={selectedSampleId}
        />

        {/* Candidate Input Form */}
        <InputForm
          initialValues={candidateInput}
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          onClear={handleClearInputs}
        />

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleAnalyze(candidateInput)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Results Display Section */}
        {analysisResult && (
          <ResultsPanel
            result={analysisResult}
            candidateName={candidateInput.candidateName || "Candidate"}
            resumeSkills={candidateInput.resumeSkills}
            interviewAnswer={candidateInput.interviewAnswer}
          />
        )}

        {/* Recent Session History */}
        <AnalysisHistory
          history={history}
          onSelectHistoryItem={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <span>Deepfake Interview Alert Tool</span>
            <span>•</span>
            <span className="text-slate-400">Recruiter AI Verification Platform</span>
          </div>
          <div>
            Assisting recruiter judgment. Does not replace human decision making.
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}
