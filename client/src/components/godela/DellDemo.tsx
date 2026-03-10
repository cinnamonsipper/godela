import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, PlusCircle, GripVertical, Upload, Play, CheckCircle, AlertTriangle, FileText, Zap, Sparkles, Settings, Grid, Beaker, RefreshCw, TestTube, Plus, Minus, Maximize2 } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';
import SketchfabEmbed from './SketchfabEmbed';
import dellDemoSteps from '@/lib/dellDemoSteps';
import mechanicalComponentImage from '@assets/image_1753382161630.png';
import postProcessorImage from '@assets/Post-processor_Screenshot_no_bg_1761848866478.png';
import boardThermalImage from '@assets/board_1761849790780.png';
import enclosureThermalImage from '@assets/enclosure_1761849997688.png';
import heatSinkThermalImage from '@assets/finpack_1761850255298.png';

interface ChatMessage {
  isAI: boolean;
  message: string;
}

export default function DellDemo() {
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
  const [currentModel, setCurrentModel] = useState("7f1336d84b944e8a888b714057a9b9da"); // Warehouse model
  const [activeTab, setActiveTab] = useState<'digital-twin' | 'generative-design' | 'simulation'>('simulation');
  const [trainingObjective, setTrainingObjective] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [predictionBehavior, setPredictionBehavior] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [twinTrained, setTwinTrained] = useState(false);
  const [predictionResult, setPredictionResult] = useState<'pass' | 'fail' | null>(null);
  
  // Generative Design Lab states
  const [selectedProduct, setSelectedProduct] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [loadConditions, setLoadConditions] = useState('');
  const [geometricConstraints, setGeometricConstraints] = useState('');
  const [performanceTarget, setPerformanceTarget] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<any[]>([]);
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [simulationModel, setSimulationModel] = useState<'mast-u' | 'aeration-cfd' | 'cavern'>('mast-u');
  const [selectedComponent, setSelectedComponent] = useState<'fan' | 'inlet' | 'board' | 'tim' | 'heatsink' | 'enclosure' | null>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  
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

    // Store the current input value before clearing
    const currentInput = inputValue.trim();

    // Add user message
    const userMessage: ChatMessage = {
      isAI: false,
      message: currentInput
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
      
      // Check if user typed "simulate flow" while in simulation tab
      if (activeTab === 'simulation' && currentInput.toLowerCase().includes("simulate flow")) {
        aiResponseMessage = "🌊 Launching Aeration CFD Simulation...\n\nSimulating fluid flow dynamics with computational fluid dynamics (CFD) analysis. The model shows:\n\n• Turbulent flow patterns\n• Aeration bubble dynamics\n• Pressure distribution\n• Velocity field visualization\n\n✓ Simulation loaded successfully.";
        setSimulationModel('aeration-cfd');
      }
      // Check if user typed "remove enclosure" while in simulation tab
      else if (activeTab === 'simulation' && currentInput.toLowerCase().includes("remove enclosure")) {
        aiResponseMessage = "🏞️ Removing enclosure structure...\n\nDisplaying open cavern environment visualization. The model shows:\n\n• Natural geological formations\n• Open space architecture\n• Structural depth analysis\n• Environmental flow patterns\n\n✓ Enclosure removed - Cavern view loaded.";
        setSimulationModel('cavern');
      }
      else if (currentInput.toLowerCase().includes("pulsar") || 
          currentInput.toLowerCase().includes("nebula") ||
          currentInput.toLowerCase().includes("astronomy") ||
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'digital-twin':
        return (
          <div className="h-full w-full flex">
            {/* Left side - 3D Model */}
            <div className="flex-1 relative">
              <div className="w-full h-full">
                <div className="sketchfab-embed-wrapper w-full h-full">
                  <iframe 
                    title="MTN Test Panel At Chainplates" 
                    className="w-full h-full border-0"
                    allowFullScreen 
                    src="https://sketchfab.com/models/3fe08eecfeca4e9a82ed54929c43d291/embed?preload=1&transparent=1"
                    style={{
                      filter: predictionResult === 'fail' ? 'hue-rotate(0deg) saturate(2) brightness(0.8)' : 
                              predictionResult === 'pass' ? 'hue-rotate(120deg) saturate(1.5) brightness(1.1)' : 'none'
                    }}
                  />
                </div>
                
                {/* Prediction Result Overlay */}
                {predictionResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 left-4 px-4 py-2 rounded-lg backdrop-blur-md border"
                    style={{
                      backgroundColor: predictionResult === 'fail' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      borderColor: predictionResult === 'fail' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {predictionResult === 'fail' ? 
                        <AlertTriangle className="w-4 h-4 text-red-400" /> : 
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      }
                      <span className={`text-sm font-medium ${predictionResult === 'fail' ? 'text-red-300' : 'text-green-300'}`}>
                        {predictionResult === 'fail' ? 'Failure Predicted' : 'Structure Safe'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right side - Controls */}
            <div className="w-80 bg-black/40 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-400" />
                Digital Twin Studio
              </h3>

              {/* Training Configuration */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Training Objective</label>
                <select 
                  value={trainingObjective}
                  onChange={(e) => setTrainingObjective(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="">Select objective...</option>
                  <option value="drop-damage">Predict Drop Damage Probability</option>
                  <option value="max-stress">Predict Max Stress under Load</option>
                  <option value="vibration">Identify Vibration Frequencies</option>
                  <option value="material-usage">Optimize Material Usage</option>
                  <option value="defects">Detect Manufacturing Defects</option>
                  <option value="fatigue-life">Predict Fatigue Life</option>
                </select>
              </div>

              {/* Data Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Data for Training</label>
                <div className="space-y-2">
                  {['stress_test_data.csv', 'impact_analysis.json', 'material_properties.xlsx'].map((file) => (
                    <label key={file} className="flex items-center space-x-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles([...selectedFiles, file]);
                          } else {
                            setSelectedFiles(selectedFiles.filter(f => f !== file));
                          }
                        }}
                        className="w-4 h-4 text-orange-500 bg-transparent border-gray-500 rounded focus:ring-orange-500"
                      />
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{file}</span>
                    </label>
                  ))}
                </div>
                
                <button className="mt-3 w-full flex items-center justify-center space-x-2 py-2 px-4 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-orange-300 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload More Data</span>
                </button>
              </div>

              {/* Train Twin Button */}
              <button
                onClick={() => {
                  setIsTraining(true);
                  setTimeout(() => {
                    setIsTraining(false);
                    setTwinTrained(true);
                  }, 3000);
                }}
                disabled={!trainingObjective || selectedFiles.length === 0 || isTraining}
                className="w-full mb-6 flex items-center justify-center space-x-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>{isTraining ? 'Training Twin...' : 'Train Digital Twin'}</span>
              </button>

              {/* Digital Twin Dashboard */}
              {twinTrained && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
                >
                  <h4 className="text-lg font-medium text-green-300 mb-3">Digital Twin Dashboard</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Accuracy:</span>
                      <span className="text-green-400 font-medium">94.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Failure Localization:</span>
                      <span className="text-green-400 font-medium">±0.3mm</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-black/30 rounded-lg">
                    <h5 className="text-sm font-medium text-orange-300 mb-2">Key Insights from Learning:</h5>
                    <p className="text-xs text-gray-300">
                      Digital twin identified critical stress concentration at chainplate connection points. 
                      Failure modes primarily occur under 45° impact angles with forces exceeding 1200N.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Predict Behavior */}
              {twinTrained && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Predict Behavior</label>
                  <select 
                    value={predictionBehavior}
                    onChange={(e) => {
                      setPredictionBehavior(e.target.value);
                      // Simulate prediction
                      setTimeout(() => {
                        setPredictionResult(e.target.value.includes('high') ? 'fail' : 'pass');
                      }, 1000);
                    }}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="">Select test scenario...</option>
                    <option value="drop-low">Drop Test - Low Impact (0.5m)</option>
                    <option value="drop-high">Drop Test - High Impact (2.0m)</option>
                    <option value="stress-normal">Stress Test - Normal Load</option>
                    <option value="stress-high">Stress Test - High Load</option>
                    <option value="vibration-test">Vibration Analysis</option>
                  </select>
                </div>
              )}

              {/* Prediction Results */}
              {predictionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-black/30 rounded-lg"
                >
                  <h5 className="text-sm font-medium text-orange-300 mb-2">Prediction Details:</h5>
                  <p className="text-xs text-gray-300">
                    {predictionResult === 'fail' 
                      ? "Analysis indicates structural failure likely at chainplate junction. Recommend reinforcement or load redistribution."
                      : "Structure shows good integrity under tested conditions. Safety margins adequate for specified use case."
                    }
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        );
      
      case 'generative-design':
        return (
          <div className="h-full w-full flex">
            {/* Left side - Design Gallery */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <p className="text-sm text-gray-400">Generated design variations appear here</p>
              </div>

              {generatedDesigns.length === 0 ? (
                <div className="relative flex items-center justify-center h-full min-h-[600px] rounded-lg overflow-hidden">
                  {/* Background 3D Component Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={
                        selectedComponent === 'board' ? boardThermalImage :
                        selectedComponent === 'enclosure' ? enclosureThermalImage :
                        selectedComponent === 'heatsink' ? heatSinkThermalImage :
                        postProcessorImage
                      } 
                      alt={
                        selectedComponent === 'board' ? "Board Thermal Analysis" :
                        selectedComponent === 'enclosure' ? "Enclosure Thermal Analysis" :
                        selectedComponent === 'heatsink' ? "Heat Sink Thermal Analysis" :
                        "Post-processor Simulation"
                      }
                      className="w-full h-full object-contain opacity-80"
                    />
                  </div>
                  
                  {/* Component Labels */}
                  {selectedComponent === 'board' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-lg px-4 py-2 shadow-xl"
                    >
                      <h4 className="text-sm font-semibold text-blue-300">Board Thermal Analysis</h4>
                      <p className="text-xs text-gray-400">Temperature distribution across PCB</p>
                    </motion.div>
                  )}
                  {selectedComponent === 'enclosure' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-lg px-4 py-2 shadow-xl"
                    >
                      <h4 className="text-sm font-semibold text-blue-300">Enclosure Thermal Analysis</h4>
                      <p className="text-xs text-gray-400">Surface temperature & airflow patterns</p>
                    </motion.div>
                  )}
                  {selectedComponent === 'heatsink' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-lg px-4 py-2 shadow-xl"
                    >
                      <h4 className="text-sm font-semibold text-blue-300">Heat Sink Thermal Analysis</h4>
                      <p className="text-xs text-gray-400">Fin pack temperature gradient</p>
                    </motion.div>
                  )}
                  
                  {/* 2D Latent Space Explorer Overlay */}
                  <motion.div
                    drag
                    dragConstraints={{ left: -350, right: 350, top: -250, bottom: 250 }}
                    dragElastic={0.1}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute top-4 right-4 w-64 h-64 bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-lg p-4 shadow-xl cursor-grab active:cursor-grabbing"
                    whileHover={{ scale: 1.02 }}
                    whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                  >
                    {/* Header */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-blue-300 mb-1">Design Space Explorer</h4>
                      <p className="text-[10px] text-gray-400">Interactive 2D latent space</p>
                    </div>
                    
                    {/* 2D Plot Area */}
                    <div className="relative w-full h-40 bg-black/40 rounded border border-blue-500/20">
                      {/* Grid lines */}
                      <div className="absolute inset-0">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-500/10"></div>
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/10"></div>
                      </div>
                      
                      {/* Axis labels */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] text-gray-500">Noise</div>
                      <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 -rotate-90 text-[9px] text-gray-500">Touch Temp</div>
                      
                      {/* Design points scattered across the space */}
                      {Array.from({ length: 25 }, (_, i) => {
                        const x = Math.random() * 90 + 5;
                        const y = Math.random() * 90 + 5;
                        const size = 3 + Math.random() * 2;
                        const opacity = 0.4 + Math.random() * 0.6;
                        const color = `hsl(${200 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`;
                        
                        return (
                          <motion.div
                            key={i}
                            className="absolute rounded-full cursor-pointer hover:scale-150 transition-transform"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              width: `${size}px`,
                              height: `${size}px`,
                              backgroundColor: color,
                              opacity: opacity,
                              boxShadow: `0 0 ${size * 2}px ${color}`
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: i * 0.02,
                              type: "spring",
                              stiffness: 300
                            }}
                            whileHover={{ 
                              scale: 2,
                              zIndex: 10
                            }}
                          />
                        );
                      })}
                      
                      {/* Highlighted region indicator */}
                      <motion.div
                        className="absolute border-2 border-blue-400/50 rounded bg-blue-400/5"
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
                      25 design variants mapped
                    </div>
                  </motion.div>
                  
                  {/* Ambient lighting effects */}
                  <div className="absolute top-4 left-4 w-24 h-24 bg-blue-500/10 blur-xl rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-sky-500/10 blur-xl rounded-full"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generatedDesigns.map((design, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-3 hover:border-orange-500/30 cursor-pointer transition-colors"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-sky-500/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                        {/* Background component image with variations */}
                        <img 
                          src={postProcessorImage} 
                          alt="Design Variation"
                          className="w-full h-full object-contain opacity-70"
                          style={{
                            filter: `hue-rotate(${index * 30}deg) saturate(${0.8 + (index % 3) * 0.3}) brightness(${0.9 + (index % 2) * 0.2})`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-1 left-1 text-xs text-white font-medium">
                          {design.name}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-white font-medium truncate">{design.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            design.status === 'Generated' ? 'bg-blue-900/50 text-blue-300' :
                            design.status === 'Testing' ? 'bg-yellow-900/50 text-yellow-300' :
                            design.status === 'Passed' ? 'bg-green-900/50 text-green-300' :
                            'bg-red-900/50 text-red-300'
                          }`}>
                            {design.status}
                          </span>
                          <span className="text-xs text-gray-400">Perf: {design.performance}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Auto-Test Button */}
              {generatedDesigns.length > 0 && (
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => {
                      setIsAutoTesting(true);
                      setTimeout(() => {
                        setIsAutoTesting(false);
                        setGeneratedDesigns(prev => prev.map(design => ({
                          ...design,
                          status: Math.random() > 0.3 ? 'Passed' : 'Failed',
                          performance: Math.floor(Math.random() * 30) + 70
                        })));
                      }, 3000);
                    }}
                    disabled={isAutoTesting}
                    className="flex items-center space-x-2 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                  >
                    <Beaker className="w-4 h-4" />
                    <span>{isAutoTesting ? 'Auto-Testing...' : 'Auto-Test Generated Designs'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Simulate AI feedback loop
                      const failedDesigns = generatedDesigns.filter(d => d.status === 'Failed').length;
                      if (failedDesigns > 0) {
                        setIsGenerating(true);
                        setTimeout(() => {
                          setIsGenerating(false);
                          const newDesigns = Array.from({length: 6}, (_, i) => ({
                            name: `Refined Design ${generatedDesigns.length + i + 1}`,
                            status: 'Generated',
                            performance: Math.floor(Math.random() * 20) + 80
                          }));
                          setGeneratedDesigns(prev => [...prev, ...newDesigns]);
                        }, 2000);
                      }
                    }}
                    className="flex items-center space-x-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refine Designs (AI Feedback Loop)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right side - Thermal Engineering Controls */}
            <div className="w-80 bg-black/40 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Thermal Design Controls
              </h3>

              {/* System Configuration */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">System Configuration</label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select system type...</option>
                  <option value="laptop-thermal">💻 Laptop Thermal System</option>
                  <option value="desktop-cooling">🖥️ Desktop Workstation</option>
                  <option value="server-thermal">🌐 Server Thermal Solution</option>
                  <option value="mobile-device">📱 Mobile Device Cooling</option>
                </select>
                {selectedProduct && (
                  <div className="mt-2 p-2 bg-black/20 rounded text-xs text-gray-400">
                    ✓ {selectedProduct.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} loaded
                  </div>
                )}
              </div>

              {/* Thermal Optimization Targets */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  🎯 Optimization Targets
                </label>
                <div className="space-y-3">
                  {/* Noise Target */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 font-medium">Noise Level</span>
                      <span className="text-xs text-blue-300">Target: &lt; 35 dBA</span>
                    </div>
                    <input 
                      type="range" 
                      min="25" 
                      max="45" 
                      defaultValue="35"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>Silent (25)</span>
                      <span>Loud (45)</span>
                    </div>
                  </div>

                  {/* Touch Temperature */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 font-medium">Touch Temp</span>
                      <span className="text-xs text-blue-300">Max: 45°C</span>
                    </div>
                    <input 
                      type="range" 
                      min="35" 
                      max="55" 
                      defaultValue="45"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>Cool (35°C)</span>
                      <span>Hot (55°C)</span>
                    </div>
                  </div>

                  {/* CPU Temperature */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 font-medium">CPU Junction Temp</span>
                      <span className="text-xs text-blue-300">Max: 85°C</span>
                    </div>
                    <input 
                      type="range" 
                      min="70" 
                      max="100" 
                      defaultValue="85"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>Conservative</span>
                      <span>Aggressive</span>
                    </div>
                  </div>

                  {/* Airflow */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300 font-medium">Airflow Rate</span>
                      <span className="text-xs text-blue-300">Min: 25 CFM</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="50" 
                      defaultValue="25"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>Low (15 CFM)</span>
                      <span>High (50 CFM)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Isolation */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-sky-400 mb-3 flex items-center">
                  Isolate Components
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setSelectedComponent(selectedComponent === 'fan' ? null : 'fan')}
                    className={`${selectedComponent === 'fan' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/20 border-blue-500/30'} hover:bg-blue-500/20 border rounded-lg p-2 text-xs text-gray-300 transition-colors flex items-center justify-center`}
                  >
                    <span>Fan</span>
                  </button>
                  <button 
                    onClick={() => setSelectedComponent(selectedComponent === 'inlet' ? null : 'inlet')}
                    className={`${selectedComponent === 'inlet' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/20 border-blue-500/30'} hover:bg-blue-500/20 border rounded-lg p-2 text-xs text-gray-300 transition-colors flex items-center justify-center`}
                  >
                    <span>Inlet</span>
                  </button>
                  <button 
                    onClick={() => setSelectedComponent(selectedComponent === 'board' ? null : 'board')}
                    className={`${selectedComponent === 'board' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/20 border-blue-500/30'} hover:bg-blue-500/20 border rounded-lg p-2 text-xs text-gray-300 transition-colors flex items-center justify-center`}
                  >
                    <span>Board</span>
                  </button>
                  <button 
                    onClick={() => setSelectedComponent(selectedComponent === 'tim' ? null : 'tim')}
                    className={`${selectedComponent === 'tim' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/20 border-blue-500/30'} hover:bg-blue-500/20 border rounded-lg p-2 text-xs text-gray-300 transition-colors flex items-center justify-center`}
                  >
                    <span>TIM</span>
                  </button>
                  <button 
                    onClick={() => setSelectedComponent(selectedComponent === 'heatsink' ? null : 'heatsink')}
                    className={`${selectedComponent === 'heatsink' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/20 border-blue-500/30'} hover:bg-blue-500/20 border rounded-lg p-2 text-xs text-gray-300 transition-colors flex items-center justify-center`}
                  >
                    <span>Heat Sink</span>
                  </button>
                  <button 
                    onClick={() => setSelectedComponent(selectedComponent === 'enclosure' ? null : 'enclosure')}
                    className={`${selectedComponent === 'enclosure' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/20 border-blue-500/30'} hover:bg-blue-500/20 border rounded-lg p-2 text-xs text-gray-300 transition-colors flex items-center justify-center`}
                  >
                    <span>Enclosure</span>
                  </button>
                </div>
              </div>

              {/* Thermal Constraints */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Design Constraints</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    <span className="text-sm text-gray-300">Meet IEC 62368 Limits</span>
                    <input type="checkbox" className="rounded bg-black/30 border-white/20 accent-blue-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    <span className="text-sm text-gray-300">Minimize Fan Speed</span>
                    <input type="checkbox" className="rounded bg-black/30 border-white/20 accent-blue-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    <span className="text-sm text-gray-300">Optimize TIM Coverage</span>
                    <input type="checkbox" className="rounded bg-black/30 border-white/20 accent-blue-500" />
                  </div>
                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    <span className="text-sm text-gray-300">Maximize Heat Spreading</span>
                    <input type="checkbox" className="rounded bg-black/30 border-white/20 accent-blue-500" />
                  </div>
                </div>
              </div>

              {/* Power Profile */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Power Profile</label>
                <select className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="idle">Idle (5-10W)</option>
                  <option value="light">Light Load (15-25W)</option>
                  <option value="typical">Typical (30-45W)</option>
                  <option value="heavy">Heavy Load (50-65W)</option>
                  <option value="stress">Stress Test (80W+)</option>
                </select>
              </div>

              {/* Generate Variations Button */}
              <button
                onClick={() => {
                  setIsGenerating(true);
                  setTimeout(() => {
                    setIsGenerating(false);
                    const newDesigns = Array.from({length: 12}, (_, i) => ({
                      name: `Design Variant ${i + 1}`,
                      status: 'Generated',
                      performance: Math.floor(Math.random() * 30) + 70
                    }));
                    setGeneratedDesigns(newDesigns);
                  }, 2000);
                }}
                disabled={!selectedProduct || isGenerating}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
              >
                <Grid className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Variations...' : 'Generate Design Variations'}</span>
              </button>

              {generatedDesigns.length > 0 && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <div className="text-sm text-green-300">
                    <strong>{generatedDesigns.length}</strong> design variations generated
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Ready for auto-testing and refinement
                  </div>
                </div>
              )}
            </div>

            {/* AI Modal */}
            {showAIModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full mx-4"
                >
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                    AI Design Idea Generator
                  </h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Describe your design goals in natural language, and AI will suggest parameters.
                  </p>
                  <textarea
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="Design a lightweight, high-strength bracket for an aerospace application that minimizes vibration..."
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    rows={4}
                  />
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => {
                        // Simulate AI parameter generation
                        if (aiDescription.toLowerCase().includes('lightweight')) {
                          setMaterialType('aluminum-alloy');
                          setPerformanceTarget('Target Weight: < 300g, Min Stiffness: 800 N/mm');
                        }
                        if (aiDescription.toLowerCase().includes('aerospace')) {
                          setLoadConditions('2000 N axial, 100 Nm torsion, vibration: 20-2000 Hz');
                          setGeometricConstraints('Max Length: 150mm, Min Wall Thickness: 1.5mm');
                        }
                        setShowAIModal(false);
                        setAiDescription('');
                      }}
                      className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                    >
                      Generate Parameters
                    </button>
                    <button
                      onClick={() => {
                        setShowAIModal(false);
                        setAiDescription('');
                      }}
                      className="py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        );
      
      case 'simulation':
        return (
          <div className="h-full w-full flex">
            {/* Main 3D Viewer */}
            <div className="flex-1 relative">
              <div className="h-full w-full bg-gray-900 rounded-lg overflow-hidden">
                <div className="sketchfab-embed-wrapper h-full w-full">
                  <iframe 
                    title={
                      simulationModel === 'mast-u' ? "MAST-U (Test)" : 
                      simulationModel === 'aeration-cfd' ? "Aeration CFD Model" : 
                      "Cavern"
                    }
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src={
                      simulationModel === 'mast-u' 
                        ? "https://sketchfab.com/models/d54f9a6a6a084af1b89c07e436982c2f/embed?camera=0&transparent=1&ui_theme=dark"
                        : simulationModel === 'aeration-cfd'
                        ? "https://sketchfab.com/models/5b3755ffc49949979a72ae8b52883d20/embed?autostart=1&camera=0&preload=1&transparent=1&ui_theme=dark"
                        : "https://sketchfab.com/models/34af692a2bb6406d97d20880c4f0bd2a/embed?autostart=1&camera=0&preload=1&transparent=1"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Test Selection */}
            <div className="w-80 bg-gray-900 border-l border-gray-700 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <TestTube className="w-5 h-5 mr-2 text-blue-400" />
                  Thermal Test Suites
                </h3>
                <p className="text-sm text-gray-400">Select Dell thermal validation tests</p>
              </div>

              {/* Preset Thermal Tests */}
              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-medium text-white mb-3">Preset Tests</h4>
                
                {/* Thermal Cycling Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Thermal Cycling Test</h5>
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">JEDEC JESD22-A104 standard</p>
                  <div className="text-xs text-gray-500">
                    • -40°C to 85°C range
                    • 1000 cycle duration
                    • 15 min dwell time
                  </div>
                </div>

                {/* Junction Temperature Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Junction Temperature Test</h5>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">CPU/GPU thermal limits</p>
                  <div className="text-xs text-gray-500">
                    • Max Tj: 105°C limit
                    • Full load stress test
                    • Thermal throttling check
                  </div>
                </div>

                {/* Airflow Validation Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Airflow Validation Test</h5>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">CFD correlation test</p>
                  <div className="text-xs text-gray-500">
                    • Fan curve validation
                    • Volumetric flow rate
                    • Pressure drop analysis
                  </div>
                </div>

                {/* Heat Sink Performance Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Heat Sink Performance Test</h5>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Thermal resistance measurement</p>
                  <div className="text-xs text-gray-500">
                    • Rθ-ja characterization
                    • TIM effectiveness
                    • Fin efficiency analysis
                  </div>
                </div>

                {/* Thermal Shock Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Thermal Shock Test</h5>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Rapid temperature change</p>
                  <div className="text-xs text-gray-500">
                    • 0°C to 100°C in 30s
                    • 100 cycle minimum
                    • Solder joint integrity
                  </div>
                </div>

                {/* Ambient Temperature Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Ambient Temperature Test</h5>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Operating range validation</p>
                  <div className="text-xs text-gray-500">
                    • 5°C to 35°C ambient
                    • System stability check
                    • Fan acoustics @ temp
                  </div>
                </div>
              </div>

              {/* Custom Test Section */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-white mb-3">Custom Tests</h4>
                
                <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-400 mb-2">Create Custom Thermal Test</p>
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    Configure Parameters
                  </button>
                </div>
              </div>

              {/* Run Test Button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <Play className="w-4 h-4 mr-2" />
                  Run Selected Tests
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
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
        
        <div className="h-full w-full flex flex-col">
          {/* Tab Bar */}
          <div className="flex border-b border-white/10 bg-black/30 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'simulation'
                  ? 'text-blue-300 border-b-2 border-blue-400 bg-blue-900/20'
                  : 'text-gray-400 hover:text-blue-200 hover:bg-blue-900/10'
              }`}
            >
              Simulation & Validation
            </button>
            <button
              onClick={() => setActiveTab('generative-design')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'generative-design'
                  ? 'text-blue-300 border-b-2 border-blue-400 bg-blue-900/20'
                  : 'text-gray-400 hover:text-blue-200 hover:bg-blue-900/10'
              }`}
            >
              Generative Design Lab
            </button>
            <button
              onClick={() => setActiveTab('digital-twin')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'digital-twin'
                  ? 'text-blue-300 border-b-2 border-blue-400 bg-blue-900/20'
                  : 'text-gray-400 hover:text-blue-200 hover:bg-blue-900/10'
              }`}
            >
              Digital Twin Studio
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {renderTabContent()}
          </div>
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
          {/* Chat header with drag handle */}
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

          )}

          {/* Input area */}
          {!isChatMinimized && (
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
          )}
        </div>
      </motion.div>
    </div>
  );
}