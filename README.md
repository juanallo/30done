# 30done - 30-Day Fitness Challenges

A Progressive Web App (PWA) that helps users commit to and complete 30-day fitness challenges with offline support and streak-based tracking.

## Features

- **10+ Fitness Challenges**: From cardio to strength training
- **Offline Support**: Work without internet connection
- **Progress Tracking**: Visual progress with streaks and completion percentages
- **PWA Installation**: Install as a native app on your device
- **Mobile-First Design**: Optimized for mobile devices

## Offline Functionality

30done works completely offline once installed:

### What Works Offline:
- ✅ View all challenges and their details
- ✅ Track your daily progress
- ✅ Mark workouts as completed
- ✅ View your progress history
- ✅ Access exercise images and instructions

### How It Works:
1. **Service Worker**: Automatically caches essential resources on first visit
2. **Local Storage**: Your progress is saved locally on your device
3. **Offline Detection**: App shows offline indicator when connection is lost
4. **Auto-Sync**: Progress syncs when connection is restored

### Testing Offline Mode:
1. Visit the app in your browser
2. Wait for the service worker to cache resources (check browser dev tools)
3. Turn off your internet connection
4. Refresh the page - the app should still work!
5. Try navigating between pages and tracking progress

## Development

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Setup
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS + DaisyUI
- **PWA**: Service Worker + Web App Manifest
- **Storage**: Local Storage for offline data
- **Icons**: Lucide React

## PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline First**: Works without internet connection
- **Fast Loading**: Cached resources for instant access
- **Native Feel**: Full-screen mode and app-like experience

## Browser Support

- Chrome/Edge (full PWA support)
- Firefox (basic PWA support)
- Safari (limited PWA support, manual install required)

## License

MIT License - see LICENSE file for details.

## Development Guidelines

### File Naming Conventions

- **Hooks**: Use camelCase naming (e.g., `