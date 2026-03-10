import { useEffect, useState } from "react";
import useDemoStore from "@/store/useDemoStore";
import { DEMO_STEPS } from "@/lib/demoConstants";

export default function StatusPanel() {
  const { demoStep } = useDemoStore();
  const [progressWidth, setProgressWidth] = useState("0%");

  const currentStep = DEMO_STEPS[demoStep];
  const statusColor = getStatusColor(currentStep.statusClass);

  useEffect(() => {
    // Animate progress bar
    setProgressWidth("0%");
    const timer = setTimeout(() => {
      setProgressWidth(`${currentStep.progress}%`);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [demoStep, currentStep.progress]);

  return (
    <div className="p-4 border-b border-[#2D3748]">
      <h2 className="text-lg font-medium mb-3 text-gray-200">Project Status</h2>
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-400">WhisperWind Turbine Blade</h3>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-900 text-blue-200">Active</span>
      </div>
      
      <div className="relative mb-2">
        <div className="absolute inset-0 bg-[#1E2330] rounded-full"></div>
        <div 
          className="relative h-2 bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: progressWidth }}
        ></div>
      </div>
      
      <div className="font-medium text-sm flex items-center">
        <div className={`w-2 h-2 rounded-full ${statusColor} mr-2`}></div>
        <span className="text-gray-200">Status: <span>{currentStep.statusText}</span></span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-[#1E2330] p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Model Type</div>
          <div className="text-sm font-medium">Wind Turbine</div>
        </div>
        <div className="bg-[#1E2330] p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Last Updated</div>
          <div className="text-sm font-medium">2 hours ago</div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(statusClass: string): string {
  switch (statusClass) {
    case "bg-green-500":
      return "bg-green-500";
    case "bg-blue-500":
      return "bg-blue-500";
    case "bg-indigo-500":
      return "bg-indigo-500";
    default:
      return "bg-gray-500";
  }
}
