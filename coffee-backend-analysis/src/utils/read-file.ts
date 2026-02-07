import * as XLSX from 'xlsx';
import { ConflictException } from '@nestjs/common';
import { FileImportsMessages } from 'src/common/messages/file-import.messages';

export function readXlsx(
  buffer: Buffer,
  expectedHeaders?: string[],
): any[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const data: any[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: false,
  });

  if (!data.length) {
    throw new ConflictException(
      FileImportsMessages.EMPTY_FILE,
    );
  }

  if (expectedHeaders) {
    validateHeaders(data[0], expectedHeaders);
  }

  return data;
}

function validateHeaders(
  firstRow: Record<string, any>,
  expectedHeaders: string[],
) {
  const headers = Object.keys(firstRow).map(h =>
    h.trim().toLowerCase(),
  );

  const missing = expectedHeaders.filter(
    h => !headers.includes(h.toLowerCase()),
  );

  if (missing.length > 0) {
    throw new ConflictException(
      FileImportsMessages.INVALID_HEADERS(missing),
    );
  }
}
