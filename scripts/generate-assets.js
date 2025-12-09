/**
 * Script to generate placeholder assets
 * Run with: node scripts/generate-assets.js
 * 
 * Note: This creates simple placeholder images.
 * Replace with actual app icons before production builds.
 */

const fs = require('fs');
const path = require('path');

// Simple SVG templates for placeholder assets
const iconSVG = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#6366f1"/>
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="300" font-weight="bold" fill="white" text-anchor="middle">GC</text>
</svg>`;

const splashSVG = `<svg width="1284" height="2778" xmlns="http://www.w3.org/2000/svg">
  <rect width="1284" height="2778" fill="#6366f1"/>
  <text x="642" y="1400" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle">Grade Calculator</text>
</svg>`;

const faviconSVG = `<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="#6366f1"/>
  <text x="24" y="32" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">GC</text>
</svg>`;

const assetsDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('⚠️  Note: This script creates SVG placeholders.');
console.log('⚠️  For production builds, you need actual PNG images.');
console.log('⚠️  Use tools like https://www.appicon.co/ to generate proper assets.\n');

// Create SVG placeholders (you'll need to convert these to PNG manually)
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSVG);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), iconSVG);
fs.writeFileSync(path.join(assetsDir, 'splash.svg'), splashSVG);
fs.writeFileSync(path.join(assetsDir, 'favicon.svg'), faviconSVG);

console.log('✅ Created SVG placeholder files:');
console.log('   - assets/icon.svg');
console.log('   - assets/adaptive-icon.svg');
console.log('   - assets/splash.svg');
console.log('   - assets/favicon.svg');
console.log('\n📝 Next steps:');
console.log('   1. Convert SVG files to PNG format');
console.log('   2. Ensure icon.png is 1024x1024px');
console.log('   3. Ensure adaptive-icon.png is 1024x1024px');
console.log('   4. Ensure splash.png is 1284x2778px');
console.log('   5. Ensure favicon.png is 48x48px');
console.log('\n💡 Tip: Use online tools or design software to create proper app icons.');

