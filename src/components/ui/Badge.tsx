import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100',
        secondary:
          'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-100',
        accent:
          'bg-accent-100 text-accent-800 dark:bg-accent-800 dark:text-accent-100',
        success:
          'bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-100',
        warning:
          'bg-warning-100 text-warning-800 dark:bg-warning-800 dark:text-warning-100',
        error:
          'bg-error-100 text-error-800 dark:bg-error-800 dark:text-error-100',
        outline:
          'border border-gray-200 bg-transparent text-gray-900 dark:border-gray-800 dark:text-gray-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={twMerge(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };