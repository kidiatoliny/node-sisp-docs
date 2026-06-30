import { execFileSync } from 'node:child_process';

function gitDate(file: string, reverse: boolean): string | null {
  try {
    const args = ['log', reverse ? '--reverse' : '-1', '--format=%cI', '--', file];
    const out = execFileSync('git', args, { encoding: 'utf8' }).trim();
    if (!out) return null;
    return reverse ? out.split('\n')[0] : out;
  } catch {
    return null;
  }
}

export function docDates(id: string): { published: string; modified: string } {
  const file = `src/content/docs/${id}.md`;
  const fallback = new Date().toISOString();
  return {
    published: gitDate(file, true) ?? fallback,
    modified: gitDate(file, false) ?? fallback,
  };
}
