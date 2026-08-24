import { RPEState } from '@gettoor/core';

export function loadRPEState(): RPEState {
  const rpeStateElement = document.getElementById('rpe-state');
  if (!rpeStateElement) {
    throw new Error('RPE state not found');
  }
  const rpeState = JSON.parse(rpeStateElement.textContent || '{}') as RPEState;
  return rpeState;
}