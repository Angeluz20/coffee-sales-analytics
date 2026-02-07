import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class FileImport1770317724337 implements MigrationInterface {
    name = 'FileImport1770317724337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'file_imports',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'original_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'stored_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'file_hash',
                        type: 'varchar',
                        length: '64',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '30',
                        isNullable: false,
                    },
                    {
                        name: 'total_records',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'processed_records',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'error_message',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime2',
                        default: 'SYSDATETIME()',
                    },
                    {
                        name: 'finished_at',
                        type: 'datetime2',
                        isNullable: true,
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: false
                    }
                ],
                foreignKeys: [
                    {
              
                        columnNames: ['user_id'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    }
                ]
             })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropDatabase('file_imports')
    }

}
