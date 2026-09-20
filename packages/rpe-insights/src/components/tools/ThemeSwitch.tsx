import { useEffect } from 'preact/hooks';

import { IconButton } from '../basic';
import styles from './ThemeSwitch.module.scss';
import { useLocalStorage } from '../../hooks';

type Theme = 'light' | 'dark';

export function ThemeSwitch() {
  const [theme, setTheme] = useLocalStorage<Theme>('light', 'theme');
  const iconName = theme === 'dark' ? 'sunny' : 'bedtime';

  useEffect(
    () => {
      document.documentElement.setAttribute('data-theme', theme);
    },
    [theme],
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <IconButton
      className={styles['theme-switch']}
      name={iconName}
      title='Theme Switch'
      onClick={toggleTheme}
    />
  );
}
