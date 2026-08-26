import { useState } from 'preact/hooks';

import { IconButton } from '../basic';
import styles from './ThemeSwitch.module.scss';

export function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const iconName = theme === 'dark' ? 'bedtime' : 'sunny';

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
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