# Design System Components

This directory contains the modern design system components implementing Neumorphism and Glassmorphism design patterns.

## Components

### NeumorphicButton

A button component featuring neumorphic design with soft shadows and tactile depth.

#### Features

- **Raised/Pressed States**: Visual feedback using dual shadows (highlight and shadow) with 145-degree light source angle
- **Spring Physics Animations**: Smooth interactions with configurable stiffness (200-400) and damping (15-30)
- **Touch-Friendly**: Minimum 44x44px touch targets on touch devices for accessibility
- **Responsive**: Automatically adjusts shadow blur based on breakpoint (mobile: -30%, tablet: -15%, desktop: full)
- **Accessible**: Respects `prefers-reduced-motion` preference, supports keyboard navigation, and forwards refs

#### Usage

```tsx
import { NeumorphicButton } from '@/app/components/design-system';

// Basic usage
<NeumorphicButton>Click me</NeumorphicButton>

// Raised variant (default)
<NeumorphicButton variant="raised">Raised Button</NeumorphicButton>

// Pressed variant
<NeumorphicButton variant="pressed">Pressed Button</NeumorphicButton>

// Different sizes
<NeumorphicButton size="sm">Small</NeumorphicButton>
<NeumorphicButton size="md">Medium</NeumorphicButton>
<NeumorphicButton size="lg">Large</NeumorphicButton>

// Full width
<NeumorphicButton fullWidth>Full Width Button</NeumorphicButton>

// Disabled state
<NeumorphicButton disabled>Disabled</NeumorphicButton>

// With event handlers
<NeumorphicButton onClick={() => console.log('clicked')}>
  Interactive
</NeumorphicButton>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'raised' \| 'pressed'` | `'raised'` | Visual state of the button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant of the button |
| `fullWidth` | `boolean` | `false` | Whether button takes full width |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| ...rest | `ButtonHTMLAttributes` | - | All standard button props |

#### Requirements Met

- **Requirement 1.6**: Hover transitions within 200ms
- **Requirement 1.7**: Active state transitions within 100ms
- **Requirement 3.6**: Minimum 44x44px touch target for touch devices
- **Requirement 11.5**: Spring physics with stiffness 200-400 and damping 15-30

#### Design Tokens Used

The component uses design tokens from `@/app/lib/design-tokens`:

- `neumorphism.lightSourceAngle`: 145 degrees
- `neumorphism.shadow.blurMax`: 30px (adjusted for breakpoints)
- `neumorphism.shadow.opacity`: 0.15
- `neumorphism.highlight.opacity`: 0.1
- `neumorphism.transition.hover`: 200ms
- `neumorphism.transition.active`: 100ms

#### Responsive Behavior

The button automatically adapts to different screen sizes:

- **Mobile (<768px)**: Shadow blur reduced by 30%
- **Tablet (768-1024px)**: Shadow blur reduced by 15%
- **Desktop (≥1024px)**: Full shadow effects

On touch devices (`pointer: coarse`), small buttons automatically expand to 44x44px minimum.

#### Accessibility

- Fully keyboard accessible (Tab, Enter, Space)
- Respects `prefers-reduced-motion` preference
- Proper disabled state with visual and semantic feedback
- Forwards refs for advanced use cases
- Supports all ARIA attributes

#### Animation Details

The button uses Framer Motion's spring physics for natural, physics-based animations:

- **Spring Config**: `{ stiffness: 300, damping: 20 }`
- **Hover Scale**: 1.02x (slightly enlarges)
- **Active Scale**: 0.98x (slightly shrinks)
- **Shadow Enhancement**: Shadow intensity increases on hover

When `prefers-reduced-motion` is enabled, all animations are disabled and only CSS transitions remain.

## Examples

See `NeumorphicButton.example.tsx` for a comprehensive showcase of all button variations and states.

## Testing

Tests are located in `NeumorphicButton.test.tsx` and cover:

- Rendering with different variants and sizes
- Touch target minimum size requirements
- Spring physics animation configuration
- Responsive behavior across breakpoints
- Shadow style application
- Accessibility features
- Transition timing

Run tests with:

```bash
npm test -- app/components/design-system/NeumorphicButton.test.tsx
```

### GlassCard

A glassmorphism component featuring transparency, backdrop blur, and layered depth effects with dynamic opacity adjustment.

#### Features

- **Backdrop Blur**: Three blur strength levels (low: 8px, medium: 16px, high: 24px)
- **Dynamic Opacity**: Automatically adjusts opacity based on background luminance to maintain text contrast
- **Z-Index Layering**: Supports layering with z-index increments of 10 for depth effects
- **Responsive**: Blur reduces by 25% on mobile, 12.5% on tablet
- **Entrance Animation**: Smooth fade-in and slide-up animation (0.6s duration)
- **Design Token Integration**: All styling values from design tokens

#### Usage

```tsx
import { GlassCard } from '@/app/components/design-system';

// Basic usage
<GlassCard>
  <p>Content with glassmorphism effect</p>
</GlassCard>

// Blur strength variants
<GlassCard blurStrength="low">Subtle blur (8px)</GlassCard>
<GlassCard blurStrength="medium">Medium blur (16px)</GlassCard>
<GlassCard blurStrength="high">Strong blur (24px)</GlassCard>

// Custom opacity
<GlassCard opacity={0.2}>Higher opacity</GlassCard>

// Z-index layering
<GlassCard zIndex={10}>Back layer</GlassCard>
<GlassCard zIndex={20}>Front layer</GlassCard>

// Disable dynamic opacity adjustment
<GlassCard dynamicOpacity={false}>Static opacity</GlassCard>

// No animation
<GlassCard noAnimation>Instant appearance</GlassCard>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blurStrength` | `'low' \| 'medium' \| 'high'` | `'medium'` | Backdrop blur intensity |
| `zIndex` | `number` | `10` | Z-index for layering (use increments of 10) |
| `opacity` | `number` | `0.1` | Background opacity (0.05-0.3) |
| `dynamicOpacity` | `boolean` | `true` | Enable automatic opacity adjustment |
| `noAnimation` | `boolean` | `false` | Disable entrance animation |
| ...rest | `HTMLAttributes<HTMLDivElement>` | - | All standard div props |

#### Requirements Met

- **Requirement 2.1**: Background opacity between 0.05 and 0.3
- **Requirement 2.2**: Backdrop-filter blur between 8px and 24px
- **Requirement 2.3**: Z-index layering in increments of 10, shadow blur 20-40px
- **Requirement 2.5**: Dynamic opacity adjustment when luminance <0.3
- **Requirement 2.6**: Border highlights and box-shadow glow
- **Requirement 12.3**: Exclusive use of design tokens

#### Design Tokens Used

- `glassmorphism.blur.min`: 8px
- `glassmorphism.blur.max`: 24px
- `glassmorphism.background.opacityMin`: 0.05
- `glassmorphism.background.opacityMax`: 0.3
- `glassmorphism.border.opacity`: 0.2
- `glassmorphism.shadow.blur`: 30px

#### Dynamic Opacity Adjustment

The component automatically increases opacity when the background luminance is below 0.3 to maintain minimum 4.5:1 text contrast ratio (WCAG AA compliance). This ensures text remains readable regardless of background darkness.

### GlassPanel

A simpler glassmorphism variant with preset blur configurations and fade-in animations. Ideal for content overlays and information panels.

#### Features

- **Preset Blur Levels**: Simple low/medium/high blur presets
- **Fade-In Animation**: Elegant 0.6s fade-in with configurable delay
- **Opacity Clamping**: Automatically clamps opacity to design token range
- **Responsive**: Same blur reduction as GlassCard (25% mobile, 12.5% tablet)
- **Simpler Styling**: Lighter shadow and smaller border radius than GlassCard

#### Usage

```tsx
import { GlassPanel } from '@/app/components/design-system';

// Basic usage
<GlassPanel>
  <p>Simple glass panel</p>
</GlassPanel>

// Blur presets
<GlassPanel blurStrength="low">8px blur</GlassPanel>
<GlassPanel blurStrength="medium">16px blur</GlassPanel>
<GlassPanel blurStrength="high">24px blur</GlassPanel>

// Custom opacity (auto-clamped to 0.05-0.3)
<GlassPanel opacity={0.25}>Custom opacity</GlassPanel>

// Staggered animation
<GlassPanel delay={0}>First panel</GlassPanel>
<GlassPanel delay={0.1}>Second panel</GlassPanel>
<GlassPanel delay={0.2}>Third panel</GlassPanel>

// No animation
<GlassPanel noAnimation>Static panel</GlassPanel>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blurStrength` | `'low' \| 'medium' \| 'high'` | `'medium'` | Backdrop blur preset |
| `opacity` | `number` | `0.15` | Background opacity (auto-clamped) |
| `noAnimation` | `boolean` | `false` | Disable fade-in animation |
| `delay` | `number` | `0` | Animation delay in seconds |
| ...rest | `HTMLAttributes<HTMLDivElement>` | - | All standard div props |

#### Requirements Met

- **Requirement 2.1**: Background opacity between 0.05 and 0.3
- **Requirement 2.2**: Backdrop-filter blur, entrance animations with 0.6s duration

#### Differences from GlassCard

| Feature | GlassCard | GlassPanel |
|---------|-----------|------------|
| Border Radius | 16px | 12px |
| Default Opacity | 0.1 | 0.15 |
| Box Shadow | `0 8px 30px` | `0 4px 16px` |
| Dynamic Opacity | Yes | No |
| Z-Index Support | Yes | No |
| Animation | Fade + Slide | Fade only |

Use **GlassCard** for complex layered layouts requiring dynamic opacity adjustment. Use **GlassPanel** for simpler overlays and content panels.

## Examples

- `NeumorphicButton.example.tsx` - Comprehensive button showcase
- `GlassCard.example.tsx` - GlassCard variations and use cases
- `GlassPanel.example.tsx` - GlassPanel variations and use cases

## Testing

Tests are located in the same directory with `.test.tsx` suffix:

- `NeumorphicButton.test.tsx` - Button component tests
- `GlassCard.test.tsx` - GlassCard component tests
- `GlassPanel.test.tsx` - GlassPanel component tests

Run all tests:

```bash
npm test -- app/components/design-system
```

Run specific test:

```bash
npm test -- app/components/design-system/GlassCard.test.tsx
```

## Future Components

Planned components for this design system:

- [ ] NeumorphicCard (Task 2.1)
- [x] GlassCard (Task 3.1) ✅
- [x] GlassPanel (Task 3.3) ✅
- [ ] Additional neumorphic form inputs
- [ ] Glassmorphic navigation components
