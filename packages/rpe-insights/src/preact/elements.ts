import { ComponentChildren, ComponentType, toChildArray, VNode } from 'preact';
import { isValidElement } from 'preact/compat';

export function isVNode(element: any): element is VNode {
  if (!element || !isValidElement(element)) {
    return false;
  }
  return element;
}

export function findChildrenByType(
  children: ComponentChildren,
  types: ComponentType<any>[],
): (ComponentChildren | null)[] {
  const result: (ComponentChildren | null)[] = [];
  types.forEach(type => {
    let childOfType: ComponentChildren | null = null;
    for (const child of toChildArray(children)) {
      if (!isVNode(child)) {
        continue;
      }
      if (child.type === type) {
        childOfType = child.props.children;
        break;
      }
    }
    result.push(childOfType);
  });
  return result;
}