import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, PlusCircle, GripVertical, Sliders } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';

interface ChatMessage {
  isAI: boolean;
  message: string;
}

/**
 * Latent Explorer Demo Component
 * 
 * A modern reimagining of the aircraft optimization interface with an immersive UI
 * that matches the design language of the sandbox demo.
 * 
 * Uses proper aircraft imagery and optimization controls for a consistent experience.
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
  const [sliderValue, setSliderValue] = useState(50);
  
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
    }
    if (userMessageCount >= 2) {
      setExplorerPhase(2); // Parameter selection
    }
    if (userMessageCount >= 3) {
      setExplorerPhase(3); // Simulation running
    }
    if (userMessageCount >= 4) {
      setExplorerPhase(4); // Optimized results
    }
  }, [messages]);

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
        return (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                  alt="Aircraft Model"
                  className="max-w-full max-h-full object-contain opacity-80" 
                />
              </div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-xl">
                <p className="text-white text-lg font-light">Initial Aircraft Model</p>
                <p className="text-blue-200 text-sm mt-2">Commercial airliner with standard configuration</p>
              </div>
            </motion.div>
          </div>
        );
      case 2:
        return (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                  alt="Aircraft Model"
                  className="max-w-full max-h-full object-contain opacity-80" 
                />
                <div className="absolute inset-0 pointer-events-none">
                  <svg width="100%" height="100%" className="stroke-blue-400/70">
                    <line x1="20%" y1="40%" x2="60%" y2="25%" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="20%" y1="45%" x2="50%" y2="60%" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="80%" y1="40%" x2="60%" y2="30%" strokeWidth="1" strokeDasharray="5,5" />
                    <circle cx="60%" cy="25%" r="8" fill="rgba(59, 130, 246, 0.5)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2" />
                    <circle cx="50%" cy="60%" r="8" fill="rgba(59, 130, 246, 0.5)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2" />
                    <circle cx="60%" cy="30%" r="8" fill="rgba(59, 130, 246, 0.5)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Parameter Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-xl w-full">
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">Wing Sweep Angle</p>
                  <p className="text-blue-200 font-light">28°</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">Aspect Ratio</p>
                  <p className="text-blue-200 font-light">9.4</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">Wing Tip Design</p>
                  <p className="text-blue-200 font-light">Standard</p>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 3:
        return (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                  alt="Aircraft Model"
                  className="max-w-full max-h-full object-contain opacity-80" 
                />
                <div className="absolute inset-0 pointer-events-none">
                  <svg width="100%" height="100%" className="stroke-blue-400/70">
                    <path d="M30,50 C100,30 200,80 400,60" fill="none" strokeWidth="2" className="animate-pulse" />
                    <path d="M30,70 C150,100 250,40 400,80" fill="none" strokeWidth="2" className="animate-pulse" />
                    <path d="M30,90 C120,60 220,120 400,100" fill="none" strokeWidth="2" className="animate-pulse" />
                  </svg>
                </div>
              </div>

              {/* Simulation Results */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-xl w-full">
                <div className="text-center mb-2">
                  <p className="text-white font-medium">Baseline Simulation</p>
                  <motion.div 
                    className="h-1 bg-blue-500/40 mt-1 mx-auto rounded-full overflow-hidden"
                    style={{ width: '90%' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 2 }}
                  >
                    <motion.div 
                      className="h-full bg-blue-500 w-full rounded-full"
                      animate={{ x: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex justify-between">
                    <p className="text-blue-100">Lift-to-Drag Ratio:</p>
                    <p className="text-white font-medium">16.8</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Drag Coefficient:</p>
                    <p className="text-white font-medium">0.0268</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Estimated Range:</p>
                    <p className="text-white font-medium">5,420 nm</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Fuel Efficiency:</p>
                    <p className="text-white font-medium">3.2 p-mpg</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 4:
        return (
          <div className="h-full w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-full h-[70%] overflow-hidden">
                  {/* Original model */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                    style={{ opacity: (100 - sliderValue) / 100 }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                      alt="Original Aircraft Model"
                      className="max-w-full max-h-full object-contain opacity-90" 
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      <svg width="100%" height="100%" className="stroke-red-400/50">
                        <path d="M30,50 C100,30 200,80 400,60" fill="none" strokeWidth="2" />
                        <path d="M30,70 C150,100 250,40 400,80" fill="none" strokeWidth="2" />
                        <path d="M30,90 C120,60 220,120 400,100" fill="none" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Optimized model */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                    style={{ opacity: sliderValue / 100 }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                      alt="Optimized Aircraft Model"
                      className="max-w-full max-h-full object-contain opacity-90" 
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      <svg width="100%" height="100%" className="stroke-green-400/50">
                        <path d="M30,40 C100,25 200,70 400,50" fill="none" strokeWidth="2" />
                        <path d="M30,60 C150,90 250,30 400,70" fill="none" strokeWidth="2" />
                        <path d="M30,80 C120,50 220,110 400,90" fill="none" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Comparison Slider */}
                <div className="w-[80%] mx-auto mt-4 mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-red-300">Original Design</span>
                    <span className="text-green-300">Optimized Design</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Optimization Results */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-xl w-full">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-white font-medium">Optimization Results</p>
                  <p className="text-green-300 font-medium">+12.8% Efficiency</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <p className="text-blue-100">Lift-to-Drag Ratio:</p>
                    <p className="text-white font-medium">18.9 <span className="text-green-300 text-xs">(+12.5%)</span></p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Wing Sweep Angle:</p>
                    <p className="text-white font-medium">32.4° <span className="text-blue-300 text-xs">(+4.4°)</span></p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Drag Coefficient:</p>
                    <p className="text-white font-medium">0.0238 <span className="text-green-300 text-xs">(-11.2%)</span></p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Aspect Ratio:</p>
                    <p className="text-white font-medium">10.2 <span className="text-blue-300 text-xs">(+0.8)</span></p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Fuel Efficiency:</p>
                    <p className="text-white font-medium">3.6 p-mpg <span className="text-green-300 text-xs">(+12.8%)</span></p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-blue-100">Wing Tip Design:</p>
                    <p className="text-white font-medium">Blended winglet</p>
                  </div>
                </div>
              </div>
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