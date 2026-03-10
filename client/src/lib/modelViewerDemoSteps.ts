// Import the ChatMessage type
import { ChatMessage } from "@/lib/demoConstants";

// Define the step structure based on other demo steps
type DemoStep = {
  view: string;
  prompt: string;
  status: string;
  statusText: string;
  statusClass: string;
  assistantResponse: string;
  expectResponse?: string;
  chatMessages?: ChatMessage[];
  progress?: number;
  simulationType?: string;
  sketchfabModelId?: string;
  embedCode?: string;
};

export const MODEL_VIEWER_DEMO_STEPS: DemoStep[] = [
  {
    view: 'model-viewer',
    prompt: 'View and analyze 3D models',
    status: 'ready',
    statusText: 'Ready',
    statusClass: 'bg-green-500',
    assistantResponse: 'Welcome to the 3D Model Viewer. I can help you visualize and analyze your 3D models. How can I assist you today?',
    chatMessages: [
      { message: 'Welcome to the 3D Model Viewer. I can help you visualize and analyze your 3D models. How can I assist you today?', isAI: true }
    ],
    progress: 0
  },
  {
    view: 'model-viewer',
    prompt: 'Upload your 3D model',
    status: 'upload',
    statusText: 'Awaiting model',
    statusClass: 'bg-blue-500',
    assistantResponse: 'I\'d be happy to help visualize and analyze your 3D model. Please upload your model file (STL, GLB, or GLTF format) so I can display it.',
    expectResponse: 'Model uploaded successfully',
    chatMessages: [
      { message: 'Welcome to the 3D Model Viewer. I can help you visualize and analyze your 3D models. How can I assist you today?', isAI: true },
      { message: 'Can you display my 3D model?', isAI: false },
      { message: 'I\'d be happy to help visualize and analyze your 3D model. Please upload your model file (STL, GLB, or GLTF format) so I can display it.', isAI: true }
    ],
    progress: 25
  },
  {
    view: 'model-viewer',
    prompt: 'Analyzing your 3D model',
    status: 'processing',
    statusText: 'Processing model',
    statusClass: 'bg-yellow-500 animate-pulse',
    assistantResponse: 'Thank you for uploading your 3D model. I\'m now processing it for visualization.\n\nI\'ll render it with standard lighting and materials. You can ask me to modify the view or analyze specific aspects of the model.',
    expectResponse: 'Display model',
    chatMessages: [
      { message: 'Welcome to the 3D Model Viewer. I can help you visualize and analyze your 3D models. How can I assist you today?', isAI: true },
      { message: 'Can you display my 3D model?', isAI: false },
      { message: 'I\'d be happy to help visualize and analyze your 3D model. Please upload your model file (STL, GLB, or GLTF format) so I can display it.', isAI: true },
      { message: 'I\'ve uploaded my 3D model.', isAI: false },
      { message: 'Thank you for uploading your 3D model. I\'m now processing it for visualization.\n\nI\'ll render it with standard lighting and materials. You can ask me to modify the view or analyze specific aspects of the model.', isAI: true }
    ],
    progress: 50
  },
  {
    view: 'model-viewer',
    prompt: 'Displaying 3D model',
    status: 'simulating',
    statusText: 'Rendering model',
    statusClass: 'bg-indigo-500 animate-pulse',
    assistantResponse: 'I\'m now rendering your 3D model. This will take a moment to complete.\n\nThe model is being prepared with optimal camera positioning and lighting to give you the best view of its details.',
    expectResponse: 'Display complete',
    chatMessages: [
      { message: 'Welcome to the 3D Model Viewer. I can help you visualize and analyze your 3D models. How can I assist you today?', isAI: true },
      { message: 'Can you display my 3D model?', isAI: false },
      { message: 'I\'d be happy to help visualize and analyze your 3D model. Please upload your model file (STL, GLB, or GLTF format) so I can display it.', isAI: true },
      { message: 'I\'ve uploaded my 3D model.', isAI: false },
      { message: 'Thank you for uploading your 3D model. I\'m now processing it for visualization.\n\nI\'ll render it with standard lighting and materials. You can ask me to modify the view or analyze specific aspects of the model.', isAI: true },
      { message: 'Please display the model with default settings.', isAI: false },
      { message: 'I\'m now rendering your 3D model. This will take a moment to complete.\n\nThe model is being prepared with optimal camera positioning and lighting to give you the best view of its details.', isAI: true }
    ],
    progress: 75,
    sketchfabModelId: 'd88cbc16b21f4c93abe003f194b25d55',
    embedCode: `<div class="sketchfab-embed-wrapper"> <iframe title="3D Model Viewer" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/d88cbc16b21f4c93abe003f194b25d55/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1" style="width: 100%; height: 100%; min-height: 400px;"> </iframe> </div>`
  },
  {
    view: 'model-viewer',
    prompt: 'Model analysis results',
    status: 'complete',
    statusText: 'Analysis complete',
    statusClass: 'bg-green-500',
    assistantResponse: 'Your 3D model is now displayed! Here are some details about it:\n\n- **Geometry**: The model has approximately 24,800 vertices and 12,400 faces\n- **Dimensions**: 6.2 x 3.8 x 1.5 units (width x height x depth)\n- **Topology**: Watertight mesh with no non-manifold edges detected\n- **Material**: Single material applied to all surfaces\n\nYou can interact with the model using your mouse/touch. Would you like me to analyze any specific aspect of the model in more detail?',
    chatMessages: [
      { message: 'Welcome to the 3D Model Viewer. I can help you visualize and analyze your 3D models. How can I assist you today?', isAI: true },
      { message: 'Can you display my 3D model?', isAI: false },
      { message: 'I\'d be happy to help visualize and analyze your 3D model. Please upload your model file (STL, GLB, or GLTF format) so I can display it.', isAI: true },
      { message: 'I\'ve uploaded my 3D model.', isAI: false },
      { message: 'Thank you for uploading your 3D model. I\'m now processing it for visualization.\n\nI\'ll render it with standard lighting and materials. You can ask me to modify the view or analyze specific aspects of the model.', isAI: true },
      { message: 'Please display the model with default settings.', isAI: false },
      { message: 'I\'m now rendering your 3D model. This will take a moment to complete.\n\nThe model is being prepared with optimal camera positioning and lighting to give you the best view of its details.', isAI: true },
      { message: 'Your 3D model is now displayed! Here are some details about it:\n\n- **Geometry**: The model has approximately 24,800 vertices and 12,400 faces\n- **Dimensions**: 6.2 x 3.8 x 1.5 units (width x height x depth)\n- **Topology**: Watertight mesh with no non-manifold edges detected\n- **Material**: Single material applied to all surfaces\n\nYou can interact with the model using your mouse/touch. Would you like me to analyze any specific aspect of the model in more detail?', isAI: true }
    ],
    progress: 100
  }
];