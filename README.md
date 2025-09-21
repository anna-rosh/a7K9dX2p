# Local-First Comments Project

A React TypeScript application featuring a commenting system with local-first architecture, real-time synchronization, and offline support.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** (for CouchDB replication - optional)

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Optional: Start CouchDB for multi-device sync:**

   ```bash
   npm run docker:setup
   ```

4. **Optional: Test PWA functionality:**
   ```bash
   npm run build
   npm run preview
   ```

## Features

### ✅ Implemented

- **Complete commenting system** with threaded replies
- **Real-time updates** using RxDB observables
- **Local-first architecture** with IndexedDB storage (Dexie)
- **Offline support**: works without internet connection
- **Multi-device sync** via CouchDB replication
- **User switching**: simulate multiple users for easier testing
- **Responsive design**: mobile and desktop optimized
- **Modern UI** using shadcn/ui components
- **Comprehensive testing** with Vitest and React Testing Library
- **ESLint + Prettier** for code quality

### 🎯 Core Functionality

- Add new comments
- Reply to existing comments
- Delete own comments
- Real-time comment updates
- Persistent local storage
- Cross-device synchronization

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: RxDB with Dexie (IndexedDB) storage
- **Replication**: CouchDB for multi-device sync
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Configuration Note

⚠️ **Local Development Setup**: This application is designed for local development and testing. Configuration values that would normally be stored in environment files (like database URLs, credentials) are hardcoded in the `src/constants/` directory and configuration files (docker-compose.yml, setup scripts) for convenience.

**In a production environment**, these values should be moved to proper environment variables and secure credential management systems.

## Testing

### Running Tests

```bash
npm test                # Run all tests once
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Open Vitest UI
```

### Manual Testing Tips

**User Simulation:**

- The application includes mock users (Winnie The Pooh and Donald Duck) to simulate different logged-in users
- Switch between users using the user selector to change authorship
- When testing from different browsers, different users help distinguish comment sources

**Multi-Device Sync Testing:**

- **Essential**: Run `npm run docker:setup` to start CouchDB before testing replication (make sure your Docker runtime is up)
- Open the app in multiple browser tabs or different browsers
- Switch to different users in each browser to simulate multiple people commenting
- Add comments/replies and observe real-time sync between tabs/browsers

**PWA Testing:**

- **Required**: Build the app first with `npm run build`
- Run `npm run preview` to test PWA functionality
- Test offline behavior by disconnecting network
- Verify data persistence when going offline/online

**Testing Scenarios:**

1. **Offline-first**: Disconnect network, add comments, reconnect and see sync
2. **Multi-user**: Use different users to test comment ownership and delete permissions
3. **Real-time updates**: Open multiple tabs and see live comment updates
