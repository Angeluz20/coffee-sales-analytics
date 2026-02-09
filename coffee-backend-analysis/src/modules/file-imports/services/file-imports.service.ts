import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';

import { CreateFileImportDto } from '../dto/create-file-import.dto';
import { UpdateFileImportDto } from '../dto/update-file-import.dto';
import { FileImportRepository } from '../repositories/file-import.repository';
import { FileImport } from '../entities/file-import.entity';

import { CoffeeSalesService } from 'src/modules/coffee-sales/services/coffee-sales.service';
import { UsersService } from 'src/modules/users/services/users.service';

import { readXlsx } from 'src/utils/read-file';
import { parseBrDateToIso, parseExcelDatetime } from 'src/utils/formatData.utils';
import { CreateCoffeeSaleDto } from 'src/modules/coffee-sales/dto/create-coffee-sale.dto';
import { FileAlreadyImportedException, FileImportNotFoundException } from 'src/common/exceptions/file-import.exception';
import { FileImportsMessages } from 'src/common/messages/file-import.messages';

const Status = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
  FINISHED: 'FINISHED'
};

@Injectable()
export class FileImportsService {
  constructor(
    @Inject(FileImportRepository)
    private readonly fileRepository: FileImportRepository,

    @Inject(CoffeeSalesService)
    private readonly coffeeSaleService: CoffeeSalesService,

    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  private readonly EXPECTED_HEADERS = [
    'Date',
    'datetime',
    'hour_of_day',
    'card',
    'money',
    'coffee_name',
    'Time_of_Day',
    'Weekday',
    'Month_name',
    'Weekdaysort',
    'MonthSort'
  ];

  async create(
    userId: number,
    dto: CreateFileImportDto,
  ): Promise<FileImport> {
    return this.fileRepository.create(userId, dto);
  }

  async startImport(
    userId: number,
    file: Express.Multer.File,
  ): Promise<FileImport> {
    await this.userService.findById(userId);

    const rows = readXlsx(file.buffer, this.EXPECTED_HEADERS);
    const totalRecords = rows.length;

    const fileHash = createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    const identicalFile =
      await this.fileRepository.findOneByHash(fileHash);

    if (identicalFile && identicalFile.status === Status.FINISHED) {
      throw new FileAlreadyImportedException();
    }

    const existingFile =
      await this.fileRepository.findByOriginalNameAndUser(
        file.originalname,
        userId,
      );

    let fileData: FileImport;

    if (existingFile) {
      const updated = await this.fileRepository.update(
        existingFile.id,
        {
          storedName: `${Date.now()}-${file.originalname}`,
          fileHash,
          status: Status.PENDING,
          processedRecords: 0,
          totalRecords,
          errorMessage: '',
        },
      );

      if (!updated) {
        throw new FileImportNotFoundException(existingFile.id);
      }

      fileData = updated;
    } else {
      fileData = await this.fileRepository.create(userId, {
        originalName: file.originalname,
        storedName: `${Date.now()}-${file.originalname}`,
        fileHash,
        status: Status.PENDING,
        totalRecords,
      });
    }

    return this.processImport(rows, fileData.id, userId);
  }

  async processImport(
      rows: any[],
      fileId: number,
      userId: number,
  ): Promise<FileImport> {
      const errors: string[] = [];
      const allDtos: CreateCoffeeSaleDto[] = [];

      await this.fileRepository.update(fileId, {
          status: Status.PROCESSING,
      });

      for (const [index, row] of rows.entries()) {
          try {
              const dto = this.mapRowToDto(row, userId, fileId);
              allDtos.push(dto);

          } catch (error) {
              errors.push(`Row ${index + 1}: ${(error as Error).message}`);
          }
      }

      const processedCount = await this.coffeeSaleService.upsertManyCoffeeSales(allDtos);

      const finished = await this.fileRepository.update(fileId, {
          status: Status.FINISHED,
          processedRecords: processedCount,
          totalRecords: rows.length,
          finishedAt: new Date(),
          errorMessage: errors.length > 0 ? errors.join(' | ').substring(0, 500) : '',
      });

      if (!finished) {
          throw new FileImportNotFoundException(fileId);
      }

      return finished;
  }
 
  private parseMoney(value: unknown): number {
     const MONEY_REGEX = /[^\d.-]/g;
    if (value == null) return 0;
    return Number(String(value).replace(MONEY_REGEX, '')) || 0;
  }

  private mapRowToDto(
    row: any,
    userId: number,
    fileId: number,
  ): CreateCoffeeSaleDto {
    return {
      date: parseBrDateToIso(row.date),
      datetime: parseExcelDatetime(row.datetime),
      coffeeName: row.coffee_name,
      amount: this.parseMoney(row.money),
      weekday: row.Weekday || row.weekday,
      monthName: row.Month_name || row.month,
      weekDaySort: Number(row.Weekdaysort || 0),
      monthSort: Number(row.Monthsort || row.month_sort),
      hourOfDay: Number(row.hour_of_day),
      timeOfDay: row.Time_of_Day || row.time_of_day,
      card: row.card,
      cashType: row.cash_type,
      userId,
      fileId,
    };
  }

  async findAll(): Promise<FileImport[]> {
    return this.fileRepository.findAll();
  }

  async findAllByUserId(userId: number): Promise<FileImport[]> {
    return this.fileRepository.findAllByUserAuthenticated(
      userId,
    );
  }

  async findOne(id: number): Promise<FileImport> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new FileImportNotFoundException(id);
    }
    return file;
  }

  async update(
    id: number,
    dto: UpdateFileImportDto,
  ): Promise<FileImport> {
    const updated = await this.fileRepository.update(
      id,
      dto,
    );

    if (!updated) {
      throw new FileImportNotFoundException(id);
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const removed = await this.fileRepository.remove(id);
    if (!removed) {
      throw new FileImportNotFoundException(id);
    }
  }
}
