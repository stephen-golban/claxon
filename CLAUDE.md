# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claxon is a mobile application for Moldova that enables users to send messages to car owners using license plates. The project consists of two main components:

- **Backend**: Cloudflare Workers API with Hono framework, Better Auth, and Drizzle ORM
- **Mobile App**: React Native with Expo, using Supabase for data and authentication

## Development Commands

### Backend (`/backend`)
- **Development**: `bun run dev` - Start local development server with Wrangler
- **Format**: `bun run format` - Format code with Biome

### Mobile App (`/mobile-app`)
- **Development**: `bun run start` - Start Expo development server
- **Format**: `bun run format` - Format code with Biome

## Architecture

### Backend Architecture
- **Framework**: Hono on Cloudflare Workers
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with session management
- **API Routes**: All auth routes handled via `/api/*` pattern

### Mobile App Architecture
- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with tab-based navigation
- **State Management**: Zustand for global state
- **UI Framework**: Custom components using react-native-reanimated and Tailwind CSS via NativeWind
- **Authentication**: Supabase Auth integration
- **Data Fetching**: TanStack Query (React Query)

### Key Features
- Phone authentication flow with OTP verification
- License plate search and messaging system
- Push notifications via Expo
- Multi-language support (English, Romanian, Russian)
- Car registration and management
- Inbox for received messages

## Code Style

Both projects use Biome for formatting and linting:
- 2-space indentation
- 120 character line width
- Double quotes for JavaScript strings
- Automatic import organization enabled

## Database Schema

The backend uses Better Auth generated schema with:
- `user` table for core authentication (phone number, basic info)
- `profiles` table for detailed user information (first_name, last_name, dob, gender, avatar_url, etc.)
- `session` table for authentication sessions  
- `account` table for provider accounts
- `verification` table for OTP/email verification

The mobile app connects to Supabase with additional tables for:
- Vehicle registration
- Message/claxon storage
- User preferences

## Development Workflow

1. Use `bun` as the package manager for all operations
2. Follow GitHub conventional commits format for all commit messages
3. Use `bun run dev` for local development
4. Use `bun run format` to format code before committing

## Authentication Flow

### Phone Authentication with Twilio
- **Two-stage authentication**: Existing users sign in immediately, new users complete profile first
- **OTP via Twilio Verify API**: 6-digit codes with 5-minute expiration
- **Rate limiting**: Maximum 3 verification attempts per OTP code
- **Request validation**: Hono Zod validator ensures proper data format
- **Profile separation**: Better Auth handles core auth, separate profiles table for user details

### API Endpoints
- `POST /api/auth/send-otp` - Send OTP to phone number (validated with Zod)
- `POST /api/auth/verify-otp` - Verify OTP and check user status (returns `hasProfile` flag)
- `POST /api/auth/complete-signup` - Complete new user registration with personal details (creates user + profile)

### Environment Variables Required
- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Auth Token  
- `TWILIO_VERIFY_SERVICE_SID` - Twilio Verify Service SID
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_URL` - API base URL
- `BETTER_AUTH_SECRET` - Session signing secret