# Olive Atelier - Premium Portfolio Website

## Overview

This is a premium portfolio/branding website for a Dubai-based service ("Olive") that creates personalized branding and portfolio websites for individuals. The app follows a single-page "story-style" landing page design with a dark premium aesthetic, olive green highlights, glassmorphism effects, and smooth animations. It uses a full-stack architecture with a React frontend and Express backend, though the current functionality is primarily frontend-focused (the backend serves the static site and provides a minimal API scaffold).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter (lightweight React router) — currently two routes: Home (`/`) and a 404 catch-all
- **Styling**: Tailwind CSS v4 with CSS variables for theming (dark/light mode support), custom fonts (DM Sans + Fraunces from Google Fonts)
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives — extensive set of components in `client/src/components/ui/`
- **Animations**: Framer Motion for scroll-based animations and transitions
- **State Management**: TanStack React Query for server state; React useState/useEffect for local state
- **Configuration**: Central config file (`client/src/config.js` and `client/src/config.ts`) acts as single source of truth for brand name, tagline, WhatsApp number, theme colors, and navigation links. Changes to this config should propagate across the entire site.
- **Design Pattern**: The site is a single-page application with smooth-scrolling sections: Navbar, Hero, Story, Expertise, Work, Team, Testimonials, and Contact

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (compiled via tsx/esbuild)
- **Architecture**: HTTP server serves API routes and static files. In development, Vite dev server middleware is used for HMR. In production, pre-built static files are served from `dist/public/`
- **Storage**: Currently uses an in-memory storage implementation (`MemStorage` class in `server/storage.ts`). There's an `IStorage` interface that can be swapped to a database-backed implementation. The Drizzle schema exists but the app primarily uses in-memory storage.
- **API Pattern**: Routes are registered in `server/routes.ts`, all prefixed with `/api`. Currently minimal — the scaffold is ready for expansion.

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` — currently has a `users` table with id, username, and password fields
- **Migrations**: Drizzle Kit configured to output migrations to `./migrations/` directory
- **Schema Push**: Use `npm run db:push` to push schema changes directly to the database
- **Note**: The DATABASE_URL environment variable must be set for database operations. The app can run without a database using the in-memory storage fallback.

### Build System
- **Client Build**: Vite builds the React app to `dist/public/`
- **Server Build**: esbuild bundles the server to `dist/index.cjs`, with specific dependencies bundled (allowlisted) vs externalized for optimized cold starts
- **Development**: `npm run dev` starts the Express server with Vite middleware for hot module replacement
- **Production**: `npm run build` builds both client and server, then `npm start` runs the production bundle

### Key Design Decisions
1. **Dual config files** (`config.js` and `config.ts`): Both exist — the `.js` version has a blue color scheme (HSL 210°) while the `.ts` version has olive green (HSL 78°). The home page imports from `config.ts`. When modifying site configuration, update `client/src/config.ts` as the primary source.
2. **In-memory storage as default**: Allows the app to run without a database. The `IStorage` interface makes it easy to swap in PostgreSQL-backed storage using Drizzle when needed.
3. **Shared schema directory**: `shared/schema.ts` is accessible to both frontend and backend via path aliases (`@shared/*`), enabling type sharing across the stack.
4. **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

## External Dependencies

- **PostgreSQL**: Database (via Drizzle ORM), requires `DATABASE_URL` environment variable. Used with `connect-pg-simple` for session storage capability.
- **WhatsApp Integration**: Contact via WhatsApp link using the configured number `+971504486615`
- **Google Fonts**: DM Sans (body) and Fraunces (display) loaded via Google Fonts CDN
- **Radix UI**: Extensive use of Radix primitives for accessible UI components
- **Framer Motion**: Animation library for scroll effects and transitions
- **Sonner**: Toast notification library (referenced in home page)
- **Replit Plugins**: Development-only plugins for cartographer, dev banner, runtime error overlay, and meta images