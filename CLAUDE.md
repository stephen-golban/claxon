# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Cloudflare Workers-based backend application built with Hono framework. The project uses:
- **Hono** as the web framework
- **Better Auth** for authentication with phone number support via Twilio
- **Drizzle ORM** with PostgreSQL (Neon) database
- **Bun** as the package manager
- **TypeScript** throughout
- **Biome** for code formatting
- **Cloudflare R2** for object storage

## Development Commands

All commands should be run from the `backend/` directory:

```bash
# Development server (runs on localhost:3000)
bun run dev

# Format code using Biome
bun run format

# Deploy to Cloudflare Workers
bun run deploy

# Generate Cloudflare Workers types
bun run cf-gen-types

# Generate Better Auth database schema
bun run better-auth-gen-schema
```

## Architecture

### Core Structure
- **Entry Point**: `src/index.ts` - Hono app with Better Auth routes
- **Authentication**: Better Auth configuration in `src/lib/better-auth/`
- **Database**: Drizzle schemas in `src/db/schemas/`, queries in `src/db/queries/`
- **External Services**: Twilio integration in `src/lib/twilio.ts`
- **Error Handling**: Centralized error and success codes in `src/lib/constants.ts`

### Database Layer
- Uses Drizzle ORM with PostgreSQL
- Schema files are modular (user, profile, account, session, verification)
- Database migrations in `drizzle/` directory
- Connection configured for Neon serverless PostgreSQL

### Authentication Flow
- Better Auth handles authentication with phone number support
- Twilio integration for SMS verification
- Session management and user profiles
- Database adapter configured for PostgreSQL

### Cloudflare Integration
- Workers runtime environment
- R2 bucket binding named "claxon" for object storage
- Environment variables managed through Wrangler
- Type generation for Cloudflare bindings
- Development server runs on localhost:3000

### Error Handling Pattern
The application uses standardized error and success codes defined in `src/lib/constants.ts`:
- **Error codes**: `OTP_SEND_FAILED`, `OTP_INVALID_OR_EXPIRED`, `USER_ALREADY_EXISTS`, `INTERNAL_SERVER_ERROR`
- **Success codes**: `OTP_SENT`, `USER_AUTHENTICATED`, `PHONE_VERIFIED_COMPLETE_PROFILE`, `ACCOUNT_CREATED`

## Key Files

- `better-auth.config.ts` - Better Auth CLI configuration
- `drizzle.config.ts` - Database migration configuration  
- `wrangler.jsonc` - Cloudflare Workers and R2 configuration
- `biome.json` - Code formatting rules
- `src/lib/constants.ts` - Centralized error and success codes

## Database Operations

Use Drizzle Kit for migrations:
```bash
# Generate migration
bunx drizzle-kit generate

# Apply migrations  
bunx drizzle-kit migrate
```

Better Auth schema generation:
```bash
bun run better-auth-gen-schema
```