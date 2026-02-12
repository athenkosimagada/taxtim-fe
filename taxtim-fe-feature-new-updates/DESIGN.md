# TaxTim Design System

This document defines the design principles, color palette, spacing, and utility classes used throughout the TaxTim project. All developers must adhere to these guidelines to ensure a consistent user experience.

---

## Color Palette

### Primary Colors

| Name | Hex Code | CSS Variable | Tailwind Class | Usage |
|------|----------|--------------|----------------|-------|
| **Primary Green** | `#16a34a` | `--color-primary` | `bg-primary`, `text-primary` | Primary actions, success states, brand identity |
| **Primary Green Dark** | `#15803d` | `--color-primary-dark` | `bg-primary-dark`, `text-primary-dark` | Hover states, active states |
| **Primary Green Light** | `#22c55e` | `--color-primary-light` | `bg-primary-light`, `text-primary-light` | Backgrounds, highlights |

### Neutral Colors

| Name | Hex Code | CSS Variable | Tailwind Class | Usage |
|------|----------|--------------|----------------|-------|
| **White** | `#ffffff` | `--color-white` | `bg-white`, `text-white` | Backgrounds, text on dark |
| **Gray 50** | `#f9fafb` | `--color-gray-50` | `bg-gray-50` | Page backgrounds |
| **Gray 100** | `#f3f4f6` | `--color-gray-100` | `bg-gray-100` | Card backgrounds |
| **Gray 200** | `#e5e7eb` | `--color-gray-200` | `border-gray-200` | Borders, dividers |
| **Gray 300** | `#d1d5db` | `--color-gray-300` | `border-gray-300` | Input borders |
| **Gray 500** | `#6b7280` | `--color-gray-500` | `text-gray-500` | Secondary text |
| **Gray 700** | `#374151` | `--color-gray-700` | `text-gray-700` | Primary text |
| **Gray 900** | `#111827` | `--color-gray-900` | `text-gray-900` | Headings |

### Semantic Colors

| Name | Hex Code | CSS Variable | Tailwind Class | Usage |
|------|----------|--------------|----------------|-------|
| **Error Red** | `#dc2626` | `--color-error` | `bg-error`, `text-error` | Error messages, destructive actions |
| **Error Red Light** | `#fef2f2` | `--color-error-light` | `bg-error-light` | Error backgrounds |
| **Error Red Dark** | `#b91c1c` | `--color-error-dark` | `text-error-dark` | Error hover states |

---

## Spacing System

We use a consistent 4px base unit spacing system. **Do not use arbitrary values.**

### Standard Spacing Scale

| Token | Value | CSS Variable | Tailwind Class | Usage |
|-------|-------|--------------|----------------|-------|
| `xs` | 4px | `--spacing-xs` | `p-1`, `m-1` | Tight spacing, icon gaps |
| `sm` | 8px | `--spacing-sm` | `p-2`, `m-2` | Compact elements |
| `md` | 16px | `--spacing-md` | `p-4`, `m-4` | Default component padding |
| `lg` | 24px | `--spacing-lg` | `p-6`, `m-6` | Section spacing |
| `xl` | 32px | `--spacing-xl` | `p-8`, `m-8` | Large section gaps |
| `2xl` | 48px | `--spacing-2xl` | `p-12`, `m-12` | Page-level spacing |
| `3xl` | 64px | `--spacing-3xl` | `p-16`, `m-16` | Hero sections |

### Padding Guidelines

- **Buttons**: `px-4 py-2` (horizontal: 16px, vertical: 8px)
- **Cards**: `p-4` or `p-6` (16px or 24px)
- **Form inputs**: `px-3 py-2` (horizontal: 12px, vertical: 8px)
- **Sections**: `py-12` or `py-16` (48px or 64px vertical)
- **Container**: `px-4` on mobile, `px-6` on tablet, `px-8` on desktop

### Margin Guidelines

- **Between form fields**: `mb-4` (16px)
- **Between sections**: `mb-8` or `mb-12` (32px or 48px)
- **Between paragraphs**: `mb-4` (16px)
- **Between headings and content**: `mb-6` (24px)

---

## Border Guidelines

### Border Widths

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| Default | 1px | `border` | Standard borders |
| Medium | 2px | `border-2` | Emphasis, focus states |

### Border Radius

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `sm` | 4px | `rounded-sm` | Subtle rounding |
| `md` | 6px | `rounded-md` | Buttons, inputs |
| `lg` | 8px | `rounded-lg` | Cards, modals |
| `full` | 9999px | `rounded-full` | Pills, avatars |

### Border Colors

- **Default borders**: `border-gray-200` or `border-gray-300`
- **Focus borders**: `border-primary` (green)
- **Error borders**: `border-error` (red)
- **Dividers**: `border-gray-200`

### Standard Border Patterns

```html
<!-- Card -->
<div class="border border-gray-200 rounded-lg">

<!-- Input (default) -->
<input class="border border-gray-300 rounded-md">

<!-- Input (focus) -->
<input class="border border-gray-300 rounded-md focus:border-primary focus:ring-0">

<!-- Input (error) -->
<input class="border border-error rounded-md">
```

---

## Animation Policy

### ⚠️ NO ANIMATIONS ALLOWED

To maintain a professional, distraction-free user experience, **animations are strictly prohibited** unless explicitly approved.

#### Forbidden

- ❌ CSS transitions on colors, backgrounds, or shadows
- ❌ Transform animations (scale, rotate, translate)
- ❌ Keyframe animations
- ❌ Loading spinners with complex animations
- ❌ Hover effects that animate properties
- ❌ Page transition animations

#### Allowed (Minimal)

- ✅ Immediate state changes (no transition duration)
- ✅ Simple opacity changes for showing/hiding elements (max 150ms)
- ✅ Focus ring appearance (browser default or instant)

#### Implementation

Always set transition to none or remove transition classes:

```css
/* DO NOT USE */
.button {
  transition: all 0.3s ease;
}

/* USE THIS */
.button {
  transition: none;
}
```

---

## Utility Class Usage

### How to Apply Colors

```html
<!-- Primary button -->
<button class="bg-primary text-white hover:bg-primary-dark">
  Submit
</button>

<!-- Secondary button -->
<button class="bg-white text-primary border border-primary hover:bg-gray-50">
  Cancel
</button>

<!-- Error message -->
<p class="text-error">This field is required</p>

<!-- Error alert -->
<div class="bg-error-light border border-error text-error-dark p-4 rounded-md">
  Error message here
</div>
```

### How to Apply Spacing

```html
<!-- Card with standard padding -->
<div class="p-6 mb-4">

<!-- Form field group -->
<div class="mb-4">
  <label class="mb-2 block">Label</label>
  <input class="px-3 py-2">
</div>

<!-- Section -->
<section class="py-12 px-4 md:px-6 lg:px-8">
```

### How to Apply Borders

```html
<!-- Standard card -->
<div class="border border-gray-200 rounded-lg p-6">

<!-- Divider -->
<hr class="border-t border-gray-200 my-6">

<!-- Focus input -->
<input class="border border-gray-300 rounded-md focus:border-primary focus:outline-none">
```

---

## Quick Reference

### Component Recipes

#### Primary Button
```html
<button class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
```

#### Secondary Button
```html
<button class="bg-white text-primary border border-primary px-4 py-2 rounded-md hover:bg-gray-50">
```

#### Danger Button
```html
<button class="bg-error text-white px-4 py-2 rounded-md hover:bg-error-dark">
```

#### Input Field
```html
<input class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-primary focus:outline-none">
```

#### Card
```html
<div class="bg-white border border-gray-200 rounded-lg p-6">
```

#### Error Message
```html
<p class="text-error text-sm mt-1">Error message</p>
```

#### Error Alert Box
```html
<div class="bg-error-light border border-error text-error-dark p-4 rounded-md">
```

---

## File Structure

- `src/index.css` - Contains CSS variables and custom utility classes
- `tailwind.config.js` - Tailwind configuration with custom theme colors

---