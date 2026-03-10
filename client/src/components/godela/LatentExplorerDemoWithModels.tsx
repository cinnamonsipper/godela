import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, GripVertical, Sliders, Maximize2 } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';
import SketchfabEmbed from './SketchfabEmbed';

interface ChatMessage {
  isAI: boolean;
  message: string;
}

interface LatentPoint {
  x: number;
  y: number;
  label: string;
  modelId: string;
  value: {
    wingAngle: number;
    aspectRatio: number;
    wingTip: string;
    efficiency: number;
    drag: number;
  }
}

/**
 * Latent Explorer Demo Component with 3D Models
 * 
 * A modern reimagining of the aircraft optimization interface with an immersive UI
 * that matches the design language of the sandbox demo, but preserves the STL loading
 * functionality of the original aircraft optimization demo.
 */
export default function LatentExplorerDemo({ onStepComplete, expectedResponse = '' }: {
  onStepComplete?: (response: string) => void;
  expectedResponse?: string;
}) {
  const { demoStep, getCurrentSteps } = useDemoStore();
  const currentSteps = getCurrentSteps();
  const currentStep = currentSteps[demoStep];
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [explorerPhase, setExplorerPhase] = useState(0);
  
  // Sketchfab model IDs for different aircraft configurations
  const [latentPoints, setLatentPoints] = useState<LatentPoint[]>([
    { 
      x: 30, 
      y: 30, 
      label: 'A',
      modelId: 'af96f49d600f461e9bb7c0157e3271ba', // Boeing 737 model
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
      modelId: 'b5f293a00957462e8f45595186c744e9', // Boeing 747 model
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
      modelId: 'a29db8fb11e14fb5b27110a1e0c13a31', // Airbus A380 model
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
      modelId: '8357e5af5e6c407a8d445adff0cbda8d', // Boeing 787 Dreamliner
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
      modelId: '8e09d710be9e4300aec5f42e01c0bd39', // Optimized next-gen concept aircraft
      value: {
        wingAngle: 32.4,
        aspectRatio: 10.2,
        wingTip: 'Blended winglet',
        efficiency: 18.9,
        drag: 0.0238
      }
    },
  ]);
  
  const [selectedPoint, setSelectedPoint] = useState<LatentPoint | null>(null);
  const [latentWindowExpanded, setLatentWindowExpanded] = useState(false);
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Initialize chat messages from demo steps
  useEffect(() => {
    if (currentStep && currentStep.chatMessages) {
      setMessages(currentStep.chatMessages);
    }
  }, [demoStep, currentStep]);

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

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      isAI: false,
      message: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
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

    // Simulate AI response
    setTimeout(() => {
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
              <h3 className="text-2xl font-light text-white mb-4">Latent Space Explorer</h3>
              <p className="mb-4">Chat with the assistant to begin exploring the design space for aircraft optimization</p>
              <div className="animate-pulse text-blue-400">
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
                  <div className="w-full h-full">
                    <SketchfabEmbed modelId={selectedPoint.modelId} />
                  </div>
                )}
                {explorerPhase >= 2 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" className="stroke-blue-400/70">
                      <path d="M30,50 C100,30 200,80 400,60" fill="none" strokeWidth="2" className={explorerPhase === 3 ? "animate-pulse" : ""} />
                      <path d="M30,70 C150,100 250,40 400,80" fill="none" strokeWidth="2" className={explorerPhase === 3 ? "animate-pulse" : ""} />
                      <path d="M30,90 C120,60 220,120 400,100" fill="none" strokeWidth="2" className={explorerPhase === 3 ? "animate-pulse" : ""} />
                    </svg>
                  </div>
                )}
              </div>

              {/* Parameter Display Panel */}
              {selectedPoint && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-xl w-full z-10">
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`absolute ${latentWindowExpanded ? 'inset-12' : 'top-8 left-8 w-80 h-80'} bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden z-20 shadow-xl`}
                >
                  <div className="absolute top-0 left-0 right-0 bg-black/20 p-3 flex justify-between items-center border-b border-white/10">
                    <p className="text-white font-medium">Latent Space Explorer</p>
                    <button 
                      onClick={() => setLatentWindowExpanded(!latentWindowExpanded)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                  <div className="absolute inset-0 mt-12 p-4">
                    <div className="relative w-full h-full bg-black/30 rounded-lg border border-white/5">
                      {/* Coordinate system */}
                      <div className="absolute inset-4 border-l border-b border-gray-500/30">
                        <div className="absolute bottom-0 left-0 transform -translate-x-4 -translate-y-1 text-xs text-gray-500">0,0</div>
                        <div className="absolute bottom-0 right-0 transform translate-x-1 -translate-y-1 text-xs text-gray-500">1,0</div>
                        <div className="absolute top-0 left-0 transform -translate-x-4 translate-y-1 text-xs text-gray-500">0,1</div>
                        
                        {/* Parameter labels */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-xs text-blue-300">Wing Sweep →</div>
                        <div className="absolute left-0 top-1/2 transform -translate-x-6 -rotate-90 text-xs text-blue-300">Aspect Ratio →</div>
                        
                        {/* Points */}
                        {latentPoints.map((point, i) => (
                          <div 
                            key={i}
                            className={`absolute cursor-pointer transform -translate-x-3 -translate-y-3 w-6 h-6 rounded-full flex items-center justify-center ${
                              selectedPoint === point 
                                ? 'bg-blue-500 text-white ring-2 ring-white' 
                                : 'bg-blue-500/40 text-gray-200 hover:bg-blue-500/70'
                            } transition-all duration-200`}
                            style={{ left: `${point.x}%`, top: `${point.y}%` }}
                            onClick={() => handleLatentPointClick(point)}
                          >
                            {point.label}
                          </div>
                        ))}
                        
                        {/* Efficiency contour lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M20,80 Q40,70 50,50 Q60,30 80,20" fill="none" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" />
                          <path d="M25,75 Q42,62 55,45 Q65,30 85,25" fill="none" stroke="rgba(52, 211, 153, 0.3)" strokeWidth="1" />
                          <path d="M30,70 Q45,55 60,40 Q70,30 90,30" fill="none" stroke="rgba(52, 211, 153, 0.4)" strokeWidth="1" />
                          
                          <text x="85" y="24" className="text-xs fill-green-300 font-light">16.0</text>
                          <text x="92" y="29" className="text-xs fill-green-300 font-light">17.5</text>
                          <text x="92" y="35" className="text-xs fill-green-300 font-light">19.0</text>
                        </svg>
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
                  className="absolute top-8 right-8 bg-green-900/20 backdrop-blur-md p-4 border border-green-500/30 rounded-xl max-w-[280px] z-10"
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
          {/* Chat header with drag handle */}
          <div className="py-4 px-6 bg-black/20 backdrop-blur-md border-b border-white/5 cursor-move flex justify-between items-center">
            <div className="text-white text-lg font-medium flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Latent Explorer
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
                        : 'bg-blue-600/30 backdrop-blur-md border border-blue-500/30 text-white'
                    }`}
                  >
                    {message.message}
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
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-blue-300 p-2 rounded-full transition-colors"
              >
                <Sliders size={20} />
              </motion.button>
              
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about optimization..."
                  className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
                  rows={1}
                  style={{ maxHeight: '120px', minHeight: '44px' }}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={inputValue.trim() === '' || isTyping}
                className={`flex-shrink-0 ${inputValue.trim() === '' || isTyping
                  ? 'bg-blue-800/20 text-blue-600/70' 
                  : 'bg-blue-600/70 hover:bg-blue-500/70 text-white'} p-2 rounded-full transition-colors backdrop-blur-md`}
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