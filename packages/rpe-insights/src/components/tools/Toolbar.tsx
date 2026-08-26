import { ThemeSwitch } from './ThemeSwitch';
import { Info } from './Info';
import styles from './Toolbar.module.scss';

export interface ToolbarProps {
  onInfoClick: () => void;
}

export function Toolbar(props: ToolbarProps) {
  return (
    <div className={styles['toolbar']}>
      <ThemeSwitch/>
      <Info onClick={props.onInfoClick}/>
    </div>
  );
}