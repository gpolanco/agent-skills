---
name: tailwind-4
description: >
  Guides AI agents in Tailwind CSS v4 utility-first styling, responsive design, and modern patterns.
  Trigger: When styling with Tailwind (className, variants, cn()), especially when dynamic styling or CSS variables are involved (no var() in className).
license: Apache-2.0
metadata:
  author: devcontext
  version: "1.0.0"
  scope: [root]
  auto_invoke: "Styling with Tailwind"
allowed-tools: Read
---

## When to Use

Use this skill when:

- Styling components with Tailwind CSS
- Creating responsive layouts
- Implementing dark mode
- Configuring Tailwind theme
- Building design systems
- Optimizing utility classes

---

## REQUIRED Patterns

### Pattern 1: Mobile-First Responsive (REQUIRED)

```tsx
// ✅ ALWAYS: Mobile-first, then scale up
<div className="p-4 md:p-6 lg:p-8">

// ❌ NEVER: Desktop-first
<div className="p-8 md:p-6 sm:p-4">
```

### Pattern 2: Semantic Color Tokens (REQUIRED)

```tsx
// ✅ ALWAYS: Use semantic color tokens
<button className="bg-primary text-primary-foreground">

// ❌ NEVER: Hardcoded colors
<button className="bg-blue-500 text-white">
```

### Pattern 3: Component Composition with cn() (REQUIRED)

```tsx
import { cn } from "@/lib/utils";

// ✅ ALWAYS: Use cn() with object syntax for conditionals
<div className={cn(
  "base-styles",
  {
    "primary-styles": variant === "primary",
    "large-styles": size === "lg",
  },
  className
)}>

// ❌ DON'T: Use cn() for static classes (unnecessary)
<div className={cn("flex items-center gap-2")} />

// ✅ DO: Just use className for static
<div className="flex items-center gap-2" />

// ❌ NEVER: String concatenation
<div className={"base " + (active ? "active" : "")}>
```

### Pattern 4: No Arbitrary Values (REQUIRED)

```tsx
// ✅ ALWAYS: Use design system tokens
<div className="w-96 h-64 text-lg">

// ❌ NEVER: Arbitrary values (unless absolutely necessary)
<div className="w-[347px] h-[219px] text-[17px]">
```

### Pattern 5: Never Use var() in className (REQUIRED)

```tsx
// ❌ NEVER: var() in className
<div className="bg-[var(--color-primary)]" />
<div className="text-[var(--text-color)]" />

// ✅ ALWAYS: Use Tailwind semantic classes
<div className="bg-primary" />
<div className="text-foreground" />
```

### Pattern 6: Never Use Hex Colors (REQUIRED)

```tsx
// ❌ NEVER: Hex colors in className
<p className="text-[#ffffff]" />
<div className="bg-[#1e293b]" />

// ✅ ALWAYS: Use Tailwind color classes
<p className="text-white" />
<div className="bg-slate-800" />
```

---

## Styling Decision Tree

```
Tailwind class exists?   → className="..."
Dynamic value?           → style={{ width: `${x}%` }}
Conditional styles?      → cn("base", { "variant": condition })
Static classes only?     → className="..." (no cn() needed)
Library can't use class? → style prop with var() constants
```

---

## Critical Patterns

### Pattern 5: Layout & Spacing

```tsx
// Flexbox
<div className="flex items-center justify-between gap-4">
<div className="flex flex-col space-y-2">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Container
<div className="container mx-auto px-4">

// Spacing scale: 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
<div className="p-4 m-2 gap-6">
```

### Pattern 6: Typography

```tsx
// Text sizing (mobile-first)
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
<p className="text-sm md:text-base text-muted-foreground">

// Font weights: thin, extralight, light, normal, medium, semibold, bold, extrabold, black
<span className="font-semibold">

// Line height
<p className="leading-tight">  // 1.25
<p className="leading-normal"> // 1.5
<p className="leading-relaxed"> // 1.625
```

### Pattern 7: Colors & Theming

```text
// Semantic colors (from design system)
bg-background
text-foreground
bg-primary / text-primary-foreground
bg-secondary / text-secondary-foreground
bg-muted / text-muted-foreground
bg-accent / text-accent-foreground
bg-destructive / text-destructive-foreground
border-border
ring-ring

// State variants
hover:bg-primary/90
focus:ring-2 focus:ring-ring
disabled:opacity-50
```

### Pattern 8: Dark Mode

```tsx
// ✅ ALWAYS: Use class-based dark mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">

// Theme toggle implementation
"use client"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle
    </button>
  )
}
```

---

## Dynamic Values

```tsx
// ✅ style prop for truly dynamic values
<div style={{ width: `${percentage}%` }} />
<div style={{ opacity: isVisible ? 1 : 0 }} />

// ✅ CSS custom properties for theming
<div style={{ "--progress": `${value}%` } as React.CSSProperties} />
```

---

## Style Constants for Libraries

When libraries don't accept className (like Recharts, Chart.js):

```typescript
// ✅ Constants with var() - ONLY for library props
const CHART_COLORS = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  text: "var(--color-text)",
  gridLine: "var(--color-border)",
};

// Usage with Recharts (can't use className)
<XAxis tick={{ fill: CHART_COLORS.text }} />
<CartesianGrid stroke={CHART_COLORS.gridLine} />
```

**Important:** Only use `var()` in the `style` prop or library props that don't support className. Never in `className`.

---

## Responsive Design

### Breakpoint System

```tsx
// Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

// Hide/show at breakpoints
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// Responsive text
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
```

### Container Patterns

```tsx
// Full-width container with max-width
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Section spacing
<section className="py-12 md:py-16 lg:py-24">

// Card container
<div className="rounded-lg border bg-card p-6 shadow-sm">
```

---

## Animation & Transitions

```tsx
// Transitions
<div className="transition-all duration-200 ease-in-out">
<div className="transition-colors hover:bg-accent">

// Transforms
<div className="hover:scale-105 active:scale-95">
<div className="hover:-translate-y-1">

// Opacity
<div className="opacity-0 hover:opacity-100 transition-opacity">

// Animations
<div className="animate-spin">
<div className="animate-pulse">
<div className="animate-bounce">
```

---

## Advanced Patterns

### Group Hover

```tsx
<div className="group cursor-pointer">
  <div className="group-hover:opacity-75 transition">
    <img src="..." />
  </div>
  <h3 className="group-hover:text-primary transition">Title</h3>
</div>
```

### Peer Modifier

```tsx
<input type="checkbox" className="peer sr-only" />
<label className="peer-checked:bg-primary peer-checked:text-primary-foreground">
  Label
</label>
```

### Custom Utilities with @layer

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Anti-Patterns

```tsx
// ❌ DON'T: Desktop-first responsive
<div className="p-8 lg:p-6 md:p-4">

// ✅ DO: Mobile-first
<div className="p-4 md:p-6 lg:p-8">

// ❌ DON'T: Hardcoded colors
<div className="bg-blue-500 text-white">

// ✅ DO: Semantic tokens
<div className="bg-primary text-primary-foreground">

// ❌ DON'T: Inline styles
<div style={{ padding: "16px" }}>

// ✅ DO: Tailwind utilities
<div className="p-4">

// ❌ DON'T: Too many arbitrary values
<div className="w-[347px] h-[219px] mt-[23px]">

// ✅ DO: Design system tokens
<div className="w-96 h-64 mt-6">

// ❌ DON'T: String concatenation
className={"btn " + (active ? "active" : "")}

// ✅ DO: cn() with object syntax
className={cn("btn", { "active": active })}

// ❌ DON'T: !important overrides
<div className="!p-0 !m-0">

// ✅ DO: Proper specificity or refactor
<div className="p-0 m-0">
```

---

## cn() Utility

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Resources

- **Documentation**: [tailwindcss.com](https://tailwindcss.com)
- **Tailwind v4**: [v4.tailwindcss.com](https://v4.tailwindcss.com) - New CSS-first configuration
- **Theme Setup**: See Tailwind v4 docs for `@theme` directive
- **cn() utility**: Always use for conditional class composition
- **Mobile-first**: Default responsive approach
