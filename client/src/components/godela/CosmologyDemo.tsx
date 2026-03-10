import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, PlusCircle, GripVertical } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';
import SketchfabEmbed from './SketchfabEmbed';

interface ChatMessage {
  isAI: boolean;
  message: string;
}

export default function CosmologyDemo() {
  const { demoStep, getCurrentSteps } = useDemoStore();
  const currentSteps = getCurrentSteps();
  const currentStep = currentSteps[demoStep];

  const [messages, setMessages] = useState<ChatMessage[]>([
    { message: 'Ask anything', isAI: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [currentModel, setCurrentModel] = useState("7f1336d84b944e8a888b714057a9b9da"); // Pulsar model
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Initialize with first step welcome message only
  useEffect(() => {
    if (demoStep === 0 && currentStep && currentStep.chatMessages) {
      // Only load the initial welcome message
      const welcomeMessage = currentStep.chatMessages[0];
      if (welcomeMessage) {
        setMessages([{
          isAI: welcomeMessage.isAI,
          message: welcomeMessage.message
        }]);
      }
      
      // Make sure no model is shown initially
      setShowModel(false);
    }
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      isAI: false,
      message: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show typing animation
    setIsTyping(true);
    
    // Track message count to determine which model to show
    const nextMessageCount = messageCount + 1;
    setMessageCount(nextMessageCount);
    
    // After a delay, show AI response based on the message count
    setTimeout(() => {
      setIsTyping(false);
      
      // Different responses and models based on message count
      let aiResponseMessage = "";
      
      if (inputValue.toLowerCase().includes("pulsar") || 
          inputValue.toLowerCase().includes("nebula") ||
          inputValue.toLowerCase().includes("astronomy") ||
          nextMessageCount === 1) {
        // First user message - show pulsar nebula
        aiResponseMessage = "📄 Referenced Paper: *Olmi et al. 2016, Journal of Plasma Physics*\n\nThis study modeled the structure of a pulsar wind nebula (PWN), like the one observed at the center of the Crab Nebula, using magnetohydrodynamic (MHD) simulations with the PLUTO code.\n\nThe simulation captures the relativistic wind emitted by a rapidly rotating neutron star, forming two bipolar jets and a dense equatorial torus. These structures are shaped by the pulsar's magnetic field and rotational energy, producing the complex morphology observed in X-ray, optical, and infrared wavelengths.\n\n\n🌀 Physics Modeled:\n- Relativistic MHD\n- Jet and torus dynamics\n- Magnetic confinement\n- Energy injection from a central pulsar\n\n🔬 This is a full 3D reconstruction based on the conditions described in the paper.\n\n🖼️ Loading simulation model now…";
        setShowModel(true);
        setCurrentModel("7f1336d84b944e8a888b714057a9b9da"); 
      } 
      else if (nextMessageCount === 2) {
        aiResponseMessage = "I've loaded another simulation showing an interstellar cloud shocked by a blast wave. This model demonstrates the density and pressure waves propagating through an interstellar medium when hit by a supernova remnant's expanding shell.";
        setShowModel(true);
        setCurrentModel("fb5a271bbb6f4c1c9f0492fcaf28b95e");
      } 
      else {
        // Additional messages
        aiResponseMessage = "What other aspects of astrophysics would you like to explore? I can explain more about pulsars, black holes, or other cosmic phenomena.";
      }
      
      // Add AI response with the appropriate message
      const aiResponse: ChatMessage = {
        isAI: true,
        message: aiResponseMessage
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full w-full relative">
      {/* Full screen model viewer background */}
      <div className="absolute inset-0 z-0 bg-black cyber-grid">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-[10%] w-96 h-96 bg-purple-500/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-indigo-400/5 blur-3xl rounded-full"></div>
        </div>
        
        <div className="h-full w-full">
          {showModel ? (
            <div className="w-full h-full">
              <SketchfabEmbed modelId={currentModel} autoStart={true} transparent={true} />
            </div>
          ) : (
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
          )}
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
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything"
                  className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none"
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