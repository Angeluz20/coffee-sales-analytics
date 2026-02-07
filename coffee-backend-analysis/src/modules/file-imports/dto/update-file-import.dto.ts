import { PartialType } from '@nestjs/mapped-types';
import { CreateFileImportDto } from './create-file-import.dto';

export class UpdateFileImportDto extends PartialType(CreateFileImportDto) {}
