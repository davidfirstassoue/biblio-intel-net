import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          className={twMerge(
            "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400",
            error && "border-error-500 focus:border-error-500 focus:ring-error-500 dark:border-error-400 dark:focus:border-error-400 dark:focus:ring-error-400",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-error-600 dark:text-error-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };