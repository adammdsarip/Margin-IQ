/**
 * Bundles the production build into one self-contained HTML file
 * (marginiq-preview.html) for sharing without a server.
 * Run after `vite build`:  npm run build:preview
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dist = 'dist';
const assets = readdirSync(`${dist}/assets`);
const css = readFileSync(`${dist}/assets/${assets.find((f) => f.endsWith('.css'))}`, 'utf8');
const js = readFileSync(`${dist}/assets/${assets.find((f) => f.endsWith('.js'))}`, 'utf8').replaceAll(
  '</script',
  '<\\/script'
);

let html = readFileSync(`${dist}/index.html`, 'utf8')
  .replace(/<link rel="stylesheet"[^>]*>/g, '')
  .replace(/<script type="module"[^>]*><\/script>/g, '')
  .replace(/<link rel="(icon|apple-touch-icon|manifest)"[^>]*>/g, '');

html = html
  .replace('</head>', () => `<style>${css}</style></head>`)
  .replace('</body>', () => `<script type="module">${js}</script></body>`);

writeFileSync('marginiq-preview.html', html);
console.log(`marginiq-preview.html written (${(html.length / 1024).toFixed(0)} KB)`);
