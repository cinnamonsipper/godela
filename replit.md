# Godela - AI Engineering Assistant Platform

## Overview

Godela is an AI-powered platform for engineering problem-solving that transforms complex physics simulations into an intuitive, interactive experience. The application follows a demo-driven architecture to showcase engineering problem-solving capabilities through conversational AI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application is built as a full-stack web application with a demo-focused frontend and a minimal backend infrastructure.

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand for lightweight, centralized state management
- **3D Rendering**: Three.js with React Three Fiber and Drei for 3D visualizations
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints (minimal implementation)
- **Static Assets**: Serves 3D models and generated visualizations

### Demo Architecture
The application implements a sophisticated demo system that separates presentation logic from content:
- **Demo Path System**: Multiple demonstration scenarios (airfoil, packaging, amazon logistics, cosmology) sharing the same interaction model
- **Step-based Progression**: Four-stage workflow (Problem Analysis → Data Processing → Model Building → Simulation)
- **Shared Components**: Reusable UI components across different demo paths
- **Content Separation**: Demo-specific content stored in constants, visual assets domain-specific

## Demo Paths

The application supports multiple engineering demonstration paths:

### Available Demo Paths
- **Airfoil**: Analyze how angle of attack and thickness impact lift & drag
- **Aircraft Aerodynamics**: Optimize aircraft design for fuel efficiency
- **Car Aerodynamics**: Simulate airflow over vehicle designs
- **Packaging Design**: Design protective packaging for products
- **Phone Packaging**: Specialized packaging optimization for mobile devices
- **Amazon Demo**: Warehouse logistics and supply chain optimization
- **Dell Demo**: Warehouse logistics and supply chain optimization (duplicate of Amazon Demo)
- **Cosmology**: Astrophysical models and cosmic simulations
- **Model Viewer**: 3D model analysis and visualization
- **Sandbox**: Experimental chat interface
- **Latent Explorer**: Interactive design space exploration with aircraft optimization
- **Latent Explorer V2**: Enhanced version of Latent Explorer with same functionality (independent duplicate for customization)

### Recent Addition: Amazon Demo Path
Added a new Amazon Demo path that guides users through building ML models for Amazon-scale logistics operations. The path includes:
- **Problem Analysis**: Understanding logistics challenges and warehouse optimization needs
- **Data Processing**: Processing warehouse data (2.3M packages/day, 450 robotic units, 12 sorting zones)
- **Model Building**: Creating neural networks with reinforcement learning for dynamic routing
- **Simulation**: Testing optimization strategies under peak conditions (Black Friday scenarios)

The Amazon Demo uses the same four-stage workflow as other paths but focuses on logistics-specific terminology and scenarios.

### Latent Explorer V2
Created as an independent duplicate of the Latent Explorer demo, allowing for customization without affecting the original. Key details:
- **Component**: LatentExplorerV2.tsx (duplicate of LatentExplorerWithSTL.tsx)
- **Demo Steps**: latentExplorerV2DemoSteps.ts with "V2" branding in welcome message
- **Routing**: Independent path 'latent-explorer-v2' in demo store and Godela.tsx
- **Styling**: Uses emerald/teal color scheme instead of blue/cyan
- **Purpose**: Allows separate customization and experimentation without breaking the original Latent Explorer demo

### Dell Demo
Created as an independent duplicate of the Amazon Demo, providing the same warehouse logistics functionality with Dell branding:
- **Component**: DellDemo.tsx (duplicate of AmazonDemo.tsx)
- **Demo Steps**: dellDemoSteps.ts with Dell-specific terminology
- **Routing**: Independent path 'dell' in demo store and Godela.tsx
- **Styling**: Uses blue/sky color scheme instead of orange/amber
- **Purpose**: Separate demo instance for Dell-specific logistics optimization scenarios

## Key Components

### Core State Management
- **useDemoStore**: Central demo state management with path tracking and step progression
- **Demo Path Selector**: Determines active demonstration scenario
- **Step Progression**: Controls workflow advancement through the four stages

### UI Component Architecture
- **Godela Components**: Core interface components located in `client/src/components/godela/`
- **View Components**: Stage-specific components (ProblemAnalysisView, DataProcessingView, ModelBuilderView, SimulateView)
- **Shared UI**: shadcn/ui components for consistent design system
- **3D Visualization**: React Three Fiber components for interactive 3D models

### Content System
- **Demo Constants**: Centralized conversation scripts and demo parameters
- **Visual Assets**: Domain-specific diagrams, charts, and visualizations
- **Placeholder System**: Mock data and simulation results for demonstration purposes

## Data Flow

1. **User Interaction**: User selects demo path and progresses through steps
2. **State Updates**: Zustand store manages demo progression and current state
3. **Component Rendering**: React components respond to state changes and render appropriate views
4. **Asset Loading**: 3D models and visualizations loaded from static assets
5. **Mock Simulation**: Placeholder logic simulates AI-powered engineering analysis

## External Dependencies

### UI and Visualization
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Three.js Ecosystem**: 3D rendering and interaction capabilities
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Type safety and improved developer experience
- **Vite**: Fast build tool with hot module replacement
- **ESLint**: Code quality and consistency

### Database and Storage
- **Drizzle ORM**: Type-safe database operations (configured but minimal usage)
- **Neon Database**: PostgreSQL database service (provisioned via DATABASE_URL)
- **Static Asset Serving**: Local file serving for 3D models and generated visualizations

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reload**: Vite provides instant feedback during development
- **Static Asset Management**: Local serving of 3D models and visualization assets

### Production Build
- **Client Build**: Vite builds optimized React application
- **Server Build**: esbuild compiles TypeScript server to JavaScript
- **Asset Pipeline**: Static assets bundled and served efficiently

### Environment Configuration
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL connection
- **Development**: NODE_ENV=development for development-specific features
- **Production**: NODE_ENV=production for optimized builds

### Architecture Decisions

#### Demo-First Approach
**Problem**: Need to showcase complex engineering workflows without full simulation backend
**Solution**: Demo system with scripted interactions and mock results
**Rationale**: Allows rapid prototyping and user testing of interaction patterns before building complex simulation infrastructure

#### Component-Based Architecture
**Problem**: Multiple demo paths with shared functionality
**Solution**: Separate content from presentation logic with reusable components
**Benefits**: Easier to add new demo scenarios, consistent user experience across paths

#### State Management Choice
**Problem**: Need centralized state for demo progression and UI coordination
**Solution**: Zustand for lightweight, type-safe state management
**Alternatives Considered**: Redux (too heavy), React Context (performance concerns for frequent updates)
**Benefits**: Simple API, TypeScript integration, minimal boilerplate

#### 3D Visualization Strategy
**Problem**: Need interactive 3D models for engineering demonstrations
**Solution**: React Three Fiber with Three.js for WebGL rendering
**Benefits**: Component-based 3D development, automatic React integration, performance optimization