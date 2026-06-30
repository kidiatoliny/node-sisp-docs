import { useCallback, useEffect, useRef, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface Result {
  url: string;
  title: string;
  excerpt: string;
}

interface PagefindModule {
  search: (query: string) => Promise<{ results: { data: () => Promise<RawResult> }[] }>;
  options?: (opts: Record<string, unknown>) => Promise<void>;
}

interface RawResult {
  url: string;
  excerpt: string;
  meta: { title?: string };
}

let pagefind: PagefindModule | null = null;

async function loadPagefind(): Promise<PagefindModule | null> {
  if (pagefind) return pagefind;
  try {
    const path = '/pagefind/pagefind.js';
    const mod = (await import(/* @vite-ignore */ path)) as PagefindModule;
    await mod.options?.({});
    pagefind = mod;
    return mod;
  } catch {
    return null;
  }
}

function normalizeUrl(url: string): string {
  return url.replace(/\.html$/, '').replace(/\/index$/, '/');
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [ready, setReady] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const runSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const engine = await loadPagefind();
    if (!engine) {
      setReady(false);
      return;
    }
    const search = await engine.search(value);
    const data = await Promise.all(search.results.slice(0, 8).map((item) => item.data()));
    setResults(
      data.map((entry) => ({
        url: normalizeUrl(entry.url),
        title: entry.meta.title ?? entry.url,
        excerpt: entry.excerpt,
      })),
    );
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => runSearch(query), 140);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, runSearch]);

  return (
    <>
      <button
        type="button"
        aria-label="Search documentation"
        title="Search"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-muted/40 px-0 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:w-64 md:justify-start md:px-3"
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="hidden flex-1 text-left md:block">Search</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 font-mono text-[11px] md:inline">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput value={query} onValueChange={setQuery} placeholder="Search documentation..." />
        <CommandList>
          {!ready && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              Search index builds with the production site.
            </div>
          )}
          {ready && query.trim() && results.length === 0 && (
            <CommandEmpty>No results for "{query}".</CommandEmpty>
          )}
          {results.map((result) => (
            <CommandItem
              key={result.url}
              value={result.url}
              onSelect={() => {
                window.location.href = result.url;
              }}
            >
              <span className="font-medium text-foreground">{result.title}</span>
              <span
                className="line-clamp-2 text-xs text-muted-foreground [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-primary"
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
