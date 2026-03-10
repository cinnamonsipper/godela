import { DemoStep, ChatMessage } from './demoConstants';

/**
 * Latent Explorer Demo Path
 * 
 * Reimagined version of the aircraft optimization demo but with
 * the modern, immersive UI of the sandbox demo.
 */
export const LATENT_EXPLORER_DEMO_STEPS: DemoStep[] = [
  {
    view: 'latent-explorer',
    statusText: 'Exploration Ready',
    statusClass: 'bg-green-500',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Latent Space Explorer. I can help you optimize aircraft design parameters and visualize aerodynamic performance in real-time.' }
    ],
    progress: 0
  },
  {
    view: 'latent-explorer',
    statusText: 'Initializing Model',
    statusClass: 'bg-blue-500',
    expectResponse: 'aircraft model',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Latent Space Explorer. I can help you optimize aircraft design parameters and visualize aerodynamic performance in real-time.' },
      { isAI: false, message: 'Can you help me optimize an aircraft design?' },
      { isAI: true, message: 'Absolutely! I\'ll help you optimize aircraft design parameters for maximum aerodynamic efficiency. Would you like me to load a standard aircraft model to begin with?' }
    ],
    progress: 20
  },
  {
    view: 'latent-explorer',
    statusText: 'Loading Parameters',
    statusClass: 'bg-yellow-500 animate-pulse',
    expectResponse: 'parameters',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Latent Space Explorer. I can help you optimize aircraft design parameters and visualize aerodynamic performance in real-time.' },
      { isAI: false, message: 'Can you help me optimize an aircraft design?' },
      { isAI: true, message: 'Absolutely! I\'ll help you optimize aircraft design parameters for maximum aerodynamic efficiency. Would you like me to load a standard aircraft model to begin with?' },
      { isAI: false, message: 'Yes, load a standard aircraft model.' },
      { isAI: true, message: 'I\'ve loaded a commercial aircraft model. You can now explore different design parameters such as wing sweep angle, fuselage length, and engine position to optimize for fuel efficiency, range, and stability. What specific aspect would you like to focus on first?' }
    ],
    progress: 40
  },
  {
    view: 'latent-explorer',
    statusText: 'Running Simulation',
    statusClass: 'bg-indigo-500 animate-pulse',
    expectResponse: 'run simulation',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Latent Space Explorer. I can help you optimize aircraft design parameters and visualize aerodynamic performance in real-time.' },
      { isAI: false, message: 'Can you help me optimize an aircraft design?' },
      { isAI: true, message: 'Absolutely! I\'ll help you optimize aircraft design parameters for maximum aerodynamic efficiency. Would you like me to load a standard aircraft model to begin with?' },
      { isAI: false, message: 'Yes, load a standard aircraft model.' },
      { isAI: true, message: 'I\'ve loaded a commercial aircraft model. You can now explore different design parameters such as wing sweep angle, fuselage length, and engine position to optimize for fuel efficiency, range, and stability. What specific aspect would you like to focus on first?' },
      { isAI: false, message: 'Let\'s focus on wing design for fuel efficiency.' },
      { isAI: true, message: 'Great choice! Wing design significantly impacts fuel efficiency. I\'m setting up interactive controls for wing sweep angle, aspect ratio, and wing tip design. You\'ll be able to see real-time changes in drag coefficient and lift-to-drag ratio as you adjust these parameters. Would you like me to run an initial simulation to establish a baseline?' }
    ],
    progress: 60
  },
  {
    view: 'latent-explorer',
    statusText: 'Optimizing Design',
    statusClass: 'bg-purple-500 animate-pulse',
    expectResponse: 'optimize',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Latent Space Explorer. I can help you optimize aircraft design parameters and visualize aerodynamic performance in real-time.' },
      { isAI: false, message: 'Can you help me optimize an aircraft design?' },
      { isAI: true, message: 'Absolutely! I\'ll help you optimize aircraft design parameters for maximum aerodynamic efficiency. Would you like me to load a standard aircraft model to begin with?' },
      { isAI: false, message: 'Yes, load a standard aircraft model.' },
      { isAI: true, message: 'I\'ve loaded a commercial aircraft model. You can now explore different design parameters such as wing sweep angle, fuselage length, and engine position to optimize for fuel efficiency, range, and stability. What specific aspect would you like to focus on first?' },
      { isAI: false, message: 'Let\'s focus on wing design for fuel efficiency.' },
      { isAI: true, message: 'Great choice! Wing design significantly impacts fuel efficiency. I\'m setting up interactive controls for wing sweep angle, aspect ratio, and wing tip design. You\'ll be able to see real-time changes in drag coefficient and lift-to-drag ratio as you adjust these parameters. Would you like me to run an initial simulation to establish a baseline?' },
      { isAI: false, message: 'Yes, run the simulation.' },
      { isAI: true, message: 'I\'ve run the baseline simulation. Here are the results for the standard configuration:\n\n- Lift-to-Drag Ratio: 16.8\n- Drag Coefficient: 0.0268\n- Estimated Range: 5,420 nautical miles\n- Fuel Efficiency: 3.2 passenger-miles per gallon\n\nI\'ve loaded an interactive visualization where you can modify wing parameters and immediately see the impact on aerodynamic performance. Would you like me to automatically optimize for maximum fuel efficiency, or would you prefer to explore the design space manually?' }
    ],
    progress: 80
  },
  {
    view: 'latent-explorer',
    statusText: 'Results Ready',
    statusClass: 'bg-green-500',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Latent Space Explorer. I can help you optimize aircraft design parameters and visualize aerodynamic performance in real-time.' },
      { isAI: false, message: 'Can you help me optimize an aircraft design?' },
      { isAI: true, message: 'Absolutely! I\'ll help you optimize aircraft design parameters for maximum aerodynamic efficiency. Would you like me to load a standard aircraft model to begin with?' },
      { isAI: false, message: 'Yes, load a standard aircraft model.' },
      { isAI: true, message: 'I\'ve loaded a commercial aircraft model. You can now explore different design parameters such as wing sweep angle, fuselage length, and engine position to optimize for fuel efficiency, range, and stability. What specific aspect would you like to focus on first?' },
      { isAI: false, message: 'Let\'s focus on wing design for fuel efficiency.' },
      { isAI: true, message: 'Great choice! Wing design significantly impacts fuel efficiency. I\'m setting up interactive controls for wing sweep angle, aspect ratio, and wing tip design. You\'ll be able to see real-time changes in drag coefficient and lift-to-drag ratio as you adjust these parameters. Would you like me to run an initial simulation to establish a baseline?' },
      { isAI: false, message: 'Yes, run the simulation.' },
      { isAI: true, message: 'I\'ve run the baseline simulation. Here are the results for the standard configuration:\n\n- Lift-to-Drag Ratio: 16.8\n- Drag Coefficient: 0.0268\n- Estimated Range: 5,420 nautical miles\n- Fuel Efficiency: 3.2 passenger-miles per gallon\n\nI\'ve loaded an interactive visualization where you can modify wing parameters and immediately see the impact on aerodynamic performance. Would you like me to automatically optimize for maximum fuel efficiency, or would you prefer to explore the design space manually?' },
      { isAI: false, message: 'Please optimize it automatically.' },
      { isAI: true, message: 'Optimization complete! After running hundreds of simulations, I\'ve found an optimal wing configuration that improves fuel efficiency by 12.8%.\n\nOptimized parameters:\n- Wing Sweep Angle: 32.4° (increased from 28°)\n- Aspect Ratio: 10.2 (increased from 9.4)\n- Wing Tip Design: Blended winglet with 6° cant angle\n\nPerformance improvements:\n- Lift-to-Drag Ratio: 18.9 (+12.5%)\n- Drag Coefficient: 0.0238 (-11.2%)\n- Estimated Range: 6,110 nautical miles (+12.7%)\n- Fuel Efficiency: 3.6 passenger-miles per gallon (+12.8%)\n\nThe visualization now shows both the original and optimized designs. You can use the slider to compare them and see the flow field differences. Would you like to explore other parameters or export this configuration for further analysis?' }
    ],
    progress: 100
  }
];