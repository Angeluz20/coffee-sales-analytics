export function parseBrDateToIso(dateStr?: string): string {
  if (!dateStr) return '';

  const [datePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);

  if (!day || !month || !year) return '';

  return new Date(year, month - 1, day).toISOString().split('T')[0];
}

export function parseExcelDatetime(value: any): Date {
  if (!value) {
    throw new Error(`Datetime vazio ou nulo: ${value}`);
  }

  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    const parsed = new Date(excelEpoch.getTime() + value * 86400000);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  if (typeof value === 'string') {
    const [datePart, timePart = '00:00:00'] = value.trim().split(/\s+/);
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour = 0, minute = 0, second = 0] = timePart.split(':').map(Number);

    if (day && month && year) {
      const parsed = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
      );

      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  throw new Error(`Invalid datetime value: ${value}`);
}
