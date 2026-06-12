# Design Token System and Core Infrastructure

This directory contains the core design system infrastructure including design tokens, responsive management, and utility functions.

## Files

- `design-tokens.ts` - Design token definitions (neumorphism, glassmorphism, spacing, blur, etc.)
- `responsive-manager.ts` - Responsive breakpoint tracking and device detection
- `utils.ts` - Utility functions (cn for className merging)

## Design Tokens

### Usage in TypeScript

```typescript
import { designTokens, getSpacing, getBlur } from '@/lib/design-tokens';

// Access token values
const shadowBlur = designTokens.neumorphism.shadow.blurMax; // 30
const glassBlur = designTokens.glassmorphism.blur.min; // 8

// Use helper functions
const spacing = getSpacing(4); // 16px
const blur = getBlur(3); // 12px
```

### Usage in CSS/Styled Components

```typescript
import { cssVars } from '@/lib/design-tokens';

const styles = {
  boxShadow: `0 4px 8px rgba(0, 0, 0, ${cssVars.neuroShadowOpacity})`,
  backdropFilter: `blur(${cssVars.glassBlurMax})`,
  padding: cssVars.space(4), // var(--space-4)
};
```

### Using CSS Custom Properties Directly

```css
.my-component {
  box-shadow: 
    calc(-1 * var(--neuro-shadow-blur-min)) calc(-1 * var(--neuro-shadow-blur-min)) var(--neuro-shadow-blur-max) rgba(255, 255, 255, var(--neuro-highlight-opacity)),
    var(--neuro-shadow-blur-min) var(--neuro-shadow-blur-min) var(--neuro-shadow-blur-max) rgba(0, 0, 0, var(--neuro-shadow-opacity));
  
  backdrop-filter: blur(var(--glass-blur-max));
  padding: var(--space-4);
}
```

## Responsive Manager

### Setup

Wrap your application with the `ResponsiveProvider`:

```typescript
import { ResponsiveProvider } from '@/lib/responsive-manager';

export default function RootLayout({ children }) {
  return (
    <ResponsiveProvider>
      {children}
    </ResponsiveProvider>
  );
}
```

### Using Responsive Hooks

```typescript
import {
  useResponsive,
  useBreakpoint,
  useIsTouch,
  usePrefersReducedMotion,
  useViewportSize,
  getAdjustedBlur,
  getAdjustedShadowBlur,
} from '@/lib/responsive-manager';

function MyComponent() {
  // Get all responsive info
  const { breakpoint, isTouch, prefersReducedMotion, viewportWidth, viewportHeight } = useResponsive();
  
  // Or use specific hooks
  const breakpoint = useBreakpoint(); // 'mobile' | 'tablet' | 'desktop'
  const isTouch = useIsTouch(); // boolean
  const prefersReducedMotion = usePrefersReducedMotion(); // boolean
  const { width, height } = useViewportSize(); // { width: number, height: number }
  
  // Adjust values based on breakpoint
  const blurValue = getAdjustedBlur(24, breakpoint); // Auto-reduces for mobile/tablet
  const shadowBlur = getAdjustedShadowBlur(30, breakpoint); // Auto-reduces for mobile/tablet
  
  return (
    <div>
      {breakpoint === 'mobile' && <p>Mobile view</p>}
      {isTouch && <p>Touch device</p>}
      {prefersReducedMotion && <p>Reduced motion enabled</p>}
    </div>
  );
}
```

## Design Token Categories

### Neumorphism Tokens

- **Light Source Angle**: 145 degrees (consistent across all neumorphic elements)
- **Shadow Blur**: 10px - 30px range
- **Shadow Spread**: -5px - 5px range
- **Shadow Opacity**: 0.15
- **Highlight Opacity**: 0.1
- **Transitions**: 200ms (hover), 100ms (active)

### Glassmorphism Tokens

- **Background Opacity**: 0.05 - 0.3 range
- **Backdrop Blur**: 8px - 24px range
- **Border Opacity**: 0.2
- **Shadow Blur**: 30px

### Spacing Scale

Values in pixels: `[0, 4, 8, 12, 16, 24, 32, 48, 64, 96]`

Access via: `designTokens.spacing[index]` or `getSpacing(index)`

### Blur Scale

Values in pixels: `[0, 4, 8, 12, 16, 20, 24]`

Access via: `designTokens.blur[index]` or `getBlur(index)`

### Shadow Levels

- Level 0: `none`
- Level 1: `0 2px 4px rgba(0, 0, 0, 0.1)`
- Level 2: `0 4px 8px rgba(0, 0, 0, 0.15)`
- Level 3: `0 8px 16px rgba(0, 0, 0, 0.2)`

Access via: `designTokens.shadowLevels[index]` or `getShadowLevel(index)`

## Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

## Responsive Adjustments

The design system automatically adjusts visual properties based on the current breakpoint:

### Mobile (< 768px)
- Neumorphism shadow blur reduced by 30%
- Glassmorphism backdrop blur reduced by 25%
- Hover effects disabled on touch devices
- Minimum touch target size: 44x44px

### Tablet (768px - 1024px)
- Neumorphism shadow blur reduced by 15%
- Glassmorphism backdrop blur reduced by 12.5%
- Intermediate values between mobile and desktop

### Desktop (≥ 1024px)
- Full visual effects
- All hover interactions enabled

## Testing

Run tests with:

```bash
npm run test          # Watch mode
npm run test:run      # Run once
npm run test:coverage # With coverage report
npm run test:ui       # With UI
```

## Requirements Fulfilled

This implementation satisfies the following requirements:

- **12.1**: Design system provides style tokens as CSS custom properties and JavaScript constants
- **12.2**: Minimum token categories defined (blur, spacing, shadows)
- **3.10**: Responsive behavior adapts to breakpoints and touch devices
- **14.2**: Reduced motion preferences detected and provided to components

## Next Steps

1. Create Neumorphism component system (Task 2)
2. Create Glassmorphism component system (Task 3)
3. Integrate with existing components
4. Add WebGL and animation frameworks
