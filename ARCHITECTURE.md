# ARCHITECTURE.md

> Living document. We will update this as the app develops.

## App Overview
**TeeMetric** is an Android golf app for tracking swings, measuring ball distance, and keeping personal stats for improving long and short game.

## 1. Development Framework
**React Native with Expo (TypeScript)**

| Decision | Reason |
|---|---|
| React Native | One JavaScript/TypeScript codebase, large community, strong tutorials for development outside of the classroom, studied in class |
| Expo (managed workflow) | Ready-made modules for GPS, camera and motion sensors, fast setup, easy testing on a real phone with Expo Go, studied in class |
| TypeScript | Catches errors early and makes code easier to review in pull requests, studied in class |

**Alternatives considered:** Flutter (strong performance, but the team has no experience), Ionic/Cordova (weaker sensor support and native feel).

## 2. Project Dependencies

| Purpose | Library | Notes |
|---|---|---|
| Navigation | `expo-router` | Bottom tabs plus stack screens, see section 4 |
| GPS / location | `expo-location` | Shot start and ball position, course location |
| Swing sensors | `expo-sensors` (Accelerometer, Gyroscope) | Swing tempo and consistency |
| Camera | `expo-camera` | Record swing video for review |
| Local files | `expo-file-system` | Keep swing videos on the phone |
| Maps | `react-native-maps` | Show shot positions and distances on the course |
| Local database | `expo-sqlite` | Offline storage of rounds, shots, swings, practice sessions |
| Cloud backend | Firebase (Auth + Firestore) | Account login and optional cloud sync, see sections 6 and 7 |
| Styling | `nativewind` | Tailwind-style utility classes for consistent styling across screens |
| Icons | `@expo/vector-icons` | Included with Expo |
| Charts | `react-native-gifted-charts` | Score, putts and distance trends |
| State management | React Context | Built into React and in line with the course; enough for auth, settings and the active round. Revisit Zustand only if re-render issues appear |
| Date handling | `date-fns` | Round dates and history |
| Testing | `jest` + `@testing-library/react-native` | Unit tests for scoring and distance logic |
| Code quality | ESLint + Prettier | Consistent style, enforced in PR review |

## 3. Target Devices
- **Platform:** Android (the only required target)
- **Minimum version:** Android 8.0 (API 26); confirm against the Expo SDK version we install.
- **Test devices:** Our own phones using Expo Go, Android Studio emulators
- **Notes:** GPS, camera and swing sensor testing must be done on a real phone, since emulators cannot simulate real swings or accurate outdoor location. iOS is out of scope for now, though React Native keeps that option open later.

## 4. Navigation Strategy
**Bottom tab navigation** with stack navigation inside each tab.

| Tab | Screens |
|---|---|
| **Home** | Dashboard: recent rounds, quick stats, start new round button |
| **Play** | Active round: hole-by-hole score and putts entry, mark shot, shot distance |
| **Swings** | Record a swing (sensor metrics plus video), log practice sessions, swing and practice history |
| **Stats** | Score and putts trends, average distance per club, best rounds |
| **Profile** | Account, clubs in bag, settings, units (yards/metres) |

Stack screens (pushed on top of tabs): Round Summary, Course Detail, Shot Detail, Swing Detail, Practice Session Detail, Add/Edit Club, Login/Sign Up.

Rationale: golfers need quick access to the main areas, and during a round the Play tab must be one tap away.

## 5. Hardware Integrations

| Hardware | Use | Library |
|---|---|---|
| **GPS** | Mark where a shot was hit and where the ball landed, then compute the distance using the Haversine formula. Also used to find nearby courses. | `expo-location` |
| **Camera** | Record swing video, saved on the phone and linked to the swing record so it can be reviewed alongside the sensor metrics | `expo-camera`, `expo-file-system` |
| **Accelerometer** | Detect swing motion and estimate tempo and relative swing speed | `expo-sensors` |
| **Gyroscope** | Measure rotation during the swing to assess consistency | `expo-sensors` |
| **Speaker / haptics** (stretch goal) | Audio or vibration cue when a swing is detected | `expo-haptics`, `expo-av` (see risks) |
| **Fingerprint / biometrics** (stretch goal) | Optional quick unlock of the app | `expo-local-authentication` |

**Known limits:** Phone GPS is typically accurate to a few metres, so very short shots will have a larger percentage error. Swing metrics from phone sensors are estimates and will be presented as such (not as professional launch-monitor data). Phone placement (pocket, armband, or hand) affects the data, so we will document a recommended placement. Swing video is for the golfer to review; the app does not analyse the video itself.

## 6. Database

**Approach: offline-first.** Golf courses often have poor signal, so all data is written to the local database first and synced to the cloud when online. Swing videos stay on the phone; only their metrics sync.

- **Local:** SQLite via `expo-sqlite`
- **Cloud (sync/backup):** Firebase Firestore

**Core tables / collections:**

| Entity | Key fields |
|---|---|
| `users` | id, email, display_name, preferred_units |
| `courses` | id, name, location (lat/lng), number_of_holes, par_per_hole |
| `rounds` | id, user_id, course_id, date, total_score, total_par |
| `hole_scores` | id, round_id, hole_number, par, strokes, putts |
| `clubs` | id, user_id, name (e.g. "7 iron"), type |
| `shots` | id, round_id, hole_number, club_id, start_lat, start_lng, end_lat, end_lng, distance, timestamp |
| `swings` | id, user_id, shot_id (optional), practice_session_id (optional), club_id, tempo, peak_acceleration, consistency_score, raw_data_ref, video_uri (local file, optional), timestamp |
| `practice_sessions` | id, user_id, date, duration, balls_hit, clubs, notes |

**Relationships:** a user has many rounds and practice sessions; a round belongs to a course and has many hole scores and shots; a shot uses one club and may have one swing record; a practice session can have many swings.

## 7. Authentication
- **Provider:** Firebase Authentication
- **Methods:** Email and password to start; Google Sign-In as a stretch goal
- **Session handling:** Token stored securely with `expo-secure-store`
- **Guest mode:** Users can score rounds locally without an account; signing in enables cloud sync
- **Security:** No credentials in the repo. API keys and config live in environment variables (`.env`, listed in `.gitignore`). Firestore security rules ensure users can only read and write their own data.

## 8. AI Features
Planned (scope is likely to shrink):

1. **Swing and round feedback:** Send summarized (not raw) stats, such as average distance per club, score and putts trends, and swing tempo consistency, to an LLM API and display plain-language tips (e.g. "Your 7-iron distance varies by 20 yards; focus on tempo").
2. **Club distance recommendations:** Suggest which club to use based on the user's own average distances. This is computed from the user's data and does not require an LLM.
3. **Round summaries:** A short written recap after each round.

**Implementation notes:**
- API calls go through a small backend function (e.g. Firebase Cloud Function) so the API key is never shipped inside the app.
- Only aggregated stats are sent, never personal details such as email or exact home location.
- AI output is labelled as a suggestion, and the app works fully without it.
- Provider: Anthropic Claude API

## 9. Repository Structure (proposed)

```
/app            Screens and navigation (expo-router)
/components     Reusable UI components
/hooks          Custom hooks (useLocation, useSwingSensor, useSwingRecorder)
/services       Database, auth, AI, and sync logic
/utils          Distance calculation, scoring helpers
/types          TypeScript types
/assets         Images and icons
/tests          Unit tests
ARCHITECTURE.md
README.md
```

## 10. Risks and Open Questions

| Risk | Mitigation |
|---|---|
| Swing detection from phone sensors may be unreliable | Build a spike early in Sprint 1, simplify to tempo-only if needed |
| Swing videos use a lot of phone storage | Keep videos on the phone only, cap recording length, let users delete videos |
| GPS accuracy on short shots | Show distance as an estimate, allow manual adjustment |
| Poor course connectivity | Offline-first storage with later sync |
| Two-way SQLite/Firestore sync is complex | SQLite is the source of truth; Firestore is a one-way backup |
| Firebase Cloud Functions may need a billing-enabled plan to call outside APIs | Confirm before building the AI feature; if not possible, AI stays a stretch goal |
| Native Firebase modules don't run in Expo Go | Use the Firebase JS SDK |
| `expo-av` is deprecated in newer Expo SDKs | Use `expo-audio` if our SDK version no longer supports `expo-av` |
| AI feature costs and key security | Backend proxy, aggregated data, rate limiting |
| Scope too large for the timeline | Core scoring and distance first; swing tracking and AI are staged after |

## 11. Change Log

| Date | Change | Decided by |
|---|---|---|
| 2026-10-13 | Initial architecture draft | Team |
| 2026-10-15 | Reconciled with team charter. Decided: expo-router, NativeWind, React Context, react-native-gifted-charts. Swing tracking uses sensors and camera (both core; videos stay on the phone). Added `practice_sessions` table and putts per hole. Min Android version set. Added technical risks. | Isaac Jenkins consulting the team |
