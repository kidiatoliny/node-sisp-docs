import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative, posix } from 'node:path';

const siblingSource = new URL('../../node-sisp/docs', import.meta.url).pathname;
const bundledSource = new URL('../_docs_src', import.meta.url).pathname;
const SOURCE = process.env.NODE_SISP_DOCS ?? (existsSync(siblingSource) ? siblingSource : bundledSource);
const OUT = new URL('../src/content/docs', import.meta.url).pathname;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
      continue;
    }
    if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

function routeFor(relPath) {
  return `/${relPath.replace(/\.md$/, '')}/`;
}

function rewriteLinks(body, fileRelPath) {
  return body.replace(/\]\(([^)]+?\.md)(#[^)]*)?\)/g, (_match, target, anchor = '') => {
    if (/^https?:|^\//.test(target)) return `](${target}${anchor})`;
    const resolved = posix.normalize(posix.join(posix.dirname(fileRelPath), target));
    return `](${routeFor(resolved)}${anchor})`;
  });
}

function stripNavFooter(lines) {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== '---') continue;
    const rest = lines.slice(i + 1).join('\n');
    if (/\]\(/.test(rest) && /\b(Index|Next|Previous)\b/.test(rest)) {
      return lines.slice(0, i);
    }
    break;
  }
  return lines;
}

function extractTitle(lines) {
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^#\s+(.+?)\s*$/);
    if (m) return { title: m[1].replace(/`/g, ''), index: i };
  }
  return { title: null, index: -1 };
}

function extractDescription(body) {
  const block = [];
  let inCode = false;
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (block.length === 0) {
      const isBlockMarker =
        trimmed === '' ||
        /^\s/.test(line) ||
        /^(#|>|\||[-*]\s|\d+\.\s)/.test(trimmed) ||
        trimmed.startsWith('<');
      if (isBlockMarker) continue;
      block.push(trimmed);
      continue;
    }
    if (trimmed === '') break;
    block.push(trimmed);
  }
  const text = block
    .join(' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length < 40) return '';
  if (text.length <= 160) return text;
  return text.slice(0, 157).replace(/\s+\S*$/, '').replace(/[.,;:\s]+$/, '') + '...';
}

async function main() {
  if (!existsSync(SOURCE)) throw new Error(`source not found: ${SOURCE}`);
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const files = await walk(SOURCE);
  for (const file of files) {
    const relPath = relative(SOURCE, file).split(/[\\/]/).join('/');
    if (relPath === '00-index.md' || relPath.endsWith('/00-index.md') || relPath.startsWith('superpowers/')) continue;
    const raw = await readFile(file, 'utf8');
    let lines = raw.split('\n');

    const { title, index } = extractTitle(lines);
    if (index >= 0) lines.splice(index, 1);
    lines = stripNavFooter(lines);

    let body = rewriteLinks(lines.join('\n').replace(/^\n+/, ''), relPath);
    body = body.replace(/\[([^\]]+?)\.md\]\(/g, '[$1](');
    const safeTitle = (title ?? relPath).replace(/"/g, '\\"');
    const order = Number(relPath.match(/(\d+)/)?.[1] ?? 999);
    const description = extractDescription(body).replace(/"/g, '\\"');

    const front = `---\ntitle: "${safeTitle}"\n${description ? `description: "${description}"\n` : ''}sidebar:\n  order: ${order}\n---\n\n`;
    const dest = join(OUT, relPath);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, front + body.trimEnd() + '\n');
  }

  console.log(`synced ${files.filter((file) => { const relPath = relative(SOURCE, file).split(/[\\/]/).join('/'); return relPath !== '00-index.md' && !relPath.endsWith('/00-index.md') && !relPath.startsWith('superpowers/'); }).length} docs into src/content/docs`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
