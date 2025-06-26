# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claxon is a mobile app for Moldova that allows users to send predefined messages to car owners using license plates. Built with Expo/React Native frontend and multiple backend implementations.

### Architecture

The project contains three main components:
- **mobile-app/**: Expo/React Native mobile application (primary frontend)
- **backend/**: Current Fastify backend with Clerk authentication 
- **backend-old/**: Legacy NestJS backend (being phased out)

## Development Commands

### Mobile App (mobile-app/)
```bash
# Development
bun start                    # Start Expo dev server with dev client
bun run ios                  # Run on iOS device
bun run android             # Run on Android

# Code Quality
bun run format              # Format code with Biome

# Database
bun run db:generate         # Generate Drizzle migrations
bun run db:migrate          # Run migrations
bun run db:push             # Push schema changes
bun run db:studio           # Open Drizzle Studio
bun run db:seed             # Seed database

# Build
bun run prebuild            # Expo prebuild (iOS clean)
bun run clean               # Clean and reinstall dependencies
```

### Current Backend (backend/)
```bash
# Development
bun run dev                 # Start dev server with watch mode
bun run build              # Build TypeScript to dist/
bun run start              # Start production server

# Database
bun run db:generate        # Generate Drizzle migrations
bun run db:migrate         # Run migrations
```

### Legacy Backend (backend-old/)
```bash
# Development
bun run start:dev          # Start NestJS in watch mode
bun run build              # Build application

# Code Quality
bun run lint               # Lint with Biome
bun run format             # Format with Biome
bun run check              # Lint + format combined
```

## Code Architecture

### Mobile App Structure

The mobile app uses Expo Router for file-based routing:

- **Authentication**: Clerk phone-based auth with protected/unprotected route groups
- **Navigation**: Tab-based navigation (Search, Inbox, My Cars, Account)
- **Database**: Drizzle ORM with PostgreSQL, schema in `src/db/schema.ts`
- **State**: Zustand stores in `src/stores/`
- **Styling**: TailwindCSS with NativeWind
- **Forms**: React Hook Form + Zod validation
- **API**: Custom hooks in `src/hooks/use-api.ts`

### Backend Architecture

**Current Backend (backend/)**:
- Fastify server with Clerk authentication
- Drizzle ORM for database operations
- TypeScript with Bun runtime
- Database schema in `src/db/schema/`

**Migration Status**: Backend logic is being migrated from Expo API routes (`mobile-app/app/api/`) to the dedicated Fastify backend.

### Database Schema

Core entities (defined in schema files):
- **Users**: Clerk-integrated user profiles
- **Vehicles**: Car registrations with license plate details  
- **Claxons**: Messages sent between users
- **ClaxonTemplates**: Predefined message templates

## Development Guidelines

### Code Style
- **Linting**: Biome for formatting and linting (configured in `biome.json`)
- **TypeScript**: Strict mode enabled
- **Imports**: Organized with Biome
- **Naming**: camelCase for variables/functions, PascalCase for components/types

### Form Patterns
- Use React Hook Form + Zod for validation
- Form components in `mobile-app/src/components/form-elements/`
- Follow base component + controller HOC pattern

### API Integration
- Create custom hooks for API calls
- Handle loading/error states consistently
- Use TypeScript interfaces for API responses

### Database Operations
- Use Drizzle ORM for all database operations
- Include `createdAt`/`updatedAt` timestamps
- Use UUIDs for primary keys
- Implement proper foreign key relationships

## Key Features

- **Privacy-First**: Plate-based messaging without contact info exchange
- **Multilingual**: English, Romanian, Russian support
- **Template-Based**: Predefined safe message templates
- **Push Notifications**: Expo push notifications for alerts
- **Optional Registration**: Car registration required only for receiving messages

## Development Notes

- **Runtime**: Use Bun instead of Node.js/npm when possible
- **Database**: PostgreSQL with Neon serverless hosting
- **Authentication**: Clerk handles all auth flows
- **File Uploads**: UploadThing integration for image uploads
- **Testing**: No specific test framework configured yet