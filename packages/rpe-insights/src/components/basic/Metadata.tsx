import * as YAML from 'yaml';
import { RPEMetadata } from '@gettoor/core';

import styles from './Metadata.module.scss';

export interface MetadataProps {
  metadata: RPEMetadata;
}

export function Metadata(props: MetadataProps) {
  const { metadata } = props;
  const metadataString = YAML.stringify(metadata);
  return (
    <pre className={styles['metadata']}>
      {metadataString}
    </pre>
  );
}