let rpeState: any = null;

export function loadRPEState(): void {
  const rpeStateElement = document.getElementById('rpe-state');
  if (!rpeStateElement) {
    throw new Error('RPE state not found');
  }
  rpeState = JSON.parse(rpeStateElement.textContent || '{}');
  console.log(rpeState);
}

export function getRPEState(): any {
  return rpeState;
}