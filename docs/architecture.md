# Colors - Architecture Documentation

## Project Purpose

**Colors** is a design tool built to help users pick color palettes and visualize how different colors interact with each other. The application provides an intuitive interface for:

- Exploring and creating color schemes
- Visualizing color combinations in real-time
- Understanding color relationships and harmony
- Testing color accessibility and contrast
- Exporting color palettes for design projects

## Tech Stack

### Core Framework
- **Next.js** `16.0.1` - React framework with App Router
- **React** `19.2.0` - UI library
- **TypeScript** `5+` - Type-safe development
- **Bun** - Fast JavaScript runtime and package manager

### Styling & UI
- **Tailwind CSS** `3.4.18` - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library (51+ components)
  - Based on Radix UI primitives
  - Fully customizable and accessible
  - Components: Navigation, Dialog, Dropdown, Sheet, Button, Input, Select, etc.
- **Tailwind CSS Animate** `1.0.7` - Animation utilities
- **PostCSS** `8.5.6` - CSS processing
- **Autoprefixer** `10.4.21` - CSS vendor prefixing

### Animation & Icons
- **Framer Motion** `12.23.24` - Production-ready animation library
- **Lucide React** `0.548.0` - Beautiful icon library

### Backend & Database
- **Supabase** `2.78.0` - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage

### Theme Management
- **next-themes** `0.4.6` - Dark mode and theme switching
- CSS Variables - Dynamic theming system

### Additional Libraries
- **class-variance-authority** `0.7.1` - Component variant management
- **clsx** `2.1.1` - Conditional className utility
- **tailwind-merge** `3.3.1` - Merge Tailwind classes intelligently
- **React Hook Form** `7.65.0` - Form state management
- **Zod** `4.1.12` - Schema validation
- **date-fns** `4.1.0` - Date manipulation
- **Recharts** `2.15.4` - Chart library
- **Sonner** `2.0.7` - Toast notifications

## Project Structure

```
colors/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers & navbar
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles & CSS variables
│
├── components/                   # React components
│   ├── navbar.tsx               # Main navbar with scroll behavior
│   ├── navbar/                  # Navbar sub-components
│   │   ├── auth-buttons.tsx    # Login/Sign Up buttons
│   │   ├── language-switcher.tsx # Language selector
│   │   ├── mobile-menu.tsx     # Mobile drawer menu
│   │   ├── nav-links.tsx       # Navigation links (Home, Videos, Images)
│   │   ├── search-bar.tsx      # Search input
│   │   └── theme-toggle.tsx    # Dark/Light mode toggle
│   ├── providers.tsx            # Theme provider wrapper
│   └── ui/                      # shadcn/ui components (51+ files)
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── navigation-menu.tsx
│       ├── sheet.tsx
│       └── ... (46+ more components)
│
├── lib/                         # Utility functions
│   ├── supabase.ts             # Supabase client configuration
│   └── utils.ts                # cn() utility for className merging
│
├── hooks/                       # Custom React hooks
│   └── use-mobile.ts           # Mobile detection hook (768px)
│
├── docs/                        # Documentation
│   └── architecture.md         # This file
│
├── node_modules/                # Dependencies
├── .git/                        # Git repository
├── .claude/                     # Claude Code configuration
│
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── components.json             # shadcn/ui configuration
├── package.json                # Package dependencies
├── bun.lock                    # Bun lockfile
├── .env.local                  # Environment variables (Supabase keys)
├── .gitignore                  # Git ignore rules
└── README.md                   # Project readme
```

## Component Architecture

### Navbar Design

The navbar is designed with a modern, responsive approach:

**Design Features:**
- **Center-aligned with rounded corners** when at top of page
- **Expands to full-width** with square corners when scrolled
- **Sticky positioning** - Always visible at top of viewport
- **Backdrop blur effect** - Semi-transparent background
- **Smooth animations** - Powered by Framer Motion

**Responsive Behavior:**
- **Desktop (≥768px):**
  - Full navigation menu visible
  - Search bar in center
  - Auth buttons + theme/language toggles

- **Mobile (<768px):**
  - Hamburger menu (Sheet component)
  - Collapsible navigation
  - Search bar below navbar
  - Simplified layout

**Components Breakdown:**

1. **navbar.tsx** - Main container
   - Handles scroll detection with `useScroll` from Framer Motion
   - Animates width and border-radius based on scroll position
   - Orchestrates all sub-components

2. **theme-toggle.tsx** - Dark mode switcher
   - Uses `next-themes` for theme management
   - Sun/Moon icons with smooth transitions
   - Dropdown with Light/Dark/System options

3. **language-switcher.tsx** - Language selector
   - Globe icon with dropdown menu
   - Placeholder for future i18n integration
   - Languages: English, Español, Français, Deutsch

4. **search-bar.tsx** - Search functionality
   - Input with search icon
   - Placeholder: "Search colors..."
   - Form submission ready for implementation

5. **nav-links.tsx** - Navigation menu
   - Links: Home, Videos, Images
   - Icons from Lucide React
   - Active state highlighting using `usePathname`

6. **auth-buttons.tsx** - Authentication
   - Login and Sign Up buttons
   - Ready for Supabase integration
   - Variants for desktop/mobile layouts

7. **mobile-menu.tsx** - Mobile navigation
   - Uses shadcn/ui Sheet component
   - Drawer slides from right
   - Contains all navigation + auth + settings

## Styling System

### CSS Variables

The project uses a comprehensive CSS variable system for theming:

**Color Tokens:**
- `--background` / `--foreground` - Base colors
- `--primary` / `--primary-foreground` - Primary actions
- `--secondary` / `--secondary-foreground` - Secondary elements
- `--muted` / `--muted-foreground` - Muted content
- `--accent` / `--accent-foreground` - Accent highlights
- `--destructive` / `--destructive-foreground` - Error states
- `--border` / `--input` / `--ring` - Form elements
- `--chart-{1-5}` - Chart colors

**Dark Mode:**
- Automatic class switching with `next-themes`
- Separate color values for `.dark` selector
- System preference detection

**Utility Function:**
```typescript
cn(...inputs: ClassValue[]) // Merges Tailwind classes intelligently
```

## Development Scripts

```json
{
  "dev": "next dev --turbopack",    // Start dev server with Turbopack
  "build": "next build",             // Production build
  "start": "next start",             // Start production server
  "lint": "next lint"                // Run ESLint
}
```

## Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Key Design Patterns

1. **Server vs Client Components**
   - Layout and page files are Server Components by default
   - Interactive components use `"use client"` directive
   - Providers are Client Components

2. **Component Composition**
   - Small, focused components
   - Clear separation of concerns
   - Reusable across the application

3. **Type Safety**
   - Strict TypeScript configuration
   - Prop interfaces for all components
   - Type inference where possible

4. **Responsive Design**
   - Mobile-first approach
   - Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
   - `use-mobile` hook for JavaScript-based responsiveness

5. **Animation Strategy**
   - Framer Motion for complex animations
   - CSS transitions for simple state changes
   - Respect user's motion preferences

## Future Enhancements

- [ ] Implement color palette creation tools
- [ ] Add color harmony visualizations
- [ ] Integrate color accessibility checker
- [ ] Add i18n (internationalization) support
- [ ] Connect authentication with Supabase
- [ ] Build color export functionality
- [ ] Add user-saved palettes feature
- [ ] Create video and image sections
- [ ] Implement search functionality
- [ ] Add color contrast calculator

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

Visit `http://localhost:3000` to see the application.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Supabase Documentation](https://supabase.com/docs)
