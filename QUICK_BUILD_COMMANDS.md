# 🚀 Quick Build Commands Reference

## Prerequisites Setup (One-Time)

```bash
# 1. Install Node.js (if not installed)
# Download from https://nodejs.org/

# 2. Install EAS CLI globally
npm install -g eas-cli

# 3. Login to Expo
eas login

# 4. Configure EAS project (first time only)
eas build:configure
```

## 📱 Android Builds

### Build APK (For Testing)
```bash
npm run build:android:apk
```
**OR**
```bash
eas build -p android --profile preview
```

**Download:** Check email or visit https://expo.dev/accounts/[your-account]/builds

**Install on Android:**
```bash
# Method 1: ADB
adb install path/to/app.apk

# Method 2: Scan QR code from EAS dashboard
# Method 3: Download directly to device and install
```

### Build AAB (For Google Play Store)
```bash
npm run build:android:aab
```
**OR**
```bash
eas build -p android --profile production
```

**Upload to Play Store:** Download AAB and upload via Google Play Console

## 🍎 iOS Builds

### Build IPA (For App Store/TestFlight)
```bash
npm run build:ios
```
**OR**
```bash
eas build -p ios --profile production
```

**First-time iOS setup:**
- EAS will prompt for Apple Developer credentials
- Choose automatic certificate management
- EAS handles code signing

**Download:** Check email or visit https://expo.dev/accounts/[your-account]/builds

**Install on iPhone:**

**Option 1: TestFlight (Recommended)**
```bash
# Submit to App Store Connect
eas submit -p ios --profile production

# Then add to TestFlight via App Store Connect
# Testers install via TestFlight app
```

**Option 2: Ad Hoc Distribution**
- Download IPA from EAS
- Install via Apple Configurator 2 or Xcode
- Or use OTA services like Diawi

## 📊 Check Build Status

```bash
# List all builds
eas build:list

# View specific build details
eas build:view [build-id]
```

## 🔍 Validate Before Building

```bash
# Validate project configuration
node scripts/validate-project.js

# Check TypeScript errors
npx tsc --noEmit

# Test app locally
npm start
```

## 📝 Update Version Numbers

Before each production build, update in `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",  // Update version
    "ios": {
      "buildNumber": "2"  // Increment build number
    },
    "android": {
      "versionCode": 2  // Increment version code
    }
  }
}
```

**Note:** Production profile has `autoIncrement: true`, so version codes increment automatically.

## 🎯 Complete Build Workflow

### For Android Production Release:

```bash
# 1. Update version in app.json
# 2. Validate project
node scripts/validate-project.js

# 3. Build AAB
npm run build:android:aab

# 4. Wait for build to complete (check email/dashboard)
# 5. Download AAB from EAS dashboard
# 6. Upload to Google Play Console
```

### For iOS Production Release:

```bash
# 1. Update version in app.json
# 2. Validate project
node scripts/validate-project.js

# 3. Build IPA
npm run build:ios

# 4. Wait for build to complete
# 5. Submit to App Store
eas submit -p ios --profile production

# OR download IPA and upload manually via App Store Connect
```

## ⚠️ Important Notes

1. **Assets Required:** Ensure `assets/` folder has:
   - `icon.png` (1024x1024px)
   - `adaptive-icon.png` (1024x1024px)
   - `splash.png` (1284x2778px)

2. **Bundle Identifiers:** Must be unique. Update in `app.json`:
   - iOS: `ios.bundleIdentifier`
   - Android: `android.package`

3. **First Build:** May take 10-20 minutes. Subsequent builds are faster.

4. **Build Limits:** Free Expo accounts have build limits. Consider EAS Build subscription for unlimited builds.

## 🆘 Need Help?

- **Build Logs:** `eas build:view [build-id]`
- **Credentials:** `eas credentials`
- **Documentation:** https://docs.expo.dev/build/introduction/
- **Status:** https://status.expo.dev/

