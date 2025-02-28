# Pie Pantry 🥧

A whimsical, frog-themed pie recipe application for your desktop! Create, manage, and explore delicious pie recipes with a fun and interactive interface.

## Features
- Create and edit pie recipes with customizable ingredients and instructions
- Interactive kitchen timer functionality
- Beautiful 8-bit style recipe illustrations
- Responsive design that works on any screen size
- Completely offline - no internet connection required!

## Prerequisites
- [Node.js](https://nodejs.org/) version 20 (LTS) or higher

## Getting Started

### Development Mode

1. Install dependencies:
```bash
npm install
```

2. Start the development server (Terminal 1):
```bash
npm run dev
```

3. Start the Electron app (Terminal 2):
```bash
npx electron electron/main.js
```

### Building a Standalone Desktop App

To create a standalone desktop application that you can double-click to run:

1. First, build the application:
```bash
npm run build
```

2. Package the Electron app:
```bash
cd electron
npm run build
```

This will create installers in the `electron/dist` directory for your operating system.

## Folder Structure
- `client/` - Frontend React application
- `electron/` - Desktop application configuration
- `shared/` - Shared types and utilities
- `server/` - Local server for development

## Tech Stack
- React + TypeScript
- Electron for desktop app
- Tailwind CSS for styling
- Framer Motion for animations
- Custom SVG illustrations

## License
MIT License - feel free to modify and use this project as you like!
