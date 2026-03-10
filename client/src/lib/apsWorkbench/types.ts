
export enum SimulationStage {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING', // Agent analyzing geometry
  CLARIFYING = 'CLARIFYING', // Agent asking questions
  PARSING = 'PARSING', // NLP Analysis (Processing refined query)
  PLANNING_CONFIRMATION = 'PLANNING_CONFIRMATION', // User confirming translation of intent
  CONFIRMING = 'CONFIRMING', // Awaiting user approval of plan
  INDUCTION = 'INDUCTION', // Surrogate Models
  CHECKING = 'CHECKING', // Confidence Check
  VALIDATION_CHECK = 'VALIDATION_CHECK', // Validation Proposal
  DEDUCTION = 'DEDUCTION', // RANS Solver
  INSIGHT = 'INSIGHT' // Final Result
}

export interface ExperimentSummary {
  intent: string;
  targetVars: string[];
  designVars: string[];
  operatingConditions: string[];
  constraints: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  type?: 'text' | 'card' | 'process' | 'insight' | 'plan' | 'summary' | 'proposal';
  data?: any; // For structured payloads like System Plan or Experiment Summary
  file?: { name: string; size: string }; // For file attachments
  timestamp: number;
}

export interface TargetVar {
  name: string;
  goal: string;
  context?: string; // e.g. "Proxy for Top Speed"
}

export interface Constraint {
  name: string;
  value: string;
  why?: string; // e.g. "Ensures handling characteristics"
}

export interface ExperimentConfig {
  status: 'WAITING' | 'DEFINED';
  targetVars: TargetVar[];
  constraints: Constraint[];
  designVars: string[];
  operatingConditions: { name: string; value: string }[];
  planStep: number; // Index of current step in SYSTEM_PLAN
  activeModules: string[];
}

export interface PointData {
  x: number; // Design parameter (e.g., Angle)
  y: number; // Objective (Cd)
  confidence?: [number, number]; // Min/Max confidence
  type: 'surrogate' | 'physics' | 'optimized';
}
