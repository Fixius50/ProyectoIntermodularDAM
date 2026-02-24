# Frontend Architecture Overview (AVIS)

This document describes the structure and design patterns of the recently updated frontend.

## 🏗️ Technical Stack
- **Framework**: [React Native](https://reactnative.dev/) + [React Native for Web](https://necolas.github.io/react-native-web/).
- **Build System**: [Vite](https://vitejs.dev/) for fast development and web builds.
- **Language**: TypeScript (Mainly).
- **State Management**: 
  - **Zustand**: Global application store (`store/useAppStore.js`).
  - **React Context**: Feature-specific state (Auth, Game, Flock, etc.).
- **Icons**: Lucide React / Lucide React Native.

## 🗺️ Workspace Structure
```text
src/frontend/
├── src/
│   ├── components/       # Shared UI components (GlassCard, WeatherBackground)
│   ├── context/          # State providers (Auth, Game, etc.)
│   ├── screens/          # Primary feature views (12 screens)
│   ├── services/         # API clients and business logic handlers
│   ├── store/            # Zustand global stores
│   ├── theme/            # Design system (colors, typography)
│   └── types/            # TypeScript definitions
├── App.tsx               # Root component & Navigation state machine
└── index.web.js          # Entry point for Web build
```

## 🔄 Core Patterns

### 1. Navigation State Machine
Instead of a standard router, `App.tsx` manages the visible screen using a `currentTab` state. This provides total control over the view hierarchy and transitions between the `AuthGate` and `GameContent`.

### 2. Authentication Logic
The `AuthContext` uses a `useReducer` to manage the lifecycle of a user session:
- **IDLE/LOADING**: Session restoration from `localStorage`.
- **AUTHENTICATED**: Access to game content.
- **UNAUTHENTICATED**: Redirect to Login/Register screens.

### 3. API Integration
The `apiClient.ts` centralizes all HTTP communication:
- Automatic **JWT injection** via interceptors.
- **Refresh Token** handling (automatic 401 retry).
- Environment-based base URL configuration.

### 4. Visual Philosophy
The UI follows a "Glassmorphism" and "Weather-reactive" design. Components like `WeatherBackground` dynamically adjust the app's look based on real-world conditions fetched from the backend.
