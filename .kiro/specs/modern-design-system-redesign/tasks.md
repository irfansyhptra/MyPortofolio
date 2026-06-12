# Implementation Plan: Modern Design System Redesign

## Overview

This implementation plan transforms the portfolio website with a modern design system integrating Neumorphism, Glassmorphism, WebGL-powered 3D experiences, and Framer Motion animations. The implementation is organized into discrete, incremental steps that build upon each other, starting with foundational design tokens, progressing through component creation, then 3D integration, animation systems, performance optimization, and accessibility compliance.

The design document uses TypeScript with Next.js, React Three Fiber for 3D rendering, and Framer Motion for animations. All tasks focus on code implementation that can be executed by a coding agent.

## Tasks

- [x] 1. Set up Design Token System and Core Infrastructure
  - Create CSS custom properties file with all design tokens (neumorphism, glassmorphism, spacing, blur, breakpoints)
  - Create TypeScript constants file (`lib/design-tokens.ts`) with design token definitions matching the design specification
  - Create ResponsiveProvider context component (`lib/responsive-manager.ts`) to track breakpoints, touch detection, and reduced motion preferences
  - Set up testing framework configuration (Vitest) and fast-check for property-based tests
  - _Requirements: 12.1, 12.2, 3.10_

- [-] 2. Implement Neumorphism Component System
  - [-] 2.1 Create NeumorphicCard component
    - Implement `components/design-system/NeumorphicCard.tsx` with raised and pressed variants
    - Apply shadow calculations using 145-degree light source angle with dual shadows (highlight and shadow)
    - Integrate Framer Motion for hover (200ms) and active (100ms) transitions
    - Use design tokens exclusively for shadow, gradient, and transition values
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 12.3_
  
  - [x]* 2.2 Write property tests for NeumorphicCard
    - **Property 1: Gradient Lightness Constraint** - Test adjacent color stops differ by ≤10% lightness
    - **Property 2: Neumorphism Consistency** - Verify 145° light source and 0.1-0.2 opacity
    - **Property 3: Neumorphism Surface Contrast** - Validate ≥1.5:1 contrast for depth
    - **Property 4: Neumorphism Text Contrast** - Verify ≥4.5:1 text contrast
    - **Validates: Requirements 1.4, 1.5, 1.8, 1.9**
  
  - [ ] 2.3 Create NeumorphicButton component
    - Implement button with raised/pressed states and interactive feedback
    - Add spring physics animations with stiffness 200-400 and damping 15-30
    - Ensure 44x44px minimum touch target for touch devices
    - _Requirements: 1.6, 1.7, 3.6, 11.5_


- [-] 3. Implement Glassmorphism Component System
  - [ ] 3.1 Create GlassCard component
    - Implement `components/design-system/GlassCard.tsx` with backdrop-filter blur (8-24px)
    - Apply background opacity (0.05-0.3), z-index layering (increments of 10), and border highlights
    - Implement dynamic opacity adjustment based on background luminance (<0.3 triggers increase)
    - Use design tokens for blur, opacity, border, and shadow values
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 12.3_
  
  - [x]* 3.2 Write property tests for GlassCard
    - **Property 5: Glassmorphism Layering** - Verify z-index increments of 10 and shadow blur 20-40px
    - **Property 6: Glassmorphism Text Contrast** - Test ≥4.5:1 for <18pt, ≥3:1 for ≥18pt
    - **Property 7: Dynamic Opacity Adjustment** - Validate opacity increase when luminance <0.3
    - **Validates: Requirements 2.3, 2.4, 2.5**
  
  - [x] 3.3 Create GlassPanel component variant
    - Implement alternative glass component with different blur strengths (low/medium/high)
    - Add entrance animations (fadeIn with 0.6s duration)
    - _Requirements: 2.1, 2.2_

- [x] 4. Checkpoint - Design System Foundation
  - Ensure all tests pass for design tokens, neumorphism, and glassmorphism components
  - Verify responsive behavior at mobile (<768px), tablet (768-1024px), and desktop (≥1024px) breakpoints
  - Ask the user if questions arise about design system implementation

- [x] 5. Implement WebGL Scene Manager and 3D Infrastructure
  - [x] 5.1 Create WebGLSceneManager class
    - Implement `lib/webgl/scene-manager.ts` with Three.js scene, camera, and renderer initialization
    - Detect WebGL support before initialization with graceful fallback
    - Set pixel ratio to min(devicePixelRatio, 2) and implement antialias based on pixel ratio
    - Add dispose method for cleanup
    - _Requirements: 4.1, 4.6, 15.4, 15.5_
  
  - [x]* 5.2 Write property tests for WebGL initialization
    - **Property 11: LOD Optimization Trigger** - Verify polygon/texture reduction when FPS <30 for >500ms
    - **Property 12: WebGL Fallback Handling** - Test fallback content displays on initialization failure
    - **Property 13: WebGL Timeout Fallback** - Validate fallback after 5000ms timeout
    - **Validates: Requirements 4.5, 4.6, 4.8**
  
  - [x] 5.3 Create WebGL React component wrapper
    - Implement `components/webgl/WebGLCanvas.tsx` using React Three Fiber
    - Add loading indicator for initialization >2000ms
    - Display static fallback image/video when WebGL unavailable
    - Add ARIA labels for accessibility
    - _Requirements: 4.2, 4.7, 4.8, 14.5_


- [x] 6. Implement 3D Model Loading and Interactive Controls
  - [x] 6.1 Create ModelLoader utility
    - Implement `lib/webgl/model-loader.ts` with support for glTF and USD formats
    - Add caching mechanism for loaded models
    - Implement LOD (Level of Detail) configuration with distance-based polygon/texture reduction
    - _Requirements: 4.5_
  
  - [x] 6.2 Create InteractiveModelController component
    - Implement `components/webgl/InteractiveModelController.tsx` for drag rotation (0.5-2.0 deg/pixel)
    - Add pinch-to-zoom gesture support with 0.5x-3.0x scale bounds
    - Implement hover highlight effect (200ms delay) with visual indicators
    - Add auto-reset to default orientation after 5 seconds of inactivity
    - Display persistent visual indicators (rotation arrows, hand cursor)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [x]* 6.3 Write property tests for interaction calculations
    - **Property 17: Drag Rotation Rate** - Verify 0.5-2.0 degrees per pixel rotation
    - **Property 18: Pinch Scale Bounds** - Test 0.5x-3.0x scale proportional to pinch distance
    - **Property 19: Scale Boundary Enforcement** - Validate feedback at scale boundaries
    - **Property 20: Interaction Indicator Presence** - Verify visual indicators present
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.6**
  
  - [x] 6.4 Implement keyboard controls for 3D models
    - Add Tab key support to enter/exit 3D controls
    - Implement Arrow keys for rotation, Plus/Minus for zoom, Escape to exit
    - Add focus trap within 3D controls until Escape pressed
    - _Requirements: 14.3, 14.7_

- [x] 7. Implement Scroll-Triggered 3D Animations
  - [x] 7.1 Create ScrollSync3D controller
    - Implement `lib/webgl/scroll-sync-3d.ts` to map scroll position (0-1 progress) to 3D animation properties
    - Update animations within 16ms (60 FPS) of scroll event detection
    - Linear mapping where 0% = element entering viewport, 100% = exiting viewport
    - Apply cubic-bezier easing with control points between (0.2, 0.0) and (0.8, 1.0)
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [x]* 7.2 Write property tests for scroll-triggered animations
    - **Property 14: Scroll-to-Progress Mapping** - Verify linear 0-1 progress mapping
    - **Property 15: Performance Degradation on FPS Drop** - Test particle reduction by 50% when FPS <30 for >500ms
    - **Property 16: Performance Recovery** - Validate restoration when FPS >50 for 2s
    - **Validates: Requirements 5.2, 5.6, 5.7**
  
  - [x] 7.3 Create scroll-animated 3D scene component
    - Implement component with 3D model transitioning from inactive (opacity 0, scale 0.8) to active (opacity 1, scale 1) over 800ms when ≥20% visible
    - Integrate with ScrollSync3D controller
    - Maintain ≥30 FPS during scroll velocity >1000px/s
    - _Requirements: 5.3, 5.4_


- [ ] 8. Implement AR Preview Capability
  - [ ] 8.1 Create ARPreviewManager
    - Implement `lib/webgl/ar-preview-manager.ts` to check WebXR 'immersive-ar' support
    - Show/hide AR button based on device capability
    - Initialize WebXR session on user activation with camera permission handling
    - Maintain 1:1 scale ratio (1 model unit = 1 meter real-world)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 8.2 Create AR UI components
    - Implement AR preview button with instructional text (16px minimum font size)
    - Display instructions: "Tap AR button to start", "Move device to place object", "Tap screen to exit AR"
    - Add visible close/exit button for AR session termination
    - Handle error messages: "AR not available on this device", "Camera access required for AR"
    - _Requirements: 7.5, 7.6, 7.7, 7.8_
  
  - [ ]* 8.3 Write property tests for AR functionality
    - **Property 21: Unsupported Input Method Messaging** - Verify alternative method messages
    - **Property 22: AR Scale Ratio** - Test 1:1 model unit to real-world meter mapping
    - **Property 23: WebXR Initialization Error Handling** - Validate error message and view return
    - **Validates: Requirements 6.7, 7.4, 7.6**

- [ ] 9. Checkpoint - 3D and WebGL Foundation
  - Ensure all tests pass for WebGL scene manager, 3D model interactions, scroll animations, and AR preview
  - Verify fallback content displays correctly when WebGL unavailable
  - Ask the user if questions arise about 3D implementation

- [ ] 10. Implement Framer Motion Animation Framework
  - [ ] 10.1 Create centralized animation variants library
    - Implement `lib/animation-variants.ts` with fadeIn, slideUp, slideDown, scaleIn, staggerContainer, pageTransition, and hoverScale variants
    - Define custom cubic-bezier easing curves with explicit control points
    - Set durations between 0.3-2.0 seconds for all animations
    - Implement spring physics configurations with stiffness 200-400, damping 15-30
    - _Requirements: 8.1, 8.3, 8.4, 9.1, 9.2, 9.4, 11.5_
  
  - [ ]* 10.2 Write property tests for animation configurations
    - **Property 24: Animation Completion Callbacks** - Verify onAnimationComplete invocation
    - **Property 25: Animation Duration Constraints** - Test 0.3-2.0s duration and custom timing
    - **Property 26: Explicit Easing Definition** - Validate explicit control point definition
    - **Property 27: Stagger Delay Constraints** - Test 50-300ms stagger delays
    - **Validates: Requirements 8.6, 9.2, 9.4, 9.6**
  
  - [ ] 10.3 Create animation documentation
    - Document at least 5 reusable animation patterns with duration, easing, and use cases
    - Include examples of anticipation (reverse motion) and follow-through (overshoot) patterns
    - _Requirements: 9.5, 9.7_


- [ ] 11. Implement Page Transition Animations
  - [ ] 11.1 Create PageTransition wrapper component
    - Implement `components/animation/PageTransition.tsx` coordinating with Next.js routing
    - Trigger exit animations within 16ms of navigation, complete within 400ms
    - Trigger entrance animations within 16ms of content availability
    - Total transition time ≤1000ms from navigation trigger
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [ ] 11.2 Add animation interruption handling
    - Allow interruption by new navigation within 50ms
    - Skip remaining animation if timeout exceeds 500ms
    - Maintain ≥30 FPS during transitions
    - _Requirements: 10.4, 10.6, 10.7_
  
  - [ ]* 11.3 Write property tests for page transitions
    - **Property 28: Transition Interruption Handling** - Test <50ms new transition start
    - **Property 29: Animation Timeout Fallback** - Verify skip and proceed after 500ms timeout
    - **Validates: Requirements 10.6, 10.7**

- [ ] 12. Implement Micro-Interactions and Hover Effects
  - [ ] 12.1 Create MicroInteractionProvider component
    - Implement hover effects initiating within 16ms with scale (0.95x-1.1x), opacity (0.7-1.0), or color shift (≤15°)
    - Apply to buttons, links, cards, form inputs, navigation items, and icon buttons
    - Complete active state animation within 200ms before executing action
    - Disable hover effects when pointer: coarse detected (touch input)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_
  
  - [ ]* 12.2 Write property tests for micro-interactions
    - **Property 30: Hover Effect Constraints** - Verify scale/opacity/color ranges
    - **Property 31: Spring Physics Constraints** - Test stiffness 200-400, damping 15-30
    - **Property 32: Touch Input Hover Disable** - Validate no hover on pointer: coarse
    - **Property 33: Animation Failure Recovery** - Test immediate end state jump and warning
    - **Validates: Requirements 11.2, 11.5, 11.6, 11.7**
  
  - [ ] 12.3 Apply micro-interactions to existing components
    - Update Navbar, Footer, buttons, links, and cards with micro-interaction animations
    - Ensure all interactive elements have appropriate feedback
    - _Requirements: 11.3_

- [ ] 13. Checkpoint - Animation Framework Complete
  - Ensure all tests pass for animation variants, page transitions, and micro-interactions
  - Verify animations maintain ≥60 FPS on capable devices, ≥30 FPS on all devices
  - Check prefers-reduced-motion handling disables motion animations
  - Ask the user if questions arise about animation implementation


- [ ] 14. Integrate Design System into Existing Components
  - [ ] 14.1 Update Navbar component
    - Apply neumorphic or glassmorphic styles using design tokens
    - Integrate micro-interaction hover effects
    - Ensure responsive behavior across breakpoints
    - Maintain accessibility with focus indicators and ARIA labels
    - _Requirements: 12.5, 12.6_
  
  - [ ] 14.2 Update Footer component
    - Apply design system styles using tokens exclusively
    - Add entrance animations using animation variants
    - _Requirements: 12.5, 12.6_
  
  - [ ] 14.3 Update Hero section
    - Integrate WebGL 3D scene with scroll-triggered animations
    - Apply glassmorphic overlay elements
    - Add page entrance animations
    - _Requirements: 12.5, 12.6_
  
  - [ ] 14.4 Update Projects section
    - Apply neumorphic card styling to project items
    - Add stagger animations for project grid
    - Integrate interactive 3D previews for selected projects
    - _Requirements: 12.5, 12.6_
  
  - [ ] 14.5 Update Blog, Services, Contact, and Testimonials sections
    - Apply design system styles using tokens
    - Add appropriate animations (fade, slide, scale)
    - Ensure responsive behavior and accessibility
    - _Requirements: 12.5, 12.6_
  
  - [ ]* 14.6 Write property tests for component integration
    - **Property 34: Component Token Usage** - Verify exclusive token usage without hardcoded values
    - **Property 35: Invalid Token Error Handling** - Test error logging and fallback values
    - **Validates: Requirements 12.3, 12.4**

- [ ] 15. Implement Performance Monitoring and Optimization
  - [ ] 15.1 Create PerformanceMonitor class
    - Implement `lib/performance-monitor.ts` with continuous FPS tracking
    - Detect low FPS (<30 for >500ms) and trigger quality reduction
    - Detect high FPS recovery (>50 for 2s) and restore quality
    - Provide callback system for quality change notifications
    - _Requirements: 13.4, 13.5_
  
  - [ ]* 15.2 Write property tests for performance logic
    - **Property 38: Performance Degradation** - Test particle disable and render distance reduction at low FPS
    - **Property 39: Effect Restoration** - Verify restoration after sustained high FPS
    - **Property 40: Shadow Optimization** - Test 30% blur reduction when >10 shadows visible
    - **Property 41: Performance Metrics Logging** - Validate logging when Core Web Vitals thresholds missed
    - **Validates: Requirements 13.4, 13.5, 13.7, 13.9**
  
  - [ ] 15.3 Implement quality adjustment handlers
    - Reduce particle count by 50% when FPS drops
    - Disable secondary animation effects during low performance
    - Reduce render distance by 50%
    - Optimize shadow blur radius by 30% when >10 shadows visible
    - _Requirements: 13.4, 13.7_


- [ ] 16. Implement Resource Loading Optimization
  - [ ] 16.1 Create lazy loading for heavy assets
    - Defer loading of WebGL scenes and animation assets >500KB until 3 seconds after initial page render
    - Implement code-splitting for 3D and animation libraries
    - _Requirements: 13.2_
  
  - [ ]* 16.2 Write property tests for resource loading
    - **Property 36: Asset Lazy Loading** - Verify >500KB assets deferred for 3s
    - **Property 37: GPU-Accelerated Properties** - Test transform/opacity usage vs top/left/width/height
    - **Validates: Requirements 13.2, 13.3**
  
  - [ ] 16.3 Optimize WebGL rendering
    - Implement frustum culling to skip objects outside camera view
    - Use instancing to batch identical geometries into single draw calls
    - Limit backdrop-filter blur rendering to elements within viewport
    - _Requirements: 13.6, 13.7_
  
  - [ ] 16.4 Add performance metrics tracking
    - Track DOMContentLoaded timing (target: ≤1500ms)
    - Monitor Largest Contentful Paint (target: ≤2.5s)
    - Monitor Cumulative Layout Shift (target: ≤0.1)
    - Log metrics when thresholds not met
    - _Requirements: 13.1, 13.8, 13.9_

- [ ] 17. Checkpoint - Performance Optimization Complete
  - Ensure all performance tests pass
  - Verify FPS remains ≥30 across all interactions
  - Check Core Web Vitals meet targets: LCP ≤2.5s, CLS ≤0.1
  - Ask the user if questions arise about performance optimization

- [ ] 18. Implement Accessibility Features
  - [ ] 18.1 Add contrast ratio validation
    - Ensure neumorphic and glassmorphic text maintains ≥4.5:1 for <18pt, ≥3:1 for ≥18pt
    - Implement dynamic contrast checking and adjustment
    - _Requirements: 14.1_
  
  - [ ]* 18.2 Write property tests for accessibility
    - **Property 42: Text Contrast Compliance** - Verify contrast ratios meet WCAG requirements
    - **Property 43: Reduced Motion Compliance** - Test motion path/scale/rotation disable
    - **Property 44: Keyboard Navigation Support** - Validate Tab/Arrow/Plus/Minus/Escape keys
    - **Property 45: WebGL Fallback Content** - Test text description presence
    - **Property 46: ARIA Label Presence** - Verify ARIA labels on unlabeled interactive elements
    - **Property 47: Focus Indicator Specifications** - Test 2px border, ≥3:1 contrast
    - **Property 48: Focus Trap for 3D Controls** - Validate focus trap until Escape
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7**


  - [ ] 18.3 Implement prefers-reduced-motion handling
    - Detect prefers-reduced-motion preference
    - Disable all animations involving motion paths, scaling, or rotation
    - Maintain instant state changes for accessibility
    - _Requirements: 14.2_
  
  - [ ] 18.4 Add focus indicators
    - Apply 2px border width focus indicators with ≥3:1 contrast on all interactive elements
    - Ensure visible focus state for keyboard navigation
    - _Requirements: 14.6_
  
  - [ ] 18.5 Add ARIA labels and alt text
    - Provide ARIA labels for all WebGL scenes and custom interactive elements without visible text
    - Add text-based descriptions for 3D content as fallback
    - _Requirements: 14.4, 14.5_

- [ ] 19. Implement Cross-Browser Compatibility
  - [ ] 19.1 Add vendor prefixes and feature detection
    - Implement vendor prefixes for backdrop-filter and other CSS properties requiring them
    - Add feature detection for WebGL, WebXR, and CSS features
    - _Requirements: 15.8_
  
  - [ ]* 19.2 Write property tests for browser compatibility
    - **Property 49: WebGL Detection** - Test WebGL support detection before rendering
    - **Property 50: WebGL Conditional Rendering** - Verify 3D render when available, fallback otherwise
    - **Property 51: Graceful CSS Degradation** - Test content render without effects when features unavailable
    - **Validates: Requirements 15.4, 15.5, 15.6, 15.7**
  
  - [ ] 19.3 Implement graceful degradation
    - Render content without visual effects when CSS features unavailable
    - Maintain layout structure and readability in all scenarios
    - Display static fallback for WebGL when unavailable
    - _Requirements: 15.6, 15.7_
  
  - [ ] 19.4 Add browser-specific adjustments
    - Test and adjust rendering for Chrome, Firefox, Safari, and Edge (2 most recent versions)
    - Ensure layout positioning within 2px and color values within 5% variance
    - _Requirements: 15.1, 15.2, 15.3, 15.9_

- [ ] 20. Implement Responsive Behavior Refinements
  - [ ] 20.1 Add mobile-specific optimizations
    - Reduce neumorphic shadow blur by 30% on mobile (<768px)
    - Reduce glassmorphic backdrop blur by 25% on mobile
    - Disable hover effects on touch devices (pointer: coarse)
    - _Requirements: 3.1, 3.10_
  
  - [ ]* 20.2 Write property tests for responsive behavior
    - **Property 8: Responsive Text Proportion** - Test heading/body ratio and spacing within variance
    - **Property 9: Touch Target Sizing** - Verify 44x44px minimum on pointer: coarse
    - **Property 10: Touch Device Hover Disable** - Test hover disable and alternative feedback
    - **Validates: Requirements 3.4, 3.6, 3.10**


  - [ ] 20.3 Add tablet-specific styles
    - Apply intermediate shadow and blur values between mobile and desktop (768-1024px)
    - Ensure smooth transitions between breakpoints (≤300ms)
    - _Requirements: 3.2, 3.7_
  
  - [ ] 20.4 Optimize breakpoint transitions
    - Complete layout adjustments within 300ms when crossing breakpoint thresholds
    - Prevent content reflow causing CLS >0.1
    - Maintain ≥30 FPS during transitions
    - _Requirements: 3.7, 3.8, 3.9_

- [ ] 21. Final Integration and Testing
  - [ ] 21.1 Create integration test suite
    - Test page transition timing in Next.js routing context
    - Test hover and click micro-interactions across components
    - Test breakpoint transitions and CLS measurement
    - Test WebGL scene initialization and rendering performance
    - _Requirements: All integration requirements_
  
  - [ ] 21.2 Run full property-based test suite
    - Execute all 51 property tests with minimum 100 iterations each
    - Verify all properties pass consistently
    - Document any edge cases discovered
  
  - [ ] 21.3 Verify Core Web Vitals
    - Measure DOMContentLoaded (target: ≤1500ms)
    - Measure Largest Contentful Paint (target: ≤2.5s)
    - Measure Cumulative Layout Shift (target: ≤0.1)
    - Test WebGL initialization timing (target: ≤2000ms)
    - _Requirements: 13.1, 13.8, 4.2_
  
  - [ ] 21.4 Cross-browser testing
    - Test rendering and functionality on Chrome, Firefox, Safari, Edge (latest 2 versions)
    - Verify layout positioning within 2px variance
    - Verify color values within 5% variance
    - Test WebGL support detection and fallback behavior
    - _Requirements: 15.1, 15.2, 15.3, 15.9_

- [ ] 22. Documentation and Polish
  - [ ] 22.1 Create design system documentation
    - Document all design tokens with examples
    - Document neumorphic and glassmorphic component usage
    - Document animation variants and patterns
    - Include at least 2 examples for each component category
    - _Requirements: 12.7_
  
  - [ ] 22.2 Create implementation guide
    - Document how to use design system tokens in new components
    - Document animation integration patterns
    - Document WebGL scene integration
    - Document responsive and accessibility best practices
  
  - [ ] 22.3 Final polish and refinement
    - Review all components for visual consistency
    - Optimize any remaining performance bottlenecks
    - Address any edge cases discovered during testing

- [ ] 23. Final Checkpoint - Complete Implementation
  - Ensure all tests pass (unit, property-based, integration)
  - Verify Core Web Vitals meet targets
  - Verify accessibility compliance (WCAG 2.1 AA)
  - Verify cross-browser compatibility
  - Ask the user if questions arise or final adjustments needed


## Notes

- **Tasks marked with `*` are optional** and can be skipped for faster MVP delivery. These are primarily property-based test tasks.
- **Each task references specific requirements** from the requirements document for traceability.
- **Checkpoints ensure incremental validation** at major milestones (tasks 4, 9, 13, 17, 23).
- **Property tests validate universal correctness properties** defined in the design document (51 total properties).
- **Unit tests and integration tests** validate specific examples, edge cases, and browser-specific behaviors.
- **All property tests must run with minimum 100 iterations** to ensure comprehensive coverage.
- **Design uses TypeScript** with Next.js, React Three Fiber, and Framer Motion as the core technology stack.
- **The project already has required dependencies** (Three.js 0.180.0, @react-three/fiber 9.3.0, motion 12.23.12) installed.
- **Implementation follows incremental approach**: Foundation → Components → 3D → Animation → Performance → Accessibility.
- **Each wave of tasks can be executed in parallel**, while tasks in later waves depend on earlier waves completing.
- **Testing frameworks**: Vitest for unit/integration tests, fast-check for property-based tests.
- **Accessibility is priority**: All components must support keyboard navigation, screen readers, and reduced motion preferences.
- **Performance targets**: 60 FPS on capable devices, 30 FPS minimum, LCP ≤2.5s, CLS ≤0.1.
- **Browser support**: Chrome, Firefox, Safari, Edge (latest 2 major versions each).

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "2.3", "3.1", "3.3"]
    },
    {
      "id": 2,
      "tasks": ["2.2", "3.2", "5.1"]
    },
    {
      "id": 3,
      "tasks": ["5.2", "5.3", "6.1"]
    },
    {
      "id": 4,
      "tasks": ["6.2", "6.3", "6.4", "7.1"]
    },
    {
      "id": 5,
      "tasks": ["7.2", "7.3", "8.1"]
    },
    {
      "id": 6,
      "tasks": ["8.2", "8.3", "10.1"]
    },
    {
      "id": 7,
      "tasks": ["10.2", "10.3", "11.1"]
    },
    {
      "id": 8,
      "tasks": ["11.2", "11.3", "12.1"]
    },
    {
      "id": 9,
      "tasks": ["12.2", "12.3", "14.1", "14.2"]
    },
    {
      "id": 10,
      "tasks": ["14.3", "14.4", "14.5"]
    },
    {
      "id": 11,
      "tasks": ["14.6", "15.1"]
    },
    {
      "id": 12,
      "tasks": ["15.2", "15.3", "16.1"]
    },
    {
      "id": 13,
      "tasks": ["16.2", "16.3", "16.4", "18.1"]
    },
    {
      "id": 14,
      "tasks": ["18.2", "18.3", "18.4", "18.5", "19.1"]
    },
    {
      "id": 15,
      "tasks": ["19.2", "19.3", "19.4", "20.1"]
    },
    {
      "id": 16,
      "tasks": ["20.2", "20.3", "20.4"]
    },
    {
      "id": 17,
      "tasks": ["21.1", "21.2", "21.3", "21.4"]
    },
    {
      "id": 18,
      "tasks": ["22.1", "22.2", "22.3"]
    }
  ]
}
```
