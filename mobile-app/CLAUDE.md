# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claxon is a React Native mobile app for Moldova that enables instant messaging to car owners via license plates without requiring contact information. Users can search license plates and send predefined messages, with optional car registration to receive notifications.

## Development Commands

- **Start Development**: `bun start` - Start Expo dev server with dev client
- **Platform Builds**: `bun ios` / `bun android` - Run on iOS/Android devices
- **Code Formatting**: `bun format` - Format code with Biome
- **Clean Build**: `bun clean` - Remove cache and reinstall dependencies
- **Prebuild**: `bun prebuild` - Clean prebuild for iOS

### Database Commands (Drizzle)
- **Generate Migrations**: `bun db:generate`
- **Run Migrations**: `bun db:migrate` 
- **Push Schema**: `bun db:push`
- **Studio**: `bun db:studio`
- **Seed Data**: `bun db:seed`

## Tech Stack & Architecture

- **Framework**: React Native + Expo with file-based routing (Expo Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk (phone-based)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand stores + TanStack Query
- **Animations**: Lottie animations
- **Push Notifications**: Expo Notifications

## Key Architecture Patterns

### Route Structure
- **Unauthenticated**: `app/(unprotected)/` - Onboarding, sign-in/up, OTP verification
- **Protected**: `app/(protected)/` - Main app with tab navigation
- **Entry Point**: `app/index.tsx` redirects based on auth state
- **Root Layout**: `app/_layout.tsx` handles app initialization and auth routing

### Component Organization
- **Common Components**: `src/components/common/` - Reusable UI (headers, containers, license plate picker)
- **Form Elements**: `src/components/form-elements/` - Specialized inputs with validation
- **UI Primitives**: `src/components/ui/` - Base components following shadcn/ui patterns
- **Icons**: `src/components/icons/` - Custom SVG icons including Moldova-specific flags

### Form Pattern
All forms follow a consistent pattern:
1. **Schema**: Zod validation schemas in `schema.ts` files
2. **Hook**: Custom logic in `hook.ts` files  
3. **Component**: React Hook Form integration with controller HOC
4. **Controller HOC**: `src/components/form-elements/controller-hoc.tsx` wraps form fields

### Database Schema (src/db/schema.ts)
- **users**: Clerk integration with Moldova-specific fields
- **vehicles**: License plate and vehicle details
- **claxonTemplates**: Predefined messages in 3 languages (EN/RO/RU)
- **claxons**: Message/alert records between users

## Moldova-Specific Features

### Multi-language Support
- **Languages**: English, Romanian (official), Russian (widely spoken)
- **Translation Files**: `src/translations/locales/` with `useTranslation` hook
- **Template Messages**: All messages support 3 languages for cultural appropriateness

### License Plate System
- **Plate Types**: Standard, governmental, special, regional (including Transnistria)
- **Assets**: Visual plate templates in `assets/images/plates/`
- **Components**: Custom license plate picker and form input with visual preview
- **Validation**: Moldova-specific plate format rules

### Vehicle Constants
- **Brands/Models**: Popular vehicles in Moldova market
- **Colors**: Local preferences and naming conventions
- **Registration**: Regional requirements and formats

## State Management

- **Global App State**: `src/stores/app.ts` (language, theme)
- **Navigation State**: `src/stores/programmatic-go-back.ts`
- **Server State**: TanStack Query for API data
- **Form State**: React Hook Form for individual forms

## Key Utilities & Hooks

- **App Initialization**: `src/hooks/use-app-init.ts` - Font loading, i18n setup
- **Theme Management**: `src/hooks/use-color-scheme.ts` - Dark/light mode
- **API Integration**: `src/hooks/use-api.ts` - Server communication
- **Image Handling**: `src/hooks/use-image-picker.ts` - Avatar/document upload
- **Error Translation**: `src/hooks/use-error-message-translation.ts` - Localized error messages

## File Upload & Assets

- **UploadThing**: File upload service integration
- **Image Assets**: Organized by category (plates, placeholders, icons)
- **Lottie Animations**: Car, claxon, alert, feedback animations
- **VRC Templates**: Vehicle Registration Certificate placeholders

## API Routes (Expo Router API)

- **Users**: `app/api/users+api.ts` - User management
- **Vehicles**: `app/api/vehicles+api.ts` - Vehicle CRUD
- **Claxons**: `app/api/claxons+api.ts` - Message sending/receiving
- **Templates**: `app/api/claxon-templates+api.ts` - Predefined messages
- **Upload**: `app/api/uploadthing+api.ts` - File upload handling

## Environment & Configuration

- **Environment**: `.env.example` shows required variables
- **TypeScript**: Strict configuration with custom types
- **Tailwind**: Custom design system with Moldova-specific colors
- **Biome**: Linting and formatting configuration
- **Metro**: React Native bundler with custom resolver

## Development Notes

- **Authentication Flow**: Phone → OTP → Optional car registration → Tab navigation
- **Privacy Focus**: No personal contact exchange, template-based messaging only
- **Regional Support**: Handles different Moldova regions including Transnistria
- **Government Plates**: Special handling for official/diplomatic vehicles
- **Testing**: Use Expo development build for device testing