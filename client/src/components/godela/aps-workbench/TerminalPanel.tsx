import { useEffect, useRef } from 'react';
import { ExperimentConfig, SimulationStage } from '@/lib/apsWorkbench/types';
import { SYSTEM_PLAN } from '@/lib/apsWorkbench/constants';

interface TerminalPanelProps {
  config: ExperimentConfig;
  stage: SimulationStage;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({ config, stage }) => {
  const listRef = useRef<HTMLUListElement>(null);

  // Auto-scroll the plan list to keep active item in view
  useEffect(() => {
    if (listRef.current && config.planStep >= 0) {
        const activeItem = listRef.current.children[config.planStep] as HTMLElement;
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
  }, [config.planStep]);

  return (
    <div className="flex flex-col h-full bg-[#0d0e11] border-t border-white/10 font-mono text-xs" data-testid="terminal-panel">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#15171b] border-b border-white/5" data-testid="terminal-header">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${stage === SimulationStage.IDLE ? 'bg-gray-600' : 'bg-cyan-500 animate-pulse'}`} data-testid="status-indicator" />
           <span className="text-gray-200 font-bold tracking-widest uppercase">Engineering Workbench</span>
        </div>
        <div className="text-gray-400 flex gap-4">
           <span>SESSION: GDL-2024-X1</span>
           <span className={`${stage === SimulationStage.INSIGHT ? 'text-green-400' : 'text-gray-500'}`} data-testid="stage-display">
               {stage}
           </span>
        </div>
      </div>

      {/* Dashboard Grid - 2 COLUMNS ONLY */}
      <div className="flex-1 grid grid-cols-12 gap-px bg-white/5 overflow-hidden">
        
        {/* COL 1: PROBLEM CONTEXT (40% - Span 5) */}
        <div className="col-span-5 bg-[#0d0e11] p-4 flex flex-col gap-5 overflow-y-auto border-r border-white/5" data-testid="problem-specification">
            <h3 className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold border-b border-gray-800 pb-1 mb-1">Problem Specification</h3>
            
            {/* Target Variables */}
            <div className="flex flex-col gap-2">
                <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Target Variables</span>
                {config.status === 'DEFINED' ? (
                    <ul className="space-y-2">
                        {config.targetVars.map((v, i) => (
                            <li key={i} className="flex flex-col" data-testid={`target-var-${i}`}>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-gray-300 font-medium">{v.name}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${v.goal === 'Minimize' ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {v.goal === 'Minimize' ? 'MINIMIZE' : 'MONITOR'}
                                    </span>
                                </div>
                                {v.context && <span className="text-[10px] text-gray-600 italic">→ {v.context}</span>}
                            </li>
                        ))}
                    </ul>
                ) : <span className="text-gray-700 italic">--</span>}
            </div>

            {/* Constraints */}
            <div className="flex flex-col gap-2">
                <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Constraints</span>
                {config.status === 'DEFINED' ? (
                    <ul className="space-y-2">
                        {config.constraints.map((c, i) => (
                            <li key={i} className="flex flex-col" data-testid={`constraint-${i}`}>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-400 text-[10px]">{c.name}</span>
                                    <span className="text-orange-300/90 font-medium">{c.value}</span>
                                </div>
                                {c.why && <span className="text-[10px] text-gray-600 italic mt-0.5">{c.why}</span>}
                            </li>
                        ))}
                    </ul>
                ) : <span className="text-gray-700 italic">--</span>}
            </div>

            <div className="grid grid-cols-1 gap-5 pt-2 border-t border-gray-800/50">
                {/* Design Vars */}
                <div className="flex flex-col gap-1">
                    <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Design Variables</span>
                    {config.status === 'DEFINED' ? (
                        <ul className="space-y-1 text-gray-300 text-[11px]">
                            {config.designVars.map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                    ) : <span className="text-gray-700 italic">--</span>}
                </div>

                {/* Operating Conditions */}
                <div className="flex flex-col gap-1">
                    <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Operating Conditions</span>
                    {config.status === 'DEFINED' ? (
                        <ul className="space-y-1">
                            {config.operatingConditions.map((c, i) => (
                                <li key={i} className="flex justify-between items-baseline text-[11px]">
                                    <span className="text-gray-400">{c.name}</span>
                                    <span className="text-gray-200">{c.value}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <span className="text-gray-700 italic">--</span>}
                </div>
            </div>
        </div>

        {/* COL 2: EXECUTION PIPELINE (60% - Span 7) */}
        <div className="col-span-7 bg-[#0d0e11] p-4 flex flex-col gap-4 overflow-hidden border-r border-white/5" data-testid="execution-pipeline">
            <h3 className="text-gray-500 uppercase tracking-wider text-[10px] font-semibold border-b border-gray-800 pb-1">System Plan</h3>
            
            <div className="flex-1 overflow-y-auto pr-1">
                <ul ref={listRef} className="space-y-2">
                    {SYSTEM_PLAN.map((step, idx) => {
                        const isActive = idx === config.planStep;
                        const isPast = idx < config.planStep;
                        return (
                            <li key={idx} className={`flex items-start gap-3 text-[11px] transition-colors p-2 rounded ${isActive ? 'bg-white/5' : ''}`} data-testid={`plan-step-${idx}`}>
                                <div className="flex flex-col items-center gap-1 mt-0.5">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.5)]' : isPast ? 'bg-green-500' : 'bg-gray-800'}`} />
                                    {idx !== SYSTEM_PLAN.length - 1 && <div className={`w-px h-full ${isPast ? 'bg-gray-700' : 'bg-gray-800'}`} />}
                                </div>
                                <div className="flex flex-col">
                                     <span className={`${isActive ? 'text-white font-medium' : isPast ? 'text-gray-500' : 'text-gray-700'}`}>{step}</span>
                                     {isActive && <span className="text-[9px] text-cyan-500 font-mono animate-pulse">EXECUTING...</span>}
                                     {isPast && <span className="text-[9px] text-green-500 font-mono">COMPLETE</span>}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="pt-2 border-t border-gray-800">
                 <span className="block text-gray-600 text-[10px] mb-2">ACTIVE MODULES</span>
                 <div className="flex flex-wrap gap-1.5">
                     {config.activeModules.length > 0 ? config.activeModules.map((m, i) => (
                         <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-[10px] border border-gray-700 font-mono" data-testid={`active-module-${i}`}>
                             {m}
                         </span>
                     )) : <span className="text-gray-700 italic">IDLE</span>}
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
};
