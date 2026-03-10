/**
 * Demo Path Management System for Godela
 * 
 * This Zustand store manages the state for multiple demonstration paths within Godela.
 * Each demo path represents a different engineering use case (airfoil, heat exchanger, etc.)
 * but shares the same overall interaction model and UI framework.
 * 
 * The store keeps track of:
 * - Which demo path is active
 * - The current step within that demo path
 * - Functions to progress through the demo steps
 * 
 * This architecture allows us to:
 * 1. Maintain a consistent UI and interaction pattern
 * 2. Swap content, visualizations, and parameters based on the engineering domain
 * 3. Add new demo paths without changing the core application structure
 */

import { create } from 'zustand';
import { DEMO_STEPS, AIRCRAFT_AERODYNAMICS_DEMO_STEPS, CAR_AERODYNAMICS_DEMO_STEPS, PACKAGING_DESIGN_DEMO_STEPS, PHONE_PACKAGING_DEMO_STEPS, AMAZON_DEMO_STEPS } from '@/lib/demoConstants';
import { MODEL_VIEWER_DEMO_STEPS } from '@/lib/modelViewerDemoSteps';
import { SANDBOX_DEMO_STEPS } from '@/lib/sandboxDemoSteps';
import { LATENT_EXPLORER_DEMO_STEPS } from '@/lib/latentExplorerDemoSteps';
import { LATENT_EXPLORER_V2_DEMO_STEPS } from '@/lib/latentExplorerV2DemoSteps';
import { APS_DEMO_STEPS } from '@/lib/apsDemoSteps';
import { SimulationStage, ChatMessage, ExperimentConfig } from '@/lib/apsWorkbench/types';
// cosmologyDemoSteps is not currently used as cosmology uses DEMO_STEPS structure
// import cosmologyDemoSteps from '@/lib/cosmologyDemoSteps';

/**
 * Available demo paths in the application
 * Each path represents a different engineering domain or problem type
 * To add a new demo path:
 * 1. Add the path identifier here
 * 2. Create its step sequence in demoConstants.ts
 * 3. Update the getCurrentSteps method to return the new steps array
 */
export type DemoPath = 'airfoil' | 'aircraft-aerodynamics' | 'car-aerodynamics' | 'packaging-design' | 'phone-packaging' | 'model-viewer' | 'sandbox' | 'latent-explorer' | 'latent-explorer-v2' | 'cosmology' | 'amazon' | 'dell' | 'aps';

/**
 * Default experiment config for APS workbench
 */
const DEFAULT_EXPERIMENT_CONFIG: ExperimentConfig = {
  status: 'WAITING',
  targetVars: [],
  constraints: [],
  designVars: [],
  operatingConditions: [],
  planStep: -1,
  activeModules: []
};

/**
 * Demo state interface
 * Defines the structure of the demo path store
 */
interface DemoState {
  /** Current step index within the active demo path */
  demoStep: number;
  
  /** Currently active demo path identifier */
  demoPath: DemoPath;
  
  /** Flag to indicate if packaging multiple products */
  isMultiProductMode: boolean;
  
  /** APS-specific state: Current simulation stage */
  apsSimulationStage: SimulationStage;
  
  /** APS-specific state: Morph value for geometry optimization */
  apsMorphValue: number;
  
  /** APS-specific state: Chat messages array */
  apsChatMessages: ChatMessage[];
  
  /** APS-specific state: Experiment configuration */
  apsExperimentConfig: ExperimentConfig;
  
  /** APS-specific state: Typing indicator */
  apsIsTyping: boolean;
  
  /** Advances to the next step in the current demo path */
  nextDemoStep: () => void;
  
  /** Resets the demo back to the first step */
  resetDemo: () => void;
  
  /** Changes the active demo path and resets step counter */
  setDemoPath: (path: DemoPath) => void;
  
  /** Enable or disable multiple product packaging mode */
  setMultiProductMode: (enabled: boolean) => void;
  
  /** Sets the APS simulation stage */
  setApsSimulationStage: (stage: SimulationStage) => void;
  
  /** Sets the APS morph value */
  setApsMorphValue: (value: number) => void;
  
  /** Adds a chat message to the APS chat */
  addApsChatMessage: (message: ChatMessage) => void;
  
  /** Updates the last chat message */
  updateLastApsChatMessage: (updates: Partial<ChatMessage>) => void;
  
  /** Sets the experiment config */
  setApsExperimentConfig: (config: ExperimentConfig) => void;
  
  /** Updates the experiment config partially */
  updateApsExperimentConfig: (updates: Partial<ExperimentConfig>) => void;
  
  /** Sets the typing indicator */
  setApsIsTyping: (isTyping: boolean) => void;
  
  /** Resets APS-specific state */
  resetApsState: () => void;
  
  /** Gets the appropriate step sequence for the current demo path */
  getCurrentSteps: () => any[];
  
  /** Access to the phone packaging demo steps array */
  phonePackagingSteps: typeof PHONE_PACKAGING_DEMO_STEPS;
}

/**
 * Demo store implementation using Zustand
 * 
 * This store maintains the state for the interactive demos
 * and provides methods to progress through them
 */
const useDemoStore = create<DemoState>((set, get) => ({
  // Start at the first step (0-indexed)
  demoStep: 0,
  
  // Default to airfoil demo path
  demoPath: 'airfoil',
  
  // Flag for multiple product packaging
  isMultiProductMode: false,
  
  // APS-specific state
  apsSimulationStage: SimulationStage.IDLE,
  apsMorphValue: 0,
  apsChatMessages: [],
  apsExperimentConfig: DEFAULT_EXPERIMENT_CONFIG,
  apsIsTyping: false,
  
  // Make packaging demo steps available
  phonePackagingSteps: PHONE_PACKAGING_DEMO_STEPS,
  
  /**
   * Gets the appropriate step sequence for the current demo path
   * This allows each path to have its own unique progression
   * while sharing the same UI components
   */
  getCurrentSteps: () => {
    const { demoPath } = get();
    // Return appropriate step sequence based on active path
    switch (demoPath) {
      case 'airfoil':
        return DEMO_STEPS;
      case 'aircraft-aerodynamics':
        return AIRCRAFT_AERODYNAMICS_DEMO_STEPS;
      case 'car-aerodynamics':
        return CAR_AERODYNAMICS_DEMO_STEPS;
      case 'packaging-design':
        return PACKAGING_DESIGN_DEMO_STEPS;
      case 'phone-packaging':
        return PHONE_PACKAGING_DEMO_STEPS;
      case 'model-viewer':
        return MODEL_VIEWER_DEMO_STEPS;
      case 'sandbox':
        return SANDBOX_DEMO_STEPS;
      case 'latent-explorer':
        return LATENT_EXPLORER_DEMO_STEPS;
      case 'latent-explorer-v2':
        return LATENT_EXPLORER_V2_DEMO_STEPS;
      case 'cosmology':
        return DEMO_STEPS; // Temporarily use airfoil steps structure until we fully adapt
      case 'amazon':
        return DEMO_STEPS; // Use same structure as cosmology for consistency
      case 'dell':
        return DEMO_STEPS; // Use same structure as amazon for consistency
      case 'aps':
        return APS_DEMO_STEPS;
      default:
        return DEMO_STEPS;
    }
  },
  
  /**
   * Advances to the next step in the current demo path
   * Handles boundary checking to prevent going past the last step
   */
  nextDemoStep: () => set((state) => {
    // Get the current steps for the active demo path
    const currentSteps = (() => {
      switch (state.demoPath) {
        case 'airfoil':
          return DEMO_STEPS;
        case 'aircraft-aerodynamics':
          return AIRCRAFT_AERODYNAMICS_DEMO_STEPS;
        case 'car-aerodynamics':
          return CAR_AERODYNAMICS_DEMO_STEPS;
        case 'packaging-design':
          return PACKAGING_DESIGN_DEMO_STEPS;
        case 'phone-packaging':
          return PHONE_PACKAGING_DEMO_STEPS;
        case 'model-viewer':
          return MODEL_VIEWER_DEMO_STEPS;
        case 'sandbox':
          return SANDBOX_DEMO_STEPS;
        case 'latent-explorer':
          return LATENT_EXPLORER_DEMO_STEPS;
        case 'latent-explorer-v2':
          return LATENT_EXPLORER_V2_DEMO_STEPS;
        case 'cosmology':
          return DEMO_STEPS;
        case 'amazon':
          return DEMO_STEPS;
        case 'dell':
          return DEMO_STEPS;
        case 'aps':
          return APS_DEMO_STEPS;
        default:
          return DEMO_STEPS;
      }
    })();
      
    // Check if we're at the last step already
    if (state.demoStep >= currentSteps.length - 1) {
      // Stay at the current step if we're at the end
      return { demoStep: state.demoStep };
    }
    // Move to the next step
    return { demoStep: state.demoStep + 1 };
  }),
  
  /**
   * Resets the demo to the first step
   * Used when restarting a demo or when the component mounts
   */
  resetDemo: () => set({ demoStep: 0 }),
  
  /**
   * Changes the active demo path and resets the step counter
   * This allows switching between different engineering domains
   */
  setDemoPath: (path: DemoPath) => set({ demoPath: path, demoStep: 0 }),
  
  /**
   * Enable or disable multiple product packaging mode
   * Used when a user requests to package multiple products together
   */
  setMultiProductMode: (enabled: boolean) => set({ isMultiProductMode: enabled }),
  
  /**
   * Sets the APS simulation stage
   * Used to track the current phase of the APS workflow
   */
  setApsSimulationStage: (stage: SimulationStage) => set({ apsSimulationStage: stage }),
  
  /**
   * Sets the APS morph value
   * Used to control the geometry optimization slider
   */
  setApsMorphValue: (value: number) => set({ apsMorphValue: value }),
  
  /**
   * Adds a chat message to the APS chat
   */
  addApsChatMessage: (message: ChatMessage) => set((state) => ({
    apsChatMessages: [...state.apsChatMessages, message]
  })),
  
  /**
   * Updates the last chat message with partial updates
   */
  updateLastApsChatMessage: (updates: Partial<ChatMessage>) => set((state) => {
    const messages = [...state.apsChatMessages];
    const lastIndex = messages.length - 1;
    if (lastIndex >= 0) {
      messages[lastIndex] = { ...messages[lastIndex], ...updates };
    }
    return { apsChatMessages: messages };
  }),
  
  /**
   * Sets the experiment config completely
   */
  setApsExperimentConfig: (config: ExperimentConfig) => set({ apsExperimentConfig: config }),
  
  /**
   * Updates the experiment config partially
   */
  updateApsExperimentConfig: (updates: Partial<ExperimentConfig>) => set((state) => ({
    apsExperimentConfig: { ...state.apsExperimentConfig, ...updates }
  })),
  
  /**
   * Sets the typing indicator
   */
  setApsIsTyping: (isTyping: boolean) => set({ apsIsTyping: isTyping }),
  
  /**
   * Resets APS-specific state to initial values
   * Called when entering or exiting the APS demo path
   */
  resetApsState: () => set({ 
    apsSimulationStage: SimulationStage.IDLE, 
    apsMorphValue: 0,
    apsChatMessages: [],
    apsExperimentConfig: DEFAULT_EXPERIMENT_CONFIG,
    apsIsTyping: false
  }),
}));

export default useDemoStore;
