import { ComponentChildren, toChildArray } from 'preact';
import { PropsWithChildren } from 'preact/compat';
import { useState } from 'preact/hooks';

import { isVNode } from '../../preact';
import { COLLAPSE_ICON, EXPAND_ICON } from '../consts';
import { IconButton } from './IconButton';
import { Header } from './Header';

export interface ExpandableSectionProps extends PropsWithChildren {
  title: string;
  headerLevel?: 1 | 2;
  expanded?: boolean;
  onToggle?: () => void;
}

function Summary({ children }: { children: ComponentChildren }) {
  return <>{children}</>;
}

function Details({ children }: { children: ComponentChildren }) {
  return <>{children}</>;
}

export function ExpandableSection(props: ExpandableSectionProps) {
  const { 
    title,
    headerLevel = 1,
    expanded: externalExpanded,
    onToggle: externalOnToggle,
    children,
  } = props;

  const isControlled = externalExpanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(
    isControlled ? externalExpanded : false
  );
  const isExpanded = isControlled ? externalExpanded : internalExpanded;

  let summary: ComponentChildren = null;
  let details: ComponentChildren = null;

  for (const child of toChildArray(children)) {
    if (!isVNode(child)) {
      continue;
    }
    if (child.type === Summary) {
      summary = child.props.children;
    }
    if (child.type === Details) {
      details = child.props.children;
    }
  }

  const onToggle = () => {
    if (isControlled) {
      externalOnToggle?.();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };
  const iconName = isExpanded ? COLLAPSE_ICON : EXPAND_ICON;

  return (
    <>
      <Header
        title={title}
        level={headerLevel}
        onTitleClick={onToggle}
      >
        <IconButton
          name={iconName}
          title='Collapse/expand'
          onClick={onToggle}
        />
      </Header>
      { isExpanded ? details : summary }
    </>
  );
}

ExpandableSection.Summary = Summary;
ExpandableSection.Details = Details;