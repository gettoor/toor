import clsx from 'clsx';
import { useState } from 'preact/hooks';

import { camelCaseToSentenceCase } from '../../string';
import { COLLAPSE_ICON, EXPAND_ICON } from '../consts';
import { IconButton, Header } from '../basic';
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
  const onToggle = () => {
    setExpanded(!expanded);
  };

  const moduleClassName = clsx(
    styles['module'],
    {
      [styles['module-expanded']]: expanded,
    },
  );
  const expandIconName = expanded ? COLLAPSE_ICON : EXPAND_ICON;

  return (
    <div className={styles['candidate-module']}>
      <Header
        title={camelCaseToSentenceCase(name)}
        level={2}
        className={styles['header']}
        onTitleClick={onToggle}
      >
        <Header.Actions>
          <IconButton
            name={expandIconName}
            title='Expand/collapse module'
            onClick={onToggle}
          />        
        </Header.Actions>
        <Header.Toolbar>
          <IconButton
            name='content_copy'
            title='Copy module'
            onClick={onCopyClick}
          />        
        </Header.Toolbar>
      </Header>
      <pre className={moduleClassName}>
        {module}
      </pre>
    </div>
  );
}