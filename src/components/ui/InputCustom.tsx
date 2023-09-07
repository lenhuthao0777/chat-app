import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormField, FormItem, FormControl, FormMessage } from './form';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  form: any;
  label: string;
  isLoading?: boolean;
}

const InputCustom = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, form, name, isLoading, label, ...props }, ref) => {
    return (
      <FormField
        control={form?.control}
        name={name as string}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <input
                type={type}
                className={cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  className
                )}
                disabled={isLoading}
                {...field}
                {...props}
                ref={ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

InputCustom.displayName = 'Input';

export { InputCustom };
