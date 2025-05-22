# VR Canvas Panel Project

## Phase 1: Basic VR Canvas Setup with Raycasting

### Overview
Phase 1 implements a basic WebXR scene with a 320x180 canvas panel that can be interacted with using VR controllers. The implementation includes basic VR setup, controller support, and raycasting interaction.

### Features
- 320x180 canvas panel positioned in front of the user at eye level (1.6m height)
- WebXR support with VR button for entering VR mode
- Meta Emulator controller support
- Raycasting interaction that activates only after entering VR mode
- Basic canvas with white background and text
- Controller models and interaction handling

### Technical Implementation
- Uses Three.js for 3D rendering and WebXR support
- Implements raycasting for precise interaction with the canvas panel
- Converts UV coordinates to canvas coordinates (320x180)
- Handles VR session start/end events
- Includes window resize handling for responsive design

### Files
- `index.html`: Main HTML file with Three.js dependencies
- `vr-scene.js`: Core implementation of the VR scene and canvas panel

### Dependencies
- Three.js v0.160.0
- WebXR API
- Meta Emulator plugin (for testing)

### Usage
1. Serve the files through a local web server
2. Open the page in a WebXR-compatible browser
3. Click the VR button to enter VR mode
4. Use Meta Emulator controllers to interact with the canvas panel
5. Click on the panel to see coordinates logged in the console

### Notes
- Raycasting only activates after entering VR mode
- Canvas panel is positioned at (0, 1.6, -1) in world space
- Basic canvas implementation with white background and text
- Controller models are automatically loaded and displayed 