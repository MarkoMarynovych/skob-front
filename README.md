# Plast-Proba Frontend

A modern, production-ready frontend application for the Plast-Proba digital scout management system.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **UI Components**: NextUI v2
- **State Management**: Redux Toolkit & RTK Query
- **Routing**: React Router v6
- **Architecture**: Feature-Sliced Design (FSD)

## Prerequisites

- Node.js 18+
- pnpm 8+

## Getting Started

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
pnpm build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

### Linting

```bash
pnpm lint
```

## Project Structure (FSD)

```
src/
├── app/              # Application initialization layer
│   ├── providers/    # Global providers (Redux, NextUI, Router)
│   ├── router/       # Route configuration
│   └── store/        # Redux store setup
├── pages/            # Route pages (Dashboard, Login, etc.)
├── widgets/          # Composite UI blocks (Navbar, GroupList, etc.)
├── features/         # Business logic features (SignProba, CreateGroup)
├── entities/         # Business entities (User, Group, Proba)
│   ├── user/
│   ├── group/
│   ├── proba/
│   └── session/
└── shared/           # Reusable non-business code
    ├── api/          # API client configuration
    ├── ui/           # Shared UI components
    └── lib/          # Helper functions and utilities
```

## Features

### User Roles

- **SCOUT**: View personal proba progress
- **FOREMAN**: Manage groups, sign probas, add notes
- **LIAISON**: Oversee foremen and their groups
- **ADMIN**: System-wide management

### Key Features

- Google OAuth authentication
- Role-based access control
- Proba progress tracking
- Group management
- Invitation system
- Responsive mobile-first design
- Code splitting and lazy loading
- Error boundaries for graceful error handling

## Performance Optimization

- Code splitting by route and vendor libraries
- Lazy-loaded page components
- Optimized bundle sizes (target: <300KB gzipped)
- Gzip compression enabled

## Code Quality

- Self-documenting code with clear naming
- Strict TypeScript configuration
- No console.log statements in production
- Comprehensive loading and error states
- FSD architectural compliance

## API Integration

All API calls are made using RTK Query. The base URL is configured via environment variables.

Key API endpoints:
- `/auth/google` - OAuth login
- `/users/me` - Current user
- `/groups` - Group management
- `/probas` - Proba progress
- `/invites` - Invitation system

## Development Guidelines

1. Follow FSD architecture strictly
2. Use intention-revealing names
3. No comments in code (self-documenting)
4. Add loading states for all async operations
5. Handle errors with toast notifications
6. Mobile-first responsive design
7. Use NextUI components for consistency

## License

Proprietary
