import { ConflictException, NotFoundException } from '@nestjs/common';
import { FileImportsMessages } from 'src/common/messages/file-import.messages';

export class FileImportNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(FileImportsMessages.NOT_FOUND(id));
  }
}

export class FileAlreadyImportedException extends ConflictException {
  constructor() {
    super(FileImportsMessages.ALREADY_IMPORTED);
  }
}