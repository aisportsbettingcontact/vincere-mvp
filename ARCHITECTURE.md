# Vincere Gaming - Architecture Documentation

## 🏛️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Supabase Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │ Edge         │  │   Auth       │     │
│  │  Database    │  │ Functions    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  External Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Lovable AI  │  │   ESPN API   │  │  Sports      │     │
│  │  Gateway     │  │   (Images)   │  │  Data APIs   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

### Directory Organization

```
vincere-gaming/
├── public/                    # Static assets
│   ├── vincere-gaming.png    # Favicon
│   └── robots.txt            # SEO configuration
│
├── src/
│   ├── components/           # React components
│   │   ├── feed/            # Feed-specific components
│   │   │   └── AIAnalysisCard.tsx
│   │   ├── ui/              # shadcn UI primitives (11 active)
│   │   ├── AgeGateModal.tsx
│   │   ├── BottomNav.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FeedToggle.tsx
│   │   ├── LineHistoryTable.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── MatchupCard.tsx
│   │   ├── MirrorBar.tsx
│   │   └── ViewToggle.tsx
│   │
│   ├── pages/               # Route components
│   │   ├── Feed.tsx        # Main game feed (700+ lines - consider refactoring)
│   │   ├── Login.tsx       # Auth page (503 lines - consider refactoring)
│   │   └── Profile.tsx     # User profile & settings
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useBettingInsights.ts  # AI insights fetching
│   │   ├── useEdgeGuideData.ts    # Game data fetching
│   │   ├── useViewPref.ts         # View mode preference
│   │   ├── use-mobile.tsx         # Responsive breakpoint
│   │   └── use-toast.ts           # Toast notifications
│   │
│   ├── utils/               # Utility functions
│   │   ├── bettingLogic.ts       # Betting calculations
│   │   ├── cfbTeamColors.ts      # College football colors
│   │   ├── cfbTeamMappings.ts    # CFB team mappings
│   │   ├── colorSimilarity.ts    # Color comparison
│   │   ├── colorUtils.ts         # Color utilities
│   │   ├── populateTeams.ts      # Database population
│   │   ├── teamColors.ts         # NFL team colors
│   │   └── teamMappings.ts       # NFL team mappings
│   │
│   ├── data/                # Static data & types
│   │   ├── betTrackingData.ts    # Betting types & helpers
│   │   ├── latest-odds.json      # Current odds data (2,768 lines)
│   │   ├── oddsData.ts          # Odds interfaces
│   │   └── sportsData.ts        # Team data helpers
│   │
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx      # Dark/light theme
│   │
│   ├── constants/           # Application constants
│   │   └── index.ts              # Centralized config
│   │
│   ├── integrations/        # External service integrations
│   │   └── supabase/
│   │       ├── client.ts         # Supabase client (auto-generated)
│   │       └── types.ts          # Database types (auto-generated)
│   │
│   ├── lib/                 # Shared libraries
│   │   └── utils.ts              # cn() helper
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles & design system
│   ├── types.ts             # Shared TypeScript types
│   └── vite-env.d.ts        # Vite type definitions
│
├── supabase/
│   ├── functions/           # Edge functions
│   │   └── betting-insights/
│   │       └── index.ts     # AI analysis endpoint
│   ├── migrations/          # Database migrations (read-only)
│   └── config.toml          # Supabase configuration
│
├── .env                     # Environment variables (auto-managed)
├── eslint.config.js         # ESLint configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies
├── README.md                # Quick start guide
├── ARCHITECTURE.md          # This file
└── AI_INTEGRATION_GUIDE.md  # AI integration documentation
```

---

## 🎨 Design System

### Color System (100% HSL)

All colors use CSS custom properties defined in `src/index.css`:

#### Core Colors
- `--background` - Page background
- `--foreground` - Primary text
- `--card` - Card backgrounds
- `--card-foreground` - Card text
- `--border` - Border color
- `--input` - Input backgrounds
- `--ring` - Focus ring color

#### Semantic Colors
- `--primary` & `--primary-foreground` - Brand color
- `--secondary` & `--secondary-foreground` - Secondary actions
- `--muted` & `--muted-foreground` - Subtle elements
- `--accent` & `--accent-foreground` - Highlights
- `--destructive` & `--destructive-foreground` - Errors/warnings

#### Extended Accents
- `--accent-cyan` - Cyan accents (191 91% 43%)
- `--accent-indigo` - Indigo accents (238 100% 72%)
- `--accent-green` - Green accents (142 71% 45%)
- `--accent-red` - Red accents (0 72% 59%)
- `--accent-amber` - Amber accents (38 92% 50%)

#### Theme Support
- Dark mode (default): `[data-theme="dark"]`
- Light mode: `[data-theme="light"]`

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700, 800
- **Line Heights:** Optimized for readability

### Spacing
Tailwind default spacing scale + custom utilities:
- `--space-2` - 8px
- `--space-3` - 12px
- `--space-4` - 16px

---

## 🔌 Data Flow

### Game Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Data Source (latest-odds.json)                           │
│    - 2,768 lines of game data                               │
│    - Contains odds, splits, team info                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. useEdgeGuideData Hook                                    │
│    - Fetches & transforms data                              │
│    - Filters by sport/book                                  │
│    - Groups by date                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Feed Component                                            │
│    - Renders game cards                                      │
│    - Handles sport/book selection                           │
│    - Manages view modes (splits/movement)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─────────────────────────────────┐
                     │                                  │
                     ▼                                  ▼
┌─────────────────────────────┐    ┌─────────────────────────────┐
│ MatchupCard Component       │    │ AIAnalysisCard Component    │
│ - Team logos                │    │ - Market selector           │
│ - Odds display              │    │ - AI insights display       │
│ - Betting chips             │    │ - Loading states            │
└─────────────────────────────┘    └────────────┬────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────────┐
                                    │ useBettingInsights Hook     │
                                    │ - Calls edge function       │
                                    │ - Handles errors/retries    │
                                    └────────────┬────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────────┐
                                    │ Edge Function               │
                                    │ - Calls Lovable AI          │
                                    │ - Generates insights        │
                                    │ - Returns JSON              │
                                    └────────────┬────────────────┘
                                                  │
                                                  ▼
                                    ┌─────────────────────────────┐
                                    │ Lovable AI Gateway          │
                                    │ - Google Gemini 2.5 Flash   │
                                    │ - Analyzes betting data     │
                                    └─────────────────────────────┘
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User visits /login                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Login/Signup Form                                         │
│    - Email validation (Zod schema)                          │
│    - Password strength check                                │
│    - Phone number formatting                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Supabase Auth                                            │
│    - signUp() or signInWithPassword()                       │
│    - Email verification required                            │
│    - JWT token generation                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Database Trigger                                          │
│    - handle_new_user() function                             │
│    - Creates profile record                                 │
│    - Populates username/phone                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Session Management                                        │
│    - Auth state listener in App.tsx                         │
│    - Redirect to / on success                               │
│    - Protected routes via Navigate                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Tables

#### `profiles`
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  phone TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);
```

#### `teams`
```sql
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT NOT NULL,
  league TEXT NOT NULL,
  team_city TEXT NOT NULL,
  team_nickname TEXT NOT NULL,
  team_abbreviation TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  tertiary_color TEXT,
  primary_hex_code TEXT,
  secondary_hex_code TEXT,
  tertiary_hex_code TEXT,
  conference TEXT,
  division TEXT,
  arena_name TEXT,
  arena_city TEXT,
  arena_state TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policies
CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);
```

### Triggers

#### `handle_new_user`
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, username, phone, email_verified, phone_verified)
  VALUES (
    gen_random_uuid(),
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone',
    COALESCE(new.email_confirmed_at IS NOT NULL, false),
    false
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email_verified = COALESCE(EXCLUDED.email_verified, public.profiles.email_verified),
    phone_verified = COALESCE(EXCLUDED.phone_verified, public.profiles.phone_verified);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';
```

---

## 🚀 Performance Optimizations

### Code Splitting
- **Dynamic imports** for heavy components
- **React.lazy()** for route-based splitting
- **Component memoization** with React.memo()

### React Query Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
```

### Component Optimizations
- **MatchupCard** - Memoized to prevent unnecessary re-renders
- **LoadingSkeleton** - Memoized for consistent loading states
- **ErrorBoundary** - Catches runtime errors gracefully

### Image Optimization
- **ESPN CDN** for team logos (200x200px)
- **Lazy loading** via browser native loading="lazy"
- **Optimized formats** (PNG with transparency)

---

## 🔒 Security Best Practices

### Row Level Security (RLS)
- **Enabled on all tables**
- **User-specific access** via `auth.uid()`
- **Public read** where appropriate (teams table)

### Authentication
- **Email verification** required before login
- **Strong password** requirements enforced
- **JWT tokens** with automatic refresh
- **Secure session** management

### API Security
- **CORS** properly configured on edge functions
- **Rate limiting** handled by Lovable AI Gateway
- **No exposed secrets** in client code
- **Environment variables** auto-managed

### Code Security
- **TypeScript strict mode** enabled
- **Zod validation** on all user inputs
- **XSS prevention** via React's built-in escaping
- **SQL injection** prevented via parameterized queries

---

## 🧪 Testing Strategy

### Manual Testing Checklist
- ✅ User registration flow
- ✅ Email verification
- ✅ Login/logout
- ✅ Theme switching
- ✅ Sport/book filtering
- ✅ AI insights generation
- ✅ Error handling
- ✅ Responsive design

### Error Handling
- **ErrorBoundary** catches React errors
- **try/catch** in async operations
- **Toast notifications** for user feedback
- **Fallback UI** for failed states

---

## 📦 Build & Deployment

### Build Process
```bash
# Development
npm run dev         # Start dev server (port 8080)

# Production
npm run build       # Build for production
npm run preview     # Preview production build
```

### Deployment
1. Click "Publish" in Lovable dashboard
2. Automatic deployment to CDN
3. Zero-downtime deployment
4. Automatic HTTPS

### Environment
- **Development:** `localhost:8080`
- **Production:** Lovable CDN
- **Database:** Supabase (managed)
- **Edge Functions:** Supabase Edge Runtime

---

## 🔄 State Management

### Global State
- **ThemeContext** - Dark/light theme preference
- **Auth State** - User session (Supabase)
- **React Query** - Server state caching

### Local State
- **useState** - Component state
- **useMemo** - Computed values
- **useEffect** - Side effects
- **Custom hooks** - Shared logic

### Persistence
- **localStorage** - Theme, view mode, age gate, stay signed in
- **Supabase** - User profiles, settings
- **Session Storage** - Temporary data (none currently)

---

## 🎯 Future Improvements

### Performance
- [ ] Implement virtual scrolling for long game lists
- [ ] Add service worker for offline support
- [ ] Optimize bundle size (tree-shaking unused shadcn components)

### Features
- [ ] Real-time game updates via Supabase Realtime
- [ ] Push notifications for line movements
- [ ] Bet tracking & analytics dashboard
- [ ] Social features (sharing, following)

### Code Quality
- [ ] Unit tests (Vitest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Storybook for component documentation
- [ ] CI/CD pipeline (GitHub Actions)

---

**Last Updated:** 2025-01-27  
**Version:** 1.0.0  
**Maintainers:** Vincere Gaming Team
