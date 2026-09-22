import clsx from 'clsx';
import { ComponentProps } from 'preact';
import { forwardRef } from 'preact/compat';

import styles from './Icon.module.scss';

export interface IconProps extends ComponentProps<'span'> {
  name: string;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ name, className, ...props }, ref) => {
    return (
      <span
        {...props}
        ref={ref}
        className={clsx(
          styles['material-symbols-outlined'],
          className,
        )}
      >
        {name}
      </span>
    );
  },
);