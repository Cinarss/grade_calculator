/**
 * Project validation script
 * Checks for common issues before building
 */

const fs = require('fs');
const path = require('path');

let errors = [];
let warnings = [];

console.log('🔍 Validating project configuration...\n');

// Check required files
const requiredFiles = [
  'App.tsx',
  'app.json',
  'eas.json',
  'package.json',
  'tsconfig.json',
  'babel.config.js',
];

requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    errors.push(`Missing required file: ${file}`);
  }
});

// Check app.json structure
try {
  const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf8'));
  
  if (!appJson.expo) {
    errors.push('app.json missing "expo" key');
  } else {
    const expo = appJson.expo;
    
    // Check required fields
    if (!expo.name) warnings.push('app.json: "name" is missing');
    if (!expo.slug) warnings.push('app.json: "slug" is missing');
    if (!expo.version) warnings.push('app.json: "version" is missing');
    if (!expo.icon) warnings.push('app.json: "icon" path is missing');
    
    // Check iOS config
    if (!expo.ios) {
      warnings.push('app.json: iOS configuration is missing');
    } else {
      if (!expo.ios.bundleIdentifier) warnings.push('app.json: iOS bundleIdentifier is missing');
      if (!expo.ios.buildNumber) warnings.push('app.json: iOS buildNumber is missing');
    }
    
    // Check Android config
    if (!expo.android) {
      warnings.push('app.json: Android configuration is missing');
    } else {
      if (!expo.android.package) warnings.push('app.json: Android package is missing');
      if (!expo.android.versionCode) warnings.push('app.json: Android versionCode is missing');
    }
  }
} catch (e) {
  errors.push(`Invalid app.json: ${e.message}`);
}

// Check eas.json
try {
  const easJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'eas.json'), 'utf8'));
  
  if (!easJson.build) {
    errors.push('eas.json missing "build" configuration');
  } else {
    const profiles = ['development', 'preview', 'production'];
    profiles.forEach(profile => {
      if (!easJson.build[profile]) {
        warnings.push(`eas.json: "${profile}" build profile is missing`);
      }
    });
  }
} catch (e) {
  errors.push(`Invalid eas.json: ${e.message}`);
}

// Check assets
const assetsDir = path.join(__dirname, '..', 'assets');
const requiredAssets = ['icon.png', 'adaptive-icon.png', 'splash.png'];

if (!fs.existsSync(assetsDir)) {
  warnings.push('assets/ directory does not exist');
} else {
  requiredAssets.forEach(asset => {
    if (!fs.existsSync(path.join(assetsDir, asset))) {
      warnings.push(`Missing asset: assets/${asset}`);
    }
  });
}

// Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  if (!packageJson.dependencies?.expo) {
    errors.push('package.json: expo dependency is missing');
  }
  
  if (!packageJson.scripts?.['build:android:apk']) {
    warnings.push('package.json: build scripts may be missing');
  }
} catch (e) {
  errors.push(`Invalid package.json: ${e.message}`);
}

// Report results
console.log('📊 Validation Results:\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Project is ready for building.\n');
} else {
  if (errors.length > 0) {
    console.log('❌ ERRORS (must fix before building):');
    errors.forEach(error => console.log(`   - ${error}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (recommended to fix):');
    warnings.forEach(warning => console.log(`   - ${warning}`));
    console.log('');
  }
}

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('✅ Project validation complete!\n');
  process.exit(0);
}

