export function nextNavigationHidden(hidden: boolean, anchor: number, current: number, locked: boolean) {
  if (locked || current <= 32) return { hidden: false, anchor: current };
  const delta = current - anchor;
  if (Math.abs(delta) < 12) return { hidden, anchor };
  return { hidden: delta > 0, anchor: current };
}
