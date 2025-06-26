# Backend API Migration Plan

## 🎯 Overview
This document outlines the complete migration plan to move the Claxon mobile app from using Expo API routes (`mobile-app/app/api/`) to the dedicated NestJS backend API running at `localhost:3000`.

## 📋 Migration Scope

### Current State
- Mobile app uses local Expo API routes in `mobile-app/app/api/`
- Backend API exists but is not connected to mobile app
- API client configured to use local routes as fallback

### Target State
- Mobile app connects directly to backend API at `localhost:3000`
- All Expo API routes removed
- Unified backend serving all API requests

## 🗂️ Files to Migrate/Remove

### Expo API Routes to Remove
- [ ] `mobile-app/app/api/users+api.ts` (5.6KB, 198 lines)
- [ ] `mobile-app/app/api/vehicles+api.ts` (7.2KB, 263 lines)
- [ ] `mobile-app/app/api/claxons+api.ts` (9.8KB, 369 lines)
- [ ] `mobile-app/app/api/claxon-templates+api.ts` (7.1KB, 247 lines)
- [ ] `mobile-app/app/api/uploadthing+api.ts` (1.3KB, 45 lines)

### Backend Routes (Already Implemented)
- [x] `backend/src/routes/users.ts` ✅
- [x] `backend/src/routes/vehicles.ts` ✅
- [x] `backend/src/routes/claxons.ts` ✅
- [x] `backend/src/routes/claxon-templates.ts` ✅
- [x] `backend/src/routes/uploadthing.ts` ✅

## 🔧 Configuration Changes

### 1. Environment Variables Update

#### Mobile App Environment Variables
Update the following environment variables in mobile app:

```bash
# OLD (using local Expo API)
EXPO_PUBLIC_API_BASE_URL="/api"  # Remove this fallback

# NEW (using backend API)
EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"
EXPO_PUBLIC_SERVER_URL="http://localhost:3000"  # For UploadThing
```

#### Files to Update:
- [ ] `mobile-app/src/lib/api.ts` - Update API_BASE_URL logic
- [ ] `mobile-app/src/lib/uploadthing.ts` - Update server URL reference

### 2. API Client Configuration

#### Current Implementation:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "/api";
```

#### Target Implementation:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
```

### 3. UploadThing Configuration

#### Current Implementation:
```typescript
export const { useImageUploader, uploadFiles } = generateReactNativeHelpers<UploadRouter>({
  url: process.env.EXPO_PUBLIC_SERVER_URL,
});
```

#### Target Implementation:
```typescript
export const { useImageUploader, uploadFiles } = generateReactNativeHelpers<UploadRouter>({
  url: process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:3000",
});
```

## 🔄 Migration Steps

### Phase 1: Environment Setup (15 minutes)
1. [ ] Update `mobile-app/.env` with backend API URL
2. [ ] Verify backend server is running on `localhost:3000`
3. [ ] Test backend health endpoint: `GET localhost:3000/health`

### Phase 2: API Client Updates (30 minutes)
1. [ ] Update `mobile-app/src/lib/api.ts`:
   - Change default API_BASE_URL to backend URL
   - Ensure authentication headers work with backend
   - Verify all endpoint paths match backend routes

2. [ ] Update `mobile-app/src/lib/uploadthing.ts`:
   - Point to backend UploadThing endpoint
   - Update type imports to reference backend types

### Phase 3: Remove Expo API Dependencies (45 minutes)
1. [ ] Remove authentication middleware: `mobile-app/src/lib/auth-middleware.ts`
2. [ ] Remove all files in `mobile-app/app/api/` directory
3. [ ] Update imports that reference Expo API types
4. [ ] Remove database dependencies from mobile app:
   - [ ] Remove `mobile-app/src/db/` directory (keep schema types only)
   - [ ] Update `mobile-app/package.json` to remove database dependencies
   - [ ] Remove `mobile-app/drizzle.config.ts`

### Phase 4: Type System Updates (30 minutes)
1. [ ] Create shared types package or copy types from backend
2. [ ] Update `mobile-app/src/lib/uploadthing.ts` type imports:
   ```typescript
   // OLD
   import type { UploadRouter } from "app/api/uploadthing+api";
   
   // NEW
   import type { UploadRouter } from "@/types/uploadthing"; // or from backend
   ```

3. [ ] Verify all API response types match backend implementation

### Phase 5: Testing & Validation (60 minutes)
1. [ ] Test all API endpoints:
   - [ ] User authentication and profile management
   - [ ] Vehicle CRUD operations
   - [ ] Claxon message sending and receiving
   - [ ] Claxon template fetching
   - [ ] File upload functionality

2. [ ] Test error handling and edge cases
3. [ ] Verify authentication flow works end-to-end
4. [ ] Test offline/network error scenarios

### Phase 6: Cleanup (15 minutes)
1. [ ] Remove unused dependencies from `mobile-app/package.json`
2. [ ] Update documentation
3. [ ] Remove any remaining references to Expo API routes

## 🔍 API Endpoint Mapping

### Users API
| Expo Route | Backend Route | Method | Description |
|------------|---------------|---------|-------------|
| `/api/users` | `/users` | POST | Create user |
| `/api/users/current` | `/users/current` | GET | Get current user |
| `/api/users/by-clerk-id/:id` | `/users/by-clerk-id/:clerkId` | GET | Get user by Clerk ID |
| `/api/users` | `/users` | PATCH | Update user |
| `/api/users` | `/users` | DELETE | Delete user |

### Vehicles API
| Expo Route | Backend Route | Method | Description |
|------------|---------------|---------|-------------|
| `/api/vehicles` | `/vehicles` | GET | List vehicles |
| `/api/vehicles/:id` | `/vehicles/:id` | GET | Get vehicle |
| `/api/vehicles` | `/vehicles` | POST | Create vehicle |
| `/api/vehicles/:id` | `/vehicles/:id` | PATCH | Update vehicle |
| `/api/vehicles/:id` | `/vehicles/:id` | DELETE | Delete vehicle |
| `/api/vehicles/search/:plate` | `/vehicles/search/:plateNumber` | GET | Search vehicle |

### Claxons API
| Expo Route | Backend Route | Method | Description |
|------------|---------------|---------|-------------|
| `/api/claxons` | `/claxons` | POST | Send claxon |
| `/api/claxons/inbox` | `/claxons/inbox` | GET | Get inbox |
| `/api/claxons/sent` | `/claxons/sent` | GET | Get sent messages |
| `/api/claxons/:id` | `/claxons/:id` | GET | Get claxon |
| `/api/claxons/:id` | `/claxons/:id` | PATCH | Update claxon |
| `/api/claxons/inbox/unread-count` | `/claxons/inbox/unread-count` | GET | Get unread count |

### Claxon Templates API
| Expo Route | Backend Route | Method | Description |
|------------|---------------|---------|-------------|
| `/api/claxon-templates` | `/claxon-templates` | GET | List templates |
| `/api/claxon-templates/:id` | `/claxon-templates/:id` | GET | Get template |
| `/api/claxon-templates/category/:category` | `/claxon-templates/category/:category` | GET | Get by category |

### UploadThing API
| Expo Route | Backend Route | Method | Description |
|------------|---------------|---------|-------------|
| `/api/uploadthing` | `/uploadthing` | GET/POST | File upload |

## ⚠️ Potential Issues & Solutions

### 1. CORS Configuration
**Issue**: Mobile app requests might be blocked by CORS
**Solution**: Backend already configured to allow `localhost:8081` (Expo dev server)

### 2. Authentication Token Format
**Issue**: Token format differences between Expo and backend
**Solution**: Both use Clerk JWT tokens - should be compatible

### 3. Database Schema Differences
**Issue**: Mobile app and backend might have schema inconsistencies
**Solution**: Backend uses same schema as mobile app - minimal risk

### 4. File Upload URLs
**Issue**: UploadThing URLs might change
**Solution**: Update environment variables and test thoroughly

### 5. Network Error Handling
**Issue**: Mobile app needs to handle network failures gracefully
**Solution**: Existing error handling in API client should work

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Sign up with phone number
- [ ] Sign in with existing account
- [ ] Token refresh handling
- [ ] Sign out functionality

### User Management
- [ ] Create user profile
- [ ] Update user profile
- [ ] Get current user data
- [ ] Delete user account

### Vehicle Management
- [ ] Register new vehicle
- [ ] List user vehicles
- [ ] Update vehicle details
- [ ] Delete vehicle
- [ ] Search vehicle by plate number

### Messaging (Claxons)
- [ ] Send message to vehicle owner
- [ ] Receive messages in inbox
- [ ] Mark messages as read
- [ ] View sent messages
- [ ] Get unread message count

### Templates
- [ ] Load message templates
- [ ] Filter templates by category
- [ ] Multi-language template support

### File Uploads
- [ ] Upload profile avatar
- [ ] Upload vehicle documents
- [ ] Handle upload errors

## 📦 Dependencies to Remove

From `mobile-app/package.json`:
```json
{
  "dependencies": {
    "@neondatabase/serverless": "^1.0.1",  // Remove - backend handles DB
    "drizzle-orm": "^0.44.2",              // Remove - backend handles ORM
    "drizzle-zod": "^0.8.2"                // Remove - backend handles validation
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.2"               // Remove - backend handles migrations
  }
}
```

## 🎯 Success Criteria

### Functional Requirements
- [ ] All API endpoints work through backend
- [ ] Authentication flow is seamless
- [ ] File uploads work correctly
- [ ] Error handling is consistent
- [ ] Performance is maintained or improved

### Technical Requirements
- [ ] No Expo API routes remain in codebase
- [ ] Mobile app bundle size is reduced
- [ ] Type safety is maintained
- [ ] Development workflow is streamlined

### Quality Assurance
- [ ] All existing tests pass
- [ ] New integration tests added for backend API
- [ ] Documentation is updated
- [ ] Code quality standards maintained

## 📅 Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Environment Setup | 15 min | Backend running |
| Phase 2: API Client Updates | 30 min | Phase 1 complete |
| Phase 3: Remove Expo API | 45 min | Phase 2 complete |
| Phase 4: Type System Updates | 30 min | Phase 3 complete |
| Phase 5: Testing & Validation | 60 min | Phase 4 complete |
| Phase 6: Cleanup | 15 min | Phase 5 complete |
| **Total** | **3 hours** | |

## 🚀 Post-Migration Benefits

### Performance
- Reduced mobile app bundle size
- Centralized API logic
- Better caching strategies
- Optimized database queries

### Maintainability
- Single source of truth for API logic
- Easier to add new features
- Better error handling and logging
- Simplified deployment process

### Scalability
- Backend can be scaled independently
- Better resource utilization
- Easier to add caching layers
- Support for multiple client types

## 📝 Notes

- Backend server must be running on `localhost:3000` during development
- Ensure all environment variables are properly set
- Test thoroughly on both iOS and Android simulators
- Consider adding health check endpoint monitoring
- Document any API differences discovered during migration

---

**Migration Lead**: Development Team  
**Created**: 2024  
**Status**: Ready for Implementation 