
import React from 'react';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <div
            key={id}
            // FIX: Replaced object syntax with a ternary operator for conditional classes, as the `cn` helper in this project doesn't support it.
            className={cn('pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all', 
              props.variant === 'destructive'
                ? 'border-destructive bg-destructive text-destructive-foreground'
                : 'border-border bg-background text-foreground'
            )}
          >
            <div className="grid gap-1">
              {title && <p className="font-semibold">{title}</p>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            {action}
            <button
              onClick={() => {}}
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
