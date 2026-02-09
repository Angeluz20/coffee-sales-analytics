import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  ConflictException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { FileImportsService } from '../services/file-imports.service';
import { UpdateFileImportDto } from '../dto/update-file-import.dto';
import { FileImportsMessages } from 'src/common/messages/file-import.messages';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('file-imports')
@UseGuards(JwtAuthGuard)
export class FileImportsController {
  constructor(
    private readonly fileImportsService: FileImportsService,
  ) {}

  @Post('import/userId/:userId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async importFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
        ],
        exceptionFactory: () =>
          new ConflictException(
            'Only Excel (.xlsx) files are allowed',
          ),
      }),
    )
    file: Express.Multer.File,
    @Param('userId') userId: number,
  ) {
    const data =
      await this.fileImportsService.startImport(
        userId,
        file,
      );

    return {
      message: FileImportsMessages.IMPORT_FINISHED,
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data = await this.fileImportsService.findAll();

    return {
      message:
        data.length > 0
          ? FileImportsMessages.FIND_ALL_SUCCESS
          : FileImportsMessages.FIND_ALL_EMPTY,
      data,
    };
  }

  @Get('userId/:userId')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(
    @Param('userId') userId: number,
  ) {
    const data =
      await this.fileImportsService.findAllByUserId(
        userId,
      );

    return {
      message:
        data.length > 0
          ? FileImportsMessages.FIND_ALL_SUCCESS
          : FileImportsMessages.FIND_ALL_EMPTY,
      data,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number) {
    const data =
      await this.fileImportsService.findOne(id);

    return {
      message: FileImportsMessages.FIND_ONE_SUCCESS,
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateFileImportDto,
  ) {
    const data =
      await this.fileImportsService.update(id, dto);

    return {
      message: FileImportsMessages.UPDATED,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number) {
    await this.fileImportsService.remove(id);

    return {
      message: FileImportsMessages.DELETED,
    };
  }
}
