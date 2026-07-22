export type RiskLevel = "Low" | "Medium" | "High";

export interface SampleCandidate {
  id: string;
  name: string;
  title: string;
  expectedRisk: RiskLevel;
  resumeSkills: string;
  interviewAnswer: string;
  description: string;
}

export interface CandidateInput {
  candidateName: string;
  resumeSkills: string;
  interviewAnswer: string;
}

export interface AnalysisResult {
  risk_score: number;
  risk_level: RiskLevel;
  reasons: string[];
  followup_questions: string[];
  candidateName?: string;
  analyzedAt?: string;
}

export interface AnalysisHistoryItem extends AnalysisResult {
  id: string;
  candidateName: string;
  resumeSkills: string;
  interviewAnswer: string;
  timestamp: string;
  notes?: string;
}
