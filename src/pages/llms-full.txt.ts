import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildNav } from '@/lib/nav';

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? 'https://sisp.akira-io.com';
  const docs = await getCollection('docs');
  const nav = buildNav(docs);
  const byId = new Map(docs.map((doc) => [doc.id, doc]));

  const sections = nav
    .flatMap((group) => group.items)
    .map((item) => {
      const doc = byId.get(item.id);
      if (!doc) return '';
      const description = doc.data.description ? `> ${doc.data.description}\n\n` : '';
      const body = (doc.body ?? '').trim();
      return `# ${item.title}\n\nSource: ${base}${item.href}\n\n${description}${body}`;
    })
    .filter(Boolean)
    .join('\n\n---\n\n');

  const body = `# node-sisp: full documentation

> SISP and Vinti4 payment gateway client for Node.js. The package creates signed payment requests, validates callbacks, stores transaction attempts, reconciles status, and exposes Express, Fastify, NestJS, and CLI entry points. This file concatenates the full documentation for LLM and AI-search consumption.

${sections}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
