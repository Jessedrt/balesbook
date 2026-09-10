# BaleBook for Android

BaleBook is a TanStack Start server-rendered app with its data in Postgres. The
Android app is a **native shell around the hosted backend** (Capacitor 8): the
WebView loads the deployed app at `BALEBOOK_SERVER_URL`, so it uses the same
code, the same database, and the same sign-in as the website. Nothing in the
Android layer substitutes local or mock data.

## Prerequisites

- Node 22+
- JDK 17+ (`java -version`)
- Android Studio, or the Android SDK with **Android 16 (API 36)** platform and
  build tools (Google Play requires new apps/updates to target API 36 as of
  Aug 31 2026 — the generated project already sets `compileSdk 36 / targetSdk 36`).

## 1. Point the shell at your backend

The URL is required and never guessed, so a build can never ship against the
wrong server. It is **not** hardcoded anywhere in git.

```bash
# one-off, or put it in a gitignored .env as BALEBOOK_SERVER_URL=https://…
BALEBOOK_SERVER_URL=https://your-balebook.example.com npm run android:sync
```

`android:sync` = `scripts/write-capacitor-config.mjs` (writes
`capacitor.config.json`) + `npx cap sync android`.

## 2. Build

```bash
npm run android:open   # open in Android Studio
npm run android:run    # install a debug build on a connected device
npm run android:aab    # production .aab for Google Play
```

`android:aab` runs `npm run android:sync` then
`cd android && ./gradlew bundleRelease`.

## 3. Signing for Google Play (Play App Signing)

You are set up for **Play App Signing**: Google holds the app-signing key, and
you keep only an *upload* key.

1. Generate an upload keystore **on your own machine** (never commit it):

   ```bash
   keytool -genkeypair -v -storetype PKCS12 \
     -keystore android/balebook-upload.keystore -alias balebook-upload \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Copy `android/keystore.properties.example` to `android/keystore.properties`
   (gitignored) and fill in `storeFile`, `storePassword`, `keyAlias`,
   `keyPassword`.

3. Build with a version bump and upload the `.aab`:

   ```bash
   cd android && ./gradlew bundleRelease -PversionCode=2 -PversionName=1.0.1
   ```

   The signed bundle lands in
   `android/app/build/outputs/bundle/release/app-release.aab`.

4. In Google Play Console: create the app, opt into Play App Signing, and
   provide the **upload** key's certificate (Play Console → Setup → App
   integrity). Export it with:

   ```bash
   keytool -exportcert -keystore android/balebook-upload.keystore \
     -alias balebook-upload -rfc
   ```

## Environment variables (hosting, for the web app the Android shell loads)

| Variable               | Required in production? | Purpose                                   |
| ---------------------- | ----------------------- | ----------------------------------------- |
| `DATABASE_URL`         | Yes                     | Postgres connection (Neon)                |
| `BETTER_AUTH_SECRET`   | **Yes**                 | Session signing. The app **fails to start** without it once `DATABASE_URL` is set, instead of silently rotating a per-process secret. |
| `BALEBOOK_SERVER_URL`  | Yes (Android build)     | Origin the WebView loads                  |
| `GROK_AUTH_CLIENT_ID/SECRET` | No              | Enables Google/X via the broker; without them the app runs on email + password |
| `VITE_AUTH_ENABLED`    | Yes (deployed)          | Must be `true` to enforce real sign-in    |

## Regenerating icons / splash

```bash
npm run assets:android
```

Draws the existing BaleMark (src/components/mark.tsx) at every density. The
outputs are committed so a fresh clone builds without running the generator.
