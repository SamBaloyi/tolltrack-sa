# TollTrackSA - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

#### Backend (Server)

```bash
cd server
bun install
```

#### Frontend (Client)

```bash
cd client
npm install
# or if you prefer bun:
bun install
```

### Step 2: Start the Backend Server

```bash
cd server
bun run dev
```

You should see:

```
🚗 Toll Gate Tracker API running at http://localhost:3001
```

### Step 3: Start the Frontend

Open a NEW terminal window:

```bash
cd client
npm run dev
# or
bun run dev
```

Your browser will automatically open to `http://localhost:3000`

## ✅ You're All Set!

The application is now running with:

- ✨ All major SA toll gates pre-loaded
- 📊 Full trip tracking capabilities
- 💰 Cost calculations for all vehicle classes
- 🌓 Dark/Light mode support

## 📱 Using the Application

### 1. Trip Calculator

- Select your starting point and destination
- Choose your vehicle class (1-4)
- Search and select toll gates on your route
- See real-time cost calculation
- Save your trip for tracking

### 2. Trip History

- View all saved trips
- See spending statistics
- Filter by date
- Export to CSV

### 3. Saved Routes

- Save frequently traveled routes
- Quick access for future trips

### 4. Toll Lookup

- Search any toll gate
- Filter by route (N1, N3, N4, etc.)
- View costs for all vehicle classes

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Calculations**: Instant cost updates
- **Data Export**: Download your trip history as CSV
- **Smart Search**: Find toll gates quickly
- **Statistics Dashboard**: Track your spending patterns

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Run all tests (59 tests total)
bun test

# Run only client tests (38 tests)
cd client && bun test

# Run only server tests (21 unit + 18 integration = 39 tests)
cd server && bun test

# Run only integration tests (requires server to be running)
cd server && bun test __tests__/integration/api.test.ts
```

**Test Coverage:**

- ✅ 38 client tests (utilities and helpers)
- ✅ 21 server unit tests (services)
- ✅ 18 integration tests (API endpoints)

**Note:** Integration tests automatically skip when the server is not running.

## 🔧 Troubleshooting

### Backend won't start

- Ensure Bun is installed: `bun --version`
- Check if port 3001 is available
- Delete `tollgates.db` and restart to rebuild

### Frontend won't start

- Ensure Bun is installed: `bun --version`
- Delete `node_modules` and reinstall
- Check if port 5173 is available (Vite default)

### Can't connect to API

- Verify backend is running on port 3001
- Check browser console for errors
- Ensure no firewall is blocking the connection

### Tests failing

- Ensure all dependencies are installed: `bun install`
- Integration tests require the server to be running
- Run `bun run type-check` to check for TypeScript errors

## 📝 Notes

- Your user ID is automatically generated and saved in your browser
- All data is stored locally in SQLite
- Theme preference is saved in localStorage
- No internet connection required after initial setup

## 🎯 Next Steps

1. Start planning your trips
2. Track your toll expenses
3. Save your favorite routes
4. Export data for expense claims

Enjoy using TollTrackSA! 🚗💨
