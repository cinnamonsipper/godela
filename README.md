# Godela - Engineering AI Assistant Platform

Godela is an advanced AI-powered platform for engineering problem-solving that transforms complex physics simulations into an intuitive, interactive experience.

## Project Structure

The application follows a structured demo approach to showcase engineering problem-solving capabilities through conversational AI.

### Core Architecture

```
client/
  ├── src/
  │   ├── components/godela/   # Core components for the Godela interface
  │   ├── store/               # State management with Zustand
  │   ├── lib/                 # Constants, utilities, and helper functions
  │   └── pages/               # Main application pages
```

## Demo Architecture

### Demo Path System

Godela supports multiple demonstration paths, each showcasing a different engineering use case while sharing the same interaction model. The architecture is designed to separate the flow logic from the content, allowing for easy addition of new demo paths.

### Demo State Management

The demo state is managed through `useDemoStore` (in `client/src/store/useDemoStore.ts`), which tracks:

- **demoPath**: The active demo path identifier (e.g., 'airfoil', 'heat-exchanger')
- **demoStep**: Current progress through the selected demo's steps
- **getCurrentSteps**: Selector to get the appropriate step sequence for the active path

### Shared Components (Core Functionality)

The following elements are consistent across all demo paths:

1. **Workflow Structure**: Four-stage progression (Problem Analysis → Data Processing → Model Building → Simulation)
2. **UI Framework**: Layout, animations, transitions, and styling
3. **Interaction Model**: Chat-driven interface with step progression
4. **Progress Visualization**: Status indicators and workflow progress visualization
5. **Component Architecture**: View components for each stage of the workflow

### Path-Specific Content

Each demo path contains its own:

1. **Conversation Script**: Unique AI-user dialogue stored in `demoConstants.ts`
2. **Visual Assets**: Domain-specific diagrams, charts, and visualizations 
3. **Parameters**: Domain-relevant input parameters (e.g., angle of attack for airfoils, flow rates for heat exchangers)
4. **Physics Models**: Different simulations based on the engineering domain
5. **Step Sequence**: Custom progression through the four-stage workflow

## Adding New Demo Paths

To add a new demo path:

1. Create a new array of demo steps in `client/src/lib/demoConstants.ts`
2. Add the new path type to the `DemoPath` type in `client/src/store/useDemoStore.ts`
3. Update the `getCurrentSteps` function to return the appropriate steps for your new path
4. Create any needed visual components for the new domain
5. Add a button or entry point in the UI (e.g., in `WelcomeView.tsx`)

## Intent and Principles

Godela is designed with the following principles:

1. **Simplicity in Interaction**: Users should be able to create complex simulations through simple conversational requests.
2. **Chat as Primary Control**: The primary way users control the application should be through the chat interface.
3. **Visual Feedback**: Every stage should provide clear visual representations of the engineering process.
4. **Educational Progression**: Each demo should walk users through a coherent workflow that teaches engineering principles.
5. **Consistent Experience with Domain-Specific Content**: While the UI and interaction patterns remain consistent, the content adapts to the specific engineering domain.

## Demo Use Cases

### Airfoil Simulation
The airfoil demo showcases how changing parameters like angle of attack and airfoil thickness impacts aerodynamic performance.

### Heat Exchanger Optimization
The heat exchanger demo demonstrates optimization of heat transfer by adjusting parameters like flow rates and geometry.

Both demos follow the same four-stage workflow but present domain-specific content, simulations, and insights.