// Physics equation data model for airfoil aerodynamics
export interface PhysicsEquation {
  id: string;
  name: string;
  latex: string;
  description: string;
  category: string;
  variables: string[];
  constraints: string[];
}

// Sample physics equations related to airfoil aerodynamics
export const physicsEquations: PhysicsEquation[] = [
  {
    id: "thin-airfoil",
    name: "Thin Airfoil Lift Theory",
    latex: "C_L = 2\\pi\\alpha",
    description: "Theoretical lift coefficient for a thin airfoil at small angles of attack in inviscid flow.",
    category: "lift",
    variables: ["CL", "α"],
    constraints: ["Small α", "Thin airfoil"]
  },
  {
    id: "drag-polar",
    name: "Drag Polar Relationship",
    latex: "C_D = C_{D0} + k C_L^2",
    description: "Parabolic relationship between lift and drag coefficients for a subsonic airfoil.",
    category: "drag",
    variables: ["CD", "CL", "CD0", "k"],
    constraints: ["Subsonic flow"]
  },
  {
    id: "cl-max-thickness",
    name: "Maximum Lift & Thickness",
    latex: "C_{L_{max}} \\propto \\sqrt{t/c}",
    description: "Maximum lift coefficient is proportional to the square root of the thickness ratio.",
    category: "lift",
    variables: ["CLmax", "t/c"],
    constraints: ["Pre-stall conditions"]
  },
  {
    id: "reynolds-effect",
    name: "Reynolds Number Effect",
    latex: "C_D = f(Re) = \\frac{C_f}{\\sqrt{Re}}",
    description: "Effect of Reynolds number on skin friction drag coefficient.",
    category: "drag",
    variables: ["CD", "Re", "Cf"],
    constraints: ["Laminar flow", "Flat plate approximation"]
  },
  {
    id: "kutta-condition",
    name: "Kutta Condition",
    latex: "\\Gamma = -\\oint_{C} \\vec{V} \\cdot d\\vec{s}",
    description: "Condition that determines the circulation around an airfoil, ensuring flow leaves the trailing edge smoothly.",
    category: "circulation",
    variables: ["Γ", "V"],
    constraints: ["Sharp trailing edge"]
  },
  {
    id: "stall-angle",
    name: "Stall Angle Prediction",
    latex: "\\alpha_{stall} \\approx 15° - 18°(t/c)",
    description: "Empirical relationship for predicting stall angle based on thickness ratio.",
    category: "stall",
    variables: ["αstall", "t/c"],
    constraints: ["NACA 4-digit airfoils"]
  },
  {
    id: "pressure-coefficient",
    name: "Pressure Coefficient",
    latex: "C_p = \\frac{p - p_\\infty}{\\frac{1}{2}\\rho V_\\infty^2}",
    description: "Non-dimensional pressure coefficient used to analyze pressure distribution around an airfoil.",
    category: "pressure",
    variables: ["Cp", "p", "p∞", "ρ", "V∞"],
    constraints: ["Incompressible flow"]
  },
  {
    id: "moment-coefficient",
    name: "Moment Coefficient",
    latex: "C_m = \\frac{M}{\\frac{1}{2}\\rho V^2 S c}",
    description: "Pitching moment coefficient about the quarter-chord point.",
    category: "moment",
    variables: ["Cm", "M", "ρ", "V", "S", "c"],
    constraints: ["Quarter-chord reference"]
  },
  {
    id: "cl-alpha-slope",
    name: "Lift Curve Slope",
    latex: "\\frac{dC_L}{d\\alpha} = \\frac{2\\pi}{1 + \\frac{2}{\\pi AR}}",
    description: "Lift curve slope for a finite wing, taking into account aspect ratio effects.",
    category: "lift",
    variables: ["CL", "α", "AR"],
    constraints: ["Elliptical lift distribution"]
  },
  {
    id: "cd-wave",
    name: "Wave Drag Prediction",
    latex: "C_{D_{wave}} = K(M - M_{crit})^3",
    description: "Simplified model for predicting wave drag in transonic flow.",
    category: "drag",
    variables: ["CDwave", "M", "Mcrit", "K"],
    constraints: ["Transonic flow"]
  }
];