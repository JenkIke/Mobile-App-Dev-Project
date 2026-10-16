# TeeMetric

TeeMetric is an Android golf app for tracking swings, measuring ball distance with GPS, and keeping personal stats to improve both the long and short game. It is built with React Native, Expo (managed workflow) and TypeScript as a SAIT team course project. Rounds and practice data are stored on the phone first so the app works on courses with poor signal, with optional cloud backup.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the stack, data model, navigation plan and other technical decisions.

## Prerequisites

- [Node.js](https://nodejs.org/) LTS
- The **Expo Go** app on an Android phone (from the Google Play Store)
- Optional: [Android Studio](https://developer.android.com/studio) with an Android emulator

## Getting started

```bash
git clone https://github.com/JenkIke/Mobile-App-Dev-Project.git
cd Mobile-App-Dev-Project
npm install
npx expo start
```

Then open Expo Go on your Android phone and scan the QR code shown in the terminal. Your phone and computer need to be on the same Wi-Fi network (if that doesn't work, try `npx expo start --tunnel`). To use an emulator instead, start it from Android Studio and press `a` in the terminal.

Copy `.env.example` to `.env` when the project starts using API keys. Never commit `.env`.

## npm scripts

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm start`         | Start the Expo dev server                       |
| `npm run android`   | Start the dev server and open it on Android     |
| `npm run lint`      | Check code with ESLint (Expo config)            |
| `npm run format`    | Format all files with Prettier                  |
| `npm run typecheck` | Check TypeScript types without building the app |

Run `npm run lint` and `npm run typecheck` before opening a pull request.

## Project structure

```
/app          Screens and navigation (expo-router)
/components   Reusable UI components
/hooks        Custom hooks
/services     Database, auth, AI and sync logic
/utils        Distance calculation, scoring helpers
/types        TypeScript types
/assets       Images and icons
/tests        Unit tests
```

## Branching and pull requests

`main` stays stable: never commit to it directly. Create one branch per issue (e.g. `feature/<issue-number>-short-name`) and merge it through a pull request reviewed by a teammate.
