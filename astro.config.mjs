import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';
import tailwindcss from '@tailwindcss/vite';

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// astro-mermaid 1.x's integration-registered remark transform does not run on content collections; register it directly.
function remarkMermaidToPre() {
  return async (tree) => {
    const { visit } = await import('unist-util-visit');
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang === 'mermaid' && parent && typeof index === 'number') {
        parent.children[index] = {
          type: 'html',
          value: `<pre class="mermaid">${escapeHtml(node.value)}</pre>`,
        };
      }
    });
  };
}

export default defineConfig({
  site: 'https://node-sisp.akira-io.com',
  integrations: [mermaid({ theme: 'default', autoTheme: true }), react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    remarkPlugins: [remarkMermaidToPre],
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
