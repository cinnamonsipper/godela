import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, GripVertical, Sliders, Maximize2, Minus } from 'lucide-react';
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
  stlPath?: string;
  sketchfabUrl?: string;
  value: {
    rooflineCurvature: number;
    aPillarAngle: number;
    bodyFeature: string;
    dragCoefficient: number;
    coolingEfficiency: number;
  }
}

/**
 * Latent Explorer V2 Demo Component with STL Viewer
 * 
 * Automotive design optimization interface showcasing:
 * - AI-driven autonomous design discovery
 * - Morphing techniques for parametric geometry
 * - CAE simulations with surrogate models
 * - Aerothermal, structural, and multiphysics optimization
 * - Interactive latent space exploration for car body designs
 */
export default function LatentExplorerV2({ onStepComplete, expectedResponse = '' }: {
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
  const [fileWasUploaded, setFileWasUploaded] = useState(false);
  const [firstMessageAfterUpload, setFirstMessageAfterUpload] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Define the latent space points with STL paths - automotive design variants
  const [latentPoints, setLatentPoints] = useState<LatentPoint[]>([
    { 
      x: 30, 
      y: 30, 
      label: 'A',
      sketchfabUrl: 'https://sketchfab.com/models/23419460a58c4774a121e15bf285930f/embed?autostart=1&camera=0&transparent=1',
      value: {
        rooflineCurvature: 0.18,
        aPillarAngle: 68,
        bodyFeature: 'Standard',
        dragCoefficient: 0.35,
        coolingEfficiency: 58
      }
    },
    { 
      x: 40, 
      y: 70, 
      label: 'B',
      sketchfabUrl: 'https://sketchfab.com/models/2db534dfcddf4434964504b2f162eb4e/embed?autostart=1&camera=0&transparent=1',
      value: {
        rooflineCurvature: 0.16,
        aPillarAngle: 66,
        bodyFeature: 'Standard',
        dragCoefficient: 0.33,
        coolingEfficiency: 62
      }
    },
    { 
      x: 60, 
      y: 40, 
      label: 'C',
      sketchfabUrl: 'https://sketchfab.com/models/86c102f05af042d1982f5147cbf59487/embed?autostart=1&camera=0&transparent=1',
      value: {
        rooflineCurvature: 0.14,
        aPillarAngle: 64,
        bodyFeature: 'Standard',
        dragCoefficient: 0.32,
        coolingEfficiency: 65
      }
    },
    { 
      x: 70, 
      y: 65, 
      label: 'D',
      sketchfabUrl: 'https://sketchfab.com/models/87e5d83ac70f4f3d9099c18fbf924d7a/embed?autostart=1&camera=0&transparent=1',
      value: {
        rooflineCurvature: 0.13,
        aPillarAngle: 63,
        bodyFeature: 'Active Diffuser',
        dragCoefficient: 0.28,
        coolingEfficiency: 72
      }
    },
    { 
      x: 80, 
      y: 25, 
      label: 'E',
      sketchfabUrl: 'https://sketchfab.com/models/e7008572946f4ac399f2a43360fe9c19/embed?autostart=1&camera=0&transparent=1',
      value: {
        rooflineCurvature: 0.12,
        aPillarAngle: 62,
        bodyFeature: 'Active Diffuser + Optimized Inlets',
        dragCoefficient: 0.24,
        coolingEfficiency: 82
      }
    },
    // Additional points for more density
    { 
      x: 25, 
      y: 55, 
      label: 'F',
      sketchfabUrl: 'https://sketchfab.com/models/a1e912f78d6c496a95911b07cfe7bf7a/embed?autostart=1&camera=0&transparent=1',
      value: {
        rooflineCurvature: 0.20,
        aPillarAngle: 70,
        bodyFeature: 'Standard',
        dragCoefficient: 0.37,
        coolingEfficiency: 55
      }
    },
    { 
      x: 48, 
      y: 48, 
      label: 'G',
      sketchfabUrl: 'https://sketchfab.com/models/62a8ada11c784024bcb1429082060d71/embed?autostart=1&camera=0&transparent=1',
      value: {
        rooflineCurvature: 0.15,
        aPillarAngle: 65,
        bodyFeature: 'Standard',
        dragCoefficient: 0.31,
        coolingEfficiency: 67
      }
    },
    { 
      x: 75, 
      y: 40, 
      label: 'H',
      stlPath: '/Planes/give_me_30_different__0505210058_generate.stl',
      value: {
        rooflineCurvature: 0.13,
        aPillarAngle: 63,
        bodyFeature: 'Active Diffuser',
        dragCoefficient: 0.29,
        coolingEfficiency: 70
      }
    },
    { 
      x: 60, 
      y: 22, 
      label: 'I',
      stlPath: '/Planes/give_me_30_different__0505210104_generate.stl',
      value: {
        rooflineCurvature: 0.14,
        aPillarAngle: 64,
        bodyFeature: 'Standard',
        dragCoefficient: 0.30,
        coolingEfficiency: 68
      }
    },
    { 
      x: 35, 
      y: 80, 
      label: 'J',
      stlPath: '/Planes/give_me_30_different__0505210111_generate.stl',
      value: {
        rooflineCurvature: 0.17,
        aPillarAngle: 67,
        bodyFeature: 'Enhanced Cooling Inlet',
        dragCoefficient: 0.34,
        coolingEfficiency: 60
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
    // Keep the default "Ask anything (V2)" message instead of loading from demo steps
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
      setExplorerPhase(1); // Initial car model
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
      if (inputValue.toLowerCase().includes("optimize") || 
          inputValue.toLowerCase().includes("reduce drag") ||
          inputValue.toLowerCase().includes("cooling")) {
        aiResponse = "Analyzing car body for aerodynamics and thermal management. Key factors: roofline curvature, A-pillar angle, cooling inlet sizing.";
      } else if (isAfterFileUpload) {
        // After file upload, show the uploaded geometry
        aiResponse = "I've loaded your uploaded geometry as the starting baseline. This is your current car design.\n\nI can now run AI-driven optimization using:\n• Morphing techniques for parametric geometry\n• CAE surrogate models (99.8% faster than traditional CFD)\n• Multi-objective optimization (aerodynamics, cooling, structural)\n\nWhat would you like to optimize?";
      } else if (messages.length === 2) {
        // Normal flow without file upload
        aiResponse = "Explore car designs in the latent space.\n• X-axis: Aerodynamics (Cd)\n• Y-axis: Cooling Performance (CFM)\n• Color/Intensity: Multi-objective Score\n\nEach point represents a morphed car design variant. The AI agent autonomously discovered these using CAE surrogate models.";
      } else if (messages.length === 4) {
        aiResponse = "Variant E optimal: Cd 0.24, 82% cooling efficiency. 25% drag reduction, 21% range improvement through AI-driven morphing.";
      } else {
        aiResponse = "What automotive parameter would you like to optimize next?";
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
        <div className="bg-black/90 backdrop-blur-md border border-emerald-500/30 rounded-lg p-3 shadow-xl text-left">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold">{tooltipPoint.label}</span>
            </div>
            <p className="text-white font-medium text-sm">Design Variant Details</p>
          </div>
          <div className="grid gap-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Roofline:</span>
              <div className="flex items-center bg-emerald-900/40 px-2 py-1 rounded">
                <span className="text-emerald-200 text-xs font-medium">{tooltipPoint.value.rooflineCurvature.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">A-Pillar:</span>
              <div className="flex items-center bg-emerald-900/40 px-2 py-1 rounded">
                <span className="text-emerald-200 text-xs font-medium">{tooltipPoint.value.aPillarAngle}°</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Drag Cd:</span>
              <div className={`flex items-center px-2 py-1 rounded ${
                tooltipPoint.value.dragCoefficient < 0.28 ? 'bg-green-900/40' : 'bg-emerald-900/40'
              }`}>
                <span className={`text-xs font-medium ${
                  tooltipPoint.value.dragCoefficient < 0.28 ? 'text-green-300' : 'text-emerald-200'
                }`}>{tooltipPoint.value.dragCoefficient.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Cooling:</span>
              <div className="flex items-center bg-emerald-900/40 px-2 py-1 rounded">
                <span className="text-emerald-200 text-xs font-medium">{tooltipPoint.value.coolingEfficiency}%</span>
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
              <div className="animate-pulse text-emerald-400">
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
              {/* Central Car Model Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedPoint && selectedPoint.sketchfabUrl ? (
                  <div className="w-full h-full z-10">
                    <div className="sketchfab-embed-wrapper h-full w-full">
                      <iframe 
                        title={`Car Design ${selectedPoint.label}`}
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; fullscreen; xr-spatial-tracking" 
                        className="w-full h-full border-0"
                        src={selectedPoint.sketchfabUrl}
                      />
                    </div>
                  </div>
                ) : selectedPoint && selectedPoint.stlPath ? (
                  <div className="w-full h-full z-10">
                    <ThreeSTLViewer 
                      stlPath={selectedPoint.stlPath}
                      modelColor="#10B981"
                    />
                  </div>
                ) : fileWasUploaded && (
                  <div className="w-full h-full z-10">
                    <div className="sketchfab-embed-wrapper h-full w-full">
                      <iframe 
                        title="car 3" 
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; fullscreen; xr-spatial-tracking" 
                        className="w-full h-full border-0"
                        src="https://sketchfab.com/models/e7008572946f4ac399f2a43360fe9c19/embed?autostart=1&camera=0&transparent=1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Parameter Display Panel */}
              {selectedPoint && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-xl w-full z-20">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white font-medium">Car Design Variant {selectedPoint.label}</p>
                    {explorerPhase >= 4 && selectedPoint === latentPoints[4] && (
                      <p className="text-green-300 font-medium">Optimal Design</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">Roofline Curvature</p>
                      <p className="text-emerald-200 font-light">{selectedPoint.value.rooflineCurvature.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">A-Pillar Angle</p>
                      <p className="text-emerald-200 font-light">{selectedPoint.value.aPillarAngle}°</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">Body Feature</p>
                      <p className="text-emerald-200 font-light">{selectedPoint.value.bodyFeature}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-medium">Drag Coefficient</p>
                      <p className="text-emerald-200 font-light">Cd {selectedPoint.value.dragCoefficient.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center col-span-2">
                      <p className="text-white font-medium">Cooling Efficiency</p>
                      <p className="text-emerald-200 font-light">{selectedPoint.value.coolingEfficiency}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Latent Space Explorer Window - Dell Demo Style */}
              {explorerPhase >= 2 && (
                <motion.div
                  drag
                  dragConstraints={{ left: -350, right: 350, top: -250, bottom: 250 }}
                  dragElastic={0.1}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute top-4 right-4 w-64 h-64 bg-black/60 backdrop-blur-md border border-emerald-500/30 rounded-lg p-4 shadow-xl cursor-grab active:cursor-grabbing z-20"
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                >
                  {/* Header */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-emerald-300 mb-1">Design Space Explorer</h4>
                    <p className="text-[10px] text-gray-400">Interactive 2D latent space</p>
                  </div>
                  
                  {/* 2D Plot Area */}
                  <div className="relative w-full h-40 bg-black/40 rounded border border-emerald-500/20">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/10"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/10"></div>
                    </div>
                    
                    {/* Axis labels */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] text-gray-500">Aerodynamics (Cd)</div>
                    <div className="absolute top-1/2 -left-10 transform -translate-y-1/2 -rotate-90 text-[9px] text-gray-500">Mass</div>
                    
                    {/* Design points - clickable car design configurations */}
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
                            isSelected ? 'bg-emerald-400 opacity-70 scale-150' : 'bg-emerald-500/30 group-hover:bg-emerald-400/60 scale-125 group-hover:scale-150'
                          } transition-all duration-300 ease-in-out`}></div>
                          
                          {/* Inner point with glass effect */}
                          <div className={`relative flex items-center justify-center ${
                            isSelected 
                              ? 'w-6 h-6 bg-emerald-500/90 ring-2 ring-white/70'
                              : 'w-5 h-5 bg-emerald-500/80 group-hover:bg-emerald-400/90'
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
                    
                    {/* Highlighted region indicator */}
                    <motion.div
                      className="absolute border-2 border-emerald-400/50 rounded bg-emerald-400/5"
                      style={{
                        left: '25%',
                        top: '30%',
                        width: '40%',
                        height: '35%'
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  
                  {/* Footer info */}
                  <div className="mt-2 text-[9px] text-gray-500 text-center">
                    {latentPoints.length} design variants mapped
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
                  <p className="text-green-300 font-semibold mb-2">AI Optimization Complete</p>
                  <p className="text-gray-300 text-sm">Autonomous discovery found optimal car design at variant E with 25% drag reduction and 21% range improvement.</p>
                  <div className="mt-3 pt-3 border-t border-green-500/20">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Baseline sedan</span>
                      <span className="text-gray-400">Optimized design</span>
                    </div>
                    <div className="relative h-1 bg-gray-700 rounded-full my-2">
                      <div className="absolute left-0 top-0 h-full bg-green-500 rounded-full" style={{width: '75%'}}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Cd 0.32</span>
                      <span className="text-green-400">Cd 0.24</span>
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
        animate={{ 
          opacity: 1, 
          x: 0,
          height: isChatMinimized ? 'auto' : undefined
        }}
        className={`absolute z-10 top-8 right-8 ${isChatMinimized ? '' : 'bottom-8'} w-[290px] rounded-3xl overflow-hidden shadow-xl`}
      >
        <div className={`${isChatMinimized ? 'h-auto' : 'h-full'} w-full flex flex-col backdrop-blur-xl bg-black/20 border border-white/10`}>
          {/* Chat header with drag handle - styled to match sandbox demo */}
          <div className="py-4 px-6 bg-black/20 backdrop-blur-md border-b border-white/5 cursor-move flex justify-between items-center">
            <div className="text-white text-lg font-medium flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Godela
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsChatMinimized(!isChatMinimized);
                }}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              >
                {isChatMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
              </button>
              <GripVertical size={18} className="text-gray-400" />
            </div>
          </div>

          {/* Chat messages */}
          {!isChatMinimized && (
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

          )}

          {/* Input area */}
          {!isChatMinimized && (
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
              />
              <div className="text-sm text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload files (any format)
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
          )}
        </div>
      </motion.div>
    </div>
  );
}
