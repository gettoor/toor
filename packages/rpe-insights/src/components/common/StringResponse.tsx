import { diffWordsWithSpace } from 'diff';
import styles from './StringResponse.module.scss';
import { ComponentChildren, Fragment } from 'preact';

export interface StringResponseProps {
  response: string;
  diffResponse?: string;
}

export function StringResponse(props: StringResponseProps) {
  const { response, diffResponse } = props;

  const differences = diffResponse
    ? diffWordsWithSpace(response, diffResponse)
    : [];

  const renderNewlines = (text: string): ComponentChildren => {
    return text.split(/\r?\n/).map((line, index) => (
      <Fragment key={index}>
        {index > 0 && <br/>}
        {line}
      </Fragment>
    ));
  }

  const render = () => {
    return differences
      .filter((difference) => {
        // added differences come from diffResponse
        return !difference.added;
      })
      .map((difference, index) => {
        const key = `${index}`;
        const hasDifference = difference.removed;
        const className = hasDifference ? styles['highlight'] : styles['reset'];
        return (
          <span key={key} className={className}>
            {renderNewlines(difference.value)}
          </span>
        );
      });
  }

  return (
    <div className={styles['string-response']}>
      { render() }
    </div>
  );
}