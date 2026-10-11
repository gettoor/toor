import { IconButton } from '../basic';

export interface InfoProps {
  onClick: () => void;
}

export function Info(props: InfoProps) {
  return (
    <IconButton
      name='info'
      title='RPE process info'
      onClick={props.onClick}
    />
  );
}