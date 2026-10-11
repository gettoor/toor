import { VNode } from 'preact';
import * as YAML from 'yaml';
import diff from 'microdiff';

import styles from './StructureResponse.module.scss';

export interface StructureResponseProps {
  response: Record<string, any>;
  diffResponse?: Record<string, any>;
}

export function StructureResponse(props: StructureResponseProps) {
  const { response, diffResponse } = props;
  const differences = diffResponse ? diff(response, diffResponse) : [];

  const checkHasDifference = (path: (string | number)[]): boolean => {
    const difference = differences?.find(itr => {
      return itr.path.join('.') === path.join('.');
    });
    return difference !== undefined;
  };

  const render = (
    value: any,
    indent = 0,
    parentPath: (string | number)[] = [],
    isArrayItem = false,
    parentHasDifference = false,
    output: VNode[] = [],
  ): VNode[] => {
    const indentString = ' '.repeat(indent * 2);

    const isPrimitive = (value: any): boolean => {
      return typeof value !== 'object' || value === null;
    };

    const renderPrimitive = (value: any): string => {
      return `${value}`;
    }

    const highlight = (
      content: string | VNode | VNode[], 
      hasDifference: boolean,
    ): VNode => {
      const className = (hasDifference || parentHasDifference) 
        ? styles['highlight']
        : styles['reset'];
      return (
        <span className={className}>
          {content}
        </span>
      );
    };
    const reset = (content: string): VNode => {
      return (
        <span className="reset">
          {content}
        </span>
      );
    };

    if (Array.isArray(value)) {
      // empty array
      if (value.length === 0) {
        const path = [...parentPath, 0];
        const hasDifference = checkHasDifference(path);
        output.push(
          reset(`${indentString}- `),
          highlight(`[]`, hasDifference),
          <br/>
        );
        return output;
      }

      // array items
      for (let index = 0; index < value.length; index++) {
        const path = [...parentPath, index];
        const hasDifference = checkHasDifference(path) || parentHasDifference;

        // array item prefix
        if (index === 0 && isArrayItem) {
          output.push(reset(`- `));
        }
        else {
          output.push(reset(`${indentString}- `));
        }

        // primitive
        if (isPrimitive(value[index])) {
          output.push(
            highlight(`${renderPrimitive(value[index])}`, hasDifference),
            <br/>,
          );
        }
        else {
          // non-primitive
          output.push(highlight(
            render(
              value[index],
              indent + 1,
              [...parentPath, index],
              true,
              hasDifference,
            ),
            hasDifference,
          ));
        }
      }
      return output;
    }

    if (typeof value === 'object' && value !== null) {
      const keys = Object.keys(value);
      keys.forEach((key, index) => {
        const objectValue = value[key];
        const path = [...parentPath, key];
        const hasDifference = checkHasDifference(path);

        // primitive
        if (isPrimitive(objectValue)) {
          // key
          if (index === 0 && isArrayItem) {
            output.push(highlight(`${key}: `, hasDifference));
          }
          else {
            output.push(highlight(`${indentString}${key}: `, hasDifference));
          }

          // value
          output.push(
            highlight(
              `${renderPrimitive(objectValue)}`,
              hasDifference,
            ),
            <br/>
          );
        }
        else {
          // non-primitive
          if (index === 0 && isArrayItem) {
            output.push(highlight(`${key}:\n`, hasDifference));
          }
          else {
            output.push(highlight(`${indentString}${key}:\n`, hasDifference));
          }

          // value
          output.push(highlight(
            render(
              objectValue,
              indent + 1,
              [...parentPath, key],
              false,
              hasDifference,
            ),
            hasDifference,
          ));
        }
      });
    }

    return output;
  };

  return (
    <div className={styles['structure-response']}>
      { render(response) }
    </div>
  );
}