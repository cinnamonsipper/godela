import useDemoStore from "@/store/useDemoStore";

// Updated dashboard panel to show workflow progression
export default function DashboardPanel() {
  const { demoStep } = useDemoStore();
  // Calculate progress based on current step
  const progress = Math.min(100, (demoStep / 5) * 100);
  
  // Define the stages of our workflow
  const workflowStages = [
    { name: "Problem Analysis", complete: demoStep >= 1 },
    { name: "Data Processing", complete: demoStep >= 2 },
    { name: "Model Building", complete: demoStep >= 3 },
    { name: "Simulation", complete: demoStep >= 4 }
  ];

  return (
    <div className="h-64 border-t border-[#1A2030] p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-blue-100">Workflow Progress</h2>
          <p className="text-xs text-blue-300 mt-1">Building an airfoil performance prediction model</p>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 text-xs rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Status
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-[#0D1017] rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Workflow stages */}
      <div className="bg-[#0D1017] rounded-lg p-4 border border-[#1A2030] shadow-md">
        <h3 className="text-sm font-medium text-blue-200 mb-3">Workflow Stages</h3>
        <div className="space-y-3">
          {workflowStages.map((stage, index) => (
            <div key={index} className="flex items-center">
              {stage.complete ? (
                <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border border-gray-600 text-gray-400 flex items-center justify-center mr-3">
                  {index + 1}
                </div>
              )}
              <span className={`text-sm ${stage.complete ? 'text-blue-300 font-medium' : 'text-gray-400'}`}>
                {stage.name}
              </span>
              {index === demoStep - 1 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-indigo-900/50 text-indigo-300 rounded animate-pulse">
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <span>Powered by Godela AI • Ask questions to progress through the workflow</span>
      </div>
    </div>
  );
}