# EAS Build Instructions

Complete guide for building Android (APK/AAB) and iOS (IPA) installation files.

## Prerequisites

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Install LTS version

2. **Install EAS CLI globally**
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo account**
   ```bash
   eas login
   ```

4. **Link project to EAS**
   ```bash
   eas build:configure
   ```
   This will create/update your `eas.json` and add a project ID to `app.json`.

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure App Metadata

Update `app.json` with your actual values:
- **App Name**: Change `"name"` field
- **Bundle Identifier (iOS)**: Change `ios.bundleIdentifier`
- **Package Name (Android)**: Change `android.package`
- **Version**: Update `version` field
- **Build Numbers**: Update `ios.buildNumber` and `android.versionCode`

### 3. Prepare Assets

Replace placeholder assets in `assets/` folder:
- `icon.png` (1024x1024px)
- `adaptive-icon.png` (1024x1024px)
- `splash.png` (1284x2778px)
- `favicon.png` (48x48px)

### 4. Initialize EAS Project (First Time Only)
```bash
eas init
```

## Android Builds

### Build APK (Preview/Testing)

```bash
# Using npm script
npm run build:android:apk

# Or directly with EAS
eas build -p android --profile preview
```

**What this does:**
- Creates a debug APK file
- Suitable for testing on physical devices
- Can be installed directly via ADB or QR code

**Download the APK:**
1. Build will complete on EAS servers
2. You'll receive a download link via email/terminal
3. Or visit: https://expo.dev/accounts/[your-account]/builds
4. Download the `.apk` file

### Build AAB (Production - Google Play Store)

```bash
# Using npm script
npm run build:android:aab

# Or directly with EAS
eas build -p android --profile production
```

**What this does:**
- Creates an Android App Bundle (AAB)
- Required format for Google Play Store
- Optimized for different device configurations
- Auto-increments version code

**Download the AAB:**
1. Build completes on EAS servers
2. Download link provided
3. Upload to Google Play Console

### Install APK on Android Device

#### Method 1: ADB (Android Debug Bridge)

1. **Enable Developer Options** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect device via USB** and install:
   ```bash
   adb install path/to/your-app.apk
   ```

3. **Or install wirelessly** (if ADB over WiFi is enabled):
   ```bash
   adb connect <device-ip>:5555
   adb install path/to/your-app.apk
   ```

#### Method 2: QR Code Installation

1. After build completes, EAS provides a QR code
2. Scan QR code with your Android device
3. Download and install the APK directly

#### Method 3: Direct Download

1. Download APK to your device
2. Open the APK file
3. Allow "Install from Unknown Sources" if prompted
4. Install the app

## iOS Builds

### Build IPA (Production)

```bash
# Using npm script
npm run build:ios

# Or directly with EAS
eas build -p ios --profile production
```

**What this does:**
- Creates an IPA file
- Signed with your Apple Developer certificate
- Ready for TestFlight or App Store submission
- Auto-increments build number

**First-time iOS setup:**
1. EAS will prompt for Apple Developer credentials
2. Choose automatic or manual certificate management
3. EAS handles code signing automatically

### Download IPA

1. Build completes on EAS servers
2. Download link provided in terminal/email
3. Or visit: https://expo.dev/accounts/[your-account]/builds

### Install IPA on iPhone

#### Method 1: TestFlight (Recommended)

1. **Upload to App Store Connect:**
   ```bash
   eas submit -p ios --profile production
   ```
   Or manually upload via App Store Connect

2. **Add to TestFlight:**
   - Go to App Store Connect
   - Navigate to TestFlight
   - Add internal/external testers
   - Testers receive email invitation

3. **Install via TestFlight app:**
   - Install TestFlight from App Store
   - Accept invitation
   - Install your app

#### Method 2: Ad Hoc Distribution

1. **Build with Ad Hoc profile** (update `eas.json`):
   ```json
   "ad-hoc": {
     "distribution": "internal",
     "ios": {
       "buildConfiguration": "Release"
     }
   }
   ```

2. **Build:**
   ```bash
   eas build -p ios --profile ad-hoc
   ```

3. **Install via:**
   - Download IPA to Mac
   - Use Apple Configurator 2 or Xcode
   - Or use services like Diawi for OTA installation

#### Method 3: Development Build (Expo Go Alternative)

```bash
npm run build:ios:dev
# or
eas build -p ios --profile development
```

Install via TestFlight or direct device installation.

## Build Profiles Explained

### Development
- **Purpose**: Development and debugging
- **Android**: Debug APK
- **iOS**: Debug build
- **Distribution**: Internal only

### Preview
- **Purpose**: Testing on real devices
- **Android**: Release APK
- **iOS**: Release build (no simulator)
- **Distribution**: Internal

### Production
- **Purpose**: App Store/Play Store release
- **Android**: AAB (App Bundle)
- **iOS**: Release IPA
- **Distribution**: Public
- **Auto-increment**: Enabled

## Version Management

### Android
- **Version Name**: Set in `app.json` → `version` (e.g., "1.0.0")
- **Version Code**: Set in `app.json` → `android.versionCode` (integer, auto-increments in production)

### iOS
- **Version**: Set in `app.json` → `version` (e.g., "1.0.0")
- **Build Number**: Set in `app.json` → `ios.buildNumber` (string, auto-increments in production)

## Troubleshooting

### Build Fails

1. **Check logs:**
   ```bash
   eas build:list
   eas build:view [build-id]
   ```

2. **Common issues:**
   - Missing assets → Ensure all assets exist
   - Invalid bundle identifier → Check app.json
   - Signing errors → Run `eas credentials`
   - TypeScript errors → Fix before building

### TypeScript Errors

```bash
# Check for errors
npx tsc --noEmit
```

### Missing Dependencies

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### EAS Credentials Issues

```bash
# Manage credentials
eas credentials

# Reset credentials (if needed)
eas credentials --platform ios
eas credentials --platform android
```

## Quick Reference Commands

```bash
# Android APK (testing)
npm run build:android:apk

# Android AAB (production)
npm run build:android:aab

# iOS IPA (production)
npm run build:ios

# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Submit to stores
eas submit -p android
eas submit -p ios
```

## Next Steps After Building

1. **Test thoroughly** on real devices
2. **Update version numbers** for next release
3. **Submit to stores:**
   - Google Play: Upload AAB via Play Console
   - App Store: Submit via App Store Connect or `eas submit`
4. **Monitor builds** at https://expo.dev

## Support

- EAS Documentation: https://docs.expo.dev/build/introduction/
- Expo Forums: https://forums.expo.dev/
- EAS Status: https://status.expo.dev/

