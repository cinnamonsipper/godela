/**
 * Demo Paths Configuration System
 * 
 * This module defines the content and progression for each demo path in Godela.
 * Each path consists of a sequence of steps that guide users through a specific
 * engineering problem domain while maintaining consistent UI patterns.
 * 
 * The architecture separates demo content (text, status, progression) from the
 * application logic, allowing easy modification of demo scenarios without
 * changing core application code.
 */

/**
 * Represents a single chat message in the conversation
 */
export interface ChatMessage {
  /** Whether the message is from the AI (true) or user (false) */
  isAI: boolean;
  /** The text content of the message */
  message: string;
  /** Whether to show a 3D model with this message */
  showModel?: boolean;
  /** The Sketchfab model ID to display (if showModel is true) */
  sketchfabModelId?: string;
  /** Embed code for the model (if provided) */
  embedCode?: string;
}

/**
 * Defines a single step in a demo path sequence
 * Each step represents a moment in the user journey through the application
 */
export interface DemoStep {
  /** Status text shown in the header during this step */
  statusText: string;
  /** CSS class for the status indicator (color coding) */
  statusClass: string;
  /** Array of chat messages to display during this step */
  chatMessages: ChatMessage[];
  /** Which view component to display (welcome, problem-analysis, etc.) */
  view: string;
  /** Progress percentage (0-100) for the progress indicator */
  progress: number;
  /** Whether to disable user input in the chat during this step */
  disableInput?: boolean;
  /** Expected user response to match (if any) */
  expectResponse?: string;
  /** Sketchfab model ID to display */
  sketchfabModelId?: string;
}

// Import phone packaging demo steps
import { PHONE_PACKAGING_DEMO_STEPS } from './phonePackagingDemoSteps';
// Export phone packaging demo steps
export { PHONE_PACKAGING_DEMO_STEPS };

/**
 * Airfoil Demo Path
 * 
 * This sequence guides users through analyzing how changing 
 * the angle of attack and thickness of an airfoil impacts lift & drag.
 * 
 * The progression follows the four-stage workflow:
 * 1. Problem Analysis - Understanding the engineering challenge
 * 2. Data Processing - Configuring parameters and data sources
 * 3. Model Building - Creating a physics-informed ML model
 * 4. Simulation - Exploring the results and insights
 */
export const DEMO_STEPS: DemoStep[] = [
  { // Step 0: Initial State
    statusText: "Idle - Ready",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" }
    ],
    view: "welcome",
    progress: 0
  },
  { // Step 1: Problem Analysis
    statusText: "Analyzing Problem",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag" },
      { isAI: true, message: "Let's first analyze the key parameters that will affect your airfoil's performance, does this look right?" }
    ],
    view: "problem-analysis",
    progress: 25,
    expectResponse: "Yes, that looks good. Please continue."
  },
  { // Step 2: Data Processing
    statusText: "Awaiting Data",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag" },
      { isAI: true, message: "Let's first analyze the key parameters that will affect your airfoil's performance, does this look right?" },
      { isAI: false, message: "Yes, that looks good. Please continue." },
      { isAI: true, message: "Upload your CAD, simulation or experimental data." }
    ],
    view: "data-processing",
    progress: 50,
    expectResponse: "Let's use your sample dataset."
  },
  { // Step 3: Model Building
    statusText: "Model Configuration",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag" },
      { isAI: true, message: "Let's first analyze the key parameters that will affect your airfoil's performance, does this look right?" },
      { isAI: false, message: "Yes, that looks good. Please continue." },
      { isAI: true, message: "Upload your CAD, simulation or experimental data." },
      { isAI: false, message: "Let's use your sample dataset." },
      { isAI: true, message: "Processing data... building physics-informed model that predicts lift and drag." }
    ],
    view: "model-builder",
    progress: 75,
    expectResponse: "That looks perfect. How accurate is this model?"
  },
  { // Step 4: Simulation Ready
    statusText: "Ready to Simulate",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag" },
      { isAI: true, message: "Let's first analyze the key parameters that will affect your airfoil's performance, does this look right?" },
      { isAI: false, message: "Yes, that looks good. Please continue." },
      { isAI: true, message: "Upload your CAD, simulation or experimental data." },
      { isAI: false, message: "Let's use your sample dataset." },
      { isAI: true, message: "Processing data... building physics-informed model that predicts lift and drag." },
      { isAI: false, message: "That looks good. Build the model" },
      { isAI: true, message: "Your simulation is ready! Use the sliders to test different parameters." }
    ],
    view: "simulate",
    progress: 90,
    expectResponse: "Can you tell me what happens if I increase the angle of attack?"
  },
  { // Step 5: Interactive Simulation
    statusText: "Interactive Simulation",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Build me a model to simulate how changing the angle of attack and thickness of my airfoil impacts lift & drag" },
      { isAI: true, message: "Let's first analyze the key parameters that will affect your airfoil's performance, does this look right?" },
      { isAI: false, message: "Yes, that looks good. Please continue." },
      { isAI: true, message: "Upload your CAD, simulation or experimental data." },
      { isAI: false, message: "Let's use your sample dataset." },
      { isAI: true, message: "Processing data... building physics-informed model that predicts lift and drag." },
      { isAI: false, message: "That looks good. Build the model" },
      { isAI: true, message: "Your simulation is ready! Use the sliders to test different parameters." },
      { isAI: false, message: "Can you tell me what happens if I increase the angle of attack?" },
      { isAI: true, message: "Increasing the angle of attack boosts lift up to 10°, then stalls. Try adjusting both thickness and angle for the best lift-to-drag ratio." }
    ],
    view: "simulate",
    progress: 100,
    disableInput: true
  }
];

/**
 * Aircraft Aerodynamics Demo Path
 * 
 * This sequence guides engineers through exploring the aerodynamic performance and stability
 * of an aircraft across its full operational flight envelope, using a latent space visualization
 * approach to optimize designs based on CAD geometries.
 * 
 * This demo follows the same four-stage workflow structure but introduces a more
 * sophisticated visualization paradigm with:
 * - Interactive latent space design exploration
 * - CAD geometry integration analysis
 * - Sparse data point interpolation
 * - Multi-parameter optimization across flight conditions
 * 
 * The progression includes:
 * 1. Problem Analysis - Understanding aircraft stability challenges across flight envelope
 * 2. Data Processing - Configuring CAD geometries and sparse CFD data points
 * 3. Model Building - Creating a physics-informed neural network surrogate model
 * 4. Simulation - Interactive latent space exploration for optimal design discovery
 */
export const AIRCRAFT_AERODYNAMICS_DEMO_STEPS: DemoStep[] = [
  { // Step 0: Initial State
    statusText: "Idle - Ready",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" }
    ],
    view: "welcome",
    progress: 0
  },
  { // Step 1: Data Processing
    statusText: "Loading CAD Geometries",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize the design of my aircraft for fuel efficiency" },
      { isAI: true, message: "Upload your CAD geometries and CFD data, or use my sample dataset." }
    ],
    view: "data-processing",
    progress: 50,
    expectResponse: "Let's use your sample dataset for now."
  },
  { // Step 2: Model Building
    statusText: "Building Surrogate Model",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize the design of my aircraft for fuel efficiency" },
      { isAI: true, message: "Upload your CAD geometries and CFD data, or use my sample dataset." },
      { isAI: false, message: "Let's use your sample dataset for now." },
      { isAI: true, message: "Building physics-informed neural network to map design space and predict performance across flight conditions." }
    ],
    view: "model-builder",
    progress: 75,
    expectResponse: "This looks promising. How accurate is this model across the flight envelope?"
  },
  { // Step 3: Latent Space Explorer Ready
    statusText: "Latent Space Ready",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize the design of my aircraft for fuel efficiency" },
      { isAI: true, message: "Upload your CAD geometries and CFD data, or use my sample dataset." },
      { isAI: false, message: "Let's use your sample dataset for now." },
      { isAI: true, message: "Building physics-informed neural network to map design space and predict performance across flight conditions." },
      { isAI: false, message: "This looks promising. How accurate is this model across the flight envelope?" },
      { isAI: true, message: "96% accuracy at data points, 92% on validation. Latent space explorer ready. Click points to explore designs." }
    ],
    view: "simulate",
    progress: 90,
    expectResponse: "Show me where the most stable designs are in this latent space."
  },
  { // Step 4: Interactive Latent Space Exploration
    statusText: "Interactive Exploration",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize the design of my aircraft for fuel efficiency" },
      { isAI: true, message: "Upload your CAD geometries and CFD data, or use my sample dataset." },
      { isAI: false, message: "Let's use your sample dataset for now." },
      { isAI: true, message: "Building physics-informed neural network to map design space and predict performance across flight conditions." },
      { isAI: false, message: "This looks promising. How accurate is this model across the flight envelope?" },
      { isAI: true, message: "96% accuracy at data points, 92% on validation. Latent space explorer ready. Click points to explore designs." },
      { isAI: false, message: "Show me where the most stable designs are in this latent space." },
      { isAI: true, message: "Highlighted region shows optimal stability. Upper right designs have 30% better pitch damping and improved Dutch roll characteristics." }
    ],
    view: "simulate",
    progress: 100,
    disableInput: true
  }
];

/**
 * Car Aerodynamics Demo Path
 * 
 * This sequence guides engineers through simulating airflow over car designs
 * using STL/CAD files and the NVIDIA Modulus API for physics-based simulation.
 * 
 * The workflow enables:
 * - Upload of STL/CAD geometries directly through chat
 * - Detailed CFD simulation without the complexity of traditional tools
 * - Real-time visualization of pressure, velocity, and aerodynamic forces
 * - Parameter exploration for drag and lift optimization
 * 
 * The progression includes:
 * 1. Problem Analysis - Understanding car aerodynamics simulation requirements
 * 2. Data Processing - Uploading or selecting car design files (STL/CAD)
 * 3. Model Building - Configuring simulation parameters and setting up the model
 * 4. Simulation - Visualizing and analyzing aerodynamic performance
 */
export const CAR_AERODYNAMICS_DEMO_STEPS: DemoStep[] = [
  { // Step 0: Initial State
    statusText: "Idle - Ready",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" }
    ],
    view: "welcome",
    progress: 0
  },
  { // Step 1: Data Processing - File Upload (Skip the conceptual slides)
    statusText: "Awaiting CAD File",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me simulate airflow over this car design" },
      { isAI: true, message: "Upload your car design (STL or CAD format), or I can use a sample." }
    ],
    view: "car-data-processing",
    progress: 50,
    expectResponse: "Let's use your sample car design for now."
  },
  { // Step 2: Jump Straight to Simulation with Controls
    statusText: "Simulation Ready",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me simulate airflow over this car design" },
      { isAI: true, message: "Upload your car design (STL or CAD format), or I can use a sample." },
      { isAI: false, message: "Let's use your sample car design for now." },
      { isAI: true, message: "Great! I've loaded the sample car design. Adjust the parameters and run the simulation." }
    ],
    view: "car-simulate",
    progress: 100,
    expectResponse: "What would happen if we increased the velocity to 60 m/s?"
  },
  { // Step 3: Interactive Simulation 
    statusText: "Interactive Simulation",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me simulate airflow over this car design" },
      { isAI: true, message: "Upload your car design (STL or CAD format), or I can use a sample." },
      { isAI: false, message: "Let's use your sample car design for now." },
      { isAI: true, message: "Great! I've loaded the sample car design. Adjust the parameters and run the simulation." },
      { isAI: false, message: "What would happen if we increased the velocity to 60 m/s?" },
      { isAI: true, message: "At 60 m/s, drag increases to 405N (from 180N) and downforce to 270N (from 120N). Drag scales with velocity squared, so 1.5x speed gives 2.25x more drag. You'll see stronger pressure differentials and vortices." }
    ],
    view: "car-simulate",
    progress: 100,
    disableInput: true
  }
];

/**
 * Packaging Design and Simulation Demo Path
 * 
 * This sequence guides product engineers through designing protective packaging
 * and testing its resilience to various transportation and handling conditions.
 * 
 * The workflow enables:
 * - Upload of product models in STL/STEP format
 * - Automated generation of protective packaging
 * - Simulation of drop tests, impacts, and transportation conditions
 * - Real-time visualization of stress and deformation
 * - Downloadable packaging designs and simulation reports
 * 
 * The progression includes:
 * 1. Data Upload - Upload or select a 3D product model
 * 2. Packaging Design - Generate protective packaging around the product
 * 3. Simulation - Test packaging resilience under various conditions
 * 4. Report - Download designs and simulation results
 */
export const PACKAGING_DESIGN_DEMO_STEPS: DemoStep[] = [
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
    statusText: "Awaiting Product Model",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for my product" },
      { isAI: true, message: "Upload your product model (STL or STEP format), or I can use a sample bottle." }
    ],
    view: "packaging-upload",
    progress: 25,
    expectResponse: "Let's use your sample bottle for now."
  },
  { // Step 2: Product Visualization
    statusText: "Product Loaded",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for my product" },
      { isAI: true, message: "Upload your product model (STL or STEP format), or I can use a sample bottle." },
      { isAI: false, message: "Let's use your sample bottle for now." },
      { isAI: true, message: "Product loaded. Dimensions: 25cm x 8cm x 8cm. Volume: 1250cm³. What kind of packaging would you like me to design?" }
    ],
    view: "packaging-design",
    progress: 50,
    expectResponse: "Design a protective package for this bottle."
  },
  { // Step 3: Packaging Design & Simulation Setup
    statusText: "Generating Packaging",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for my product" },
      { isAI: true, message: "Upload your product model (STL or STEP format), or I can use a sample bottle." },
      { isAI: false, message: "Let's use your sample bottle for now." },
      { isAI: true, message: "Product loaded. Dimensions: 25cm x 8cm x 8cm. Volume: 1250cm³. What kind of packaging would you like me to design?" },
      { isAI: false, message: "Design a protective package for this bottle." },
      { isAI: true, message: "I've generated a protective packaging design with 20mm of foam cushioning and a corrugated outer box. You can now test this design with simulations." }
    ],
    view: "packaging-design",
    progress: 75, 
    expectResponse: "Run a 1 meter drop test."
  },
  { // Step 4: Simulation
    statusText: "Running Simulation",
    statusClass: "bg-yellow-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for my product" },
      { isAI: true, message: "Upload your product model (STL or STEP format), or I can use a sample bottle." },
      { isAI: false, message: "Let's use your sample bottle for now." },
      { isAI: true, message: "Product loaded. Dimensions: 25cm x 8cm x 8cm. Volume: 1250cm³. What kind of packaging would you like me to design?" },
      { isAI: false, message: "Design a protective package for this bottle." },
      { isAI: true, message: "I've generated a protective packaging design with 20mm of foam cushioning and a corrugated outer box. You can now test this design with simulations." },
      { isAI: false, message: "Run a 1 meter drop test." },
      { isAI: true, message: "Running 1 meter vertical drop simulation. Calculating impact forces and packaging deformation..." }
    ],
    view: "packaging-simulation",
    progress: 90,
    expectResponse: "Simulate impact after a flight – will the bottle dimple?"
  },
  { // Step 5: Simulation Results
    statusText: "Simulation Complete",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me design protective packaging for my product" },
      { isAI: true, message: "Upload your product model (STL or STEP format), or I can use a sample bottle." },
      { isAI: false, message: "Let's use your sample bottle for now." },
      { isAI: true, message: "Product loaded. Dimensions: 25cm x 8cm x 8cm. Volume: 1250cm³. What kind of packaging would you like me to design?" },
      { isAI: false, message: "Design a protective package for this bottle." },
      { isAI: true, message: "Generating protective packaging with internal cushioning. The design has 20mm of foam cushioning and a corrugated outer box. Would you like to test this design with a simulation?" },
      { isAI: false, message: "Run a 1 meter drop test." },
      { isAI: true, message: "Running 1 meter vertical drop simulation. Calculating impact forces and packaging deformation..." },
      { isAI: true, message: "Simulation complete. Result: PASS. Maximum deceleration: 28G. Maximum stress: 0.42MPa. Cushioning absorbed 92% of impact energy. No damage to product predicted. You can download the packaging design or simulation report using the buttons below." },
      { isAI: false, message: "Simulate impact after a flight – will the bottle dimple?" },
      { isAI: true, message: "Simulating vibration and pressure changes during air transport... Result: The cushioning design is sufficient for typical flight conditions. There's a 12% risk of bottle dimpling at the base under sustained 38G lateral acceleration, which could occur in severe turbulence. I recommend increasing corner cushioning by 5mm for air transport." }
    ],
    view: "packaging-simulation",
    progress: 100,
    disableInput: true
  }
];

/**
 * Amazon Demo Path
 * 
 * This sequence guides users through building ML models for Amazon-scale logistics,
 * fulfillment center optimization, and supply chain simulation.
 * 
 * The workflow enables:
 * - Analysis of package flow and logistics patterns
 * - Warehouse automation and robotics optimization
 * - Predictive models for inventory management
 * - Supply chain resilience simulation
 * - Real-time visualization of fulfillment center operations
 * 
 * The progression includes:
 * 1. Problem Analysis - Understanding logistics challenges
 * 2. Data Processing - Processing warehouse and shipping data
 * 3. Model Building - Creating predictive logistics models
 * 4. Simulation - Testing optimization strategies
 */
export const AMAZON_DEMO_STEPS: DemoStep[] = [
  { // Step 0: Initial State
    statusText: "Idle - Ready",
    statusClass: "bg-green-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" }
    ],
    view: "welcome",
    progress: 0
  },
  { // Step 1: Problem Analysis
    statusText: "Analyzing Logistics Problem",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize Amazon warehouse operations" },
      { isAI: true, message: "I'll help you build predictive models for warehouse optimization. Let me analyze your fulfillment center operations. What specific logistics challenge would you like to focus on?" }
    ],
    view: "problem-analysis",
    progress: 25,
    expectResponse: "Optimize package sorting and delivery routing"
  },
  { // Step 2: Data Processing
    statusText: "Processing Logistics Data",
    statusClass: "bg-blue-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize Amazon warehouse operations" },
      { isAI: true, message: "I'll help you build predictive models for warehouse optimization. Let me analyze your fulfillment center operations. What specific logistics challenge would you like to focus on?" },
      { isAI: false, message: "Optimize package sorting and delivery routing" },
      { isAI: true, message: "Processing warehouse data: 2.3M packages/day, 450 robotic units, 12 sorting zones. I'm building a physics-informed model that accounts for package flow dynamics, robot coordination, and delivery route optimization." }
    ],
    view: "data-processing",
    progress: 50, 
    expectResponse: "Build the ML model for real-time optimization"
  },
  { // Step 3: Model Building
    statusText: "Building Optimization Model",
    statusClass: "bg-yellow-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize Amazon warehouse operations" },
      { isAI: true, message: "I'll help you build predictive models for warehouse optimization. Let me analyze your fulfillment center operations. What specific logistics challenge would you like to focus on?" },
      { isAI: false, message: "Optimize package sorting and delivery routing" },
      { isAI: true, message: "Processing warehouse data: 2.3M packages/day, 450 robotic units, 12 sorting zones. I'm building a physics-informed model that accounts for package flow dynamics, robot coordination, and delivery route optimization." },
      { isAI: false, message: "Build the ML model for real-time optimization" },
      { isAI: true, message: "Model architecture complete. Neural network trained on logistics flow patterns with reinforcement learning for dynamic routing. The model predicts optimal sorting sequences and delivery routes in real-time, accounting for traffic, weather, and package priority." }
    ],
    view: "model-building",
    progress: 75,
    expectResponse: "Run simulation for Black Friday conditions"
  },
  { // Step 4: Simulation
    statusText: "Running Logistics Simulation",
    statusClass: "bg-indigo-500",
    chatMessages: [
      { isAI: true, message: "What do you want to simulate?" },
      { isAI: false, message: "Help me optimize Amazon warehouse operations" },
      { isAI: true, message: "I'll help you build predictive models for warehouse optimization. Let me analyze your fulfillment center operations. What specific logistics challenge would you like to focus on?" },
      { isAI: false, message: "Optimize package sorting and delivery routing" },
      { isAI: true, message: "Processing warehouse data: 2.3M packages/day, 450 robotic units, 12 sorting zones. I'm building a physics-informed model that accounts for package flow dynamics, robot coordination, and delivery route optimization." },
      { isAI: false, message: "Build the ML model for real-time optimization" },
      { isAI: true, message: "Model architecture complete. Neural network trained on logistics flow patterns with reinforcement learning for dynamic routing. The model predicts optimal sorting sequences and delivery routes in real-time, accounting for traffic, weather, and package priority." },
      { isAI: false, message: "Run simulation for Black Friday conditions" },
      { isAI: true, message: "Simulating Black Friday 5x surge: 11.5M packages/day. Results: 23% improvement in throughput, 31% reduction in delivery time, 18% decrease in operational costs. The model successfully coordinated 450 robots with 97.2% uptime and optimized 1.2M delivery routes. Peak processing achieved 847 packages/minute with zero bottlenecks." }
    ],
    view: "simulation-results",
    progress: 100,
    disableInput: true
  }
];