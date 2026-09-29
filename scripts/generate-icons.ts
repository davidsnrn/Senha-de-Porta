import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('./public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');

  // 512x512 maskable (with 10% padding for safe zone)
  await sharp(svgBuffer)
    .resize(420, 420)
    .extend({
      top: 46,
      bottom: 46,
      left: 46,
      right: 46,
      background: '#fef3c7',
    })
    .png()
    .toFile('./public/pwa-maskable-512x512.png');

  // 180x180 apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon.png');

  console.log('PWA PNG Icons successfully generated!');
}

generate().catch(console.error);
