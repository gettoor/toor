import clsx from 'clsx';
import { useState } from 'preact/hooks';

import { camelCaseToSentenceCase } from '../../string';
import { IconButton } from '../basic';
import { Header } from './Header';
import styles from './CandidateModule.module.scss';

export interface CandidateModuleProps {
  name: string;
  module: string;
}

export function CandidateModule(props: CandidateModuleProps) {
  const { name, module } = props;

  const [expanded, setExpanded] = useState(false);

  const onCopyClick = () => {
    navigator.clipboard.writeText(module);
  };
  const onExpandClick = () => {
    setExpanded(!expanded);
  };

  const moduleClassName = clsx(
    styles['module'],
    {
      [styles['module-expanded']]: expanded,
    },
  );
  const expandIconName = expanded ? 'unfold_less' : 'unfold_more';

  return (
    <div className={styles['candidate-module']}>
      <Header
        title={camelCaseToSentenceCase(name)}
        level={2}
        className={styles['header']}
      >
        {/* <IconButton
          name='content_copy'
          title='Copy'
          onClick={onCopyClick}
        /> */}
        <IconButton
          name={expandIconName}
          title='Expand/collapse module'
          onClick={onExpandClick}
        />        
      </Header>
      <pre className={moduleClassName}>
        {module}
      </pre>
    </div>
  );
}