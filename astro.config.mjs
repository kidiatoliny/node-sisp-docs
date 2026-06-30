import { execFileSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://sisp.akira-io.com';

function gitLastmod(id) {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', `src/content/docs/${id}.md`],
      { encoding: 'utf8' },
    ).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

function sitemapEntry(item) {
  const path = item.url.replace(SITE, '').replace(/^\/|\/$/g, '');
  if (path === '') {
    return { ...item, changefreq: 'weekly', priority: 1.0 };
  }
  const isExample = path.startsWith('examples/');
  return {
    ...item,
    changefreq: 'monthly',
    priority: isExample ? 0.6 : 0.8,
    lastmod: gitLastmod(path),
  };
}

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
  site: SITE,
  integrations: [
    mermaid({ theme: 'default', autoTheme: true }),
    react(),
    sitemap({ serialize: sitemapEntry }),
  ],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    remarkPlugins: [remarkMermaidToPre],
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
