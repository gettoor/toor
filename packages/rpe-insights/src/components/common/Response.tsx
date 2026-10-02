import * as YAML from 'yaml';
import { RPEResponse } from '@gettoor/core';

import { Markdown } from '../basic';
import styles from './Response.module.scss';

export interface ResponseProps {
  response: RPEResponse;
}

export function Response(props: ResponseProps) {
  const { response: rawResponse } = props;
  const response = transform(rawResponse);
  const isStructuredOutput = typeof response === 'object';

  const renderString = () => {
    return <Markdown content={response as string} />;
  }
  const renderStructuredOutput = () => {
    const structuredOutput = YAML.stringify(response);
    return (
      <pre className={styles['response-structured-output']}>
        { structuredOutput }
      </pre>
    );
  }

  return (
    <>
      { isStructuredOutput ? renderStructuredOutput() : renderString() }
    </>
  );
}

function transform(response: RPEResponse): RPEResponse {
  if (typeof response === 'object') {
    return response;
  }

  // try to parse as JSON
  try {
    return JSON.parse(response);
  } catch (error) {
    // ignore on purpose, just return the original response
  }

  return response;
}