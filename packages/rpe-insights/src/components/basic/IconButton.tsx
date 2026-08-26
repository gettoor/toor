import clsx from 'clsx';

import { Icon } from './Icon';
import styles from './IconButton.module.scss';

export interface IconButtonProps {
  name: string;
  title?: string;
  className?: string;
  onClick: () => void;
}

export function IconButton(props: IconButtonProps) {
  const { name, title, className, onClick } = props;
  return (
    <div 
      className={clsx(styles['icon-button'], className)}
      onClick={onClick}
    >
      <Icon
        className='icon'
        name={name}
        title={title}
      />
    </div>
  );
}