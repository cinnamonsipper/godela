
import { PointData, ExperimentSummary, ExperimentConfig } from './types';

export const MOCK_SURROGATE_DATA: PointData[] = Array.from({ length: 50 }, (_, i) => {
  const x = i / 5; // Angle 0 to 10
  // Synthetic curve with noise representing surrogate prediction
  const base = 0.35 - (0.015 * x) + (0.001 * x * x); 
  const noise = (Math.random() - 0.5) * 0.02;
  return {
    x,
    y: base + noise,
    type: 'surrogate'
  };
});

// The RANS solver points (The Gold Stars)
export const PHYSICS_VALIDATION_POINTS: PointData[] = [
  { x: 2, y: 0.32, type: 'physics' },
  { x: 5, y: 0.28, type: 'physics' },
  { x: 8, y: 0.29, type: 'physics' }
];

export const OPTIMAL_POINT: PointData = { x: 4.2, y: 0.24, type: 'optimized' };

export const INITIAL_USER_QUERY = "I want to make this design more aerodynamic.";

// Outcome-based query, not parameter-based
export const REFINED_USER_QUERY = "I need to increase top speed on the straights, but I can't lose any grip in the corners. Also, keep the engine from overheating.";

export const SYSTEM_PLAN = [
  "Construct system plan",
  "Generate candidate geometries",
  "Evaluate surrogate aero-thermal models",
  "Rank candidates by weighted objective",
  "Select high-fidelity candidate",
  "Run integrated aero-thermal inference",
  "Validate constraints & present insight"
];

export const DEFAULT_OPERATING_CONDITIONS = [
  { name: "Inlet Velocity", value: "120 km/h" },
  { name: "Air Density", value: "1.225 kg/m³" },
  { name: "Turbulence", value: "5% (I)" }
];

export const DEFAULT_DESIGN_VARS = [
  "Rear spoiler angle [°]",
  "Underbody curvature",
  "Vent size/placement"
];

export const EXPERIMENT_SUMMARY_DATA: ExperimentSummary = {
  intent: "Optimize aerodynamic + thermal performance of baseline geometry.",
  targetVars: [
    "Drag Coefficient (Cd): Minimize",
    "Lift Coefficient (Cl): Maintain within ±2%",
    "Max Surface Temperature: ≤ 80°C"
  ],
  designVars: [
    "Rear spoiler angle [°]",
    "Underbody curvature profile",
    "Vent size and placement",
    "Surface curvature morph zones"
  ],
  operatingConditions: [
    "Inlet velocity: 120 km/h",
    "Air density: 1.225 kg/m³",
    "Ambient temperature: 298 K",
    "Turbulence intensity: 5%"
  ],
  constraints: [
    "Cl ∈ [Cl₀ - 0.02, Cl₀ + 0.02]",
    "T_max ≤ 80°C",
    "Geometric deformation: ≤ 5%"
  ]
};

export const DETAILED_PROBLEM_SPEC: ExperimentConfig = {
    status: 'DEFINED',
    planStep: 0,
    activeModules: ['Design Space Generator'],
    targetVars: [
        { name: 'Drag Coefficient (Cd)', goal: 'Minimize', context: 'Proxy for Top Speed' },
        { name: 'Lift Coefficient (Cl)', goal: 'Monitor', context: 'Proxy for Grip' },
        { name: 'Max Surface Temp (Tmax)', goal: 'Monitor', context: 'Proxy for Overheating' }
    ],
    constraints: [
        { name: 'Aerodynamic Balance', value: 'Cl deviation ≤ ±2.0%', why: 'Ensures handling consistency' },
        { name: 'Thermal Safety', value: 'Tmax ≤ 80°C', why: 'Prevents material degradation' },
        { name: 'Geometric Limits', value: 'Deformation ≤ 50mm', why: 'Ensures fitment constraint' }
    ],
    designVars: [
        'Rear Spoiler Angle (α): [-5°, +10°]',
        'Side Vent Inlet Scale: [0.8x, 1.5x]',
        'Diffuser Ramp Angle (θ): [5°, 15°]'
    ],
    operatingConditions: [
        { name: 'Inlet Velocity', value: '33.3 m/s (120 km/h)' },
        { name: 'Ambient Temp', value: '25°C (298 K)' },
        { name: 'Heat Source', value: 'Flux 5000 W/m²' },
        { name: 'Ground Condition', value: 'Moving Wall (33.3 m/s)' }
    ]
};


export const SIMULATION_PROPOSAL_DATA = {
  solver: [
    { label: "Physics", val: "Steady-State Compressible + CHT" },
    { label: "Turbulence", val: "k-ω SST (Wall-resolved, y⁺≈1)" },
    { label: "Discretization", val: "Second-Order Upwind" }
  ],
  boundaries: [
    { label: "Inlet", val: "Vel. Inlet (U∞=33.3 m/s, I=1%)" },
    { label: "Ground", val: "Moving Wall (Matched U)" },
    { label: "Wheels", val: "MRF Rotation" },
    { label: "Thermal", val: "Flux 5kW/m² (Engine Casing)" },
    { label: "Ambient", val: "Static T∞ = 300 K" }
  ],
  assumptions: [
    "Symmetry plane utilized (Half-body domain)",
    "Radiation effects neglected (Convection dominant)"
  ],
  time: "3.4s"
};
