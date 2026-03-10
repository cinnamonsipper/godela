import { DemoStep } from './demoConstants';

/**
 * Phone Packaging Design and Simulation Demo Path
 * 
 * This sequence guides engineers through designing specialized protective packaging
 * for smartphones, focusing on precise fit, drop protection, and material optimization.
 * 
 * The workflow enables:
 * - Upload or selection of smartphone 3D models
 * - Creation of snug-fitting protective packaging with precise tolerances
 * - Impact simulation focused on corner and edge protection
 * - Material optimization for sustainability while maintaining protection
 * - Specialized drop test simulations for common smartphone damage scenarios
 * 
 * The progression includes:
 * 1. Data Upload - Upload or select a 3D phone model
 * 2. Packaging Design - Generate protective packaging designed for the phone
 * 3. Simulation - Test packaging with specialized phone drop scenarios
 * 4. Report - Download designs and simulation results
 */
export const PHONE_PACKAGING_DEMO_STEPS: DemoStep[] = [
  { // Step 0: Initial State
    statusText: "Idle - Ready",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" }
    ],
    view: "welcome",
    progress: 0
  },
  { // Step 1: Data Upload - File Upload
    statusText: "Awaiting Phone Model",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for a smartphone" },
      { isAI: true, message: "Upload your smartphone model (STL or STEP format), or I can use a sample phone model." }
    ],
    view: "packaging-upload",
    progress: 25,
    expectResponse: "Let's use your sample phone model."
  },
  { // Step 2: Product Visualization
    statusText: "Phone Model Loaded",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for a smartphone" },
      { isAI: true, message: "Upload your smartphone model (STL or STEP format), or I can use a sample phone model." },
      { isAI: false, message: "Let's use your sample phone model." },
      { isAI: true, message: "Phone model loaded. Dimensions: 15cm x 7.5cm x 0.8cm. Weight: 185g. What kind of packaging requirements do you have for this phone?" }
    ],
    view: "packaging-design",
    progress: 50,
    expectResponse: "Design a drop-proof package that protects the screen and corners."
  },
  { // Step 3: Packaging Design & Simulation Setup
    statusText: "Generating Phone Packaging",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for a smartphone" },
      { isAI: true, message: "Upload your smartphone model (STL or STEP format), or I can use a sample phone model." },
      { isAI: false, message: "Let's use your sample phone model." },
      { isAI: true, message: "Phone model loaded. Dimensions: 15cm x 7.5cm x 0.8cm. Weight: 185g. What kind of packaging requirements do you have for this phone?" },
      { isAI: false, message: "Design a drop-proof package that protects the screen and corners." },
      { isAI: true, message: "I've generated a protective phone packaging design with reinforced corners and 3mm air cushioning around the screen. It uses 60% recycled materials while maintaining structural integrity. You can now test this design with smartphone-specific simulations." }
    ],
    view: "packaging-design",
    progress: 75, 
    expectResponse: "Run a 1.5 meter corner drop test."
  },
  { // Step 4: Simulation
    statusText: "Running Phone Simulation",
    statusClass: "bg-yellow-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for a smartphone" },
      { isAI: true, message: "Upload your smartphone model (STL or STEP format), or I can use a sample phone model." },
      { isAI: false, message: "Let's use your sample phone model." },
      { isAI: true, message: "Phone model loaded. Dimensions: 15cm x 7.5cm x 0.8cm. Weight: 185g. What kind of packaging requirements do you have for this phone?" },
      { isAI: false, message: "Design a drop-proof package that protects the screen and corners." },
      { isAI: true, message: "I've generated a protective phone packaging design with reinforced corners and 3mm air cushioning around the screen. It uses 60% recycled materials while maintaining structural integrity. You can now test this design with smartphone-specific simulations." },
      { isAI: false, message: "Run a 1.5 meter corner drop test." },
      { isAI: true, message: "Running 1.5 meter corner drop simulation. Calculating impact forces and screen protection capabilities..." }
    ],
    view: "packaging-simulation",
    progress: 90,
    expectResponse: "What if we increase the recycled material to 80%?"
  },
  { // Step 5: Simulation Results
    statusText: "Simulation Complete",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for a smartphone" },
      { isAI: true, message: "Upload your smartphone model (STL or STEP format), or I can use a sample phone model." },
      { isAI: false, message: "Let's use your sample phone model." },
      { isAI: true, message: "Phone model loaded. Dimensions: 15cm x 7.5cm x 0.8cm. Weight: 185g. What kind of packaging requirements do you have for this phone?" },
      { isAI: false, message: "Design a drop-proof package that protects the screen and corners." },
      { isAI: true, message: "I've generated a protective phone packaging design with reinforced corners and 3mm air cushioning around the screen. It uses 60% recycled materials while maintaining structural integrity. You can now test this design with smartphone-specific simulations." },
      { isAI: false, message: "Run a 1.5 meter corner drop test." },
      { isAI: true, message: "Running 1.5 meter corner drop simulation. Calculating impact forces and screen protection capabilities..." },
      { isAI: true, message: "Simulation complete. Result: PASS. Corner impact deceleration: 24G. Screen stress: 0.17MPa - well below glass fracture threshold of 27-41MPa. Packaging absorbed 95% of corner impact energy. No damage to phone screen or body predicted. You can download the packaging design or simulation report using the buttons below." },
      { isAI: false, message: "What if we increase the recycled material to 80%?" },
      { isAI: true, message: "Simulating with 80% recycled materials... The package passes most tests but shows borderline performance on corner drop tests. The maximum stress on the phone increases by 22% but remains below damage thresholds. For mass production, I recommend additional physical validation tests, but the simulation indicates it should be acceptable with potentially a 5% reduction in overall protection." }
    ],
    view: "packaging-simulation",
    progress: 100,
    disableInput: true
  }
];