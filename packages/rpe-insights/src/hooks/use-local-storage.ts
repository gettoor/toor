import { useState } from 'preact/hooks';

export function useLocalStorage<T>(
  initialValue: T,
  key: string,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : initialValue;
  });

  const setStoredValue = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
    setValue(value);
  };

  return [value, setStoredValue];
}