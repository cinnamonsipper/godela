interface Step {
  id: string;
  instructions: string;
  expectedResponse: string;
  hint: string;
}

// Steps for the Dell warehouse logistics demo flow
export const dellDemoSteps: Step[] = [
  {
    id: 'ask-about-warehouse',
    instructions: 'Ask about warehouse optimization or logistics challenges.',
    expectedResponse: 'warehouse optimization',
    hint: 'Try asking something like: "Help me optimize my warehouse logistics for 2.3M packages per day with 450 robotic units across 12 sorting zones."'
  },
  {
    id: 'follow-up-question',
    instructions: 'Ask a follow-up question about robot deployment or peak capacity.',
    expectedResponse: 'robot deployment',
    hint: 'Try asking: "How should I deploy robots during Black Friday surge capacity?"'
  },
  {
    id: 'conclusion',
    instructions: 'Demo complete! You can continue exploring warehouse scenarios or go back to the main menu.',
    expectedResponse: '',
    hint: ''
  }
];

export default dellDemoSteps;