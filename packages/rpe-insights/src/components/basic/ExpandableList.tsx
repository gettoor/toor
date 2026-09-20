import { useState } from 'preact/hooks';

import { IconButton } from './IconButton';
import { MiddotSeparator } from './MiddotSeparator';
import styles from './ExpandableList.module.scss';
import { LinkButton } from './LinkButton';

export interface ExpandableListProps {
  totalItems: number;
  initialVisibleItemCount?: number;
  visibleItemCountIncrement?: number;
  itemRenderer: (index: number) => React.ReactNode;
}

const INITIAL_VISIBLE_ITEM_COUNT = 4;
const DEFAULT_VISIBLE_ITEM_COUNT_INCREMENT = 4;

export function ExpandableList(props: ExpandableListProps) {
  const { 
    totalItems,
    initialVisibleItemCount = INITIAL_VISIBLE_ITEM_COUNT,
    visibleItemCountIncrement = DEFAULT_VISIBLE_ITEM_COUNT_INCREMENT,
    itemRenderer,
  } = props;

  const [visibleItemCount, setVisibleItemCount] = useState(
    initialVisibleItemCount,
  );

  const onMoreClick = () => {
    setVisibleItemCount(
      Math.min(
        visibleItemCount + visibleItemCountIncrement,
        totalItems,
      ),
    );
  };
  const onLessClick = () => {
    setVisibleItemCount(
      Math.max(
        visibleItemCount - visibleItemCountIncrement,
        initialVisibleItemCount,
      ),
    );
  };

  const renderItems = () => {
    return Array.from({ length: visibleItemCount }, (_, index) => {
      return itemRenderer(index);
    });
  };

  const renderCountLabel = () => {
    return (
      <span>
        {visibleItemCount} of {totalItems}
      </span>
    );
  }

  const hasMore = visibleItemCount < totalItems;
  const hasLess = visibleItemCount > initialVisibleItemCount;

  return (
    <div>
      { renderItems() }
      <div className={styles['expandable-list-button-bar']}>
        <div className={styles['expandable-list-button-bar-content']}>
          <LinkButton
            label='More'
            disabled={!hasMore}
            onClick={onMoreClick}
            />
          <MiddotSeparator/>
          <LinkButton
            label='Less'
            disabled={!hasLess}
            onClick={onLessClick}
          />
          <MiddotSeparator/>
          { renderCountLabel() }
        </div>
      </div>
    </div>
  );
}