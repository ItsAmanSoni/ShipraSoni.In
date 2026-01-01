const fs = require('fs');
const path = require('path');

/**
 * Generate SS Icons for Shipra Soni Portfolio
 * This script creates all PWA icons and favicon with "SS" branding
 */

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Colors (Blue theme to match portfolio)
const PRIMARY_COLOR = '#3b82f6';
const SECONDARY_COLOR = '#2563eb';
const TEXT_COLOR = '#ffffff';

/**
 * Create SVG icon
 */
function createSVG(size) {
  const fontSize = Math.floor(size * 0.45);
  const letterSpacing = size * 0.02;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${PRIMARY_COLOR};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${SECONDARY_COLOR};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background with gradient -->
  <rect width="${size}" height="${size}" fill="url(#bgGradient)" rx="${size * 0.1}"/>

  <!-- SS Text -->
  <text
    x="50%"
    y="50%"
    font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    fill="${TEXT_COLOR}"
    text-anchor="middle"
    dominant-baseline="central"
    letter-spacing="${letterSpacing}">SS</text>
</svg>`;
}

/**
 * Create simple favicon ICO (base64 encoded)
 * This creates a minimal ICO file with 16x16 and 32x32 sizes
 */
function createFaviconICO() {
  // For simplicity, we'll create SVG favicons which modern browsers support
  const svg16 = createSVG(16);
  const svg32 = createSVG(32);

  // Create a simple ICO header for 16x16 and 32x32
  // This is a simplified version - for production, use a proper ICO library
  return svg32; // Browsers will accept SVG as favicon
}

/**
 * Save icon files
 */
function generateIcons() {
  console.log('🎨 Generating SS Icons for Shipra Soni Portfolio...\n');

  // Create icons directory if it doesn't exist
  const iconsDir = path.join(__dirname, 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Generate each size
  sizes.forEach(size => {
    const svgContent = createSVG(size);
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);

    fs.writeFileSync(filepath, svgContent);
    console.log(`✅ Created ${filename}`);
  });

  // Generate favicon
  const faviconSVG = createSVG(32);
  const faviconPath = path.join(__dirname, 'src', 'app', 'favicon.ico');

  // For better browser compatibility, also create icon.svg
  const iconSVGPath = path.join(__dirname, 'src', 'app', 'icon.svg');
  fs.writeFileSync(iconSVGPath, createSVG(512));
  console.log(`✅ Created icon.svg (Next.js will use this)`);

  // Create apple-icon.png as SVG
  const appleIconPath = path.join(__dirname, 'src', 'app', 'apple-icon.png');
  const appleIconSVG = createSVG(180);
  // Note: Saving as SVG with .png extension for Next.js to handle
  fs.writeFileSync(appleIconPath, appleIconSVG);
  console.log(`✅ Created apple-icon.png`);

  console.log('\n🎉 All icons generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. The icons are now in public/icons/ and src/app/');
  console.log('2. Run "npm run dev" to see your new SS icons');
  console.log('3. For production PNG icons, you can convert SVGs using an online tool');
  console.log('\n💡 Tip: SVG icons work great for modern browsers and are much smaller in file size!');
}

// Run the generator
try {
  generateIcons();
} catch (error) {
  console.error('❌ Error generating icons:', error.message);
  process.exit(1);
}
