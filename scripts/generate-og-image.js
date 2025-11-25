import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOGImage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport to exact OGP dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1
    });

    // Read SVG file
    const svgPath = join(__dirname, '../public/og-image.svg');
    const svgContent = readFileSync(svgPath, 'utf-8');

    // Create HTML wrapper for SVG
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; }
            body { width: 1200px; height: 630px; overflow: hidden; }
            svg { display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Take screenshot
    const outputPath = join(__dirname, '../public/og-image.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630
      }
    });

    console.log('✅ OG image generated successfully:', outputPath);
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generateOGImage();
