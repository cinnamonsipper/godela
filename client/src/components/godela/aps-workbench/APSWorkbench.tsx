import { useEffect } from 'react';
import useDemoStore from '@/store/useDemoStore';
import { InquiryAgent } from './InquiryAgent';
import { InsightCanvas } from './InsightCanvas';

export const APSWorkbench: React.FC = () => {
  const { apsSimulationStage, apsMorphValue, setApsSimulationStage, setApsMorphValue, resetApsState } = useDemoStore();

  // Initialize APS state when component mounts
  useEffect(() => {
    resetApsState();
  }, [resetApsState]);

  return (
    <div className="w-full h-screen flex overflow-hidden bg-[#0a0b0e]" data-testid="aps-workbench">
      {/* LEFT PANEL: 3D Visualization + HUD */}
      <div className="flex-1 relative">
        <InsightCanvas stage={apsSimulationStage} morphValue={apsMorphValue} />
      </div>

      {/* RIGHT PANEL: Inquiry Agent + Engineering Dashboard */}
      <div className="w-[45%] flex-shrink-0">
        <InquiryAgent 
          stage={apsSimulationStage} 
          setStage={setApsSimulationStage} 
          setMorphValue={setApsMorphValue} 
        />
      </div>
    </div>
  );
};
