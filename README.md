# 🏋️ ForgeFit Mobile

A mobile gym app built with **React Native + Expo + TypeScript**. Authenticate, create and run workout routines, log sets (weight/reps), track weekly progress with charts, and share summaries.

![App Screenshot](./Screenshots/Screenshot_20261110_125851_Expo%20Go.jpg)

---

## ✨ Features

- 🔐 **Authentication** with JWT and secure persistence (`expo-secure-store`).
- 🏋️ **Routines** — global and custom plans with exercises, sets, and rest times.
- ▶️ **Active sessions** — real-time set logging (kg/reps, complete or skip).
- 📊 **Dashboard** — weekly volume chart and overall metrics.
- 📜 **History** — paginated sessions with status filters (completed, in progress, cancelled).
- 👤 **Profile** — preferences, stats, and light/dark theme toggle.
- 🔔 **Weekly reminders** (optional, requires development build on Android).
- 📸 **Share summary** as a PNG image.
- 🎨 **Dark mode** with NativeWind (`class` strategy).

---

## 🧰 Tech Stack

| Layer          | Technology                                     |
| :------------- | :--------------------------------------------- |
| Framework      | Expo SDK 57, React Native 0.86                 |
| Language       | TypeScript                                     |
| Routing        | Expo Router (file-based)                       |
| Styling        | NativeWind (Tailwind CSS)                      |
| Server state   | TanStack Query                                 |
| Client state   | Zustand                                        |
| Forms          | React Hook Form + Zod                          |
| Charts         | react-native-gifted-charts                     |
| Icons          | @react-native-vector-icons/ionicons            |
| Illustrations  | Local SVGs with `react-native-svg-transformer` |
| Notifications  | expo-notifications                             |
| Testing        | Jest + jest-expo, React Native Testing Library |
| unit/component |

---

## 📱 Demo and Backend (Important Note)

Some screenshots of this app in Screenshots folder.

This project includes a **demo APK** that you can download to test the application on a real Android device.

**[⬇️ Download APK (Google Drive)](https://drive.google.com/file/d/1mmis2WYMAsWWWYoIPZE_UBmbNIIncbyp/view?usp=sharing)**

> **⚠️ Backend notice:** The application is configured to connect to a test backend deployed on **Render**. This free service **automatically shuts down after a period of inactivity**, so some server-dependent features (login, data loading, etc.) may not respond correctly if the backend is "asleep." The app's UI and navigation work without issues.

### 🛠️ Want to try it locally?

If you want to run the project on your own machine, follow the installation instructions below. You will need to configure your own environment variables for the backend (or use the test backend if it is active).

---

## 📋 Requirements

- Node.js ≥ 20
- npm or yarn
- Expo Go on your device (or a development build for notifications on Android)
- ForgeFit backend (https://github.com/nelsonacb/gym-app-backend) running (default: `http://<your-ip>:4000/api`)

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd gymapp

# 2. Install dependencies
npm install

# 3. (Optional) Configure the backend URL
echo "EXPO_PUBLIC_API_URL=http://192.168.X.X:4000/api" > .env

# 4. Start the app
npx expo start
```

````

Scan the QR code with **Expo Go** or press `a` / `i` to open in an emulator.

> **Note:** if `EXPO_PUBLIC_API_URL` is not set, the app auto-detects the Expo host IP (`Constants.expoConfig.hostUri`). This works when the backend runs on the same machine as Expo.

---

## 📁 Project Structure

```
src/
├── app/                        # Expo Router routes
│   ├── _layout.tsx             # Root (providers + auth gate)
│   ├── (auth)/                 # Login and Register
│   ├── (tabs)/                 # Dashboard, Routines, History, Profile
│   ├── routines/[id].tsx       # Plan detail
│   ├── session/[id].tsx        # Active session / read-only view
│   ├── exercise/[id].tsx       # Per-exercise progress
│   └── plan-form.tsx           # Create/edit routine (modal)
├── components/                 # Reusable UI
├── /__tests__/                 # Test components
├── lib/
│   ├── api/                    # fetch wrapper, types, errors, token
│   ├── services/               # Per-resource API calls
│   ├── hooks/                  # React Query hooks
│   ├── query/                  # QueryClient, keys, persister
│   ├── stores/                 # Zustand (auth, ui)
│   └── schemas/                # Zod schemas
└── assets/
    └── exercises/              # Exercise SVGs
```

---

## 🗺️ Main Routes

| Route              | Description                        |
| :----------------- | :--------------------------------- |
| `/(auth)/login`    | Sign in                            |
| `/(auth)/register` | User registration                  |
| `/(tabs)`          | Dashboard (Home)                   |
| `/(tabs)/routines` | Workout plan list                  |
| `/(tabs)/history`  | Paginated session history          |
| `/(tabs)/profile`  | Profile and preferences            |
| `/routines/[id]`   | Plan detail                        |
| `/session/[id]`    | Active session or read-only detail |
| `/exercise/[id]`   | Exercise progress and PRs          |
| `/plan-form`       | Create/edit routine (modal)        |

---

## 🔌 API (Overview)

Base: `http://<host>:4000/api`

| Method | Endpoint                                       | Auth |
| :----- | :--------------------------------------------- | :--- |
| POST   | `/auth/register`                               | —    |
| POST   | `/auth/login`                                  | —    |
| GET    | `/auth/me`                                     | 🔒   |
| GET    | `/users/me/preferences`                        | 🔒   |
| PUT    | `/users/me/preferences`                        | 🔒   |
| GET    | `/exercises`                                   | 🔒   |
| GET    | `/workout-plans`                               | 🔒   |
| POST   | `/workout-plans`                               | 🔒   |
| GET    | `/workout-plans/:id`                           | 🔒   |
| PATCH  | `/workout-plans/:id`                           | 🔒   |
| DELETE | `/workout-plans/:id`                           | 🔒   |
| GET    | `/workout-sessions`                            | 🔒   |
| POST   | `/workout-sessions/start`                      | 🔒   |
| PATCH  | `/workout-sessions/:id/exercises/:eid/sets/:n` | 🔒   |
| POST   | `/workout-sessions/:id/complete`               | 🔒   |
| POST   | `/workout-sessions/:id/cancel`                 | 🔒   |
| GET    | `/progress/overall`                            | 🔒   |
| GET    | `/progress/exercises/:id`                      | 🔒   |

🔒 = requires `Authorization: Bearer <token>`.

---

## 🧪 Scripts

```bash
npm start          # Start Metro
npm run android    # Open on Android
npm run ios        # Open on iOS
npm run web        # Open in browser
npm run lint       # Linter
npm test           # Run tests
```

---

## 🎨 Adding Exercise Illustrations

1. Copy the exercise folder to `src/assets/exercises/<slug>/frame-1.svg`.
2. Add its `import` in `src/lib/exercise-assets.ts`:

```ts
import BenchPress from '../assets/exercises/bench-press/frame-1.svg';

const exerciseMap = {
  'bench-press': BenchPress,
  // ...
};
```

3. Done. `ExerciseIllustration` resolves the SVG using the slug derived from the exercise name (`name.toLowerCase().replace(/\s+/g, '-')`).

> If an exercise has no SVG, a generic dumbbell icon (`Ionicons barbell-outline`) is shown instead of breaking the UI.

---

## 📱 Expo Go Notes

- **Local notifications** work on **iOS** and on **Android with a development build**. On Android + Expo Go, the toggle is disabled with a warning (SDK 57 known issue).
- **SVGs** are bundled (offline). Only the exercises in use are copied to keep the bundle small (~18 assets vs. 54 MB full set).
````
