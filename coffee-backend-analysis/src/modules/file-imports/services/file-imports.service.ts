import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import { CreateFileImportDto } from '../dto/create-file-import.dto';
import { UpdateFileImportDto } from '../dto/update-file-import.dto';
import { FileImportRepository } from '../repositories/file-import.repository';
import { FileImport } from '../entities/file-import.entity';

import { CoffeeSalesService } from 'src/modules/coffee-sales/services/coffee-sales.service';
import { UsersService } from 'src/modules/users/services/users.service';

import { readXlsx } from 'src/utils/read-file';
import { parseBrDateToIso } from 'src/utils/formatData.utils';
import { CreateCoffeeSaleDto } from 'src/modules/coffee-sales/dto/create-coffee-sale.dto';
import { FileAlreadyImportedException, FileImportNotFoundException } from 'src/modules/coffee-sales/exceptions/file-import.exception';

const Status = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  PROCESSING: 'PROCESSING',
  ERROR: 'ERROR',
  FINISEHD: 'FINISHED'
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

    const rows = readXlsx(
      file.buffer,
      this.EXPECTED_HEADERS,
    );

    const totalRecords = rows.length;

    const fileHash = createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    const identicalFile =
      await this.fileRepository.findOneByHash(fileHash);

    if (identicalFile && identicalFile.status === Status.FINISEHD) {
      throw new FileAlreadyImportedException();
    }

    const existingFile =
      await this.fileRepository.findByOriginalNameAndUser(
        file.originalname,
        userId,
      );

    let fileData: FileImport;

    if (existingFile) {
      const updated =
        await this.fileRepository.update(existingFile.id, {
          storedName: `${Date.now()}-${file.originalname}`,
          fileHash,
          status: Status.PENDING,
          processedRecords: 0,
          totalRecords,
          errorMessage: '',
        });

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

    return this.processImport(
      rows,
      fileData.id,
      userId,
    );
  }

  async processImport(
    rows: any[],
    fileId: number,
    userId: number,
  ): Promise<FileImport> {
    const COLUMNS_PER_ROW = 15;
    const MAX_SQL_PARAMS = 1500;

    const BATCH_SIZE = Math.max(
      1,
      Math.floor(MAX_SQL_PARAMS / COLUMNS_PER_ROW),
    );

    const errors: string[] = [];
    let processedCount = 0;

    const batchMap = new Map<string, CreateCoffeeSaleDto>();

    const started = await this.fileRepository.update(fileId, {
      status: Status.PROCESSING,
    });

    if (!started) {
      throw new FileImportNotFoundException(fileId);
    }

    for (const [index, row] of rows.entries()) {
      try {
        if (!row.date || !row.coffee_name) {
          throw new Error('Required fields are missing');
        }

        const rawMoney = row.money
          ? String(row.money).replace(/[^\d.-]/g, '')
          : '0';

        const dto = this.mapRowToDto(
          row,
          rawMoney,
          userId,
          fileId,
        );

        const uniqueKey = `${dto.userId}_${dto.coffeeName}_${new Date(
          dto.datetime,
        ).getTime()}`;

        batchMap.set(uniqueKey, dto);

        if (batchMap.size === BATCH_SIZE) {
          processedCount += await this.flushBatch(batchMap);
        }
      } catch (error) {
        errors.push(
          `Row ${index + 1}: ${(error as Error).message}`,
        );
      }
    }

    if (batchMap.size > 0) {
      processedCount += await this.flushBatch(batchMap);
    }

    const finished = await this.fileRepository.update(fileId, {
      status: Status.FINISEHD,
      processedRecords: processedCount,
      totalRecords: rows.length,
      finishedAt: new Date(),
      errorMessage:
        errors.length > 0
          ? errors.join(' | ').substring(0, 500)
          : '',
    });

    if (!finished) {
      throw new FileImportNotFoundException(fileId);
    }

    return finished;
  }

  private async flushBatch(
    batchMap: Map<string, CreateCoffeeSaleDto>,
  ): Promise<number> {
    const data = Array.from(batchMap.values());

    const result =
      await this.coffeeSaleService.upsertManyCoffeeSales(
        data,
      );

    batchMap.clear();

    return result;
  }

  private mapRowToDto(
    row: any,
    rawMoney: string,
    userId: number,
    fileId: number,
  ): CreateCoffeeSaleDto {
    return {
      date: parseBrDateToIso(row.date),
      datetime: parseBrDateToIso(row.datetime),
      coffeeName: row.coffee_name,
      amount: parseFloat(rawMoney),
      weekday: row.Weekday || row.weekday,
      monthName: row.Month_name || row.month,
      weekDaySort: Number(row.Weekdaysort || 0),
      monthSort: Number(row.Monthsort || row.month_sort),
      hourOrDay: Number(row.hour_of_day || row.hour_or_day),
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
