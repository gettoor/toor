import { RPEResponse } from '@gettoor/core';

import { StringResponse } from './StringResponse';
import { StructureResponse } from './StructureResponse';

export interface ResponseProps {
  response: RPEResponse;
  diffResponse?: RPEResponse; // response to diff against
}

export function Response(props: ResponseProps) {
  const { 
    response: rawResponse,
    diffResponse: rawDiffResponse,
  } = props;
  
  const response = transform(rawResponse)!;
  const isStructuredOutput = typeof response === 'object';

  const diffResponse = transform(rawDiffResponse);
  const isDiffStructuredOutput = typeof diffResponse === 'object';

  return (
    <>
      { isStructuredOutput
        ? <StructureResponse
            response={response}
            diffResponse={isDiffStructuredOutput ? diffResponse : undefined}
          />
        : <StringResponse
            response={response}
            diffResponse={!isDiffStructuredOutput ? diffResponse : undefined}
          />
      }
    </>
  );
}

function transform(response?: RPEResponse): RPEResponse | undefined {
  if (!response) {
    return undefined;
  }

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