interface BladeResultsProps {
  showInsightHighlight: boolean;
}

interface ResultsComparisonProps {
  onOpt2Click: () => void;
}

export function BladeBaseline() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <path d="M50,100 Q125,70 250,90 Q375,110 450,100" stroke="#9CA3AF" strokeWidth="2" fill="none" />
        <path d="M50,100 Q125,130 250,110 Q375,90 450,100" stroke="#9CA3AF" strokeWidth="2" fill="none" />
        <path d="M450,100 L470,105 L470,95 Z" fill="#9CA3AF" />
        <text x="50" y="140" fill="#D1D5DB" fontSize="14">Root</text>
        <text x="430" y="140" fill="#D1D5DB" fontSize="14">Tip</text>
        <text x="250" y="60" fill="#D1D5DB" fontSize="16" textAnchor="middle">WhisperWind V1 Baseline</text>
      </svg>
    </div>
  );
}

export function BladeResults({ showInsightHighlight }: BladeResultsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <path d="M50,100 Q125,70 250,90 Q375,110 450,100" stroke="url(#pressureGradient)" strokeWidth="2" fill="none" />
        <path d="M50,100 Q125,130 250,110 Q375,90 450,100" stroke="#6366F1" strokeWidth="2" fill="none" />
        
        {/* Contour lines */}
        <path d="M150,85 Q200,80 250,85 Q300,90 350,85" stroke="#3B82F6" strokeWidth="1" fill="none" strokeDasharray="2,2" />
        <path d="M150,115 Q200,120 250,115 Q300,110 350,115" stroke="#8B5CF6" strokeWidth="1" fill="none" strokeDasharray="2,2" />
        <path d="M350,85 Q375,90 400,85" stroke="#EC4899" strokeWidth="1" fill="none" />
        
        {/* Trailing edge problem area */}
        {showInsightHighlight && (
          <circle cx="380" cy="95" r="15" fill="none" stroke="#F59E0B" strokeWidth="2" className="animate-pulse" />
        )}
        
        <path d="M450,100 L470,105 L470,95 Z" fill="#9CA3AF" />
        <text x="50" y="140" fill="#D1D5DB" fontSize="14">Root</text>
        <text x="430" y="140" fill="#D1D5DB" fontSize="14">Tip</text>
        <text x="250" y="60" fill="#D1D5DB" fontSize="16" textAnchor="middle">Analysis Results</text>
      </svg>
    </div>
  );
}

export function OptimAnimation() {
  return (
    <div className="text-center">
      <div className="inline-block w-16 h-16 mb-4">
        <svg className="w-full h-full animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="4"></circle>
          <path className="opacity-75" fill="#6366F1" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-200 mb-2">Exploring Design Space</h3>
      <p className="text-gray-400 mb-6">AI optimization is running based on your constraints<span className="loading-dots"></span></p>
      
      <div className="w-full max-w-lg mx-auto bg-[#121722] rounded-lg p-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>27%</span>
        </div>
        <div className="w-full bg-[#1E2330] rounded-full h-2 mb-4">
          <div className="bg-indigo-600 h-2 rounded-full w-[27%]"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400">Iterations</div>
            <div className="font-mono font-medium">128/500</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Objectives</div>
            <div className="font-mono font-medium">3/3</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Candidates</div>
            <div className="font-mono font-medium">3</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultsComparison({ onOpt2Click }: ResultsComparisonProps) {
  return (
    <>
      <h3 className="text-lg font-medium text-center mb-4">Optimization Results</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Baseline */}
        <div className="bg-[#121722] rounded-lg p-3 border border-[#2D3748]">
          <div className="text-sm font-medium mb-2 text-gray-300 text-center">Baseline</div>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-28">
            <path d="M10,50 Q25,40 50,45 Q75,50 90,50" stroke="#9CA3AF" strokeWidth="1" fill="none" />
            <path d="M10,50 Q25,60 50,55 Q75,50 90,50" stroke="#9CA3AF" strokeWidth="1" fill="none" />
          </svg>
        </div>
        
        {/* Option 1 */}
        <div className="bg-[#121722] rounded-lg p-3 border border-[#2D3748] hover:border-indigo-500 transition cursor-pointer">
          <div className="text-sm font-medium mb-2 text-gray-300 text-center">Opt 1</div>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-28">
            <path d="M10,50 Q25,35 50,40 Q75,45 90,50" stroke="#6366F1" strokeWidth="1" fill="none" />
            <path d="M10,50 Q25,65 50,60 Q75,55 90,50" stroke="#6366F1" strokeWidth="1" fill="none" />
          </svg>
        </div>
        
        {/* Option 2 - Active */}
        <div 
          className="bg-[#121722] rounded-lg p-3 border border-indigo-500 cursor-pointer shadow-md hover:shadow-indigo-900/30"
          onClick={onOpt2Click}
        >
          <div className="text-sm font-medium mb-2 text-indigo-400 text-center">Opt 2</div>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-28">
            <path d="M10,50 Q25,35 50,42 Q75,49 90,45" stroke="#818CF8" strokeWidth="1" fill="none" />
            <path d="M10,50 Q25,65 50,58 Q75,51 90,55" stroke="#818CF8" strokeWidth="1" fill="none" />
          </svg>
        </div>
        
        {/* Option 3 */}
        <div className="bg-[#121722] rounded-lg p-3 border border-[#2D3748] hover:border-indigo-500 transition cursor-pointer">
          <div className="text-sm font-medium mb-2 text-gray-300 text-center">Opt 3</div>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-28">
            <path d="M10,50 Q25,38 50,40 Q75,42 90,48" stroke="#6366F1" strokeWidth="1" fill="none" />
            <path d="M10,50 Q25,62 50,60 Q75,58 90,52" stroke="#6366F1" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400 text-center">
        Select a candidate to view details or proceed with validation
      </div>
    </>
  );
}

export function BladeOptimized() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <linearGradient id="optimGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path d="M50,100 Q125,65 250,85 Q375,105 450,90" stroke="url(#optimGradient)" strokeWidth="2" fill="none" />
        <path d="M50,100 Q125,135 250,115 Q375,95 450,110" stroke="#818CF8" strokeWidth="2" fill="none" />
        
        {/* Design modifications highlighted */}
        <ellipse cx="380" cy="90" rx="40" ry="20" fill="#6366F122" stroke="#6366F1" strokeWidth="1" />
        <text x="380" y="90" fill="#D1D5DB" fontSize="10" textAnchor="middle">Modified Tip</text>
        
        <path d="M450,100 L470,105 L470,95 Z" fill="#818CF8" />
        <text x="50" y="140" fill="#D1D5DB" fontSize="14">Root</text>
        <text x="430" y="140" fill="#D1D5DB" fontSize="14">Tip</text>
        <text x="250" y="60" fill="#D1D5DB" fontSize="16" textAnchor="middle">WhisperWind V2-AI_Opt2</text>
        
        <rect x="330" y="130" width="100" height="25" rx="4" fill="#059669" fillOpacity="0.2" stroke="#059669" />
        <text x="380" y="147" fill="#10B981" fontSize="12" textAnchor="middle">Optimized</text>
      </svg>
    </div>
  );
}
