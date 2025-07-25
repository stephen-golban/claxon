# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claxon is a React Native mobile app for Moldova that enables instant messaging to car owners via license plates without requiring contact information. Users can search license plates, send predefined messages, register their vehicles to receive notifications, and manage their car fleet.

## Development Commands

### Core Commands
- `bun start` - Start Expo development server with dev client
- `bun run ios` - Run on iOS device
- `bun run android` - Run on Android
- `bun run format` - Format code with Biome
- `bun run prebuild` - Clean prebuild for iOS platform
- `bun run clean` - Full clean (removes .expo, node_modules, reinstalls)

### Database
- `bun run db:generate` - Generate TypeScript types from Supabase schema

## Architecture Overview

### Tech Stack
- **Framework**: React Native with Expo (v53)
- **Backend**: Supabase (database, auth, real-time)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router with file-based routing
- **State Management**: Zustand for global state, TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Expo push notifications
- **Authentication**: Phone-based auth via Clerk
- **Language Support**: i18next with Romanian, Russian, and English

### Key Architectural Patterns

#### Route Structure
- **Protected routes** (`app/(protected)/`): Require authentication, include tab navigation
- **Unprotected routes** (`app/(unprotected)/`): Onboarding and authentication flows
- **Tab navigation**: Search, Inbox, My Cars, Account

#### Component Organization
- **UI components** (`src/components/ui/`): Base components styled with NativeWind
- **Form elements** (`src/components/form-elements/`): React Hook Form integrated components
- **Common components** (`src/components/common/`): App-specific reusable components
- **Screen components** (`src/screens/`): Organized by protected/unprotected with dedicated folders

#### Data Layer
- **API services** (`src/services/api/`): Supabase client and domain-specific API functions
- **Type definitions** (`src/typings/`): Database types, validation schemas, vehicle types
- **Stores** (`src/stores/`): Zustand stores for global state management

#### License Plate System
- Moldova-specific license plate formats and validation
- Visual plate picker with country flags and vehicle type support
- Plate images organized by vehicle type in `assets/images/plates/`

#### Internationalization
- Translation files in `src/translations/locales/` (ro, ru, en)
- `useTranslation` hook for component translations
- Error message translation system

### Development Guidelines

#### TypeScript Usage
- All files use TypeScript with strict typing
- Database types auto-generated from Supabase schema
- Zod schemas for validation in each feature's `schema.ts`

#### Form Pattern
Each form follows this pattern:
1. Base component in `src/components/form-elements/`
2. Controller wrapper using React Hook Form
3. Validation schema with Zod
4. Hook for form logic and submission

#### Screen Pattern
Each screen folder contains:
- `index.tsx` - Main screen component
- `schema.ts` - Zod validation schemas
- `hook.ts` - Screen-specific logic and API calls

#### Styling Approach
- Use NativeWind (Tailwind) classes consistently
- Theme constants in `src/lib/constants/theme.ts`
- Dark/light mode support via `useColorScheme` hook
- Custom color palette with CSS variables

#### Error Handling
- Translated error messages via `useErrorMessageTranslation`
- Consistent error UI components
- Error boundaries for React error catching

### File Naming Conventions
- Components: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase with `use` prefix (`useMyHook.ts`)
- Utilities: camelCase (`myUtility.ts`)
- Constants: SCREAMING_SNAKE_CASE
- Schemas: `schema.ts` for validation

### Key Features Implementation

#### Authentication Flow
1. Phone number input → OTP verification
2. Post-auth personal details completion
3. Welcome screen with app exploration options
4. Session management through Supabase provider

#### Core App Functionality
- **Search tab**: License plate lookup and message sending
- **Inbox tab**: Received claxon notifications
- **My Cars tab**: Vehicle registration and management
- **Account tab**: Profile management and app preferences

#### Push Notifications
- Expo push notifications for claxon alerts
- Notification preferences in account settings
- Real-time updates via Supabase subscriptions

This is a privacy-focused app with template-based messaging to ensure safe, uniform communication between car owners in Moldova.