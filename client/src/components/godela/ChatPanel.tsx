import { useState, useRef, useEffect } from "react";
import useDemoStore from "@/store/useDemoStore";
import { ChatMessage } from "@/lib/demoConstants";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import EmbeddedModelViewer from "@/components/godela/EmbeddedModelViewer";
import godelaLogoNew from "../../assets/godela-logo-new.png";

export default function ChatPanel() {
  const { demoStep, nextDemoStep, getCurrentSteps, demoPath } = useDemoStore();
  const currentSteps = getCurrentSteps();
  const currentStep = currentSteps[demoStep];
  const messages = currentStep.chatMessages || [];
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(currentStep.expectResponse || "");
  const isLastStep = demoStep === currentSteps.length - 1;
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);
  const [showModel, setShowModel] = useState(false);
  const [modelId, setModelId] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [localMessages]);

  // Sync local messages with current step messages
  useEffect(() => {
    setLocalMessages(messages || []);
  }, [demoStep, currentStep.view]);
  
  // Update input value when step changes
  useEffect(() => {
    setInputValue(currentStep.expectResponse || "");
  }, [demoStep, currentStep.expectResponse]);

  const handleNextStep = () => {
    if (inputValue.trim() !== "" && !isSending) {
      // Show message being sent with smooth animation
      setIsSending(true);
      
      // Before sending, check for multi-product keywords in packaging demo
      // This helps set the simulation state later on
      const lowerInput = inputValue.toLowerCase();
      const isPackagingDemo = currentSteps === useDemoStore.getState().phonePackagingSteps;
      
      // Check multi-product shipping request when in packaging demo
      if (isPackagingDemo) {
        const multiProductKeywords = ['two', 'multiple', 'several', 'many', 'both', 'pair'];
        const hasMultiProductKeyword = multiProductKeywords.some(keyword => lowerInput.includes(keyword));
        const hasShipKeyword = lowerInput.includes('ship');
        
        if ((hasMultiProductKeyword && lowerInput.includes('product')) || 
            (hasShipKeyword && hasMultiProductKeyword)) {
          // Set a special expected response for next step to trigger multi-product mode
          useDemoStore.getState().setMultiProductMode(true);
        }
      }
      
      // Check for 3D model simulation requests in model-viewer demo
      const isModelViewerDemo = demoPath === 'model-viewer';
      
      if (isModelViewerDemo) {
        // Add the user message immediately
        const userMessage: ChatMessage = {
          isAI: false,
          message: inputValue
        };
        setLocalMessages(prev => [...prev, userMessage]);
        
        // Set typing indicator
        setIsSending(false);
        setIsTyping(true);
        
        // Immediately show the 3D model visualization
        setTimeout(() => {
          // Set the model ID for the embed
          setModelId('d88cbc16b21f4c93abe003f194b25d55'); // Default airfoil model
          setEmbedCode(`<div class="sketchfab-embed-wrapper"> <iframe title="Pressure around an aircraft wing" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/d88cbc16b21f4c93abe003f194b25d55/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1" style="width: 100%; height: 100%; min-height: 400px;"> </iframe> </div>`);
          setShowModel(true);
          
          // Add AI response
          const aiResponse: ChatMessage = {
            isAI: true,
            message: "I've analyzed your request and run a simulation on the model. Here are the results of the pressure distribution visualization shown on the right."
          };
          
          setLocalMessages(prev => [...prev, aiResponse]);
          setInputValue("");
          setIsTyping(false);
        }, 1500);
        
        return; // Skip regular flow
      }
      
      // Add the user message to local messages
      const userMessage: ChatMessage = {
        isAI: false,
        message: inputValue
      };
      
      setLocalMessages(prev => [...prev, userMessage]);
      
      // After a brief delay, start the AI typing animation
      setTimeout(() => {
        setIsSending(false);
        setIsTyping(true);
        
        // Wait longer to simulate AI thinking (like Gemini does), then proceed
        setTimeout(() => {
          setInputValue("");
          setIsTyping(false);
          nextDemoStep();
        }, 2500); // Longer typing time of 2.5 seconds
      }, 500); // Slightly longer initial delay
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLastStep && !isTyping && !isSending) {
      handleNextStep();
    }
  };
  
  // Animation variants for message bubbles
  const bubbleVariants = {
    hidden: { opacity: 0, y: -30, height: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: "auto", 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 250, 
        damping: 20,
        duration: 0.7,
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 30, 
      transition: { duration: 0.4 } 
    }
  };
  
  // Animation for the AI typing indicator (Gemini style)
  const typingVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: "auto", 
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing that looks like Gemini
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      transition: { duration: 0.5 } 
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-0">
      {/* No header section - matching the model view style */}
      
      {/* Main content with flexible layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <div className={`flex flex-col ${showModel ? 'w-1/2 border-r border-gray-800/30' : 'w-full'}`}>
          <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {localMessages && localMessages.map((msg: ChatMessage, index: number) => (
                <motion.div 
                  key={`msg-${index}`}
                  className={`flex items-start ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={bubbleVariants}
                  layout
                >
                  {msg.isAI ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-black/60 border border-gray-700/40 flex items-center justify-center text-gray-300 mr-2 flex-shrink-0 shadow-sm premium-glow">
                        <img src={godelaLogoNew} alt="Godela" className="w-4 h-4 object-contain" />
                      </div>
                      <motion.div 
                        className="glass rounded-2xl p-3.5 text-sm max-w-[85%] border border-gray-800/30 premium-glow"
                        initial={{ scale: 0.95, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <p className="leading-relaxed">{msg.message}</p>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div 
                        className="bg-gray-800/60 glass rounded-2xl p-3.5 text-sm max-w-[85%] border border-gray-700/30"
                        initial={{ scale: 0.95, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <p className="leading-relaxed text-gray-300">{msg.message}</p>
                      </motion.div>
                      <div className="w-7 h-7 rounded-full bg-gray-700/80 border border-gray-600/30 flex items-center justify-center text-gray-300 ml-2 flex-shrink-0 premium-glow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div 
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="w-7 h-7 rounded-full bg-black/60 border border-gray-700/40 flex items-center justify-center text-gray-300 mr-2 flex-shrink-0 shadow-sm premium-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM5.5 12a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7.5-3l-3 5h3l-1 3 3-5h-3l1-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <motion.div 
                  className="glass rounded-2xl p-3.5 text-sm border border-gray-800/30 premium-glow"
                  animate={{ 
                    scale: [1, 1.01, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          {currentStep.expectResponse && !isLastStep && (
            <div className="px-4 pb-2">
              <motion.button
                className="w-full bg-[#1E2330] text-indigo-300 text-left p-3 rounded-lg text-sm font-medium border border-indigo-500/40 mb-2 relative overflow-hidden group"
                onClick={() => {
                  setInputValue(currentStep.expectResponse || "");
                  handleNextStep();
                }}
                whileHover={{ 
                  scale: 1.01,
                  backgroundColor: "rgba(37, 43, 61, 1)",
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.4, 
                  ease: [0.25, 0.1, 0.25, 1.0],
                }}
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-indigo-600/5"
                  animate={{ 
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400 group-hover:text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="relative z-10">{currentStep.expectResponse}</span>
                </div>
              </motion.button>
            </div>
          )}
          
          <div className="p-4 border-t border-zinc-800/40 flex-shrink-0">
            <div className="flex">
              <input 
                type="text" 
                className="bg-black/40 glass rounded-l-md px-4 py-2 flex-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-700/30"
                placeholder="What do you want to know?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLastStep || isTyping || isSending}
              />
              <button 
                className={`glass premium-glow hover:bg-black/60 text-gray-300 px-4 py-2 rounded-r-md ${(isLastStep || isTyping || isSending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleNextStep}
                disabled={isLastStep || isTyping || isSending || inputValue.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-400 px-1">
              {isLastStep 
                ? "Simulation complete. Start a new session to create another model."
                : "Send a message or press Enter to continue"}
            </div>
          </div>
        </div>
        
        {/* 3D Model Display Area - conditionally visible */}
        {showModel && (
          <motion.div 
            className="w-1/2 h-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 p-4">
              {embedCode ? (
                <div 
                  className="w-full h-full rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: embedCode }} 
                />
              ) : modelId && (
                <iframe
                  title="Sketchfab Model"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  src={`https://sketchfab.com/models/${modelId}/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1`}
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: '400px' }}
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}