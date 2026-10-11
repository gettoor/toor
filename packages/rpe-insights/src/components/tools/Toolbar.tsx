import { ThemeSwitch } from './ThemeSwitch';
import { Info } from './Info';
import styles from './Toolbar.module.scss';
import { IconButton } from '../basic';

export interface ToolbarProps {
  onInfoClick: () => void;
  onFailingExamplesClick: () => void;
}

export function Toolbar(props: ToolbarProps) {
  return (
    <div className={styles['toolbar']}>
      {/* <Info onClick={props.onInfoClick}/> */}
      <IconButton
        name='info'
        title='RPE process info'
        onClick={props.onInfoClick}
      />      
      <IconButton
        name='playlist_remove'
        title='Failing examples'
        onClick={props.onFailingExamplesClick}
      />      
      <ThemeSwitch/>
    </div>
  );
}