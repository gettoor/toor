import { isValidElement } from 'preact/compat';
import { VNode } from 'preact';

export function isVNode(element: any): element is VNode {
  if (!element || !isValidElement(element)) {
    return false;
  }
  return element;
}