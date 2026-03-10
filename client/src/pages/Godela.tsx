import { useEffect, useState } from "react";
import useDemoStore from "@/store/useDemoStore";
import { AnimatePresence, motion } from "framer-motion";

// Import view components directly
import WelcomeView from "@/components/godela/WelcomeView";
import ProblemAnalysisView from "@/components/godela/ProblemAnalysisView";
import DataProcessingView from "@/components/godela/DataProcessingView";
import ModelBuilderView from "@/components/godela/ModelBuilderView";
import SimulateView from "@/components/godela/SimulateView";
import ChatPanel from "@/components/godela/ChatPanel";
import CarDataProcessingView from "@/components/godela/CarDataProcessingView";
import CarModelBuilderView from "@/components/godela/CarModelBuilderView";
import CarSimulateView from "@/components/godela/CarSimulateView";
import UnifiedPackagingView from "@/components/godela/UnifiedPackagingView";
import PhonePackagingView from "@/components/godela/PhonePackagingView";
import ModelUploadView from "@/components/godela/ModelUploadView";
import ModelViewerDemo from "@/components/godela/ModelViewerDemo";
import SketchfabViewer from "@/components/godela/SketchfabViewer";
import SandboxDemo from "@/components/godela/SandboxDemo";
import LatentExplorerDemo from "@/components/godela/LatentExplorerWithSTL";
import LatentExplorerV2 from "@/components/godela/LatentExplorerV2";
import CosmologyDemo from "@/components/godela/CosmologyDemo";
import AmazonDemo from "@/components/godela/AmazonDemo";
import DellDemo from "@/components/godela/DellDemo";
import APSDemo from "@/components/godela/APSDemo";

// Import logo
import godelaLogoSmall from "../assets/godela-logo-new.png";

export default function Godela() {
  const { resetDemo, demoStep, getCurrentSteps } = useDemoStore();
  const currentStep = getCurrentSteps()[demoStep];
  const [isLoading, setIsLoading] = useState(false);
  const [prevStep, setPrevStep] = useState(demoStep);
  
  // Reset the demo state when the component mounts
  useEffect(() => {
    resetDemo();
  }, [resetDemo]);
  
  // Handle transitions between steps
  useEffect(() => {
    if (demoStep !== prevStep) {
      // Check if we're within the packaging design flow
      const currentView = getCurrentSteps()[demoStep].view;
      const prevView = getCurrentSteps()[prevStep].view;
      
      const isPackagingFlow = 
        (currentView.startsWith('packaging-') && prevView.startsWith('packaging-')) ||
        (useDemoStore.getState().demoPath === 'phone-packaging');
      
      if (isPackagingFlow) {
        // For packaging flow, don't show loading screen - just update the step
        setPrevStep(demoStep);
      } else {
        // For other flows, show loading animation when transitioning between steps
        setIsLoading(true);
        
        // Simulate processing time with longer duration for more dramatic effect
        const timer = setTimeout(() => {
          setIsLoading(false);
          setPrevStep(demoStep);
        }, 1500); // Longer loading time of 1.5 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, [demoStep, prevStep, getCurrentSteps]);
  
  // Determine which view to show based on the current demo step
  const renderRightSideView = () => {
    const view = currentStep.view;
    const isPackagingFlow = view.startsWith('packaging-') || useDemoStore.getState().demoPath === 'phone-packaging';
    
    // For packaging views, use the same key "packaging" for all steps
    // This prevents AnimatePresence from unmounting and remounting components
    const animationKey = isPackagingFlow ? "packaging" : view;
    
    // If we're in packaging flow and not loading, return the appropriate component
    if (isPackagingFlow && !isLoading) {
      // Extract the stage from the view name (e.g., "upload" from "packaging-upload")
      const stagePart = view.split('-')[1];
      
      // Cast the stage to one of the allowed values
      const stage = (stagePart === 'upload' || stagePart === 'design' || stagePart === 'simulation') 
        ? stagePart 
        : 'upload';
      
      // Check if this is the phone packaging demo path
      const isPhonePackaging = useDemoStore.getState().demoPath === 'phone-packaging';
      
      if (isPhonePackaging) {
        return (
          <PhonePackagingView
            key="phone-packaging"
            onStepComplete={(response: string) => {
              // Set the input value directly in the store and advance to next step
              useDemoStore.getState().nextDemoStep();
            }}
            expectedResponse={currentStep.expectResponse || ""}
            currentStep={demoStep}
            stage={stage}
          />
        );
      } else {
        return (
          <UnifiedPackagingView
            key="packaging-unified"
            onStepComplete={(response: string) => {
              // Set the input value directly in the store and advance to next step
              useDemoStore.getState().nextDemoStep();
            }}
            expectedResponse={currentStep.expectResponse || ""}
            currentStep={demoStep}
            stage={stage}
          />
        );
      }
    }
    
    // For non-packaging views or when loading, use the standard approach
    return (
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="flex items-center justify-center h-full w-full"
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Apple-inspired loading animation */}
              <motion.div 
                className="relative w-20 h-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0.8, 1], opacity: [0.5, 1, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-600"></div>
                </motion.div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: [0, 1, 0.8, 1], opacity: [0.5, 1, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500"></div>
                </motion.div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: [0, 1, 0.8, 1], opacity: [0.5, 1, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                </motion.div>
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: 270 }}
                  animate={{ scale: [0, 1, 0.8, 1], opacity: [0.5, 1, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-400"></div>
                </motion.div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border border-indigo-400/20"></div>
              </motion.div>
              
              {/* Loading message with typing effect */}
              <motion.p 
                className="text-indigo-300 text-sm font-light px-6 py-2 rounded-full bg-indigo-900/20 border border-indigo-500/10"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {getLoadingMessage(view)}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={animationKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="h-full w-full"
          >
            {renderView(view)}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  const renderView = (view: string) => {
    switch (view) {
      case 'welcome':
        return <WelcomeView />;
      case 'problem-analysis':
        return <ProblemAnalysisView />;
      case 'data-processing':
        return <DataProcessingView />;
      case 'model-builder':
        return <ModelBuilderView />;
      case 'simulate':
        return <SimulateView />;
      // Car aerodynamics specific views
      case 'car-data-processing':
        return <CarDataProcessingView />;
      case 'car-model-builder':
        return <CarModelBuilderView />;
      case 'car-simulate':
        return <CarSimulateView />;
      // Model viewer specific view
      case 'model-viewer':
        // This return is actually not used since we bypass renderRightSideView for model-viewer path
        // See the special layout case in the main render function
        return null;
      case 'sandbox':
        return <SandboxDemo
          onStepComplete={(response: string) => {
            useDemoStore.getState().nextDemoStep();
          }}
          expectedResponse={currentStep.expectResponse || ""}
        />;
      case 'aps':
        return <APSDemo
          onStepComplete={(response: string) => {
            useDemoStore.getState().nextDemoStep();
          }}
          expectedResponse={currentStep.expectResponse || ""}
        />;
      // Unified packaging design view - handles all packaging stages in one component
      case 'packaging-upload':
        return <UnifiedPackagingView
          onStepComplete={(response: string) => {
            // Set the input value directly in the store and advance to next step
            useDemoStore.getState().nextDemoStep();
          }}
          expectedResponse={currentStep.expectResponse || ""}
          currentStep={demoStep}
          stage="upload"
        />;
      case 'packaging-design':
        return <UnifiedPackagingView
          onStepComplete={(response: string) => {
            // Set the input value directly in the store and advance to next step
            useDemoStore.getState().nextDemoStep();
          }}
          expectedResponse={currentStep.expectResponse || ""}
          currentStep={demoStep}
          stage="design"
        />;
      case 'packaging-simulation':
        return <UnifiedPackagingView
          onStepComplete={(response: string) => {
            // Set the input value directly in the store and advance to next step
            useDemoStore.getState().nextDemoStep();
          }}
          expectedResponse={currentStep.expectResponse || ""}
          currentStep={demoStep}
          stage="simulation"
        />;
      default:
        return <WelcomeView />;
    }
  };
  
  const getLoadingMessage = (view: string) => {
    switch (view) {
      case 'problem-analysis':
        return "Analyzing problem parameters...";
      case 'data-processing':
      case 'car-data-processing':
        return "Processing input data...";
      case 'model-builder':
      case 'car-model-builder':
        return "Configuring physics model...";
      case 'simulate':
      case 'car-simulate':
        return "Initializing simulation engine...";
      case 'model-viewer':
        return "Initializing 3D model viewer...";
      case 'packaging-upload':
        return "Initializing upload interface...";
      case 'packaging-design':
        return "Loading packaging design tools...";
      case 'packaging-simulation':
        return "Preparing simulation environment...";
      default:
        return "Loading...";
    }
  };

  const isWelcomeScreen = currentStep.view === 'welcome';

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100 grid-glow">
      
      {/* Header - Always visible */}
      <header className="backdrop-blur-md bg-black/60 py-3 px-4 border-b border-gray-800/30 sticky top-0 z-10 glass">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-32 bg-gray-500/5 blur-3xl rounded-full"></div>
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center mr-3 transform hover:scale-105 transition-all duration-300">
              <img src={godelaLogoSmall} alt="Godela" className="w-full h-full opacity-90" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-wide">
                <span className="text-white">GODELA</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isWelcomeScreen && (
              <div className="text-sm mr-2 text-gray-400">
                <span className={`inline-block w-2 h-2 rounded-full ${currentStep.statusClass} mr-1`}></span>
                {currentStep.statusText}
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-sky-600 flex items-center justify-center text-white font-medium shadow-md border border-white/10">
              ER
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content - Conditional Layout */}
      {isWelcomeScreen ? (
        // Welcome Screen - Full Width
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-gray-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-gray-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <WelcomeView />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'model-viewer' ? (
        // Special layout for model viewer (which has its own chat interface)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-gray-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-gray-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <ModelViewerDemo 
                onStepComplete={(response: string) => {
                  useDemoStore.getState().nextDemoStep();
                }}
                expectedResponse={currentStep.expectResponse || ""}
              />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'sandbox' ? (
        // Special layout for sandbox demo (which has its own chat interface)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-purple-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-indigo-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <SandboxDemo 
                onStepComplete={(response: string) => {
                  useDemoStore.getState().nextDemoStep();
                }}
                expectedResponse={currentStep.expectResponse || ""}
              />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'aps' ? (
        // Special layout for APS demo (which has its own chat interface)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-blue-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-cyan-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <APSDemo 
                onStepComplete={(response: string) => {
                  useDemoStore.getState().nextDemoStep();
                }}
                expectedResponse={currentStep.expectResponse || ""}
              />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'latent-explorer' ? (
        // Special layout for latent explorer demo (which has its own immersive UI)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-blue-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-indigo-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <LatentExplorerDemo 
                onStepComplete={(response: string) => {
                  useDemoStore.getState().nextDemoStep();
                }}
                expectedResponse={currentStep.expectResponse || ""}
              />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'latent-explorer-v2' ? (
        // Special layout for V2 latent explorer demo (which has its own immersive UI with enhanced features)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-emerald-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-teal-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <LatentExplorerV2 
                onStepComplete={(response: string) => {
                  useDemoStore.getState().nextDemoStep();
                }}
                expectedResponse={currentStep.expectResponse || ""}
              />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'cosmology' ? (
        // Special layout for cosmology demo (which has its own immersive UI)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-purple-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-blue-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <CosmologyDemo />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'amazon' ? (
        // Special layout for Amazon demo (warehouse logistics optimization)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-orange-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-amber-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <AmazonDemo />
            </div>
          </div>
        </main>
      ) : useDemoStore.getState().demoPath === 'dell' ? (
        // Special layout for Dell demo (warehouse logistics optimization)
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-blue-400/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-sky-400/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              <DellDemo />
            </div>
          </div>
        </main>
      ) : (
        // Regular Layout - Split View
        <main className="flex flex-1 overflow-hidden">
          {/* Left Chat Interface */}
          <div className="w-[400px] flex flex-col border-r border-gray-800/30 bg-black/80 backdrop-blur-sm">
            <ChatPanel />
          </div>
          
          {/* Right Side - Dynamic Based on Current Step - Futuristic 3D modeling canvas */}
          <div className="flex-1 overflow-hidden bg-black relative cyber-grid-with-vignette">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-20 right-[10%] w-96 h-96 bg-sky-500/5 blur-3xl rounded-full"></div>
              <div className="absolute bottom-20 left-[30%] w-64 h-64 bg-slate-300/5 blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10 h-full w-full">
              {renderRightSideView()}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
