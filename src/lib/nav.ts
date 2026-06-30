export interface DocEntryLike {
  id: string;
  data: { title: string; sidebar?: { order?: number } };
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

function orderOf(entry: DocEntryLike): number {
  if (typeof entry.data.sidebar?.order === 'number') return entry.data.sidebar.order;
  const match = entry.id.match(/(\d+)/);
  return match ? Number(match[1]) : 999;
}

function dirOf(id: string): string {
  return id.includes('/') ? id.split('/')[0] : '';
}

const GROUPS: { label: string; match: (dir: string, order: number) => boolean }[] = [
  { label: 'Start here', match: (dir, order) => dir === '' && order <= 4 },
  { label: 'Operations', match: (dir, order) => dir === '' && order >= 5 && order <= 8 },
  { label: 'Reference', match: (dir, order) => dir === '' && order >= 9 },
  { label: 'Examples', match: (dir) => dir === 'examples' },
];

export function buildNav(entries: DocEntryLike[]): NavGroup[] {
  const sorted = [...entries].sort((a, b) => orderOf(a) - orderOf(b));
  return GROUPS.map((group) => ({
    label: group.label,
    items: sorted
      .filter((entry) => group.match(dirOf(entry.id), orderOf(entry)))
      .map((entry) => ({ id: entry.id, title: entry.data.title, href: `/${entry.id}` })),
  })).filter((group) => group.items.length > 0);
}

export function flattenNav(groups: NavGroup[]): NavItem[] {
  return groups.flatMap((group) => group.items);
}
