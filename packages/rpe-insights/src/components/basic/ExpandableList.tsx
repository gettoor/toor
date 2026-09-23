import { useState } from 'preact/hooks';

import { MiddotSeparator } from './MiddotSeparator';
import { LinkButton } from './LinkButton';
import styles from './ExpandableList.module.scss';

export interface ExpandableListProps {
  totalItems: number;
  initialVisibleItemCount?: number;
  visibleItemCountIncrement?: number;
  itemRenderer: (index: number) => React.ReactNode;
}

const DEFAULT_INITIAL_VISIBLE_ITEM_COUNT = 4;
const DEFAULT_VISIBLE_ITEM_COUNT_INCREMENT = 4;

export function ExpandableList(props: ExpandableListProps) {
  const { 
    totalItems,
    initialVisibleItemCount = DEFAULT_INITIAL_VISIBLE_ITEM_COUNT,
    visibleItemCountIncrement = DEFAULT_VISIBLE_ITEM_COUNT_INCREMENT,
    itemRenderer,
  } = props;

  const [visibleItemCount, setVisibleItemCount] = useState(
    Math.min(initialVisibleItemCount, totalItems),
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
    // const length = Math.min(visibleItemCount, totalItems);
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