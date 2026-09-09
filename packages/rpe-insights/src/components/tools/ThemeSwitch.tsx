import { useEffect, useState } from 'preact/hooks';

import { IconButton } from '../basic';
import styles from './ThemeSwitch.module.scss';

const THEME_STORAGE_KEY = 'toor_rpe_insights_theme';

export function ThemeSwitch() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const iconName = theme === 'dark' ? 'bedtime' : 'sunny';

  useEffect(
    () => {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
      }
    },
    [],
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
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
