import { DemoStep, ChatMessage } from './demoConstants';

/**
 * Latent Explorer V2 Demo Path
 * 
 * Automotive design optimization demo showcasing AI-driven autonomous
 * design discovery using morphing techniques, CAE simulations, and surrogate models.
 * Focuses on aerothermal, structural, and multiphysics optimization.
 */
export const LATENT_EXPLORER_V2_DEMO_STEPS: DemoStep[] = [
  {
    view: 'latent-explorer-v2',
    statusText: 'Exploration Ready',
    statusClass: 'bg-green-500',
    chatMessages: [
      { isAI: true, message: 'Welcome to Godela\'s Automotive Design Optimizer. I\'m an AI agent that can autonomously discover optimal car designs using morphing techniques and CAE simulations with surrogate models for aerothermal, structural, and multiphysics problems.' }
    ],
    progress: 0
  },
  {
    view: 'latent-explorer-v2',
    statusText: 'Initializing Model',
    statusClass: 'bg-blue-500',
    expectResponse: 'car model',
    chatMessages: [
      { isAI: true, message: 'Welcome to Godela\'s Automotive Design Optimizer. I\'m an AI agent that can autonomously discover optimal car designs using morphing techniques and CAE simulations with surrogate models for aerothermal, structural, and multiphysics problems.' },
      { isAI: false, message: 'Can you help me optimize a car body design for aerodynamics and cooling?' },
      { isAI: true, message: 'Absolutely! I can help you optimize car body shapes for aerodynamics, engine cooling, and battery thermal management. My approach uses:\n\n• AI-driven autonomous design exploration\n• Morphing techniques for parametric geometry\n• CAE simulations with surrogate models\n• Multi-objective optimization (aerothermal, structural, multiphysics)\n\nWould you like me to load a baseline sedan model to begin with?' }
    ],
    progress: 20
  },
  {
    view: 'latent-explorer-v2',
    statusText: 'Loading Parameters',
    statusClass: 'bg-yellow-500 animate-pulse',
    expectResponse: 'parameters',
    chatMessages: [
      { isAI: true, message: 'Welcome to Godela\'s Automotive Design Optimizer. I\'m an AI agent that can autonomously discover optimal car designs using morphing techniques and CAE simulations with surrogate models for aerothermal, structural, and multiphysics problems.' },
      { isAI: false, message: 'Can you help me optimize a car body design for aerodynamics and cooling?' },
      { isAI: true, message: 'Absolutely! I can help you optimize car body shapes for aerodynamics, engine cooling, and battery thermal management. My approach uses:\n\n• AI-driven autonomous design exploration\n• Morphing techniques for parametric geometry\n• CAE simulations with surrogate models\n• Multi-objective optimization (aerothermal, structural, multiphysics)\n\nWould you like me to load a baseline sedan model to begin with?' },
      { isAI: false, message: 'Yes, load a baseline sedan model.' },
      { isAI: true, message: 'I\'ve loaded a baseline sedan geometry. Using morphing parameters, I can explore the design space:\n\n**Body Morphing Controls:**\n• Roofline curvature (aerodynamics)\n• A-pillar angle (drag reduction)\n• Underbody diffuser geometry (downforce)\n• Cooling inlet sizing (thermal management)\n\n**Optimization Targets:**\n• Drag coefficient (Cd)\n• Cooling airflow rate (CFM)\n• Structural rigidity (torsional stiffness)\n\nWhat would you like to optimize first?' }
    ],
    progress: 40
  },
  {
    view: 'latent-explorer-v2',
    statusText: 'Running Simulation',
    statusClass: 'bg-indigo-500 animate-pulse',
    expectResponse: 'run simulation',
    chatMessages: [
      { isAI: true, message: 'Welcome to Godela\'s Automotive Design Optimizer. I\'m an AI agent that can autonomously discover optimal car designs using morphing techniques and CAE simulations with surrogate models for aerothermal, structural, and multiphysics problems.' },
      { isAI: false, message: 'Can you help me optimize a car body design for aerodynamics and cooling?' },
      { isAI: true, message: 'Absolutely! I can help you optimize car body shapes for aerodynamics, engine cooling, and battery thermal management. My approach uses:\n\n• AI-driven autonomous design exploration\n• Morphing techniques for parametric geometry\n• CAE simulations with surrogate models\n• Multi-objective optimization (aerothermal, structural, multiphysics)\n\nWould you like me to load a baseline sedan model to begin with?' },
      { isAI: false, message: 'Yes, load a baseline sedan model.' },
      { isAI: true, message: 'I\'ve loaded a baseline sedan geometry. Using morphing parameters, I can explore the design space:\n\n**Body Morphing Controls:**\n• Roofline curvature (aerodynamics)\n• A-pillar angle (drag reduction)\n• Underbody diffuser geometry (downforce)\n• Cooling inlet sizing (thermal management)\n\n**Optimization Targets:**\n• Drag coefficient (Cd)\n• Cooling airflow rate (CFM)\n• Structural rigidity (torsional stiffness)\n\nWhat would you like to optimize first?' },
      { isAI: false, message: 'Let\'s optimize for aerodynamics and battery cooling.' },
      { isAI: true, message: 'Excellent choice for electric vehicles! I\'m setting up a multi-objective optimization:\n\n**Primary objectives:**\n1. Minimize drag coefficient (Cd) → maximize range\n2. Maximize battery pack cooling efficiency → thermal safety\n\nI\'ll use my surrogate models to accelerate the CAE simulations. Instead of running full CFD for each design variant (8 hours each), my neural network surrogate can predict performance in seconds with 98.5% accuracy.\n\nRunning baseline simulation now...' }
    ],
    progress: 60
  },
  {
    view: 'latent-explorer-v2',
    statusText: 'Optimizing Design',
    statusClass: 'bg-purple-500 animate-pulse',
    expectResponse: 'optimize',
    chatMessages: [
      { isAI: true, message: 'Welcome to Godela\'s Automotive Design Optimizer. I\'m an AI agent that can autonomously discover optimal car designs using morphing techniques and CAE simulations with surrogate models for aerothermal, structural, and multiphysics problems.' },
      { isAI: false, message: 'Can you help me optimize a car body design for aerodynamics and cooling?' },
      { isAI: true, message: 'Absolutely! I can help you optimize car body shapes for aerodynamics, engine cooling, and battery thermal management. My approach uses:\n\n• AI-driven autonomous design exploration\n• Morphing techniques for parametric geometry\n• CAE simulations with surrogate models\n• Multi-objective optimization (aerothermal, structural, multiphysics)\n\nWould you like me to load a baseline sedan model to begin with?' },
      { isAI: false, message: 'Yes, load a baseline sedan model.' },
      { isAI: true, message: 'I\'ve loaded a baseline sedan geometry. Using morphing parameters, I can explore the design space:\n\n**Body Morphing Controls:**\n• Roofline curvature (aerodynamics)\n• A-pillar angle (drag reduction)\n• Underbody diffuser geometry (downforce)\n• Cooling inlet sizing (thermal management)\n\n**Optimization Targets:**\n• Drag coefficient (Cd)\n• Cooling airflow rate (CFM)\n• Structural rigidity (torsional stiffness)\n\nWhat would you like to optimize first?' },
      { isAI: false, message: 'Let\'s optimize for aerodynamics and battery cooling.' },
      { isAI: true, message: 'Excellent choice for electric vehicles! I\'m setting up a multi-objective optimization:\n\n**Primary objectives:**\n1. Minimize drag coefficient (Cd) → maximize range\n2. Maximize battery pack cooling efficiency → thermal safety\n\nI\'ll use my surrogate models to accelerate the CAE simulations. Instead of running full CFD for each design variant (8 hours each), my neural network surrogate can predict performance in seconds with 98.5% accuracy.\n\nRunning baseline simulation now...' },
      { isAI: false, message: 'Show me the baseline results.' },
      { isAI: true, message: 'Baseline simulation complete! Here are the results:\n\n**Aerodynamics:**\n• Drag Coefficient (Cd): 0.32\n• Frontal Area: 2.45 m²\n• Drag Force @ 100 km/h: 285 N\n\n**Thermal Performance:**\n• Battery Cooling Airflow: 420 CFM\n• Peak Battery Temp: 42°C\n• Cooling Efficiency: 65%\n\n**Range Impact:**\n• Estimated Range: 385 km\n\nI\'ve mapped the entire design space using 250 morphing variations. The latent space explorer shows each design variant. Now let me autonomously search for the optimal configuration...' }
    ],
    progress: 80
  },
  {
    view: 'latent-explorer-v2',
    statusText: 'Results Ready',
    statusClass: 'bg-green-500',
    chatMessages: [
      { isAI: true, message: 'Welcome to Godela\'s Automotive Design Optimizer. I\'m an AI agent that can autonomously discover optimal car designs using morphing techniques and CAE simulations with surrogate models for aerothermal, structural, and multiphysics problems.' },
      { isAI: false, message: 'Can you help me optimize a car body design for aerodynamics and cooling?' },
      { isAI: true, message: 'Absolutely! I can help you optimize car body shapes for aerodynamics, engine cooling, and battery thermal management. My approach uses:\n\n• AI-driven autonomous design exploration\n• Morphing techniques for parametric geometry\n• CAE simulations with surrogate models\n• Multi-objective optimization (aerothermal, structural, multiphysics)\n\nWould you like me to load a baseline sedan model to begin with?' },
      { isAI: false, message: 'Yes, load a baseline sedan model.' },
      { isAI: true, message: 'I\'ve loaded a baseline sedan geometry. Using morphing parameters, I can explore the design space:\n\n**Body Morphing Controls:**\n• Roofline curvature (aerodynamics)\n• A-pillar angle (drag reduction)\n• Underbody diffuser geometry (downforce)\n• Cooling inlet sizing (thermal management)\n\n**Optimization Targets:**\n• Drag coefficient (Cd)\n• Cooling airflow rate (CFM)\n• Structural rigidity (torsional stiffness)\n\nWhat would you like to optimize first?' },
      { isAI: false, message: 'Let\'s optimize for aerodynamics and battery cooling.' },
      { isAI: true, message: 'Excellent choice for electric vehicles! I\'m setting up a multi-objective optimization:\n\n**Primary objectives:**\n1. Minimize drag coefficient (Cd) → maximize range\n2. Maximize battery pack cooling efficiency → thermal safety\n\nI\'ll use my surrogate models to accelerate the CAE simulations. Instead of running full CFD for each design variant (8 hours each), my neural network surrogate can predict performance in seconds with 98.5% accuracy.\n\nRunning baseline simulation now...' },
      { isAI: false, message: 'Show me the baseline results.' },
      { isAI: true, message: 'Baseline simulation complete! Here are the results:\n\n**Aerodynamics:**\n• Drag Coefficient (Cd): 0.32\n• Frontal Area: 2.45 m²\n• Drag Force @ 100 km/h: 285 N\n\n**Thermal Performance:**\n• Battery Cooling Airflow: 420 CFM\n• Peak Battery Temp: 42°C\n• Cooling Efficiency: 65%\n\n**Range Impact:**\n• Estimated Range: 385 km\n\nI\'ve mapped the entire design space using 250 morphing variations. The latent space explorer shows each design variant. Now let me autonomously search for the optimal configuration...' },
      { isAI: false, message: 'Please find the optimal design autonomously.' },
      { isAI: true, message: '✅ **Autonomous optimization complete!**\n\nAfter exploring 250 design variants using AI-driven morphing and surrogate CAE models, I discovered an optimal configuration:\n\n**Optimized Body Geometry:**\n• Roofline curvature: +8% smoother (Kappa reduction)\n• A-pillar angle: 68° → 62° (reduced)\n• Active underbody diffuser: Extended 12 cm\n• Battery cooling inlet: Repositioned + 15% larger\n\n**Performance Gains:**\n• Drag Coefficient: 0.32 → 0.24 (-25%)\n• Battery Cooling: 420 → 580 CFM (+38%)\n• Peak Battery Temp: 42°C → 35°C (-7°C)\n• Estimated Range: 385 → 465 km (+80 km, +21%)\n\n**Time Saved:**\n• Traditional CAE workflow: ~2,000 hours\n• Godela AI approach: 3.5 hours (99.8% faster)\n\nClick through the latent space points to explore different design variants. Point E represents the optimal configuration.' }
    ],
    progress: 100
  }
];
