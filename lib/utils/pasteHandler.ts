export function normalizePasted(value: string): string {
  if (!value) return '';
  const trimmed = value.trim().replace(/\u00a0/g, '');
  if (/^-?\d+,\d+$/.test(trimmed)) {
    return trimmed.replace(',', '.');
  }
  return trimmed;
}

export function parseClipboard(text: string): string[][] {
  const rows = text.replace(/\r/g, '').split('\n');
  const filteredRows = rows.filter((row) => row.trim() !== '');
  return filteredRows.map((row) => row.split('\t').map(normalizePasted));
}

export interface PasteConfig<T> {
  dataArr: T[];
  fieldOrder: string[];
  makeEmptyRow: () => T;
  startRow: number;
  startField: string;
  onUpdate: () => void;
}

export function handlePaste<T>(
  event: React.ClipboardEvent<HTMLInputElement>,
  config: PasteConfig<T>
): void {
  const text = event.clipboardData?.getData('text');
  if (!text || !text.trim()) return;

  event.preventDefault();
  const grid = parseClipboard(text);
  const startFieldIdx = config.fieldOrder.indexOf(config.startField);

  grid.forEach((cols, ri) => {
    const targetRow = config.startRow + ri;
    while (config.dataArr.length <= targetRow) {
      config.dataArr.push(config.makeEmptyRow());
    }
    cols.forEach((val, ci) => {
      const fieldIdx = startFieldIdx + ci;
      if (fieldIdx >= 0 && fieldIdx < config.fieldOrder.length) {
        const key = config.fieldOrder[fieldIdx];
        (config.dataArr[targetRow] as Record<string, unknown>)[key] = val;
      }
    });
  });

  config.onUpdate();
}