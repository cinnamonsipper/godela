import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { MOCK_SURROGATE_DATA, PHYSICS_VALIDATION_POINTS, OPTIMAL_POINT } from '@/lib/apsWorkbench/constants';
import { SimulationStage } from '@/lib/apsWorkbench/types';

interface EnsembleChartProps {
  stage: SimulationStage;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1b1f] border border-gray-700 p-2 text-xs shadow-xl rounded z-50">
        <p className="font-mono text-white mb-1">Angle: {label}°</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} style={{ color: p.color }}>
            {p.name}: {Number(p.value).toFixed(3)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const EnsembleChart: React.FC<EnsembleChartProps> = ({ stage }) => {
  // Filter data based on stage
  const showSurrogate = stage !== SimulationStage.IDLE && stage !== SimulationStage.PARSING;
  const showPhysics = stage === SimulationStage.DEDUCTION || stage === SimulationStage.INSIGHT;
  const showOptimized = stage === SimulationStage.INSIGHT;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        margin={{ top: 10, right: 15, bottom: 5, left: -20 }}
      >
        <CartesianGrid stroke="#ffffff" strokeDasharray="3 3" vertical={false} opacity={0.1} />
        <XAxis 
          dataKey="x" 
          type="number" 
          domain={[0, 10]} 
          tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
          axisLine={{ stroke: '#94a3b8', opacity: 0.3 }}
          interval={2}
        />
        <YAxis 
          dataKey="y" 
          domain={[0.2, 0.4]} 
          tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
          axisLine={{ stroke: '#94a3b8', opacity: 0.3 }}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />

        {/* 1. Induction (Surrogate Model) */}
        {showSurrogate && (
            <Area 
            data={MOCK_SURROGATE_DATA} 
            dataKey="y" 
            name="Confidence Interval" 
            stroke="none" 
            fill="#00E5FF" 
            fillOpacity={0.15} 
            isAnimationActive={true}
            />
        )}
        {showSurrogate && (
        <Scatter 
            name="Surrogate Ensemble" 
            data={MOCK_SURROGATE_DATA} 
            fill="#94a3b8" 
            shape="circle" 
            r={2}
            fillOpacity={0.8}
            animationDuration={1000}
        />
        )}

        {/* 2. Deduction (Physics/RANS) */}
        {showPhysics && (
        <Scatter 
            name="RANS Solver (Deduction)" 
            data={PHYSICS_VALIDATION_POINTS} 
            fill="#FFB800" 
            shape="star" 
            r={6} 
            stroke="#fff"
            strokeWidth={1}
        />
        )}

        {/* 3. Insight (Optimized Point) */}
        {showOptimized && (
            <ReferenceDot 
            x={OPTIMAL_POINT.x} 
            y={OPTIMAL_POINT.y} 
            r={6} 
            fill="#00FF94" 
            stroke="#fff"
            strokeWidth={1}
            ifOverflow="extendDomain"
            />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
