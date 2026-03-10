import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, GripVertical, Sliders, Maximize2 } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';
import ThreeSTLViewer from './ThreeSTLViewer';

interface ChatMessage {
  isAI: boolean;
  message: string;
}

interface LatentPoint {
  x: number;
  y: number;
  label: string;
  stlPath: string;
  value: {
    wingAngle: number;
    aspectRatio: number;
    wingTip: string;
    efficiency: number;
    drag: number;
  }
}

/**
 * Latent Explorer Demo Component with STL Viewer
 * 
 * A reimagining of the aircraft optimization interface with:
 * - Immersive UI matching the sandbox demo design language
 * - Cyber grid background
 * - Latent space explorer in the corner
 * - STL models that load when clicking different points
 */
export default function LatentExplorerWithSTL({ onStepComplete, expectedResponse = '' }: {
  onStepComplete?: (response: string) => void;
  expectedResponse?: string;
}) {
  const { demoStep, getCurrentSteps } = useDemoStore();
  const currentSteps = getCurrentSteps();
  const currentStep = currentSteps[demoStep];
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      isAI: true,
      message: "Ask anything"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [explorerPhase, setExplorerPhase] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [hasFilesToUpload, setHasFilesToUpload] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [fileWasUploaded, setFileWasUploaded] = useState(false); // Track if a file was ever uploaded
  const [firstMessageAfterUpload, setFirstMessageAfterUpload] = useState(false); // Track first message after upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Define the latent space points with STL paths from the Planes folder - each with a unique STL file
  const [latentPoints, setLatentPoints] = useState<LatentPoint[]>([
    { 
      x: 30, 
      y: 30, 
      label: 'A',
      stlPath: '/Planes/give_me_30_different__0505205934_generate.stl',
      value: {
        wingAngle: 24,
        aspectRatio: 8.2,
        wingTip: 'Standard',
        efficiency: 14.5,
        drag: 0.0295
      }
    },
    { 
      x: 40, 
      y: 70, 
      label: 'B',
      stlPath: '/Planes/give_me_30_different__0505205956_generate.stl',
      value: {
        wingAngle: 26,
        aspectRatio: 8.8,
        wingTip: 'Standard',
        efficiency: 15.6,
        drag: 0.0285
      }
    },
    { 
      x: 60, 
      y: 40, 
      label: 'C',
      stlPath: '/Planes/give_me_30_different__0505210010_generate.stl',
      value: {
        wingAngle: 28,
        aspectRatio: 9.4,
        wingTip: 'Standard',
        efficiency: 16.8,
        drag: 0.0268
      }
    },
    { 
      x: 70, 
      y: 65, 
      label: 'D',
      stlPath: '/Planes/give_me_30_different__0505210016_generate.stl',
      value: {
        wingAngle: 30,
        aspectRatio: 9.8,
        wingTip: 'Winglet',
        efficiency: 17.5,
        drag: 0.0255
      }
    },
    { 
      x: 80, 
      y: 25, 
      label: 'E',
      stlPath: '/Planes/give_me_30_different__0505210023_generate.stl',
      value: {
        wingAngle: 32.4,
        aspectRatio: 10.2,
        wingTip: 'Blended winglet',
        efficiency: 18.9,
        drag: 0.0238
      }
    },
    // Additional points for more density
    { 
      x: 25, 
      y: 55, 
      label: 'F',
      stlPath: '/Planes/give_me_30_different__0505210032_generate.stl',
      value: {
        wingAngle: 22.5,
        aspectRatio: 7.8,
        wingTip: 'Standard',
        efficiency: 13.8,
        drag: 0.0308
      }
    },
    { 
      x: 48, 
      y: 48, 
      label: 'G',
      stlPath: '/Planes/give_me_30_different__0505210052_generate.stl',
      value: {
        wingAngle: 27.2,
        aspectRatio: 9.0,
        wingTip: 'Standard',
        efficiency: 16.2,
        drag: 0.0278
      }
    },
    { 
      x: 75, 
      y: 40, 
      label: 'H',
      stlPath: '/Planes/give_me_30_different__0505210058_generate.stl',
      value: {
        wingAngle: 29.5,
        aspectRatio: 9.6,
        wingTip: 'Winglet',
        efficiency: 17.0,
        drag: 0.0262
      }
    },
    { 
      x: 60, 
      y: 22, 
      label: 'I',
      stlPath: '/Planes/give_me_30_different__0505210104_generate.stl',
      value: {
        wingAngle: 28.8,
        aspectRatio: 9.3,
        wingTip: 'Standard',
        efficiency: 16.5,
        drag: 0.0271
      }
    },
    { 
      x: 35, 
      y: 80, 
      label: 'J',
      stlPath: '/Planes/give_me_30_different__0505210111_generate.stl',
      value: {
        wingAngle: 25.2,
        aspectRatio: 8.5,
        wingTip: 'Raked wingtip',
        efficiency: 15.2,
        drag: 0.0289
      }
    },
  ]);
  
  const [selectedPoint, setSelectedPoint] = useState<LatentPoint | null>(null);
  const [latentWindowExpanded, setLatentWindowExpanded] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPoint, setTooltipPoint] = useState<LatentPoint | null>(null);
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Only initialize initial welcome message
  useEffect(() => {
    // Keep the default "Ask anything" message instead of loading from demo steps
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Update explorer phase based on message count
  useEffect(() => {
    // Skip the first message which is just the welcome message
    const userMessageCount = messages.filter(m => !m.isAI).length;
    if (userMessageCount > 0) {
      setShowVisualizer(true);
    }
    if (userMessageCount >= 1) {
      setExplorerPhase(1); // Initial aircraft model
      setSelectedPoint(latentPoints[2]); // Select the middle point (standard config)
    }
    if (userMessageCount >= 2) {
      setExplorerPhase(2); // Parameter selection & latent space
    }
    if (userMessageCount >= 3) {
      setExplorerPhase(3); // Advanced exploration
    }
    if (userMessageCount >= 4) {
      setExplorerPhase(4); // Optimized results
      setSelectedPoint(latentPoints[4]); // Select the optimal point
    }
  }, [messages, latentPoints]);

  // Handle file drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > 0) {
      // Store files as pending, don't process yet
      setPendingFiles(files);
      setHasFilesToUpload(true);
      
      // Show file name in the input area to indicate it's ready to send
      const fileNames = files.map(f => f.name).join(', ');
      setInputValue(`Uploading: ${fileNames}`);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Store files as pending, don't process yet
      setPendingFiles(files);
      setHasFilesToUpload(true);
      
      // Show file name in the input area to indicate it's ready to send
      const fileNames = files.map(f => f.name).join(', ');
      setInputValue(`Uploading: ${fileNames}`);
    }
  };
  
  // Add file type to ChatMessage interface to support file attachments
  interface FileAttachment {
    name: string;
    type: string;
    size: number;
  }
  
  // Extended ChatMessage to include file attachments
  interface ExtendedChatMessage extends ChatMessage {
    files?: FileAttachment[];
    fileMessage?: string;
  }
  
  const processUploadedFiles = (files: File[]) => {
    // Store the files
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Create file attachments for the message
    const fileAttachments: FileAttachment[] = files.map(file => ({
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size
    }));
    
    // Create user message with file attachments
    const userMessage: ExtendedChatMessage = {
      isAI: false,
      message: inputValue || "Here's a model for analysis",
      files: fileAttachments
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage as ChatMessage]);
    
    // Reset pending files
    setPendingFiles([]);
    setHasFilesToUpload(false);
    setInputValue('');
    
    // Trigger typing animation and AI response
    setIsTyping(true);
    
    // After a delay, show AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = "Design loaded. What would you like to optimize?";
      setMessages(prev => [...prev, { isAI: true, message: aiResponse }]);
      // Mark that a file was uploaded and reset the flag for the next message
      setFileWasUploaded(true);
      setFirstMessageAfterUpload(true);
    }, 1500);
  };

  const handleSendMessage = () => {
    // Check if we have pending files to upload
    if (hasFilesToUpload && pendingFiles.length > 0) {
      // Process the files when user clicks send
      processUploadedFiles(pendingFiles);
      return;
    }
    
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      isAI: false,
      message: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Track if this is a message after a file upload
    const isAfterFileUpload = fileWasUploaded && firstMessageAfterUpload;
    
    // If this is the first message after file upload, clear the flag for next time
    if (isAfterFileUpload) {
      setFirstMessageAfterUpload(false);
    }
    
    setInputValue('');
    setIsTyping(true);

    // Check if message matches expected response
    if (expectedResponse && 
        (inputValue.toLowerCase().includes(expectedResponse.toLowerCase()) ||
         userMessage.message.toLowerCase().includes(expectedResponse.toLowerCase()))) {
      // Wait for AI typing animation before completing the step
      setTimeout(() => {
        if (onStepComplete) {
          onStepComplete(inputValue);
        }
      }, 1500);
    }

    // Simulate AI response for redesign question - shorter responses in Godela style
    setTimeout(() => {
      let aiResponse = "";
      
      // Get if this was the first message after a file upload
      const isAfterFileUpload = fileWasUploaded && firstMessageAfterUpload;
      
      // Generate response based on message content and upload state
      if (inputValue.toLowerCase().includes("redesign") || 
          inputValue.toLowerCase().includes("reduce fuel") ||
          inputValue.toLowerCase().includes("mach 1.6")) {
        aiResponse = "Analyzing for Mach 1.6 efficiency. Key factors: wing sweep, thickness ratio, shock management.";
      } else if (isAfterFileUpload) {
        // After file upload, show detailed explanation for ANY first message
        aiResponse = "Explore designs in the latent space.\n• X-axis: Wing Loading (lb/ft²)\n• Y-axis: Thrust-to-Weight Ratio\n• Contour/Color: Mission Performance Metric (Endurance, Range, Fuel Efficiency)\n\nEach point = a specific aircraft configuration. The color gradient shows how well each design performs.";
      } else if (messages.length === 2) {
        // Normal flow without file upload
        aiResponse = "Explore designs in the latent space.\n• X-axis: Wing Loading (lb/ft²)\n• Y-axis: Thrust-to-Weight Ratio\n• Contour/Color: Mission Performance Metric (Endurance, Range, Fuel Efficiency)\n\nEach point = a specific aircraft configuration. The color gradient shows how well each design performs.";
      } else if (messages.length === 4) {
        aiResponse = "Config E optimal: 32.4° sweep, blended winglets. 19% drag reduction, 13% better efficiency.";
      } else {
        aiResponse = "What would you like to optimize?";
      }
      
      // Add AI response
      setMessages(prev => [...prev, { isAI: true, message: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLatentPointClick = (point: LatentPoint) => {
    setSelectedPoint(point);
  };

  // Global tooltip that will appear at the top of the page
  const renderTooltip = () => {
    if (!tooltipPoint) return null;
    
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] p-3 w-64">
        <div className="bg-black/90 backdrop-blur-md border border-blue-500/30 rounded-lg p-3 shadow-xl text-left">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold">{tooltipPoint.label}</span>
            </div>
            <p className="text-white font-medium text-sm">Configuration Details</p>
          </div>
          <div className="grid gap-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Wing Sweep:</span>
              <div className="flex items-center bg-blue-900/40 px-2 py-1 rounded">
                <span className="text-blue-200 text-xs font-medium">{tooltipPoint.value.wingAngle}°</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Aspect Ratio:</span>
              <div className="flex items-center bg-blue-900/40 px-2 py-1 rounded">
                <span className="text-blue-200 text-xs font-medium">{tooltipPoint.value.aspectRatio}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Efficiency:</span>
              <div className="flex items-center bg-blue-900/40 px-2 py-1 rounded">
                <span className="text-blue-200 text-xs font-medium">{tooltipPoint.value.efficiency}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Drag:</span>
              <div className={`flex items-center px-2 py-1 rounded ${
                tooltipPoint.value.drag < 0.026 ? 'bg-green-900/40' : 'bg-blue-900/40'
              }`}>
                <span className={`text-xs font-medium ${
                  tooltipPoint.value.drag < 0.026 ? 'text-green-300' : 'text-blue-200'
                }`}>{tooltipPoint.value.drag}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Helper to render the appropriate visualization based on phase
  const renderExplorerVisualizer = () => {
    switch (explorerPhase) {
      case 0:
        return (
          <div className="flex items-center justify-center h-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-400 max-w-md p-8"
            >
              <h3 className="text-2xl font-light text-white mb-4">Ask anything</h3>
              <div className="animate-pulse text-purple-400">
                Waiting for your input...
              </div>
            </motion.div>
          </div>
        );
      case 1:
      case 2:
      case 3:
      case 4:
        return (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              {/* Central Aircraft Model Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedPoint && (
                  <div className="w-full h-full z-10">
                    <ThreeSTLViewer 
                      stlPath={selectedPoint.stlPath}
                      modelColor="#3B82F6"
                    />
                  </div>
                )}
              </div>

              {/* Parameter Display Panel */}
              {selectedPoint && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-xl w-full z-20">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white font-medium">Aircraft Configuration {selectedPoint.label}</p>
                    {explorerPhase >= 4 && selectedPoint === latentPoints[4] && (
                      <p className="text-green-300 font-medium">Optimal Design</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">Wing Sweep Angle</p>
                      <p className="text-blue-200 font-light">{selectedPoint.value.wingAngle}°</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">Aspect Ratio</p>
                      <p className="text-blue-200 font-light">{selectedPoint.value.aspectRatio}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">Wing Tip Design</p>
                      <p className="text-blue-200 font-light">{selectedPoint.value.wingTip}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">Lift-to-Drag Ratio</p>
                      <p className="text-blue-200 font-light">{selectedPoint.value.efficiency}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Latent Space Explorer Window */}
              {explorerPhase >= 2 && (
                <motion.div 
                  drag
                  dragMomentum={false}
                  dragConstraints={{ left: -100, right: 400, top: -100, bottom: 300 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`absolute ${latentWindowExpanded ? 'inset-12' : 'top-8 left-8 w-72 h-72'} bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden z-20 shadow-xl cursor-move`}
                >
                  <div className="absolute top-0 left-0 right-0 bg-black/20 p-3 flex justify-between items-center border-b border-white/10">
                    <div className="text-white font-medium flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Design Explorer
                    </div>
                    <button 
                      onClick={() => setLatentWindowExpanded(!latentWindowExpanded)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                  <div className="absolute inset-0 mt-12 p-4">
                    <div className="relative w-full h-full bg-black/30 rounded-lg border border-white/5">
                      {/* Coordinate system with SVG contour map */}
                      <div className="absolute inset-0 rounded-lg overflow-hidden bg-[#2a1c4a]">
                        {/* Matplotlib-generated Contour Plot Background */}
                        <div 
                          className="absolute inset-0 w-full h-full" 
                          style={{
                            backgroundImage: 'url("/images/contour_plot_background.png")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          {/* No dark overlay - removed to prevent obscuring the contour plot */}
                        </div>

                        {/* Plot area with axes - removed borders */}
                        <div className="absolute inset-[30px]">
                          {/* No points here - moved below */}
                        </div>
                        
                        {/* No axes labels in React - they will be added directly to the matplotlib plot */}
                        <div className="absolute inset-0">
                          {/* Empty container - axes labels removed */}
                        </div>
                        
                        {/* Semi-transparent overlay to make points stand out */}
                        <div className="absolute inset-0 bg-black/15"></div>
                        
                        {/* Points - modern design with glow effects */}
                        {latentPoints.map((point, i) => {
                          const isSelected = selectedPoint === point;
                          
                          return (
                            <div 
                              key={i}
                              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-30 group"
                              style={{ left: `${point.x}%`, top: `${100 - point.y}%` }}
                              onClick={() => handleLatentPointClick(point)}
                            >
                              {/* Outer glow effect */}
                              <div className={`absolute inset-0 rounded-full blur-sm ${
                                isSelected ? 'bg-yellow-400 opacity-70 scale-150' : 'bg-yellow-500/30 group-hover:bg-yellow-400/60 scale-125 group-hover:scale-150'
                              } transition-all duration-300 ease-in-out`}></div>
                              
                              {/* Inner point with glass effect - smaller size */}
                              <div className={`relative flex items-center justify-center ${
                                isSelected 
                                  ? 'w-6 h-6 bg-yellow-500/90 ring-2 ring-white/70'
                                  : 'w-5 h-5 bg-yellow-500/80 group-hover:bg-yellow-400/90'
                              } backdrop-blur-md rounded-full transition-all duration-200 shadow-lg`}>
                                <span className="font-medium text-[10px] text-white">{point.label}</span>
                              </div>
                              
                              {/* Hover event handlers */}
                              <div 
                                className="absolute inset-0"
                                onMouseEnter={() => setTooltipPoint(point)}
                                onMouseLeave={() => setTooltipPoint(null)}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Optimization notification panel for phase 4 */}
              {explorerPhase === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute top-8 right-8 bg-green-900/20 backdrop-blur-md p-4 border border-green-500/30 rounded-xl max-w-[280px] z-20"
                >
                  <p className="text-green-300 font-semibold mb-2">Optimization Complete</p>
                  <p className="text-gray-300 text-sm">Found optimal design at point E with 12.8% improved efficiency.</p>
                  <div className="mt-3 pt-3 border-t border-green-500/20">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Standard design</span>
                      <span className="text-gray-400">Optimal design</span>
                    </div>
                    <div className="relative h-1 bg-gray-700 rounded-full my-2">
                      <div className="absolute left-0 top-0 h-full bg-green-500 rounded-full" style={{width: '66%'}}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">16.8 L/D</span>
                      <span className="text-green-400">18.9 L/D</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full relative">
      {/* Global tooltip that stays above everything */}
      {renderTooltip()}
      
      {/* Full screen visualizer background */}
      <div className="absolute inset-0 z-0 bg-black cyber-grid">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-[10%] w-96 h-96 bg-blue-500/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-indigo-400/5 blur-3xl rounded-full"></div>
        </div>
        
        <div className="h-full w-full">
          {renderExplorerVisualizer()}
        </div>
      </div>
      
      {/* Floating draggable glassmorphic chat interface */}
      <motion.div 
        drag
        dragMomentum={false}
        dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute z-10 top-8 right-8 bottom-8 w-[290px] rounded-3xl overflow-hidden shadow-xl"
      >
        <div className="h-full w-full flex flex-col backdrop-blur-xl bg-black/20 border border-white/10">
          {/* Chat header with drag handle - styled to match sandbox demo */}
          <div className="py-4 px-6 bg-black/20 backdrop-blur-md border-b border-white/5 cursor-move flex justify-between items-center">
            <div className="text-white text-lg font-medium flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Godela
            </div>
            <GripVertical size={18} className="text-gray-400" />
          </div>

          {/* Chat messages */}
          <div 
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
            ref={chatMessagesRef}
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      message.isAI 
                        ? 'bg-black/30 backdrop-blur-md border border-white/10 text-gray-200' 
                        : 'bg-purple-600/30 backdrop-blur-md border border-purple-500/30 text-white'
                    }`}
                  >
                    {/* Show message text */}
                    <div>{message.message}</div>
                    
                    {/* Show file attachments if present */}
                    {(message as any).files && (message as any).files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {(message as any).files.map((file: any, fileIndex: number) => (
                          <div key={fileIndex} className="flex items-center p-2 bg-black/20 rounded-lg border border-white/20">
                            <div className="mr-2 bg-purple-500/20 p-2 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 truncate">
                              <div className="text-sm font-medium text-white truncate">{file.name}</div>
                              <div className="text-xs text-gray-400">3D Model</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-2 p-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-gray-200">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '200ms'}}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '400ms'}}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="p-4 mt-auto backdrop-blur-xl bg-black/20 border-t border-white/5">
            {/* File drag area */}
            <div 
              className={`mb-3 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${
                isDragging 
                  ? 'border-purple-500 bg-purple-900/20' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileInput} 
                className="hidden" 
                multiple 
                accept=".stl,.obj,.glb,.gltf,.step,.stp,.iges,.igs"
              />
              <div className="text-sm text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload 3D model
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-purple-300 p-2 rounded-full transition-colors"
              >
                <Sliders size={20} />
              </motion.button>
              
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything..."
                  className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
                  rows={1}
                  style={{ maxHeight: '120px', minHeight: '44px' }}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={(inputValue.trim() === '' && !hasFilesToUpload) || isTyping}
                className={`flex-shrink-0 ${(inputValue.trim() === '' && !hasFilesToUpload) || isTyping
                  ? 'bg-purple-800/20 text-purple-600/70' 
                  : 'bg-purple-600/70 hover:bg-purple-500/70 text-white'} p-2 rounded-full transition-colors backdrop-blur-md`}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}