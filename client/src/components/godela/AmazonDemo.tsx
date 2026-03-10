import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, PlusCircle, GripVertical, Upload, Play, CheckCircle, AlertTriangle, FileText, Zap, Sparkles, Settings, Grid, Beaker, RefreshCw, TestTube, Plus } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';
import SketchfabEmbed from './SketchfabEmbed';
import amazonDemoSteps from '@/lib/amazonDemoSteps';
import mechanicalComponentImage from '@assets/image_1753382161630.png';

interface ChatMessage {
  isAI: boolean;
  message: string;
}

export default function AmazonDemo() {
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
  const [activeTab, setActiveTab] = useState<'digital-twin' | 'generative-design' | 'simulation'>('digital-twin');
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
                <div className="relative flex items-center justify-center h-full min-h-[600px] border-2 border-dashed border-gray-600 rounded-lg overflow-hidden">
                  {/* Background 3D Component Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={mechanicalComponentImage} 
                      alt="Mechanical Component"
                      className="w-full h-full object-contain opacity-80 transform rotate-12 scale-125"
                    />
                  </div>
                  
                  {/* Ambient lighting effects */}
                  <div className="absolute top-4 right-4 w-24 h-24 bg-orange-500/10 blur-xl rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-purple-500/10 blur-xl rounded-full"></div>
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
                      <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                        {/* Background component image with variations */}
                        <img 
                          src={mechanicalComponentImage} 
                          alt="Design Variation"
                          className="w-full h-full object-contain opacity-70 transform scale-75"
                          style={{
                            filter: `hue-rotate(${index * 30}deg) saturate(${0.8 + (index % 3) * 0.3}) brightness(${0.9 + (index % 2) * 0.2})`,
                            transform: `scale(0.75) rotate(${-10 + (index % 4) * 5}deg)`
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

            {/* Right side - Controls */}
            <div className="w-80 bg-black/40 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-orange-400" />
                Design Parameters
              </h3>

              {/* Product Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Product CAD</label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="">Choose product...</option>
                  <option value="electronic-device">Electronic Device CAD</option>
                  <option value="mechanical-part">Mechanical Component</option>
                  <option value="packaging-sample">Existing Package Design</option>
                  <option value="test-panel">MTN Test Panel</option>
                </select>
                {selectedProduct && (
                  <div className="mt-2 p-2 bg-black/20 rounded text-xs text-gray-400">
                    ✓ {selectedProduct.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} selected
                  </div>
                )}
              </div>

              {/* Sustainability Targets */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-green-400 mb-3 flex items-center">
                  🌱 Sustainability Goals
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Material Recyclability</span>
                    <select className="bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200">
                      <option value="100">100% Recyclable</option>
                      <option value="80">80% Recyclable</option>
                      <option value="60">60% Recyclable</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Carbon Footprint</span>
                    <select className="bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200">
                      <option value="minimal">Minimal (&lt; 2kg CO₂)</option>
                      <option value="low">Low (&lt; 5kg CO₂)</option>
                      <option value="standard">Standard (&lt; 10kg CO₂)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Bio-based Content</span>
                    <select className="bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200">
                      <option value="high">High (&gt;70%)</option>
                      <option value="medium">Medium (&gt;40%)</option>
                      <option value="low">Low (&gt;20%)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Design Optimization Targets */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  🎯 Optimization Goals
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Weight Reduction</div>
                    <select className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200">
                      <option value="30">30% Lighter</option>
                      <option value="20">20% Lighter</option>
                      <option value="10">10% Lighter</option>
                    </select>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Material Usage</div>
                    <select className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200">
                      <option value="minimal">Minimize (40% less)</option>
                      <option value="reduced">Reduce (25% less)</option>
                      <option value="optimize">Optimize (15% less)</option>
                    </select>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Protection Level</div>
                    <select className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200">
                      <option value="maximum">Maximum (99.9%)</option>
                      <option value="high">High (99%)</option>
                      <option value="standard">Standard (95%)</option>
                    </select>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Space Efficiency</div>
                    <select className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200">
                      <option value="compact">Ultra Compact</option>
                      <option value="efficient">Space Efficient</option>
                      <option value="balanced">Balanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Material Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Smart Material Selection</label>
                <select 
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                >
                  <option value="">AI will suggest optimal material...</option>
                  <option value="recyclable-cardboard">♻️ Recyclable Cardboard (90% sustainable)</option>
                  <option value="bio-foam">🌱 Bio-Foam (85% bio-based)</option>
                  <option value="molded-pulp">📦 Molded Pulp (100% compostable)</option>
                  <option value="recycled-plastic">♻️ Recycled Plastic (75% recycled content)</option>
                  <option value="mushroom-packaging">🍄 Mushroom Packaging (100% biodegradable)</option>
                  <option value="cornstarch-foam">🌽 Cornstarch Foam (100% plant-based)</option>
                </select>
              </div>

              {/* Package Requirements */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Package Requirements</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    <span className="text-sm text-gray-300">Drop Test (0.6m)</span>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded bg-black/30 border-white/20" defaultChecked />
                      <span className="text-xs text-green-400">Required</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    <span className="text-sm text-gray-300">Vibration Resistance</span>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded bg-black/30 border-white/20" defaultChecked />
                      <span className="text-xs text-orange-400">Standard</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    <span className="text-sm text-gray-300">Compression (125 lbs)</span>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded bg-black/30 border-white/20" />
                      <span className="text-xs text-gray-400">Optional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Constraints */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Size & Shipping Constraints</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Max Dimensions</label>
                    <select className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200 mt-1">
                      <option>Small (&lt; 30cm)</option>
                      <option>Medium (&lt; 60cm)</option>
                      <option>Large (&lt; 100cm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Shipping Type</label>
                    <select className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-xs text-gray-200 mt-1">
                      <option>Standard Ground</option>
                      <option>Air/Express</option>
                      <option>International</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Generate Ideas Button */}
              <button
                onClick={() => setShowAIModal(true)}
                className="w-full mb-4 flex items-center justify-center space-x-2 py-2 px-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>✨ Generate Design Ideas</span>
              </button>

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
                    title="iPhone 12 Pro Packaging Test"
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/16a403db673c49ed876185f1db14e78d/embed?autospin=1&ui_theme=dark"
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Test Selection */}
            <div className="w-80 bg-gray-900 border-l border-gray-700 p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <TestTube className="w-5 h-5 mr-2 text-orange-400" />
                  Test Suites
                </h3>
                <p className="text-sm text-gray-400">Select Amazon packaging validation tests</p>
              </div>

              {/* Preset Amazon Tests */}
              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-medium text-white mb-3">Preset Tests</h4>
                
                {/* Drop Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-orange-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Drop Test</h5>
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">ISTA 6-Amazon.com-SIOC standard</p>
                  <div className="text-xs text-gray-500">
                    • 0.6m drop height
                    • Multiple orientations
                    • Edge & corner impacts
                  </div>
                </div>

                {/* Vibration Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-orange-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Vibration Test</h5>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Transportation simulation</p>
                  <div className="text-xs text-gray-500">
                    • Random vibration profile
                    • 1-200 Hz frequency range
                    • 30 minute duration
                  </div>
                </div>

                {/* Compression Test */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-orange-500 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">Compression Test</h5>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Stacking load simulation</p>
                  <div className="text-xs text-gray-500">
                    • 125 lbs static load
                    • 24 hour duration
                    • Edge crush strength
                  </div>
                </div>
              </div>

              {/* Custom Test Section */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-white mb-3">Custom Tests</h4>
                
                <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-400 mb-2">Create Custom Test</p>
                  <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                    Configure Parameters
                  </button>
                </div>
              </div>

              {/* Run Test Button */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
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
              onClick={() => setActiveTab('digital-twin')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'digital-twin'
                  ? 'text-orange-300 border-b-2 border-orange-400 bg-orange-900/20'
                  : 'text-gray-400 hover:text-orange-200 hover:bg-orange-900/10'
              }`}
            >
              Digital Twin Studio
            </button>
            <button
              onClick={() => setActiveTab('generative-design')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'generative-design'
                  ? 'text-orange-300 border-b-2 border-orange-400 bg-orange-900/20'
                  : 'text-gray-400 hover:text-orange-200 hover:bg-orange-900/10'
              }`}
            >
              Generative Design Lab
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'simulation'
                  ? 'text-orange-300 border-b-2 border-orange-400 bg-orange-900/20'
                  : 'text-gray-400 hover:text-orange-200 hover:bg-orange-900/10'
              }`}
            >
              Simulation & Validation
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