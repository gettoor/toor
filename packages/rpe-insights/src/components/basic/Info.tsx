import { useEffect, useRef, useState } from 'preact/hooks';
import clsx from 'clsx';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

import { Icon } from './Icon';
import tooltipStyles from './Tooltip.module.scss';
import styles from './Info.module.scss';

export interface InfoProps {
  text: string;
  className?: string;
}

export function Info({ text, className }: InfoProps) {
  const referenceRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const open = hovered || focused;

  useEffect(() => {
    if (!open) {
      return;
    }

    const reference = referenceRef.current;
    const floating = floatingRef.current;

    if (!reference || !floating) {
      return;
    }

    const update = async () => {
      const { x, y } = await computePosition(reference, floating, {
        placement: 'top',
        middleware: [
          offset(6),
          flip(),
          shift({ padding: 8 }),
        ],
      });

      Object.assign(floating.style, {
        left: `${x}px`,
        top: `${y}px`,
        visibility: 'visible',
      });
    };

    return autoUpdate(reference, floating, update);
  }, [open]);

  const infoClassName = clsx(styles['info'], className);

  return (
    <>
      <Icon
        ref={referenceRef}
        name='info'
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={infoClassName}
      />

      {open && (
        <span
          ref={floatingRef}
          role='tooltip'
          className={tooltipStyles['tooltip']}
          style={{ visibility: 'hidden' }}
        >
          {text}
        </span>
      )}
    </>
  );
}