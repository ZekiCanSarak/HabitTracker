import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = 'public/icons/icon.svg';
const outputDir = 'public/icons';

async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(inputFile);

    // Generate each size
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${outputFile}`);
    }

    // Also generate favicon.ico (32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFile('public/favicon.ico');
    console.log('Generated favicon.ico');

    // Generate apple-touch-icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile('public/apple-touch-icon.png');
    console.log('Generated apple-touch-icon.png');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 