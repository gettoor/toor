import { Icon } from './Icon';
import styles from './IconButton.module.scss';

export interface IconButtonProps {
  name: string;
  title?: string;
  onClick: () => void;
}

export function IconButton(props: IconButtonProps) {
  const { name, title, onClick } = props;
  return (
    <div 
      className={styles['icon-button']}
      onClick={onClick}
    >
      <Icon name={name} title={title}/>
    </div>
  );
}