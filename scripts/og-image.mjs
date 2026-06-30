import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../public/og.png', import.meta.url));

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="82%" cy="-8%" r="75%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.30"/>
      <stop offset="55%" stop-color="#7c3aed" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#0d0d13" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f4f4f8"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="hair" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0"/>
      <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0d0d13"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0.5" y="0.5" width="1199" height="629" fill="none" stroke="#23202e" stroke-width="1"/>
  <rect x="40" y="4" width="2" height="622" fill="url(#hair)" opacity="0.0"/>

  <g transform="translate(80,60) scale(0.92)">
    <path fill="#7c3aed" d="M0,24.35C0,16.8,0,13,1.22,10A16,16,0,0,1,10,1.22C13,0,16.8,0,24.35,0h0C31.9,0,35.71,0,38.72,1.22A16,16,0,0,1,47.48,10c1.22,3,1.22,6.82,1.22,14.37h0c0,7.55,0,11.36-1.22,14.37a16,16,0,0,1-8.76,8.76c-3,1.22-6.82,1.22-14.37,1.22h0C16.8,48.7,13,48.7,10,47.48a16,16,0,0,1-8.76-8.76C0,35.71,0,31.9,0,24.35Z"/>
    <path fill="#fff" d="M36.12,25.81,28.9,13.23h0a3.59,3.59,0,0,0-6.25,0l-11,19.16a2.59,2.59,0,0,0-.33,1.38A2.72,2.72,0,0,0,14,36.53a2.64,2.64,0,0,0,2.36-1.38L25.08,20a.84.84,0,0,1,1.46,0l2.76,4.79a.72.72,0,0,1-.65,1H25.57a2.72,2.72,0,0,0-2.68,2.76h0a2.72,2.72,0,0,0,2.68,2.76h9.17a2.63,2.63,0,0,0,2.27-4Z"/>
  </g>
  <text x="140" y="98" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="800" fill="#f4f4f8">node-sisp</text>
  <text x="142" y="98" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="800" fill="url(#ink)" opacity="0">node-sisp</text>

  <text x="80" y="220" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="800" fill="url(#ink)">SISP payments for</text>
  <text x="80" y="282" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="800" fill="url(#ink)">Node.js</text>

  <text x="80" y="338" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="400" fill="#a1a1b5">Signed callbacks, sandbox, and reconciliation.</text>

  <g font-family="Inter, Arial, sans-serif" font-size="21" font-weight="500" fill="#cdc9da">
    <circle cx="88" cy="392" r="4" fill="#8b5cf6"/><text x="106" y="398">SISP and Vinti4 gateway client for Node.js</text>
    <circle cx="88" cy="430" r="4" fill="#8b5cf6"/><text x="106" y="436">Payment requests, callbacks, refunds, retries</text>
    <circle cx="88" cy="468" r="4" fill="#8b5cf6"/><text x="106" y="474">Transaction attempts, logs, and reconciliation</text>
  </g>

  <rect x="676" y="150" width="444" height="324" rx="16" fill="#15131f" stroke="#2a2740" stroke-width="1.5"/>
  <circle cx="704" cy="180" r="6" fill="#3a3650"/>
  <circle cx="724" cy="180" r="6" fill="#3a3650"/>
  <circle cx="744" cy="180" r="6" fill="#3a3650"/>
  <text x="1096" y="185" text-anchor="end" font-family="monospace" font-size="15" fill="#6b6880">sisp.ts</text>
  <line x1="676" y1="206" x2="1120" y2="206" stroke="#23202e" stroke-width="1"/>

  <g font-family="monospace" font-size="20" font-weight="500" xml:space="preserve">
    <text x="704" y="246"><tspan fill="#c084fc">import</tspan><tspan fill="#cdc9da"> { </tspan><tspan fill="#8b5cf6">createSisp</tspan><tspan fill="#cdc9da"> }</tspan></text>
    <text x="704" y="274"><tspan fill="#cdc9da">  </tspan><tspan fill="#c084fc">from</tspan><tspan fill="#86efac"> '@akira-io/sisp'</tspan></text>
    <text x="704" y="330"><tspan fill="#c084fc">const</tspan><tspan fill="#cdc9da"> sisp </tspan><tspan fill="#c084fc">=</tspan><tspan fill="#8b5cf6"> createSisp</tspan><tspan fill="#cdc9da">({</tspan></text>
    <text x="704" y="358"><tspan fill="#cdc9da">  sandbox: </tspan><tspan fill="#8b5cf6">true</tspan><tspan fill="#cdc9da">,</tspan></text>
    <text x="704" y="386"><tspan fill="#cdc9da">  database, appKey,</tspan></text>
    <text x="704" y="414"><tspan fill="#cdc9da">})</tspan></text>
    <text x="704" y="450"><tspan fill="#6b6880">// Request, Gateway form, Callback, Reconcile</tspan></text>
  </g>

  <line x1="80" y1="556" x2="1120" y2="556" stroke="#23202e" stroke-width="1"/>
  <text x="80" y="592" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#a78bfa">node-sisp.akira-io.com</text>
  <text x="1120" y="592" text-anchor="end" font-family="monospace" font-size="20" fill="#a1a1b5">npm i @akira-io/sisp</text>
</svg>`;

await sharp(Buffer.from(svg), { density: 144 }).resize(1200, 630).png().toFile(OUT);
console.log(`wrote ${OUT}`);
