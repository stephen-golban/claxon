# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claxon is a mobile app for Moldova that enables users to send predefined messages to car owners using license plates. The app consists of an Expo/React Native mobile app and a NestJS backend API.

**Key Features:**
- Privacy-first messaging via license plates (no contact info exchange)
- Multi-language support (English, Romanian, Russian)  
- Phone-based authentication via Clerk
- Template-based messaging system
- Push notifications for message alerts

## Development Commands

### Mobile App (`mobile-app/`)
```bash
# Install dependencies
bun install

# Development
bun start                    # Start Expo dev server with dev client
bun run ios --device        # Run on iOS device
bun run android             # Run on Android

# Code quality
bun run format              # Format with Biome

# Database operations
bun run db:generate         # Generate Drizzle migrations
bun run db:push             # Push schema to database
bun run db:studio           # Open Drizzle Studio
bun run db:seed             # Seed database with initial data

# Build
bun run prebuild --clean --platform ios  # Prebuild for iOS
```

### Backend (`backend/`)
```bash
# Install dependencies
bun install

# Development
bun run start:dev           # Start in watch mode
bun run start:debug         # Start with debug mode
bun run start:prod          # Production mode

# Code quality
bun run lint                # Lint with Biome
bun run format              # Format with Biome  
bun run check               # Combined lint + format

# Build
bun run build               # Build for production
```

## Architecture Overview

### Mobile App Stack
- **Framework:** Expo/React Native with TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Styling:** TailwindCSS + NativeWind
- **State Management:** Zustand stores
- **Database:** Drizzle ORM with PostgreSQL
- **Authentication:** Clerk (phone-based)
- **Forms:** React Hook Form + Zod validation
- **Internationalization:** i18next (EN/RO/RU)

### Backend Stack
- **Framework:** NestJS with TypeScript
- **Runtime:** Bun
- **Code Quality:** Biome for linting/formatting
- **Database:** Shared PostgreSQL with mobile app via Drizzle schema

### Database Schema
Core entities defined in `mobile-app/src/db/schema.ts`:
- **Users:** Clerk-integrated profiles with phone auth
- **Vehicles:** License plate registrations with detailed metadata
- **Claxons:** Messages/alerts sent between users
- **ClaxonTemplates:** Predefined multi-language message templates

## Directory Structure

### Mobile App (`mobile-app/`)
```
app/                        # Expo Router routes
├── (protected)/           # Authenticated tab navigation
├── (unprotected)/         # Auth screens (sign-in, sign-up)  
└── api/                   # API routes (being migrated to backend)

src/
├── components/            # Reusable UI components
│   ├── common/           # App-specific components
│   ├── form-elements/    # Form components with React Hook Form
│   └── ui/               # Base UI components (shadcn-style)
├── db/                   # Database schema and setup
├── hooks/                # Custom React hooks
├── screens/              # Screen-specific components
├── stores/               # Zustand state management
├── translations/         # i18n locale files
└── lib/                  # Utilities and constants
```

### Backend (`backend/src/`)
```
src/
├── app.controller.ts     # Main app controller
├── app.module.ts         # Root module
├── app.service.ts        # Main app service
└── main.ts              # Bootstrap file
```

## Key Development Patterns

### Component Structure
- Functional components with TypeScript interfaces
- Custom hooks for state management and API calls
- Consistent error and loading state handling
- Form validation with Zod schemas

### API Integration
- Custom hooks in `src/hooks/use-api.ts` for data fetching
- TanStack Query for caching and synchronization
- Consistent error handling patterns

### Database Operations
- Use Drizzle ORM with proper relations
- Cursor-based pagination for large datasets
- Soft deletes with `isActive` boolean flags
- Proper indexing on frequently queried fields

### Authentication Flow
- Clerk handles phone-based auth and user management
- JWT token validation on backend endpoints
- Route protection with authentication guards

## Migration in Progress

**Current State:** Backend logic exists in Expo API routes (`mobile-app/app/api/`)  
**Target State:** Migrating all backend logic to NestJS (`backend/src/`)

### API Routes to Migrate:
- `app/api/claxons+api.ts` - Message operations
- `app/api/vehicles+api.ts` - Vehicle management  
- `app/api/users+api.ts` - User operations
- `app/api/claxon-templates+api.ts` - Template management
- `app/api/uploadthing+api.ts` - File uploads

## Code Quality

### Formatting and Linting
- **Mobile App:** Biome with 2-space indentation, double quotes
- **Backend:** Biome with 2-space indentation, single quotes  
- Run format/lint commands before committing

### Naming Conventions
- **Files:** PascalCase for components, camelCase for utilities
- **Variables/Functions:** camelCase
- **Types/Interfaces:** PascalCase
- **Constants:** UPPER_SNAKE_CASE

### Testing
- Component tests for UI components
- Hook tests for custom hooks in isolation
- Integration tests for complete user flows

## Environment Setup

### Required Environment Variables
- `EXPO_PUBLIC_DATABASE_URL` - PostgreSQL connection string
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth key
- `CLERK_SECRET_KEY` - Clerk server secret
- `UPLOADTHING_SECRET` - File upload service key

### Database Setup
1. Set up PostgreSQL database
2. Configure connection in `drizzle.config.ts`
3. Run `bun run db:push` to create tables
4. Run `bun run db:seed` to populate initial data

## Push Notifications

The app uses Expo push notifications:
- User device tokens stored in profiles table on login
- Messages trigger notifications to recipients
- Notification handling in app initialization hooks

## Internationalization

Multi-language support with i18next:
- Locale files in `src/translations/locales/` (en.json, ro.json, ru.json)
- Type-safe translation keys
- Language preference stored in user profiles