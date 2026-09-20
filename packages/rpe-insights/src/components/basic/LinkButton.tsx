import clsx from 'clsx';
import styles from './LinkButton.module.scss';

export interface LinkButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export function LinkButton(props: LinkButtonProps) {
  const className = clsx(styles['link-button'], {
    [styles['link-button-disabled']]: props.disabled,
  });

  const onClick = () => {
    if (props.disabled) {
      return;
    }
    props.onClick();
  }

  return (
    <a
      href='#'
      onClick={onClick}
      className={className}
    >
      {props.label}
    </a>
  );
}