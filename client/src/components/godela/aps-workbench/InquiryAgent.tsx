import { useEffect, useRef, useState } from 'react';
import useDemoStore from '@/store/useDemoStore';
import { SimulationStage } from '@/lib/apsWorkbench/types';
import { INITIAL_USER_QUERY, REFINED_USER_QUERY, DETAILED_PROBLEM_SPEC, SYSTEM_PLAN, EXPERIMENT_SUMMARY_DATA, SIMULATION_PROPOSAL_DATA } from '@/lib/apsWorkbench/constants';
import { TerminalPanel } from './TerminalPanel';

interface InquiryAgentProps {
  stage: SimulationStage;
  setStage: (stage: SimulationStage) => void;
  setMorphValue: (val: number) => void;
}

export const InquiryAgent: React.FC<InquiryAgentProps> = ({ stage, setStage, setMorphValue }) => {
  // Use store for all APS state
  const { 
    apsChatMessages: messages, 
    apsExperimentConfig: experimentConfig, 
    apsIsTyping: isTyping,
    addApsChatMessage,
    updateLastApsChatMessage,
    setApsExperimentConfig,
    updateApsExperimentConfig,
    setApsIsTyping
  } = useDemoStore();
  
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState(INITIAL_USER_QUERY);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle User Action
  const handleSend = async () => {
    if (stage === SimulationStage.IDLE) {
      await runInitialAnalysis();
    } else if (stage === SimulationStage.CLARIFYING) {
      await startPlanning();
    } else if (stage === SimulationStage.PLANNING_CONFIRMATION) {
      await finalizePlan();
    } else if (stage === SimulationStage.CONFIRMING) {
      await executePlan();
    } else if (stage === SimulationStage.VALIDATION_CHECK) {
      await runValidation();
    }
  };

  const addMessage = (sender: 'user' | 'agent', text: string, type: 'text' | 'card' | 'process' | 'insight' | 'plan' | 'summary' | 'proposal' = 'text', data?: any, file?: { name: string; size: string }) => {
    addApsChatMessage({
      id: Math.random().toString(36),
      sender,
      text,
      type,
      data,
      file,
      timestamp: Date.now()
    });
  };

  const updateLastMessage = (updates: Partial<{ text: string; type: 'text' | 'card' | 'process' | 'insight' | 'plan' | 'summary' | 'proposal'; data?: any }>) => {
    updateLastApsChatMessage(updates);
  };

  // --------------------------------------------------------------------------------
  // SEQUENCE 1: INITIAL ANALYSIS
  // --------------------------------------------------------------------------------
  const runInitialAnalysis = async () => {
    // User Input with File Upload Simulation
    addMessage('user', inputText, 'text', undefined, { name: 'coupe_baseline_v04.stl', size: '24.8 MB' });
    setInputText('');
    setStage(SimulationStage.ANALYZING);
    setApsIsTyping(true);

    // Dashboard Update: Initializing
    updateApsExperimentConfig({
        activeModules: ['I2I Parser'],
        planStep: -1
    });

    // Scanning Visuals - REDUCED LATENCY (was 3500)
    await new Promise(r => setTimeout(r, 1500));
    setApsIsTyping(false);
    
    // Narrative: Contextual
    addMessage('agent', "I've analyzed the base geometry. It's a standard sports coupe profile with an estimated drag coefficient (Cd) of ~0.35.", 'text');
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Narrative: Clarification
    setStage(SimulationStage.CLARIFYING);
    updateApsExperimentConfig({
        activeModules: ['I2I Parser', 'Conversation Engine']
    });

    addMessage('agent', "To begin, please define your primary performance objectives and any critical operating constraints.", 'text');
    
    // Auto-fill user response
    setInputText("");
    setTimeout(() => {
        let i = 0;
        const txt = REFINED_USER_QUERY;
        const typeInterval = setInterval(() => {
            setInputText(txt.substring(0, i + 1));
            i++;
            if (i === txt.length) clearInterval(typeInterval);
        }, 15);
    }, 1500);
  };

  // --------------------------------------------------------------------------------
  // SEQUENCE 2a: START PLANNING (Definition & Translation)
  // --------------------------------------------------------------------------------
  const startPlanning = async () => {
    // User Input
    addMessage('user', inputText);
    setInputText('');
    setStage(SimulationStage.PARSING);
    setApsIsTyping(true);
    
    // 1. Show "Thinking" state for Definition - INCREASED LATENCY
    await new Promise(r => setTimeout(r, 1000));
    addMessage('agent', "Decomposing inquiry and defining experiment parameters...", 'process');

    // Dashboard Update: Parsing
    updateApsExperimentConfig({
        activeModules: ['I2I Parser', 'Design Space Generator'],
        planStep: 0 // "Construct parametric design manifold"
    });

    await new Promise(r => setTimeout(r, 3000));

    // 2. Transform to Summary Card (The Problem)
    updateLastMessage({
        type: 'summary',
        text: "I have translated your objectives into the following engineering experiment definition.",
        data: EXPERIMENT_SUMMARY_DATA
    });

    // Dashboard Update: Context Populated with DETAILED SPEC
    setApsExperimentConfig(DETAILED_PROBLEM_SPEC);

    // Reduced latency to show narrative immediately after card
    await new Promise(r => setTimeout(r, 600));
    setApsIsTyping(false);

    // 3. Narrative: Translation Confirmation
    addMessage('agent', "Understood. I am translating 'Top Speed' to Drag Reduction and 'Grip' to Downforce maintenance. 'Overheating' defines our Thermal Constraint.\n\nContinue with planning?", 'text');

    setStage(SimulationStage.PLANNING_CONFIRMATION);
  };

  // --------------------------------------------------------------------------------
  // SEQUENCE 2c: FINALIZE PLAN (System Plan)
  // --------------------------------------------------------------------------------
  const finalizePlan = async () => {
    // User Input (Confirmation)
    addMessage('user', inputText || "Proceed.");
    setInputText('');
    setStage(SimulationStage.PARSING); // Briefly back to parsing/thinking
    setApsIsTyping(true);

    // 4. Show "Thinking" state for Strategy
    await new Promise(r => setTimeout(r, 800));
    addMessage('agent', "Formulating execution pipeline...", 'process');
    
    // INCREASED LATENCY
    await new Promise(r => setTimeout(r, 3500));

    // 5. Transform to Plan Card (The Solution)
    updateLastMessage({
        type: 'plan',
        text: "Based on the definition and thermal coupling requirements, I have generated this system plan.",
        data: SYSTEM_PLAN
    });

    // Dashboard Update: Plan Ready
    updateApsExperimentConfig({
        planStep: 1, // "Generate candidate geometries"
        activeModules: ['Surrogate Aero (v3)', 'Thermal Solver (Coupled)']
    });

    setApsIsTyping(false);
    setStage(SimulationStage.CONFIRMING);
  }

  // --------------------------------------------------------------------------------
  // SEQUENCE 3: EXECUTE PLAN (Induction -> Check -> Insight)
  // --------------------------------------------------------------------------------
  const executePlan = async () => {
    // User Input (Confirmation)
    addMessage('user', inputText || "Execute.");
    setInputText('');
    setApsIsTyping(true);
    
    await new Promise(r => setTimeout(r, 1000));
    setApsIsTyping(false);
    
    addMessage('agent', "Initiating execution. Generating candidate geometries...", 'text');

    // Mechanism: Induction
    setStage(SimulationStage.INDUCTION);
    
    updateApsExperimentConfig({
        planStep: 2, // "Evaluate surrogate models"
        activeModules: ['Surrogate Aero (v3)', 'Surrogate Thermal (v2)']
    });

    // Let the 3D cycling happen - INCREASED LATENCY
    await new Promise(r => setTimeout(r, 4500));
    updateApsExperimentConfig({ planStep: 3 }); // Rank candidates
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Mechanism: Check
    setStage(SimulationStage.CHECKING);
    updateApsExperimentConfig({
         planStep: 4, // Select high-fidelity candidate
         activeModules: ['Constraint Evaluator']
    });

    addMessage('agent', "Surrogate analysis complete. A promising candidate geometry has been identified.", 'text');
    
    await new Promise(r => setTimeout(r, 1500));
    
    // 6. Transform to Proposal Card (Assess Drag/Thermal)
    // PASS STRUCTURED DATA FOR NEAT FORMATTING
    updateLastMessage({
        type: 'proposal', 
        text: "I propose running a high-fidelity validation simulation to confirm constraint satisfaction.",
        data: SIMULATION_PROPOSAL_DATA
    });

    setStage(SimulationStage.VALIDATION_CHECK);
  };

  // --------------------------------------------------------------------------------
  // SEQUENCE 4: VALIDATION & INSIGHT (Deduction -> Insight)
  // --------------------------------------------------------------------------------
  const runValidation = async () => {
    // User Input (Confirmation)
    addMessage('user', inputText || "Simulate.");
    setInputText('');
    setApsIsTyping(true);
    
    await new Promise(r => setTimeout(r, 1000));
    setApsIsTyping(false);
    
    addMessage('agent', "Initializing simulation environment...", 'process');
    
    await new Promise(r => setTimeout(r, 2000));
    updateLastMessage({
        text: "Running integrated aero-thermal simulation...",
        type: 'text'
    });

    // Mechanism: Deduction (Solver Trigger)
    setStage(SimulationStage.DEDUCTION);
    updateApsExperimentConfig({
        planStep: 5, // "Run integrated aero-thermal inference"
        activeModules: ['Field Viz Pipeline', 'Optimization Engine']
    });

    // Deduction Visuals Wait - INCREASED LATENCY
    await new Promise(r => setTimeout(r, 4000));
    
    // Insight - CRITICAL: Update morph value to trigger 3D visualization
    setStage(SimulationStage.INSIGHT);
    setMorphValue(1.0); // This now uses the prop which is connected to the store
    
    updateApsExperimentConfig({
        planStep: 6, // "Validate constraints & present insight"
        activeModules: ['Field Viz Pipeline', 'Conversation Engine']
    });

    addMessage('agent', "Insight generated. The optimal design reduces drag by 15% by tilting the spoiler 4.2°, satisfying all lift and thermal constraints.", 'insight');
  };

  // Button disabled logic
  const canInteract = stage === SimulationStage.IDLE || stage === SimulationStage.CLARIFYING || stage === SimulationStage.PLANNING_CONFIRMATION || stage === SimulationStage.CONFIRMING || stage === SimulationStage.VALIDATION_CHECK;
  const isButtonDisabled = !canInteract;

  // Input placeholder logic
  let placeholder = "Describe your engineering goal...";
  if (stage === SimulationStage.CLARIFYING) placeholder = "Type your constraints...";
  if (stage === SimulationStage.PLANNING_CONFIRMATION) placeholder = "Confirm translation...";
  if (stage === SimulationStage.CONFIRMING) placeholder = "Type 'Execute' to proceed...";
  if (stage === SimulationStage.VALIDATION_CHECK) placeholder = "Type 'Simulate' to proceed...";

  // Button Label logic
  let buttonLabel = "Send";
  if (stage === SimulationStage.CLARIFYING) buttonLabel = "Update";
  if (stage === SimulationStage.PLANNING_CONFIRMATION) buttonLabel = "Confirm";
  if (stage === SimulationStage.CONFIRMING) buttonLabel = "Execute";
  if (stage === SimulationStage.VALIDATION_CHECK) buttonLabel = "Simulate";

  return (
    <div className="h-full flex flex-col bg-[#1a1b1f] border-l border-white/10 shadow-2xl" data-testid="inquiry-agent">
      
      {/* 1. TOP PANEL: CHAT / NARRATIVE */}
      <div className="flex-1 flex flex-col min-h-0">
          
          {/* Header */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-[#1A1D24]" data-testid="inquiry-agent-header">
            <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm tracking-widest text-white">INQUIRY AGENT</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Narrative</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">GODELA v2.0</div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a1b1f]" ref={chatScrollRef} data-testid="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`} data-testid={`message-${msg.sender}`}>
                <div className={`max-w-[95%] text-sm leading-relaxed shadow-sm ${
                    msg.type === 'plan' || msg.type === 'summary' || msg.type === 'proposal' ? 'w-full' : 
                    msg.sender === 'user' ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-lg rounded-br-none p-3' 
                    : 'bg-[#252830] border border-gray-700 text-gray-200 rounded-lg rounded-bl-none p-3'
                }`}>
                    {msg.sender === 'agent' && msg.type !== 'plan' && msg.type !== 'summary' && msg.type !== 'proposal' && <span className="text-cyan-500 font-mono text-[10px] block mb-1 uppercase opacity-70">Godela Agent</span>}
                    
                    {/* File Attachment Renderer */}
                    {msg.file && (
                        <div className="flex items-center gap-3 bg-black/20 border border-white/10 p-2 rounded mb-2 w-full max-w-[240px]">
                            <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center border border-blue-500/30 text-blue-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-mono font-bold truncate">{msg.file.name}</span>
                                <span className="text-[9px] text-gray-400 font-mono">{msg.file.size}</span>
                            </div>
                        </div>
                    )}

                    {msg.type === 'insight' ? (
                        <div className="border-l-2 border-green-500 pl-2">
                            <span className="text-green-500 font-bold block mb-1 text-xs uppercase tracking-wider">Insight Generated</span>
                            {msg.text}
                        </div>
                    ) : msg.type === 'process' ? (
                        <div className="flex items-center gap-2 text-cyan-500">
                            <div className="w-2 h-2 rounded-full border border-cyan-500 border-t-transparent animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-wider">{msg.text}</span>
                        </div>
                    ) : msg.type === 'summary' ? (
                        // EXPERIMENT SUMMARY RENDERER
                        <div className="bg-[#15171b] border border-gray-700 rounded-lg overflow-hidden w-full">
                            <div className="bg-gray-800/50 p-2 border-b border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span className="font-bold text-xs text-white uppercase tracking-wider">Experiment Definition</span>
                                </div>
                                <span className="text-[9px] font-mono text-gray-400">STATUS: DEFINED</span>
                            </div>
                            <div className="p-3 space-y-3">
                                <p className="text-gray-300 text-xs italic">"{EXPERIMENT_SUMMARY_DATA.intent}"</p>
                                
                                <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                                    <div>
                                        <span className="text-cyan-500 block mb-1">TARGETS</span>
                                        <ul className="text-gray-400 space-y-0.5">
                                            {EXPERIMENT_SUMMARY_DATA.targetVars.map((t, i) => <li key={i}>{t}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-cyan-500 block mb-1">CONSTRAINTS</span>
                                        <ul className="text-gray-400 space-y-0.5">
                                            {EXPERIMENT_SUMMARY_DATA.constraints.map((t, i) => <li key={i}>{t}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 pt-2 text-[10px] font-mono">
                                    <span className="text-gray-500 block mb-1">DESIGN SPACE</span>
                                    <span className="text-gray-400">{EXPERIMENT_SUMMARY_DATA.designVars.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                    ) : msg.type === 'plan' ? (
                        // PLAN CARD RENDERER
                        <div className="bg-[#15171b] border border-cyan-500/30 rounded-lg overflow-hidden w-full">
                            <div className="bg-cyan-500/10 p-2 border-b border-cyan-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                    <span className="font-bold text-xs text-cyan-500 uppercase tracking-wider">SYSTEM PLAN</span>
                                </div>
                                <span className="text-[9px] font-mono text-gray-400">ID: PLAN-001</span>
                            </div>
                            <div className="p-3">
                                <p className="text-gray-300 mb-3 text-xs">{msg.text}</p>
                                <div className="bg-black/30 rounded p-3 font-mono text-[10px] text-gray-400 border border-white/5">
                                    <ul className="space-y-1.5">
                                        {msg.data && Array.isArray(msg.data) && msg.data.map((step: string, i: number) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="text-gray-600">{(i+1).toString().padStart(2, '0')}</span>
                                                <span className="text-gray-300">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-cyan-500/5 p-2 text-[10px] text-center text-cyan-500 border-t border-cyan-500/10 font-bold uppercase tracking-widest animate-pulse">
                                Awaiting Execution Approval
                            </div>
                        </div>
                    ) : msg.type === 'proposal' ? (
                        // PROPOSAL CARD RENDERER (DETAILED)
                        <div className="bg-[#15171b] border border-cyan-500/30 rounded-lg overflow-hidden w-full">
                            <div className="bg-cyan-500/10 p-2 border-b border-cyan-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                    <span className="font-bold text-xs text-cyan-500 uppercase tracking-wider">Simulation Proposal</span>
                                </div>
                                <span className="text-[9px] font-mono text-gray-400">STATUS: READY</span>
                            </div>
                            <div className="p-3 space-y-3">
                                {/* Config Section */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Solver Configuration</span>
                                    <div className="bg-black/20 p-2 rounded border border-white/5 grid grid-cols-1 gap-1">
                                        {msg.data?.solver?.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between text-[10px] font-mono">
                                                <span className="text-gray-500">{item.label}:</span>
                                                <span className="text-gray-300">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Boundary Conditions */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Boundary Conditions</span>
                                    <div className="bg-black/20 p-2 rounded border border-white/5 grid grid-cols-1 gap-1">
                                        {msg.data?.boundaries?.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between text-[10px] font-mono">
                                                <span className="text-gray-500">{item.label}:</span>
                                                <span className="text-gray-300">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Assumptions */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assumptions</span>
                                    <ul className="list-disc pl-3 text-[10px] text-gray-400 space-y-0.5">
                                        {msg.data?.assumptions?.map((item: string, i: number) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* Time Est */}
                                <div className="bg-black/30 p-2 rounded border border-white/5 text-[10px] font-mono text-gray-400 flex justify-between items-center mt-2">
                                    <span>ESTIMATED DURATION:</span>
                                    <span className="text-white">{msg.data?.time || "~3.2s"}</span>
                                </div>
                            </div>
                            <div className="bg-cyan-500/5 p-2 text-[10px] text-center text-cyan-500 border-t border-cyan-500/10 font-bold uppercase tracking-widest animate-pulse">
                                Awaiting Confirmation
                            </div>
                        </div>
                    ) : (
                         <span className="whitespace-pre-wrap">{msg.text}</span>
                    )}
                </div>
              </div>
            ))}
            {isTyping && (
                <div className="flex items-center gap-1 ml-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#1a1b1f] border-t border-white/10 flex-shrink-0">
            <div className="relative group">
                <textarea 
                    className="w-full bg-black/40 border border-gray-600 rounded p-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none h-16 font-sans transition-colors placeholder-gray-600"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isButtonDisabled}
                    placeholder={placeholder}
                    data-testid="input-message"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !isButtonDisabled) {
                            e.preventDefault();
                            if (inputText || stage === SimulationStage.PLANNING_CONFIRMATION || stage === SimulationStage.CONFIRMING || stage === SimulationStage.VALIDATION_CHECK) {
                                handleSend();
                            }
                        }
                    }}
                />
                <button 
                    onClick={handleSend}
                    disabled={isButtonDisabled || (!inputText && stage !== SimulationStage.PLANNING_CONFIRMATION && stage !== SimulationStage.CONFIRMING && stage !== SimulationStage.VALIDATION_CHECK)}
                    className={`absolute bottom-3 right-3 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all
                        ${isButtonDisabled || (!inputText && stage !== SimulationStage.PLANNING_CONFIRMATION && stage !== SimulationStage.CONFIRMING && stage !== SimulationStage.VALIDATION_CHECK)
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-cyan-500 text-black hover:bg-white shadow-lg shadow-cyan-500/20'}`}
                    data-testid="button-send"
                >
                    {buttonLabel}
                </button>
            </div>
          </div>
      </div>

      {/* 2. BOTTOM PANEL: ENGINEERING DASHBOARD (Fixed height, 40%) */}
      <div className="h-[40%] flex-shrink-0 border-t-4 border-[#0F1115]">
          <TerminalPanel config={experimentConfig} stage={stage} />
      </div>

    </div>
  );
};
