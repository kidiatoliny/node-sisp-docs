import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildNav } from '@/lib/nav';

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? 'https://sisp.akira-io.com';
  const docs = await getCollection('docs');
  const nav = buildNav(docs);
  const descriptions = new Map(docs.map((doc) => [doc.id, doc.data.description]));

  const sections = nav
    .map((group) => {
      const items = group.items
        .map((item) => {
          const description = descriptions.get(item.id);
          return `- [${item.title}](${base}${item.href})${description ? `: ${description}` : ''}`;
        })
        .join('\n');
      return `## ${group.label}\n\n${items}`;
    })
    .join('\n\n');

  const body = `# node-sisp

> SISP and Vinti4 payment gateway client for Node.js. The package creates signed payment requests, validates callbacks, stores transaction attempts, reconciles status, and exposes Express, Fastify, NestJS, and CLI entry points.

${sections}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
