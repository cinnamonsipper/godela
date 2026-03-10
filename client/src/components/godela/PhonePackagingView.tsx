import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Upload, CheckCircle, RotateCw, Box, Leaf } from 'lucide-react';
import useDemoStore from '@/store/useDemoStore';

// Import GIFs directly
import dropGif from '../../assets/des_drop_filling_rates.gif';
import comparisonGif from '../../assets/des_sph_comparison.gif';

// Import components
import SimplePhonePackagePreview, { 
  PackageStyle, 
  MaterialType, 
  ProtectionLevel
} from './SimplePhonePackagePreview';
// Import the Sketchfab embed component for reliable 3D model display
import SketchfabEmbed from './SketchfabEmbed';
import PhonePackageStyleSelector from './PhonePackageStyleSelector';
import PhonePackageGoalSelector, { DesignGoal } from './PhonePackageGoalSelector';
import PhonePackageCustomizer, { PhonePackageParams } from './PhonePackageCustomizer';
import PhonePackageOptimizationSelector, { 
  OptimizationDriver, 
  PackageConstraints, 
  SecondaryTuning 
} from './PhonePackageOptimizationSelector';
import PhonePackageAIConcepts, { PackageConcept } from './PhonePackageAIConcepts';
import OrderPrototypeModal from './OrderPrototypeModal';

// Types for view stages in the phone packaging flow
type PhonePackagingStage = 'upload' | 'optimization' | 'ai-concepts' | 'customize' | 'simulation';

// Props for the component
interface PhonePackagingViewProps {
  stage: 'upload' | 'design' | 'simulation';
  currentStep: number;
  expectedResponse?: string;
  onStepComplete: (response: string) => void;
}

/**
 * A specialized view for phone packaging design stages that follows the multi-step 
 * process: upload, style selection, customization, and simulation
 */
export default function PhonePackagingView({ 
  stage, 
  currentStep, 
  expectedResponse = '', 
  onStepComplete 
}: PhonePackagingViewProps) {
  // Enhanced state for the phone packaging flow
  const [currentStage, setCurrentStage] = useState<PhonePackagingStage>('upload');
  const [showProduct, setShowProduct] = useState(false);
  const [showPackage, setShowPackage] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Package parameters
  const [selectedPackageStyle, setSelectedPackageStyle] = useState<PackageStyle>('slim-fit-mailer');
  const [selectedDesignGoal, setSelectedDesignGoal] = useState<DesignGoal | null>(null);
  const [packageParams, setPackageParams] = useState<PhonePackageParams>({
    material: 'white-recycled',
    recycledContent: 70,
    protectionLevel: 'standard',
    brandColor: '#a78bfa'
  });
  
  // Optimization state
  const [optimizationDriver, setOptimizationDriver] = useState<OptimizationDriver | null>(null);
  const [constraints, setConstraints] = useState<PackageConstraints>({
    minRecycledContent: 70,
    noPlastic: true,
    supplierRegion: 'north-america'
  });
  const [secondaryTuning, setSecondaryTuning] = useState<SecondaryTuning>({
    costRange: [0.20, 0.40],
    protectionThreshold: 80,
    sustainabilityScore: 70
  });
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState(false);
  
  // AI concepts state
  const [aiConcepts, setAiConcepts] = useState<PackageConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const [showSelectedConcept, setShowSelectedConcept] = useState(false);
  
  // Simulation results
  const [simulationResults, setSimulationResults] = useState<{
    cornerDropTest: boolean;
    productImpactTest: boolean;
    edgeDropTest: boolean;
    repeatedImpactTest: boolean;
  }>({
    cornerDropTest: false,
    productImpactTest: false,
    edgeDropTest: false,
    repeatedImpactTest: false
  });
  
  // Optimization suggestion state
  const [showOptimizationSuggestion, setShowOptimizationSuggestion] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);
  
  // Get the multi-product mode state from the store
  const { isMultiProductMode } = useDemoStore();
  
  // State for the current 3D model to display
  const [currentModel, setCurrentModel] = useState<string>('product');
  
  // Effect to handle stage transitions based on incoming prop
  useEffect(() => {
    if (stage === 'upload') {
      setCurrentStage('upload');
      setShowProduct(false);
      setShowPackage(false);
      setCurrentModel('product');
    } else if (stage === 'design') {
      // In design stage, we want to show the product and give options for package optimization
      setShowProduct(true);
      
      // For demo progression, we'll make the component follow our multi-step flow internally
      if (currentStep === 2) {
        setCurrentStage('optimization');
        setCurrentModel('product_detailed');
      } else if (currentStep === 3) {
        setCurrentStage('ai-concepts');
        setShowPackage(true);
        setCurrentModel('box_simple');
      } else if (currentStep === 4) {
        setCurrentStage('customize');
        setShowPackage(true);
        setCurrentModel('box_with_protection');
      }
    } else if (stage === 'simulation') {
      setCurrentStage('simulation');
      setShowProduct(true);
      setShowPackage(true);
      setCurrentModel('box_optimized');
      runSimulation();
    }
  }, [stage, currentStep]);
  
  // Check expected response for multiple products keywords and sync with global store
  useEffect(() => {
    if (expectedResponse) {
      const lowerResponse = expectedResponse.toLowerCase();
      const multiProductKeywords = ['two', 'multiple', 'several', 'many', 'both', 'pair'];
      
      // Check if the expected response contains keywords for multiple products
      const hasMultiProductKeyword = multiProductKeywords.some(keyword => lowerResponse.includes(keyword));
      const hasShipKeyword = lowerResponse.includes('ship');
      
      if ((hasMultiProductKeyword && lowerResponse.includes('product')) || 
          (hasShipKeyword && hasMultiProductKeyword)) {
        // This is handled by the store now, no need to set local state
        useDemoStore.getState().setMultiProductMode(true);
      }
    }
  }, [expectedResponse]);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      setIsLoading(false);
      setShowProduct(true);
      
      // Advance to next step (style selection)
      onStepComplete(expectedResponse);
    }, 1500);
  };
  
  // Handle using the sample model
  const handleUseSample = () => {
    setIsLoading(true);
    
    // Set the current model to the sample product
    setCurrentModel('sample_product');
    
    // Simulate loading the sample model
    setTimeout(() => {
      setIsLoading(false);
      setShowProduct(true);
      
      // Advance to next step (style selection)
      onStepComplete(expectedResponse);
    }, 1000);
  };
  
  // Handle selecting a package style
  const handleSelectPackageStyle = (style: PackageStyle) => {
    setSelectedPackageStyle(style);
  };
  
  // Handle selecting a design goal
  const handleSelectDesignGoal = (goal: DesignGoal) => {
    setSelectedDesignGoal(goal);
  };
  
  // Handle optimization driver selection
  const handleSelectOptimizationDriver = (driver: OptimizationDriver) => {
    setOptimizationDriver(driver);
  };
  
  // Handle updating constraints
  const handleUpdateConstraints = (newConstraints: PackageConstraints) => {
    setConstraints(newConstraints);
  };
  
  // Handle updating secondary tuning parameters
  const handleUpdateTuning = (newTuning: SecondaryTuning) => {
    setSecondaryTuning(newTuning);
  };
  
  // Handle generating AI concepts
  const handleGenerateAIConcepts = () => {
    if (!optimizationDriver) return;
    
    setIsGeneratingConcepts(true);
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate mock AI concepts based on the selected driver
      const mockConcepts: PackageConcept[] = generateMockConcepts(optimizationDriver, constraints, secondaryTuning);
      
      setAiConcepts(mockConcepts);
      setIsGeneratingConcepts(false);
      setIsLoading(false);
      
      // Set default package style to show the first concept's packaging
      if (mockConcepts.length > 0) {
        setSelectedPackageStyle(mockConcepts[0].style);
      }
      
      setCurrentStage('ai-concepts');
      
      // Advance to next step
      onStepComplete(expectedResponse);
    }, 3000);
  };
  
  // Handle selecting an AI concept
  const handleSelectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setShowSelectedConcept(true);
    
    // Update package style and parameters based on selected concept
    const selectedConcept = aiConcepts.find(concept => concept.id === conceptId);
    if (selectedConcept) {
      // Ensure we're using a valid package style from SimplePhonePackagePreview
      // Make sure to include all 5 package styles to correctly match each unique model
      const validStyle: PackageStyle = 
        selectedConcept.style === 'slim-fit-mailer' ? 'slim-fit-mailer' :
        selectedConcept.style === 'molded-pulp' ? 'molded-pulp' :
        selectedConcept.style === 'cushioned-envelope' ? 'cushioned-envelope' :
        selectedConcept.style === 'premium-box' ? 'premium-box' :
        selectedConcept.style === 'eco-waffle' ? 'eco-waffle' : 
        'cushioned-envelope';
      
      console.log('Setting package style to:', validStyle, 'for concept:', selectedConcept.style);
      setSelectedPackageStyle(validStyle);
      
      // Use valid material type and protection level
      const material: MaterialType = 
        selectedConcept.materials.outer.toLowerCase().includes('kraft') ? 'kraft' : 
        selectedConcept.materials.outer.toLowerCase().includes('white') ? 'white-recycled' : 'molded-pulp';
      
      const protectionLevel: ProtectionLevel = 
        selectedConcept.metrics.protectionLevel >= 80 ? 'enhanced' : 'standard';
        
      // Update package parameters based on concept
      setPackageParams({
        ...packageParams,
        material,
        recycledContent: selectedConcept.materials.recycledContent,
        protectionLevel
      });
    }
  };
  
  // Handle reviewing a concept (moving to customize)
  const handleReviewConcept = (conceptId: string) => {
    // First make sure the concept is selected
    handleSelectConcept(conceptId);
    
    setIsLoadingConcepts(true);
    
    // Simulate transition to customization
    setTimeout(() => {
      setIsLoadingConcepts(false);
      setShowPackage(true);
      setCurrentStage('customize');
      
      // Advance to next step
      onStepComplete(expectedResponse);
    }, 1200);
  };
  
  // Handle moving to customization stage
  const handleGoToCustomize = () => {
    setIsLoading(true);
    
    // Simulate transition
    setTimeout(() => {
      setIsLoading(false);
      setShowPackage(true);
      setCurrentStage('customize');
      
      // Advance to next step
      onStepComplete(expectedResponse);
    }, 1000);
  };
  
  // Handle package parameter changes
  const handlePackageParamChange = (params: PhonePackageParams) => {
    setPackageParams(params);
  };
  
  // Handle running a simulation
  const handleRunSimulation = () => {
    setIsLoading(true);
    
    // Simulate preparing the simulation
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStage('simulation');
      
      // Run the simulation
      runSimulation();
      
      // Advance to next step
      onStepComplete(expectedResponse);
    }, 1000);
  };
  
  // Generate mock AI concepts based on optimization parameters
  const generateMockConcepts = (
    driver: OptimizationDriver,
    constraints: PackageConstraints,
    tuning: SecondaryTuning
  ): PackageConcept[] => {
    // Base concepts based on optimization driver
    let concepts: PackageConcept[] = [];
    
    // Package styles to choose from
    const styles: PackageStyle[] = ['slim-fit-mailer', 'molded-pulp', 'cushioned-envelope', 'premium-box', 'eco-waffle'];
    
    // Name generation helper
    const generateName = (style: PackageStyle, driver: OptimizationDriver, index: number): string => {
      const styleNames = {
        'slim-fit-mailer': 'Slim',
        'molded-pulp': 'Molded',
        'cushioned-envelope': 'Cushioned',
        'premium-box': 'Premium',
        'eco-waffle': 'Eco-Waffle',
      };
      
      const driverPrefix = {
        'sustainability': 'Eco',
        'cost': 'Economy',
        'protection': 'Shield',
        'balanced': 'Optimized',
      };
      
      return `${driverPrefix[driver]} ${styleNames[style]} ${index}`;
    };
    
    // Generate 5 concepts with different packaging styles, one for each style
    for (let i = 0; i < styles.length; i++) {
      // Explicitly assign a different style to each concept
      const style = styles[i];
      
      // Base values
      let unitCost = 0.25 + (Math.random() * 0.3);
      let sustainabilityScore = 50 + (Math.random() * 30);
      let recycledContent = constraints.minRecycledContent + (Math.random() * (100 - constraints.minRecycledContent) * 0.5);
      let protectionLevel = 70 + (Math.random() * 25);
      let testConfidence = 65 + (Math.random() * 30);
      
      // Adjust based on driver
      switch (driver) {
        case 'sustainability':
          sustainabilityScore = 80 + (Math.random() * 20);
          recycledContent = Math.max(80, recycledContent);
          unitCost = Math.max(tuning.costRange[0], unitCost);
          protectionLevel = Math.max(tuning.protectionThreshold, protectionLevel);
          break;
        case 'cost':
          unitCost = tuning.costRange[0] + (Math.random() * (tuning.costRange[1] - tuning.costRange[0]) * 0.6);
          sustainabilityScore = Math.max(tuning.sustainabilityScore * 0.8, sustainabilityScore);
          break;
        case 'protection':
          protectionLevel = 85 + (Math.random() * 15);
          testConfidence = 80 + (Math.random() * 20);
          unitCost = tuning.costRange[0] + (Math.random() * (tuning.costRange[1] - tuning.costRange[0]));
          break;
        case 'balanced':
          // Already balanced values
          unitCost = tuning.costRange[0] + (Math.random() * (tuning.costRange[1] - tuning.costRange[0]) * 0.8);
          sustainabilityScore = Math.max(70, sustainabilityScore);
          protectionLevel = Math.max(75, protectionLevel);
          testConfidence = Math.max(75, testConfidence);
          break;
      }
      
      // Adjust for constraints
      if (constraints.noPlastic) {
        sustainabilityScore += 10;
        unitCost += 0.05;
      }
      
      // Generate materials based on constraints and driver
      const outerMaterials = [
        'Recycled Kraft Paperboard',
        'Corrugated Cardboard with Bio-Coating',
        'FSC-Certified White Paperboard',
        'Sugarcane Bagasse Fiber Composite',
        'Bamboo Fiber Composite'
      ];
      
      const innerMaterials = [
        'Molded Pulp',
        'Recycled Corrugate Inserts',
        'Honeycomb Paper Padding',
        'Mushroom Mycelium Cushioning',
        'Air Pillow Pouches (Biodegradable)'
      ];
      
      // Rationales
      const rationales = [
        `This design prioritizes ${driver === 'cost' ? 'cost-efficiency while' : driver === 'sustainability' ? 'sustainability while' : driver === 'protection' ? 'maximum protection while' : 'balanced performance while'} meeting ISTA 6-Amazon SIOC standards. ${constraints.noPlastic ? 'Uses no plastic materials, with ' : 'Incorporates '} ${Math.round(recycledContent)}% recycled content.`,
        
        `Optimized for ${driver} with careful material selection to balance structural integrity and environmental impact. Engineered specifically for product protection during shipping with ${protectionLevel > 90 ? 'exceptional' : protectionLevel > 80 ? 'excellent' : 'good'} drop resilience.`,
        
        `AI-engineered hybrid solution developed specifically for e-commerce distribution, balancing SIOC performance requirements with ${driver === 'sustainability' ? 'industry-leading sustainability metrics' : driver === 'cost' ? 'cost-optimized materials and design' : driver === 'protection' ? 'maximum product protection' : 'optimized overall performance'}.`
      ];
      
      // Recyclability
      const recyclabilityOptions = [
        "Curbside Recyclable, 100% Biodegradable",
        "Curbside Recyclable, Compostable Components",
        "Fully Recyclable, Minimal Disassembly Required",
        "Home Compostable (excluding labels)",
        "Biodegradable in Industrial Facilities"
      ];
      
      // Create concept with valid package style
      const validStyle: PackageStyle = style as PackageStyle;
      
      concepts.push({
        id: `concept-${i + 1}`,
        title: generateName(validStyle, driver, i + 1),
        style: validStyle,
        primaryOptimization: driver,
        metrics: {
          unitCost: parseFloat(unitCost.toFixed(2)),
          sustainabilityScore: Math.round(sustainabilityScore),
          recyclability: recyclabilityOptions[Math.floor(Math.random() * recyclabilityOptions.length)],
          testConfidence: Math.round(testConfidence),
          protectionLevel: Math.round(protectionLevel)
        },
        materials: {
          outer: outerMaterials[Math.floor(Math.random() * outerMaterials.length)],
          inner: innerMaterials[Math.floor(Math.random() * innerMaterials.length)],
          recycledContent: Math.round(recycledContent)
        },
        rationale: rationales[i % rationales.length]
      });
    }
    
    return concepts;
  };
  
  // Run the simulation with loading animation and 3D drop test animation
  const runSimulation = () => {
    setIsSimulating(true);
    setOptimizationApplied(false);
    setShowOptimizationSuggestion(false);
    setSimulationResults({
      cornerDropTest: false,
      productImpactTest: false,
      edgeDropTest: false,
      repeatedImpactTest: false
    });
    
    // Initial simulation loading animation 
    setTimeout(() => {
      setIsSimulating(false);
      
      // Show the 3D drop test animation
      const cornerDropTimer = setTimeout(() => {
        setSimulationResults(prev => ({ ...prev, cornerDropTest: true }));
        
        // Show optimization suggestion after test passes (12-second delay)
        const optimizationTimer = setTimeout(() => {
          setShowOptimizationSuggestion(true);
        }, 12000);
        
        // After the drop test animation has played for a while, start showing test results
        const productImpactTimer = setTimeout(() => {
          setSimulationResults(prev => ({ ...prev, productImpactTest: true }));
          
          // Complete the rest of the tests sequentially
          const edgeDropTimer = setTimeout(() => {
            setSimulationResults(prev => ({ ...prev, edgeDropTest: true }));
            
            const repeatedImpactTimer = setTimeout(() => {
              setSimulationResults(prev => ({ ...prev, repeatedImpactTest: true }));
            }, 800);
            
            return () => clearTimeout(repeatedImpactTimer);
          }, 800);
          
          return () => clearTimeout(edgeDropTimer);
        }, 2500);
        
        return () => {
          clearTimeout(productImpactTimer);
          clearTimeout(optimizationTimer); // Make sure to clean up the 12-second optimization timer
        };
      }, 500);
      
      return () => clearTimeout(cornerDropTimer);
    }, 5000); // Initial loading animation
  };
  
  // Apply optimized packaging design
  const applyOptimization = () => {
    setOptimizationApplied(true);
    setShowOptimizationSuggestion(false);
    
    // Update package parameters with optimized values
    setPackageParams(prev => ({
      ...prev,
      recycledContent: Math.min(100, prev.recycledContent + 10), // Increase recycled content
    }));
    
    // Reset simulation to show the new model
    setIsSimulating(true);
    
    // Show the new optimized model after a brief loading period
    setTimeout(() => {
      setIsSimulating(false);
      
      // Complete the tests again with the optimized design
      setTimeout(() => {
        setSimulationResults(prev => ({ ...prev, cornerDropTest: true }));
        
        setTimeout(() => {
          setSimulationResults(prev => ({ ...prev, productImpactTest: true }));
          
          setTimeout(() => {
            setSimulationResults(prev => ({ ...prev, edgeDropTest: true }));
            
            setTimeout(() => {
              setSimulationResults(prev => ({ ...prev, repeatedImpactTest: true }));
            }, 500);
          }, 500);
        }, 1000);
      }, 500);
    }, 2000);
  };
  
  // Shared 3D model viewer for the product
  // Define an ErrorBoundary component to handle 3D rendering errors
  class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }> {
    state = { hasError: false };
    
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    
    componentDidCatch(error: any) {
      console.error("Error in 3D viewer:", error);
    }
    
    render() {
      if (this.state.hasError) {
        return this.props.fallback;
      }
      return this.props.children;
    }
  }

  // Get the appropriate Sketchfab model ID based on current model state
  const getSketchfabModelId = () => {
    // Define unique models for each packaging style
    const productModelId = "4328dea00e47497dbeac73c556121bc9"; // Sample product model
    const multiProductModelId = "d44e25624cd64988b1073e01f9a91e19"; // Model for two phones
    
    // Each of these must be unique and will be used as the actual model IDs
    const slimFitMailerModelId = "cb743643cb624437bf67566725ed59e9"; // Amazon box for slim fit (option 1)
    const moldedPulpModelId = "5bab4cd3f6b9415a96bc7b9d405254bd"; // Craft pouch for molded pulp (option 2)
    const cushionedEnvelopeModelId = "982e7cbd341c450a8b7c5795381c3441"; // Package box for cushioned (option 3)
    const premiumBoxPackageModelId = "3b68aaab1d7d4bce889a2803b131a375"; // Premium box package (option 4)
    const ecoWafflePackageModelId = "3ae75bfd31de4845a0321070cc7002cb"; // Eco waffle package (option 5)
    
    // Multi-product package models - larger versions of the standard models
    const multiSlimFitMailerModelId = "cb743643cb624437bf67566725ed59e9"; // Amazon box for multiple products
    const multiMoldedPulpModelId = "5bab4cd3f6b9415a96bc7b9d405254bd"; // Craft pouch for multiple products
    const multiCushionedEnvelopeModelId = "982e7cbd341c450a8b7c5795381c3441"; // Package box for multiple products
    const multiPremiumBoxPackageModelId = "3b68aaab1d7d4bce889a2803b131a375"; // Premium box for multiple products
    const multiEcoWafflePackageModelId = "3ae75bfd31de4845a0321070cc7002cb"; // Eco waffle for multiple products
    
    if (currentStage === 'upload' || currentStage === 'optimization') {
      // For initial stages, show the product model based on multi-product mode
      return isMultiProductMode ? multiProductModelId : productModelId;
    } else if (currentStage === 'ai-concepts' || currentStage === 'customize') {
      // For concept and customization stages, show the packaging based on selected style
      if (isMultiProductMode) {
        // Use multi-product versions of the packaging models
        if (selectedPackageStyle === 'slim-fit-mailer') {
          return multiSlimFitMailerModelId;
        } else if (selectedPackageStyle === 'molded-pulp') {
          return multiMoldedPulpModelId;
        } else if (selectedPackageStyle === 'cushioned-envelope') {
          return multiCushionedEnvelopeModelId;
        } else if (selectedPackageStyle === 'premium-box') {
          return multiPremiumBoxPackageModelId;
        } else if (selectedPackageStyle === 'eco-waffle') {
          return multiEcoWafflePackageModelId;
        } else {
          return multiCushionedEnvelopeModelId; // Default fallback
        }
      } else {
        // Use single product versions of the packaging models
        if (selectedPackageStyle === 'slim-fit-mailer') {
          return slimFitMailerModelId;
        } else if (selectedPackageStyle === 'molded-pulp') {
          return moldedPulpModelId;
        } else if (selectedPackageStyle === 'cushioned-envelope') {
          return cushionedEnvelopeModelId;
        } else if (selectedPackageStyle === 'premium-box') {
          return premiumBoxPackageModelId;
        } else if (selectedPackageStyle === 'eco-waffle') {
          return ecoWafflePackageModelId;
        } else {
          return cushionedEnvelopeModelId; // Default fallback
        }
      }
    } else if (currentStage === 'simulation') {
      // For simulation stage, use the appropriate models based on multi-product mode
      if (isMultiProductMode) {
        // Use multi-product versions of the packaging models for simulation
        if (selectedPackageStyle === 'slim-fit-mailer') {
          return multiSlimFitMailerModelId;
        } else if (selectedPackageStyle === 'molded-pulp') {
          return multiMoldedPulpModelId;
        } else if (selectedPackageStyle === 'cushioned-envelope') {
          return multiCushionedEnvelopeModelId;
        } else if (selectedPackageStyle === 'premium-box') {
          return multiPremiumBoxPackageModelId;
        } else if (selectedPackageStyle === 'eco-waffle') {
          return multiEcoWafflePackageModelId;
        } else {
          return multiCushionedEnvelopeModelId; // Default fallback
        }
      } else {
        // Use single product versions of the packaging models for simulation
        if (selectedPackageStyle === 'slim-fit-mailer') {
          return slimFitMailerModelId;
        } else if (selectedPackageStyle === 'molded-pulp') {
          return moldedPulpModelId;
        } else if (selectedPackageStyle === 'cushioned-envelope') {
          return cushionedEnvelopeModelId;
        } else if (selectedPackageStyle === 'premium-box') {
          return premiumBoxPackageModelId;
        } else if (selectedPackageStyle === 'eco-waffle') {
          return ecoWafflePackageModelId;
        } else {
          return cushionedEnvelopeModelId; // Default fallback
        }
      }
    }
    
    // Default fallback based on multi-product mode
    return isMultiProductMode ? multiProductModelId : productModelId;
  };

  const renderModelViewer = () => {
    // Get the model ID based on current state
    const modelId = getSketchfabModelId();
    const singleProductModelId = "4328dea00e47497dbeac73c556121bc9"; // Sample single product model
    const multiProductModelId = "d44e25624cd64988b1073e01f9a91e19"; // Sample multiple product model
    
    // Use the appropriate product model ID based on multi-product mode
    const productModelId = isMultiProductMode ? multiProductModelId : singleProductModelId;
    
    // Determine if we should show the product as an overlay
    const showOverlay = currentStage === 'ai-concepts' || currentStage === 'customize' || currentStage === 'simulation';
    
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
        <SketchfabEmbed
          modelId={modelId}
          backgroundColor="#111827"
          className="min-h-[300px]"
          autoRotate={currentStage !== 'simulation'}
          isLoading={isLoading}
          overlayModelId={productModelId}
          showOverlay={showOverlay}
        />
      </div>
    );
  };
  
  // Render the main content based on the current stage
  const renderContent = () => {
    switch (currentStage) {
      case 'upload':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-slate-200">
                {isMultiProductMode ? "Upload Your Products" : "Upload Your Product"}
              </h2>
              <p className="text-slate-400 mt-1">
                {isMultiProductMode 
                  ? "Upload 3D models of your products to begin designing the perfect multi-product packaging" 
                  : "Upload a 3D model of your product to begin designing the perfect packaging"
                }
              </p>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
              {/* Upload area (left) */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl p-6">
                  <div className="flex items-center mb-4">
                    <Box className="h-5 w-5 text-indigo-400 mr-2" />
                    <h3 className="text-lg font-medium text-slate-200">
                      {isMultiProductMode ? "Upload Multiple Products" : "Upload Your Product"}
                    </h3>
                  </div>
                  <p className="text-slate-300 mb-6">
                    {isMultiProductMode 
                      ? "Upload 3D models of your products to design the perfect multi-product packaging solution. Choose files or use our sample models."
                      : "Upload a 3D model of your product to design the perfect packaging solution. Choose a file or use our sample model."
                    }
                  </p>
                  
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mx-auto h-12 w-12 text-slate-500" />
                      <p className="mt-2 text-sm font-medium text-slate-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        STL, STEP, or OBJ up to 50MB
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".stl,.step,.obj"
                        onChange={handleFileUpload}
                      />
                    </div>
                    
                    <div className="text-center">
                      <span className="text-xs text-slate-500">or</span>
                    </div>
                    
                    {isMultiProductMode ? (
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleUseSample}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </span>
                        ) : "Use Sample Products"}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleUseSample}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </span>
                        ) : "Use Sample Product"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              

            </div>
          </div>
        );
      
      case 'optimization':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-slate-200">Step 2: Define Optimization Goals & Constraints</h2>
              <p className="text-slate-400 mt-1">
                Specify your packaging optimization priorities and constraints before AI generates design concepts
              </p>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
              {/* Product model preview (left) */}
              <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden relative min-h-[400px]">
                {renderModelViewer()}
              </div>
              
              {/* Optimization selector (right) */}
              <div className="md:w-[400px]">
                <PhonePackageOptimizationSelector
                  selectedDriver={optimizationDriver}
                  onSelectDriver={handleSelectOptimizationDriver}
                  onUpdateConstraints={handleUpdateConstraints}
                  onUpdateTuning={handleUpdateTuning}
                  onGenerateAIConcepts={handleGenerateAIConcepts}
                  isGeneratingConcepts={isGeneratingConcepts}
                  className="bg-slate-900/70 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5"
                />
              </div>
            </div>
          </div>
        );
      
      case 'ai-concepts':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-slate-200">Step 3: Review AI-Generated Concepts</h2>
              <p className="text-slate-400 mt-1">
                Select an AI-optimized package design concept that best meets your requirements
              </p>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
              {/* Product model preview (left) */}
              <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden relative min-h-[400px]">
                {renderModelViewer()}
              </div>
              
              {/* AI Concepts (right) */}
              <div className="md:w-[450px]">
                <PhonePackageAIConcepts
                  concepts={aiConcepts}
                  selectedConceptId={selectedConceptId}
                  onSelectConcept={handleSelectConcept}
                  onReviewConcept={handleReviewConcept}
                  isLoading={isLoadingConcepts}
                  className="bg-slate-900/70 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5"
                />
              </div>
            </div>
          </div>
        );
      
      case 'customize':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-slate-200">Step 3: Customize Your Package</h2>
              <p className="text-slate-400 mt-1">
                Fine-tune your package design, materials, and sustainability parameters
              </p>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - 3D preview */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                {renderModelViewer()}
              </div>
              
              {/* Right column - Customization controls */}
              <div className="space-y-5">
                <PhonePackageCustomizer
                  packageStyle={selectedPackageStyle}
                  designGoal={selectedDesignGoal || 'balanced'}
                  onParamChange={handlePackageParamChange}
                  onRunSimulation={handleRunSimulation}
                />
              </div>
            </div>
          </div>
        );
      
      case 'simulation':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-semibold text-slate-200">Step 4: Simulation Results</h2>
              <p className="text-slate-400 mt-1">
                Testing how your packaging design performs in real-world scenarios
              </p>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 flex flex-col">
              {/* Simulation visualization area */}
              <div className="flex-1 relative bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                {/* Optimization suggestion that appears after the first test passes */}
                {showOptimizationSuggestion && !optimizationApplied && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-md"
                  >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6 max-w-lg shadow-2xl mx-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-500/20 rounded-full p-2">
                          <Leaf className="h-6 w-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-200">Optimization Suggestion</h3>
                      </div>
                      
                      <p className="text-slate-300 mb-5">
                        {isMultiProductMode ? 
                          "Based on drop test results for multiple products, we can optimize the internal compartment design and reduce material usage by 15%. This maintains the same level of protection while improving sustainability." 
                          : 
                          "Based on drop test results, we can reduce the size of packaging and reduce the carbon footprint of box material by 10%. This maintains the same level of protection while using fewer materials."
                        }
                      </p>
                      
                      <div className="flex justify-between gap-3 mt-5">
                        <Button 
                          variant="outline" 
                          className="border-slate-700 hover:bg-slate-800"
                          onClick={() => setShowOptimizationSuggestion(false)}
                        >
                          Keep Current Design
                        </Button>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={applyOptimization}
                        >
                          Apply Optimization
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {isSimulating ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-indigo-300/20 rounded-full"></div>
                        <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-300 text-sm mb-1">Running advanced physics simulation...</p>
                      <div className="w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5 }} // 5-second loading animation
                        />
                      </div>
                      <p className="text-slate-400 text-xs mt-2">Calculating material deformation and impact forces</p>
                    </div>
                  </div>
                ) : simulationResults.cornerDropTest ? (
                  <div className="w-full h-full">
                    {/* Advanced product drop simulation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full">
                        <div className="sketchfab-embed-wrapper h-full"> 
                          <iframe 
                            title={isMultiProductMode 
                              ? "IP12PRO_2_phones_nobreak_baked_NLA" 
                              : (optimizationApplied ? "Product_nobreak_smallerbox_baked_NLA" : "Product_nobreak_baked_2_NLA_fix_5")}
                            frameBorder="0" 
                            allowFullScreen={true}
                            allow="autoplay; fullscreen; xr-spatial-tracking" 
                            className="w-full h-full"
                            src={isMultiProductMode 
                              ? "https://sketchfab.com/models/d44e25624cd64988b1073e01f9a91e19/embed?autostart=1&camera=0&preload=1&transparent=1&ui_theme=dark&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0"
                              : (optimizationApplied 
                                ? "https://sketchfab.com/models/c719df9928a944809c93ecf2bc4150bb/embed?autostart=1&camera=0&preload=1&transparent=1&ui_theme=dark&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0"
                                : "https://sketchfab.com/models/16a403db673c49ed876185f1db14e78d/embed?autostart=1&preload=1&transparent=1&ui_theme=dark&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0"
                              )
                            }
                          />
                        </div>
                      </div>
                      {/* Info label */}
                      <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-slate-200 font-medium border border-slate-700/50">
                        Advanced Physics Drop Test Animation
                      </div>
                      
                      {/* Secondary animation in top-right corner */}
                      <div className="absolute top-4 right-4 w-64 h-48 bg-slate-900/70 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 text-xs font-medium text-slate-200 py-1 px-2">
                          Alternate Angle: Slow Motion Detail
                        </div>
                        <div className="sketchfab-embed-wrapper h-full"> 
                          <iframe 
                            title="Secondary Drop Test View"
                            frameBorder="0" 
                            allowFullScreen={true}
                            allow="autoplay; fullscreen; xr-spatial-tracking" 
                            className="w-full h-full"
                            src="https://sketchfab.com/models/164007f38bc648a8bb94952da994f715/embed?autostart=1&camera=0&preload=1&transparent=1&ui_theme=dark&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show the 3D model before the simulation is run
                  renderModelViewer()
                )}
              </div>
              
              {/* Simulation results panel */}
              {!isSimulating && (
                <div className="mt-6 p-6 bg-slate-900/70 backdrop-blur-sm rounded-xl border border-slate-700/50">
                  <h3 className="text-lg font-medium text-slate-200 mb-4">Test Results</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-green-500/10 ${simulationResults.cornerDropTest ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}></div>
                        <div className="relative">
                          <div className="flex items-center mb-2">
                            <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${simulationResults.cornerDropTest ? 'bg-green-500' : 'bg-slate-600'}`}>
                              {simulationResults.cornerDropTest && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-slate-300">Corner Drop Test</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {simulationResults.cornerDropTest ? (
                              <span className="text-green-400">PASS - Impact force reduced by 95%</span>
                            ) : (
                              <span>Running test...</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-green-500/10 ${simulationResults.productImpactTest ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}></div>
                        <div className="relative">
                          <div className="flex items-center mb-2">
                            <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${simulationResults.productImpactTest ? 'bg-green-500' : 'bg-slate-600'}`}>
                              {simulationResults.productImpactTest && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-slate-300">Product Impact Test</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {simulationResults.productImpactTest ? (
                              <span className="text-green-400">PASS - Impact stress below threshold</span>
                            ) : (
                              <span>Running test...</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-green-500/10 ${simulationResults.edgeDropTest ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}></div>
                        <div className="relative">
                          <div className="flex items-center mb-2">
                            <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${simulationResults.edgeDropTest ? 'bg-green-500' : 'bg-slate-600'}`}>
                              {simulationResults.edgeDropTest && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-slate-300">Edge Drop Test</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {simulationResults.edgeDropTest ? (
                              <span className="text-green-400">PASS - Edge protection effective</span>
                            ) : (
                              <span>Running test...</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-green-500/10 ${simulationResults.repeatedImpactTest ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}></div>
                        <div className="relative">
                          <div className="flex items-center mb-2">
                            <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${simulationResults.repeatedImpactTest ? 'bg-green-500' : 'bg-slate-600'}`}>
                              {simulationResults.repeatedImpactTest && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-slate-300">Repeated Impact</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {simulationResults.repeatedImpactTest ? (
                              <span className="text-green-400">PASS - Durability verified</span>
                            ) : (
                              <span>Running test...</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Summary card that appears when all tests are complete */}
                    {simulationResults.cornerDropTest && 
                     simulationResults.productImpactTest && 
                     simulationResults.edgeDropTest && 
                     simulationResults.repeatedImpactTest && (
                      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg p-4 mt-3 border border-green-500/20">
                        <div className="flex items-start">
                          <div className="bg-green-500/20 rounded-full p-2 mr-3">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium text-green-300">Simulation Complete - All Tests Passed</h4>
                            <p className="text-sm text-slate-300 mt-1">
                              Your packaging design successfully protects against drops from 1.5 meters with {packageParams.recycledContent}% recycled materials. The packaging provides excellent corner and impact protection.
                            </p>
                            
                            {/* Show sustainability metrics if optimization was applied */}
                            {optimizationApplied && (
                              <div className="mt-3 mb-2 bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                                <h5 className="text-sm font-medium text-green-300 flex items-center">
                                  <Leaf className="h-4 w-4 mr-1.5 text-green-400" />
                                  Sustainability Metrics
                                </h5>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  <div className="bg-black/20 rounded p-2">
                                    <div className="text-xs text-slate-400">Material Reduction</div>
                                    <div className="text-base font-medium text-green-300">10%</div>
                                  </div>
                                  <div className="bg-black/20 rounded p-2">
                                    <div className="text-xs text-slate-400">Recycled Content</div>
                                    <div className="text-base font-medium text-green-300">{packageParams.recycledContent}%</div>
                                  </div>
                                  <div className="bg-black/20 rounded p-2">
                                    <div className="text-xs text-slate-400">CO₂ Savings</div>
                                    <div className="text-base font-medium text-green-300">5.2 kg</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" className="text-xs h-8 px-3 border-slate-600">
                                Download Report
                              </Button>
                              <Button variant="outline" className="text-xs h-8 px-3 border-slate-600">
                                Export Design
                              </Button>
                              <Button className="text-xs h-8 px-3 ml-auto bg-indigo-600 hover:bg-indigo-700">
                                Order Prototype
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return <div>Unknown stage</div>;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      {renderContent()}
    </motion.div>
  );
}