export function parseBrDateToIso(dateStr?: string): string {
  if (!dateStr) return '';

  const [datePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);

  if (!day || !month || !year) return '';

  return new Date(year, month - 1, day).toISOString().split('T')[0];
}
