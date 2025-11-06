# Dynasty App - Style Guide

## Color Palette

### Primary Colors
- **Blue**: `#2563eb` (primary, trust, reliability)
  - Light: `#60a5fa` / `#93c5fd`
  - Dark: `#1d4ed8` / `#1e40af`
- **Amber**: `#f59e0b` (secondary accent, energy, action)
  - Light: `#fcd34d` / `#fde047`
  - Dark: `#d97706` / `#b45309`

### Neutral Colors
- **Black**: `#000000` (background, main)
- **Zinc**: `#27272a` to `#fafafa` (text, dividers, secondary)
  - Dark backgrounds: `#18181b` to `#3f3f46`
  - Light backgrounds: `#f4f4f5` to `#fafafa`

### Semantic Colors
- **Success/Starter**: `#10b981` (green, highlights active players)
- **Error**: `#ef4444` (red, validation, errors)

## Typography

### Font Stack
- **Primary**: "Geist Sans" (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- **Monospace**: "Geist Mono" (code, numbers)

### Text Sizes & Weights
- **Display (H1)**: 56-84px, font-black (900)
- **Headline (H2)**: 32-48px, font-bold (700)
- **Subheading (H3-H4)**: 20-28px, font-semibold (600)
- **Body**: 16px, font-normal (400)
- **Small**: 12-14px, font-medium (500)
- **Tiny**: 10-12px, font-bold (700)

## Component Guidelines

### Landing Page
- Dark background (`bg-black`)
- Gradient backdrop (blue → amber, 20% opacity)
- Large, bold headline with gradient text
- Center-aligned content on full viewport height
- Glowing input with animated border effect on hover
- Full-width CTA button with scale animation on hover

### League View
- Dark cards with subtle borders
- Gradient borders and backgrounds for depth
- Player cards organized by position
- Starters: Green gradient with ring effect
- Benched: Zinc background with hover states
- Back button for navigation

### Buttons
- **Primary**: Blue-to-Amber gradient
  - Hover: Lighter blue-to-amber with 5% scale
  - Disabled: Reduced opacity (50%)
- **Secondary**: Outline or zinc background
- Always: Transition effects, clear states

### Inputs
- Dark background with subtle borders
- Focus ring in blue (`ring-blue-500`)
- Placeholder text in zinc
- Glow effect on parent container on hover

### Cards
- `bg-zinc-900/50` or `bg-gradient-to-br from-zinc-900/50 to-black`
- `border border-zinc-800` with hover darkening
- Rounded corners: `rounded-lg` (8px) to `rounded-xl` (12px)
- Padding: `p-3` (small), `p-4` (medium), `p-6` (large)

## Spacing & Layout

### Margins & Padding
- **Extra Small**: 2px, 4px
- **Small**: 8px (gap-2, p-2)
- **Medium**: 16px (gap-4, p-4)
- **Large**: 24px (gap-6, p-6)
- **Extra Large**: 32px (py-32)

### Grid & Gaps
- Player grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2`
- Roster sections: `space-y-6`
- Position groups: `space-y-3`

### Container Widths
- Max width: `max-w-6xl`
- Padding: `px-4` on mobile, inherent on desktop

## Animations & Transitions

- **Duration**: 200ms standard, 300ms for emphasis
- **Easing**: Default (ease-out)
- **Hover effects**:
  - Scale: `hover:scale-105`
  - Shadow: `hover:shadow-xl`
  - Color: `hover:text-white`, `hover:bg-zinc-700`
- **Loading**: Spinning border animation

## Accessibility

- **Color contrast**: WCAG AA minimum (7:1 for text)
- **Focus states**: Always visible, blue ring
- **Semantic HTML**: Form elements properly labeled
- **Loading states**: Spinner + text feedback

## Dark Mode

- Entire app is dark-first design
- No light mode toggle currently
- Consistent use of zinc and opacity for hierarchy
- Amber/Blue remain consistent in darkness

## UI Patterns

### Player Cards
- Compact size (2-5 per row depending on screen)
- Center-aligned text
- Show: Player initials + last name, team abbreviation
- Starter indicator: Green background + star symbol
- Hover state: Slightly lighter background

### Roster Cards
- Large heading with team identifier
- Record and points summary
- Multiple position sections stacked vertically
- Subtle borders and gradient backgrounds

### Loading States
- Spinning border animation
- Text updates to "Loading..."
- Button disabled, opacity reduced
- Inline error messages below form
