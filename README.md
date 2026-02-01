# TollTrack SA 🚗

A modern, TypeScript-based toll gate management system for South African routes with pure Bun runtime.

## Features

- **Trip Calculator**: Build custom routes and calculate toll costs
- **Trip History**: Track past trips with comprehensive statistics
- **Saved Routes**: Quick access to frequently traveled routes
- **Toll Lookup**: Search and browse all toll gates with real-time pricing
- **Dark Mode**: Full dark mode support with persistent theme
- **Export Data**: Export trip history to CSV

## Tech Stack

### Runtime

- **Bun** - Pure Bun runtime (no Node.js) for both client and server

### Frontend

- **React 18.3.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 6.4.1** - Build tool (via `bunx --bun vite`)
- **Tailwind CSS 3.4.19** - Styling
- **Lucide React** - Icon system

### Backend

- **Elysia 1.4.22** - Web framework
- **SQLite** - Database (via `bun:sqlite`)
- **TypeScript 5.9.3** - Type safety

### Testing

- **Bun Test** - Built-in test runner
- **happy-dom** - DOM testing for client

## Project Structure

```
tolltrack_za/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── common/    # Reusable components
│   │   │   └── layout/    # Layout components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API layer
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   │   └── __tests__/ # Unit tests
│   │   ├── config/        # Configuration
│   │   └── types/         # TypeScript definitions
│   └── package.json
├── server/                # Elysia backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── data/             # Seed data (JSON)
│   └── package.json
└── package.json          # Root workspace config
```

## Getting Started

### Prerequisites

- **Bun >= 1.3.1** - [Install Bun](https://bun.sh)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd tolltrack_za

# Install dependencies for all workspaces
bun install && bun install:all
```

### Development

```bash
# Run both client and server in development mode
bun run dev

# Run only the server
bun run dev:server

# Run only the client
bun run dev:client
```

The application will be available at:

- **Client**: http://localhost:5173 (Vite dev server)
- **Server**: http://localhost:3001 (Elysia API server)

### Building for Production

```bash
# Build both client and server
bun run build

# Build only client
cd client && bun run build

# Build only server
cd server && bun run build
```

### Running Tests

```bash
# Run all tests (client + server)
bun test

# Run only client tests (38 tests)
cd client && bun test

# Run only server tests (39 tests: 21 unit + 18 integration)
cd server && bun test

# Run only integration tests (requires server running)
cd server && bun test __tests__/integration/api.test.ts
```

**Test Coverage**: 77 comprehensive tests

- **Client**: 38 tests covering date utils, currency formatting, toll calculations, and CSV export
- **Server Unit Tests**: 21 tests for toll gate and route services
- **Server Integration Tests**: 18 tests for API endpoints (auto-skip when server not running)

**Test Framework**: Bun's built-in test runner with happy-dom for client-side DOM testing.

### Type Checking

```bash
# Check types for both client and server
bun run type-check

# Check types for client only
cd client && bun run type-check

# Check types for server only
cd server && bun run type-check
```

## API Endpoints

All API responses follow the format: `{success: boolean, data?: any, error?: string}`

### Toll Gates

- `GET /api/tollgates` - Get all toll gates
  ```json
  // Response
  {
    "success": true,
    "data": [{"id": 1, "name": "...", ...}]
  }
  ```

### Route Calculation

- `POST /api/calculate-route` - Calculate route cost
  ```json
  // Request
  {
    "tollGateIds": [1, 2, 3],
    "vehicleClass": 1
  }
  // Response
  {
    "success": true,
    "data": {
      "count": 3,
      "totalCost": 150.00,
      "tollgates": [...],
      "vehicleClass": 1
    }
  }
  ```

### Trips

- `GET /api/trips/:userId` - Get user trips
- `POST /api/trips` - Create trip
- `DELETE /api/trips/:id` - Delete trip
- `GET /api/trips/:userId/stats` - Get trip statistics

### Saved Routes

- `GET /api/saved-routes/:userId` - Get saved routes
- `POST /api/saved-routes` - Create saved route
- `DELETE /api/saved-routes/:id` - Delete saved route

## Database

The application uses SQLite with automatic initialization:

- Database file: `server/tollgates.db`
- Seed data: `server/data/tollgates.json`
- Automatic seeding on first run if database doesn't exist

## TypeScript Configuration

### Client (`client/tsconfig.json`)

- **Target**: ES2020
- **JSX**: react-jsx (no React imports needed)
- **Module Resolution**: bundler
- **Strict mode**: enabled
- **Path alias**: `@/*` → `./src/*`

### Server (`server/tsconfig.json`)

- **Target**: ESNext
- **Module Resolution**: bundler
- **Bun types**: included
- **Strict mode**: enabled
- **JSON imports**: enabled

## Scripts

### Root

- `bun run dev` - Run both client and server
- `bun test` - Run all tests
- `bun run type-check` - Type check all workspaces
- `bun run build` - Build all workspaces

### Client

- `bun run dev` - Start Vite dev server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun test` - Run unit tests
- `bun run type-check` - Check TypeScript types

### Server

- `bun run dev` - Start server with watch mode
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun test` - Run tests
- `bun run type-check` - Check TypeScript types

## Environment Variables

### Client

- `VITE_API_URL` - API base URL (default: `http://localhost:3001/api`)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `bun run type-check` to ensure no TypeScript errors
4. Run `bun test` to ensure all tests pass
5. Submit a pull request

## License

MIT

## Author

TollTrack SA Team
