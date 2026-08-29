import clsx from 'clsx';
import styles from './Properties.module.scss';

export type PropertyValue = string | number;

export interface Property {
  key: string;
  value: PropertyValue;
  topBorder?: boolean;
}

export interface PropertiesProps {
  properties: Property[];
  keyAlign?: 'left' | 'right';
  valueAlign?: 'left' | 'right';
}

export function Properties(props: PropertiesProps) {
  const { properties, keyAlign = 'left', valueAlign = 'right' } = props;

  const renderRows = () => {
    return properties.map((property) => {
      const keyClassName = clsx(
        styles['property-key'],
        {
          [styles['align-left']]: keyAlign === 'left',
          [styles['align-right']]: keyAlign === 'right',
          [styles['top-border']]: property.topBorder,
        },
      );
      const valueClassName = clsx(
        styles['property-value'],
        {
          [styles['align-left']]: valueAlign === 'left',
          [styles['align-right']]: valueAlign === 'right',
          [styles['top-border']]: property.topBorder,
        },
      );
      return (
        <>
          <span
            key={property.key + '-key'}
            className={keyClassName}
          >
            {property.key}
          </span>
          <span
            key={property.key + '-value'}
            className={valueClassName}
          >
            {property.value}
          </span>
        </>
      );
    });
  }

  return (
    <div className={styles['properties']}>
      {renderRows()}
    </div>
  );
}