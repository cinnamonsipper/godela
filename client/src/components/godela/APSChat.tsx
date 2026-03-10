import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, PlusCircle, GripVertical } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';
import SketchfabEmbed from './SketchfabEmbed';

interface FileAttachment {
  name: string;
  type: string;
  size: number;
}

interface ChatMessage {
  isAI: boolean;
  message: string;
  files?: FileAttachment[];
}

export default function APSChat() {
  const { demoStep, getCurrentSteps } = useDemoStore();
  const currentSteps = getCurrentSteps();
  const currentStep = currentSteps[demoStep];

  const [messages, setMessages] = useState<ChatMessage[]>([
    { message: 'Welcome to APS. Ask me anything about your models.', isAI: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [currentModel, setCurrentModel] = useState("d88cbc16b21f4c93abe003f194b25d55"); // Initial model (default)
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [hasFilesToUpload, setHasFilesToUpload] = useState(false);
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setInputValue(`Analyzing ${fileNames}`);
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
      setInputValue(`Analyzing ${fileNames}`);
    }
  };
  
  const processUploadedFiles = (files: File[]) => {
    // Store the files
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Create file attachments for the message
    const fileAttachments: FileAttachment[] = files.map(file => ({
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size
    }));
    
    // Create a message with file information
    const userMessage: ChatMessage = {
      isAI: false,
      message: `I've uploaded ${files.length > 1 ? 'these files' : 'this file'} for analysis`,
      files: fileAttachments
    };
    
    // Add the user message to the chat
    setMessages(prev => [...prev, userMessage]);
    
    // Reset pending files
    setPendingFiles([]);
    setHasFilesToUpload(false);
    
    // Trigger the AI response
    handleFilesUploadedResponse();
  };
  
  // Handle AI response after file upload
  const handleFilesUploadedResponse = () => {
    // Show typing animation
    setIsTyping(true);
    
    // After a delay, show AI response for the file upload
    setTimeout(() => {
      setIsTyping(false);
      
      // Get count of file uploads so far to determine which model to show
      const fileUploadCount = uploadedFiles.length;
      
      // Different responses and models based on file upload count
      let aiResponseMessage = "";
      let modelId = "";
      
      switch (fileUploadCount) {
        case 1:
          // First file upload
          aiResponseMessage = "Design loaded. Here's the surface pressure distribution.";
          modelId = "d88cbc16b21f4c93abe003f194b25d55";
          break;
        case 2:
          // Second file upload
          aiResponseMessage = "Visualizing the airflow around the model.";
          modelId = "1a5fe76e822a42d5846f7533bd4ea8a5";
          break;
        case 3:
          // Third file upload
          aiResponseMessage = "Full 3D pressure distribution map.";
          modelId = "d02a7a81b2ed409cb16659b76be89727";
          break;
        case 4:
          // Fourth file upload
          aiResponseMessage = "Annotated model with key features highlighted.";
          modelId = "3f0561fff90c4fceb8d07ccfd299c8d7";
          break;
        default:
          // Additional files after the sequence
          aiResponseMessage = "Analysis complete. What else would you like to see?";
          break;
      }
      
      // Add AI response with the appropriate message
      const aiResponse: ChatMessage = {
        isAI: true,
        message: aiResponseMessage
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Update the model display
      if (modelId) {
        setShowModel(true);
        setCurrentModel(modelId);
      }
      
      // Advance the demo step if we've reached the final model
      if (fileUploadCount === 4) {
        // Only advance once at the end of the sequence
        const nextStep = demoStep + 1;
        if (nextStep < currentSteps.length) {
          setTimeout(() => {
            const { nextDemoStep } = useDemoStore.getState();
            nextDemoStep();
          }, 1000);
        }
      }
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
    setInputValue('');
    
    // Show typing animation
    setIsTyping(true);
    
    // Track message count to determine which model to show
    const nextMessageCount = messageCount + 1;
    setMessageCount(nextMessageCount);
    
    // After a delay, show AI response based on the message count
    setTimeout(() => {
      setIsTyping(false);
      
      // Different responses and models based on message count (1-based)
      let aiResponseMessage = "";
      
      if (nextMessageCount === 1) {
        // First user message
        aiResponseMessage = "I've analyzed your request and run a simulation on the model. Here are the results of the pressure distribution visualization shown on the surface.";
        setShowModel(true);
        setCurrentModel("d88cbc16b21f4c93abe003f194b25d55");
      } 
      else if (nextMessageCount === 2) {
        // Second message
        aiResponseMessage = "External flow field: I've analyzed your request and visualized the airflow around the model. This simulation shows the streamlines and pressure distribution as air passes over the surface.";
        setShowModel(true);
        setCurrentModel("1a5fe76e822a42d5846f7533bd4ea8a5");
      } 
      else if (nextMessageCount === 3) {
        // Third message
        aiResponseMessage = "3D pressure map: Here's a more detailed visualization showing the pressure distribution across the entire surface of the model. The color gradient indicates high pressure (red) to low pressure (blue) regions.";
        setShowModel(true);
        setCurrentModel("d02a7a81b2ed409cb16659b76be89727");
      } 
      else if (nextMessageCount === 4) {
        // Fourth message
        aiResponseMessage = "Here's a detailed view with annotations highlighting the key features and critical areas. You can see where the flow separation occurs and the regions requiring design attention.";
        setShowModel(true);
        setCurrentModel("3f0561fff90c4fceb8d07ccfd299c8d7");
      } 
      else {
        // Additional messages after the sequence is complete
        aiResponseMessage = "What other aspects of the model analysis would you like me to explain? I can provide more details on specific areas of interest or suggest additional optimization strategies.";
      }
      
      // Add AI response with the appropriate message
      const aiResponse: ChatMessage = {
        isAI: true,
        message: aiResponseMessage
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Advance the demo step if we've reached the final model
      if (nextMessageCount === 4) {
        // Only advance once at the end of the sequence
        const nextStep = demoStep + 1;
        if (nextStep < currentSteps.length) {
          setTimeout(() => {
            const { nextDemoStep } = useDemoStore.getState();
            nextDemoStep();
          }, 1000);
        }
      }
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
              <SketchfabEmbed modelId={currentModel} />
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
              APS
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
                    
                    {/* File attachments */}
                    {message.files && message.files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.files.map((file, fileIndex) => (
                          <div 
                            key={fileIndex}
                            className="flex items-center p-2 bg-black/20 backdrop-blur-sm rounded-md border border-white/10"
                          >
                            {/* File type icon */}
                            <div className="mr-3 w-10 h-10 bg-blue-900/60 rounded-md flex items-center justify-center text-blue-300">
                              {file.type.includes('stl') || file.type.includes('model') ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12L3 18V6L12 12M12 12L21 18V6L12 12M12 2V12" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </div>
                            
                            {/* File details */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{file.name}</p>
                              <p className="text-xs text-gray-400">
                                {file.type.split('/').pop() || 'file'} • {(file.size / 1024).toFixed(1)} KB
                              </p>
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
            
            {/* Text input area */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-purple-300 p-2 rounded-full transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <PlusCircle size={20} />
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