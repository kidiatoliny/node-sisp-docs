import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { NavGroup } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function MobileNav({ nav, currentSlug }: { nav: NavGroup[]; currentSlug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        aria-label="Open navigation"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-r border-sidebar-border bg-sidebar p-5 shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-left">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold">Documentation</span>
            <DialogPrimitive.Close aria-label="Close navigation" className="text-muted-foreground hover:text-foreground">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <nav className="flex flex-col gap-5">
            {nav.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 px-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className={cn(
                          'block rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          item.id === currentSlug && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
                        )}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
