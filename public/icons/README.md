# PWA Icons

This directory contains the icons needed for the Progressive Web App functionality.

## Required Icons

The following icon sizes are needed for full PWA support:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons

### Option 1: Use an Online Tool (Easiest)

1. Visit https://www.pwabuilder.com/imageGenerator or https://favicon.io/favicon-converter/
2. Upload your logo/icon (recommended: 512x512 PNG with transparent background)
3. Download the generated icons
4. Place them in this directory

### Option 2: Use ImageMagick (Command Line)

If you have ImageMagick installed, you can generate all sizes from a source image:

```bash
# Create a 512x512 source image first (source-icon.png)
convert source-icon.png -resize 72x72 icon-72x72.png
convert source-icon.png -resize 96x96 icon-96x96.png
convert source-icon.png -resize 128x128 icon-128x128.png
convert source-icon.png -resize 144x144 icon-144x144.png
convert source-icon.png -resize 152x152 icon-152x152.png
convert source-icon.png -resize 192x192 icon-192x192.png
convert source-icon.png -resize 384x384 icon-384x384.png
convert source-icon.png -resize 512x512 icon-512x512.png
```

### Option 3: Manual Design

Create each icon size manually in your preferred design tool (Figma, Photoshop, etc.)

## Notes

- Icons should have transparent backgrounds for best results
- Use PNG format for compatibility
- The icons will be used for:
  - App installation on mobile devices
  - Home screen shortcuts
  - Splash screens
  - Task switcher icons
