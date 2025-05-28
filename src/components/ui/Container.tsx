import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => {
    return (
      <div
        className={twMerge(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          size === 'sm' && 'max-w-3xl',
          size === 'md' && 'max-w-5xl',
          size === 'lg' && 'max-w-7xl',
          size === 'xl' && 'max-w-screen-2xl',
          size === 'full' && 'max-w-full',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export { Container };