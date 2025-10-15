import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RadioGroupContextType {
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextType>({});

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & RadioGroupContextType
>(({ className, value, onValueChange, disabled, children, ...props }, ref) => {
  return (
      <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
        <div ref={ref} className={cn('grid gap-2', className)} {...props} role="radiogroup">
            {children}
        </div>
      </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext);
  const isChecked = context.value === value;
  const isDisabled = context.disabled || props.disabled;

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isChecked}
      data-state={isChecked ? 'checked' : 'unchecked'}
      disabled={isDisabled}
      onClick={() => context.onValueChange?.(value)}
      {...props}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
        {isChecked && <div className="flex items-center justify-center h-full w-full"><Check className="h-3.5 w-3.5 fill-current text-current" /></div>}
    </button>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };