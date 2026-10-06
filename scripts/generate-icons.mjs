#!/usr/bin/env node
// Renders the raster app icons (favicons, iOS touch icon, manifest icons) from the master SVGs in public/icons.
// Run `npm run icons` after changing any of the SVGs and commit the output.
import { copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ICONS = fileURLToPath(new URL('../public/icons/', import.meta.url));
const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url));
const SVG_SIZE = 512; // every master SVG uses a 512x512 viewBox

// Rasterizes straight at the target size (not a downscale) so small sizes stay crisp.
function render(svg, size) {
  return sharp(ICONS + svg, { density: (72 * size) / SVG_SIZE }).resize(size, size);
}

// Flattened onto white with no alpha channel: iOS fills transparent touch-icon pixels with black.
function renderOpaque(svg, size) {
  return render(svg, size).flatten({ background: '#ffffff' }).removeAlpha();
}

// An .ico file that embeds PNG images, which every browser that still asks for /favicon.ico understands.
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * 16;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry[0] = entry[1] = size % 256; // 0 means 256
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

const outputs = [
  ['favicon-16.png', render('icon-small.svg', 16)],
  ['favicon-32.png', render('icon-small.svg', 32)],
  ['apple-touch-icon.png', renderOpaque('icon-maskable.svg', 180)],
  ['icon-192.png', render('icon.svg', 192)],
  ['icon-512.png', render('icon.svg', 512)],
  ['icon-maskable-512.png', renderOpaque('icon-maskable.svg', 512)],
];
for (const [name, image] of outputs) {
  await image.png({ compressionLevel: 9 }).toFile(ICONS + name);
}

await copyFile(ICONS + 'icon-small.svg', ICONS + 'favicon.svg');

const icoImages = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, png: await render('icon-small.svg', size).png().toBuffer() })),
);
await writeFile(PUBLIC + 'favicon.ico', toIco(icoImages));

console.log(`Wrote ${outputs.length + 2} icons to public/`);
