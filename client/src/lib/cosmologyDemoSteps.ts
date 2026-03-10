interface Step {
  id: string;
  instructions: string;
  expectedResponse: string;
  hint: string;
}

// Steps for the cosmology demo flow
export const cosmologyDemoSteps: Step[] = [
  {
    id: 'ask-about-pulsar',
    instructions: 'Ask about a pulsar wind nebula like the Crab, referencing the Olmi et al. 2016 paper.',
    expectedResponse: 'pulsar wind nebula',
    hint: 'Try asking something like: "Show me the 3D structure and magnetic field interaction of a pulsar wind nebula like the Crab, including jet and torus morphology. Base it on Olmi et al. 2016, J. Plasma Phys. 82, Id. 635820601."'
  },
  {
    id: 'follow-up-question',
    instructions: 'Ask a follow-up question about the magnetic field structure.',
    expectedResponse: 'magnetic field',
    hint: 'Try asking: "Can you explain the magnetic field structure in more detail?"'
  },
  {
    id: 'conclusion',
    instructions: 'Demo complete! You can continue exploring or go back to the main menu.',
    expectedResponse: '',
    hint: ''
  }
];

export default cosmologyDemoSteps;