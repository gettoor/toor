import { ThemeSwitch } from './ThemeSwitch';
import { Info } from './Info';
import styles from './Toolbar.module.scss';
import { IconButton } from '../basic';

export interface ToolbarProps {
  onInfoClick: () => void;
  onFailingExamplesClick: () => void;
  onFinalCandidatesClick: () => void;
}

export function Toolbar(props: ToolbarProps) {
  return (
    <div className={styles['toolbar']}>
      <IconButton
        name='info'
        title='RPE process info'
        onClick={props.onInfoClick}
      />      
      <IconButton
        name='editor_choice'
        title='Final candidates'
        onClick={props.onFinalCandidatesClick}
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