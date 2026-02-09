export const FileImportsMessages = {
  NOT_FOUND: (id: number) =>
    `File import with id ${id} not found`,

  CREATED: 'File import created successfully',
  IMPORT_STARTED: 'File import started successfully',
  IMPORT_FINISHED: 'File import processed successfully',

  FIND_ALL_SUCCESS: 'Import list retrieved successfully',
  FIND_ONE_SUCCESS: 'Import retrieved successfully',
  FIND_ALL_EMPTY: 'No imports found for this user',

  UPDATED: 'File import updated successfully',
  DELETED: 'File import removed successfully',

  INVALID_FILE: 'Invalid file format. Only Excel files are allowed',
  DUPLICATED_FILE: 'This file has already been imported',

  ALREADY_IMPORTED: 'This file has already been imported and no changes were detected',
  
  EMPTY_FILE: 'The uploaded file is empty',
  REQUIRED_FIELDS_ARE_MISSING : 'Required fields are missing',
  INVALID_HEADERS: (headers: string[]) =>
    `Invalid file structure. Missing columns: ${headers.join(', ')}`,
};
