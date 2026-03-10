import { DemoStep } from './demoConstants';

/**
 * APS Demo Steps
 * 
 * The APS (Automated Physics Simulation) demo features a comprehensive I2I (Intent-to-Insight) workbench
 * that operates autonomously through multiple simulation stages:
 * 
 * IDLE → ANALYZING → CLARIFYING → PARSING → PLANNING_CONFIRMATION → CONFIRMING → 
 * INDUCTION → CHECKING → VALIDATION_CHECK → DEDUCTION → INSIGHT
 * 
 * The workflow is managed internally by the APSWorkbench components (InquiryAgent, InsightCanvas, 
 * TerminalPanel, EnsembleChart) and uses dedicated state management via useDemoStore.
 */
export const APS_DEMO_STEPS: DemoStep[] = [
  {
    view: 'aps',
    statusText: 'APS Workbench Ready',
    statusClass: 'bg-cyan-500',
    chatMessages: [
      { 
        isAI: true, 
        message: 'Welcome to the APS Intent-to-Insight Workbench. This interactive demonstration showcases an AI-powered engineering assistant that transforms natural language goals into optimized design solutions through automated multi-stage simulation workflows. Begin by describing your engineering objective in the input field below.' 
      }
    ],
    progress: 100
  }
];
