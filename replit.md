# Haunted Realm - Gothic NFT Collection Platform

## Overview

Haunted Realm is a mobile-first dark fantasy NFT web application that immerses users in an elegant twilight metaverse where gothic romance meets blockchain technology. The platform allows users to collect ethereal NFT character cards, build legendary decks, participate in seasonal events, and engage in a comprehensive gaming ecosystem on the TON blockchain.

The application features a sophisticated gothic aesthetic with dark themes, elegant typography (Cinzel, Spectral, Inter fonts), and atmospheric visual effects including floating particles and glass-morphism UI elements. Users can connect their TON wallets, manage their NFT collections, build custom decks with synergy mechanics, participate in tournaments and challenges, and track their progress on global leaderboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React 18 with TypeScript and follows a component-based architecture. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching. The UI framework is built on Radix UI primitives with shadcn/ui components, styled with Tailwind CSS using a custom twilight/gothic color palette.

Key architectural decisions:
- **Component Structure**: Organized into logical directories (pages, components/ui, components/layout, components/cards, components/effects)
- **State Management**: TanStack Query for server state, React Context for wallet/user state, local component state for UI interactions
- **Styling Approach**: Utility-first CSS with Tailwind, custom CSS variables for theming, glass-morphism effects for gothic aesthetic
- **Mobile-First Design**: Responsive layouts with mobile breakpoints, touch-friendly interactions

### Backend Architecture
The server uses Express.js with TypeScript in ESM format. The architecture follows a clean separation of concerns with dedicated modules for routing, storage, and server setup.

Key design patterns:
- **RESTful API Design**: Clean REST endpoints for users, NFTs, decks, events, transactions, and leaderboards
- **Storage Abstraction**: Interface-based storage layer with in-memory implementation (IStorage/MemStorage pattern)
- **Middleware Pipeline**: Request logging, JSON parsing, error handling middleware
- **Development Integration**: Vite development server integration with HMR support

### Data Layer
The application uses Drizzle ORM with PostgreSQL for data persistence. The database schema supports a comprehensive NFT gaming ecosystem with proper relationships and constraints.

Database design decisions:
- **User Management**: Users table with wallet integration, power scores, and win rates
- **NFT System**: Comprehensive NFT metadata including rarity, faction, power, mana, and abilities stored as JSONB
- **Deck Building**: Deck composition tracking with calculated stats (average mana, total power, synergy)
- **Event System**: Flexible event management supporting tournaments, challenges, and gatherings
- **Analytics**: Transaction tracking and leaderboard systems for user engagement

### Authentication and Authorization
The application implements wallet-based authentication using TON blockchain integration. Users connect via TON Keeper or compatible wallets, with session management handled through user context.

Security considerations:
- **Wallet Verification**: Wallet address validation and user session management
- **State Persistence**: Local storage for session persistence with validation checks
- **Error Handling**: Graceful handling of wallet connection failures and session restoration

## External Dependencies

### Blockchain Integration
- **@neondatabase/serverless**: PostgreSQL database connection for Neon serverless database
- **TON Blockchain**: User wallet integration (TON Keeper compatibility)

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, TypeScript for core application framework
- **UI Framework**: Radix UI primitives (@radix-ui/react-*) for accessible component foundation
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for component variants
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Hookform Resolvers for form validation

### Backend Dependencies
- **Express.js**: Web server framework with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect for database operations
- **Development**: Vite for build tooling and development server with HMR
- **Utilities**: date-fns for date manipulation, nanoid for ID generation

### Development Tools
- **Build System**: Vite for frontend bundling, esbuild for server bundling
- **TypeScript**: Full TypeScript support across frontend and backend
- **Development**: Replit integration with development banners and error overlays
- **Validation**: Zod for schema validation with Drizzle integration

### UI and Styling
- **Typography**: Google Fonts (Cinzel, Spectral, Inter) for gothic aesthetic
- **Icons**: Font Awesome 6 for comprehensive icon library
- **Animations**: Tailwind CSS animations with custom keyframes for floating particles
- **Components**: shadcn/ui component library built on Radix UI primitives