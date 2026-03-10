import { DemoStep, ChatMessage } from './demoConstants';

/**
 * Sandbox Demo Path
 * 
 * This is a separate demo path for experimentation and customization.
 * Based on the 3D model viewer, but with a completely separate path
 * that won't affect other demo paths when modified.
 * 
 * This version follows the same sequential steps as the model viewer demo,
 * showing the same sequence of 3D models.
 */
export const SANDBOX_DEMO_STEPS: DemoStep[] = [
  {
    view: 'sandbox',
    statusText: 'Sandbox Ready',
    statusClass: 'bg-green-500',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Sandbox environment. I can help you visualize and analyze 3D models. Ask me anything about aerodynamic simulation or 3D model analysis.' }
    ],
    progress: 0
  },
  {
    view: 'sandbox',
    statusText: 'Awaiting model',
    statusClass: 'bg-blue-500',
    expectResponse: 'Model uploaded successfully',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Sandbox environment. I can help you visualize and analyze 3D models. Ask me anything about aerodynamic simulation or 3D model analysis.' },
      { isAI: false, message: 'Show me the wing pressure distribution.' },
      { isAI: true, message: 'I\'d be happy to show you wing pressure distribution analysis. Let me load the aircraft model and run the CFD simulation to visualize the pressure patterns across the wing surfaces.' }
    ],
    progress: 25,
    sketchfabModelId: 'd88cbc16b21f4c93abe003f194b25d55'
  },
  {
    view: 'sandbox',
    statusText: 'Processing model',
    statusClass: 'bg-yellow-500 animate-pulse',
    expectResponse: 'Display model',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Sandbox environment. I can help you visualize and analyze 3D models. Ask me anything about aerodynamic simulation or 3D model analysis.' },
      { isAI: false, message: 'Show me the wing pressure distribution.' },
      { isAI: true, message: 'I\'d be happy to show you wing pressure distribution analysis. Let me load the aircraft model and run the CFD simulation to visualize the pressure patterns across the wing surfaces.' },
      { isAI: false, message: 'Can you also show the external flow field?' },
      { isAI: true, message: 'Certainly! I\'m now processing both the wing pressure distribution and the external flow field visualization.\n\nThis will give you a comprehensive view of how air flows around the aircraft and the resulting pressure patterns on the wing surfaces. The simulation is calculating velocity vectors, pressure coefficients, and streamlines.' }
    ],
    progress: 50,
    sketchfabModelId: '27fc598f3b0c4109a9301b5153ca03a1'
  },
  {
    view: 'sandbox',
    statusText: 'Rendering results',
    statusClass: 'bg-indigo-500 animate-pulse',
    expectResponse: 'Show 3D pressure map',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Sandbox environment. I can help you visualize and analyze 3D models. Ask me anything about aerodynamic simulation or 3D model analysis.' },
      { isAI: false, message: 'Show me the wing pressure distribution.' },
      { isAI: true, message: 'I\'d be happy to show you wing pressure distribution analysis. Let me load the aircraft model and run the CFD simulation to visualize the pressure patterns across the wing surfaces.' },
      { isAI: false, message: 'Can you also show the external flow field?' },
      { isAI: true, message: 'Certainly! I\'m now processing both the wing pressure distribution and the external flow field visualization.\n\nThis will give you a comprehensive view of how air flows around the aircraft and the resulting pressure patterns on the wing surfaces. The simulation is calculating velocity vectors, pressure coefficients, and streamlines.' },
      { isAI: false, message: 'Can you generate a 3D pressure map?' },
      { isAI: true, message: 'I\'m generating a comprehensive 3D pressure map visualization now. This will show pressure distribution across the entire aircraft surface using a color gradient.\n\nThe high-pressure regions will appear in red, while low-pressure areas will be shown in blue. This will help identify critical areas like stagnation points, suction peaks, and potential shock formations.' }
    ],
    progress: 75,
    sketchfabModelId: '5eee9888935d4ab3ac4a39b0d55e3dcc'
  },
  {
    view: 'sandbox',
    statusText: 'Analysis complete',
    statusClass: 'bg-green-500',
    chatMessages: [
      { isAI: true, message: 'Welcome to the Sandbox environment. I can help you visualize and analyze 3D models. Ask me anything about aerodynamic simulation or 3D model analysis.' },
      { isAI: false, message: 'Show me the wing pressure distribution.' },
      { isAI: true, message: 'I\'d be happy to show you wing pressure distribution analysis. Let me load the aircraft model and run the CFD simulation to visualize the pressure patterns across the wing surfaces.' },
      { isAI: false, message: 'Can you also show the external flow field?' },
      { isAI: true, message: 'Certainly! I\'m now processing both the wing pressure distribution and the external flow field visualization.\n\nThis will give you a comprehensive view of how air flows around the aircraft and the resulting pressure patterns on the wing surfaces. The simulation is calculating velocity vectors, pressure coefficients, and streamlines.' },
      { isAI: false, message: 'Can you generate a 3D pressure map?' },
      { isAI: true, message: 'I\'m generating a comprehensive 3D pressure map visualization now. This will show pressure distribution across the entire aircraft surface using a color gradient.\n\nThe high-pressure regions will appear in red, while low-pressure areas will be shown in blue. This will help identify critical areas like stagnation points, suction peaks, and potential shock formations.' },
      { isAI: false, message: 'Show me the annotated model with recommendations.' },
      { isAI: true, message: 'Here\'s the fully annotated model with optimization recommendations:\n\n- **Wing Leading Edge**: Increased radius recommended to improve low-speed performance\n- **Wing Tip**: Modified winglet design shown in green would reduce induced drag by 6.2%\n- **Tail Configuration**: Current T-tail design optimal for this aircraft category\n- **Fuselage-Wing Junction**: Fairing modification (highlighted in yellow) would reduce interference drag by 4.8%\n\nThe annotations are color-coded: green for recommended changes, blue for optimal current features, and yellow for areas requiring minor refinement. The model now includes projected performance improvements for each recommended modification.' }
    ],
    progress: 100,
    sketchfabModelId: '690e9b33f3c9473bbb2855aaea7cfa56'
  }
];