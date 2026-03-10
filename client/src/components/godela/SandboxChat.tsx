import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  isAI: boolean;
  message: string;
}

export default function SandboxChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { isAI: true, message: "Welcome to the Sandbox environment. This is your playground to experiment with chat logic without affecting other demo paths." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [showModel, setShowModel] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const messageCount = useRef(0);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "" || isTyping) return;

    // Add user message
    const userMessage: ChatMessage = {
      isAI: false,
      message: inputValue,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    messageCount.current += 1;

    // Simulate AI response
    setTimeout(() => {
      // Different responses based on message count
      let responseMessage = "";
      
      if (messageCount.current === 1) {
        responseMessage = "I'd be happy to assist with the sandbox environment. You can experiment with the chat logic here. Would you like to see a 3D model visualization?";
      } else if (messageCount.current === 2) {
        responseMessage = "Here's a visualization of an aircraft wing with pressure distribution. You can modify this demo path to show different models or responses.";
        setCurrentModel("d88cbc16b21f4c93abe003f194b25d55"); // Pressure on wing model
        setShowModel(true);
      } else {
        responseMessage = "This is a fully isolated sandbox environment. You can modify the code to change how responses appear, what 3D models are shown, and experiment with the chat interface.";
      }
      
      // Add AI response
      const aiResponse: ChatMessage = {
        isAI: true,
        message: responseMessage
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Animation variants
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden p-0">
      {/* Main content with flexible layout - takes all available height */}
      <div className="flex-1 flex min-h-0">
        {/* Chat area - always half width */}
        <div className="flex flex-col w-1/2 border-r border-gray-800/30 h-full bg-black/80 backdrop-blur-sm">
          {/* Messages area - takes all available space, scrolls if needed */}
          <div 
            ref={chatMessagesRef} 
            className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 custom-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div 
                  key={`msg-${index}`}
                  className={`flex items-start ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={bubbleVariants}
                >
                  {msg.isAI ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-black/60 border border-gray-700/40 flex items-center justify-center text-gray-300 mr-2 flex-shrink-0 premium-glow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM5.5 12a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7.5-3l-3 5h3l-1 3 3-5h-3l1-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <motion.div 
                        className="glass rounded-2xl p-3.5 text-sm max-w-[85%]"
                        initial={{ scale: 0.95, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <p className="leading-relaxed text-gray-200">{msg.message}</p>
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
          
          {/* Input field - fixed at bottom */}
          <div className="p-4 border-t border-zinc-800/40 flex-shrink-0">
            <div className="flex">
              <input 
                type="text" 
                className="bg-black/40 glass rounded-l-md px-4 py-2 flex-1 text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-700/30"
                placeholder="What do you want to know?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <button 
                className={`glass premium-glow hover:bg-black/60 text-gray-300 px-4 py-2 rounded-r-md ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSendMessage}
                disabled={isTyping || inputValue.trim() === ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* 3D Model Display Area - futuristic modeling canvas */}
        <div className="w-1/2 h-full relative bg-black cyber-grid-with-vignette">
          {showModel && (
            <motion.div 
              className="absolute inset-0 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <iframe
                title="Aircraft wing visualization"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={`https://sketchfab.com/models/${currentModel}/embed?autospin=1&preload=1&transparent=1&ui_hint=0`}
                className="w-full h-full rounded-md"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}