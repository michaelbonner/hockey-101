// Renders the favicon set and the Open Graph image into public/.
// Run with: node scripts/generate-meta-images.mjs (needs Playwright's Chromium and ffmpeg).
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const icon = readFileSync(`${root}public/favicon.svg`, 'utf8');
// Maskable icons need a full-bleed background with the mark inside the central safe zone.
const maskable = icon.replace('rx="14"', 'rx="0"').replace(/<path[\s\S]*<\/svg>/, m => `<g transform="translate(6.4 6.4) scale(.8)">${m.replace('</svg>', '')}</g></svg>`);

const browser = await chromium.launch();
const page = await browser.newPage();
async function renderSvg(svg, size, file, transparent = true) {
 await page.setViewportSize({ width: size, height: size });
 await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
 await page.screenshot({ path: `${root}public/${file}`, omitBackground: transparent });
}
await renderSvg(icon, 32, 'favicon-32.png');
await renderSvg(icon.replace('rx="14"', 'rx="0"'), 180, 'apple-touch-icon.png', false);
await renderSvg(icon, 192, 'icon-192.png');
await renderSvg(icon, 512, 'icon-512.png');
await renderSvg(maskable, 512, 'icon-maskable-512.png', false);

await page.setViewportSize({ width: 1200, height: 630 });
await page.goto(`file://${root}scripts/og-image.html`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${root}public/og-image.png` });
await browser.close();

execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', `${root}public/og-image.png`, '-q:v', '3', `${root}public/og-image.jpg`]);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', `${root}public/favicon-32.png`, `${root}public/favicon.ico`]);
rmSync(`${root}public/og-image.png`);
rmSync(`${root}public/favicon-32.png`);
