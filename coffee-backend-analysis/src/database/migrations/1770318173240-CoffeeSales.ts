import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CoffeeSales1770318173240 implements MigrationInterface {
    name = 'CoffeeSales1770318173240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'coffee_sales',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'date',
                        type: 'date',
                        isNullable: true,
                        default: 'CAST(GETDATE() AS date)',
                    },
                    {
                        name: 'datetime',
                        type: 'datetime2',
                        isNullable: true,
                        default: 'GETDATE()'
                    },
                    {
                        name: 'hour_or_day',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'coffee_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'time_of_day',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'cash_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'card',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'weekday',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'month_name',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'week_day_sort',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'month_sort',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10, 
                        scale: 2,
                        isNullable: true
                    },
                    {
                        name: 'created_at',
                        type: 'datetime2',
                        isNullable: false,
                        default: 'GETDATE()',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime2',
                        isNullable: false,
                        default: 'GETDATE()',
                    },
                    {
                        name: 'file_id',
                        type: 'int',
                        isNullable: false
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: false
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['file_id'],
                        referencedTableName: 'file_imports',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE'
                    },
                    {
              
                        columnNames: ['user_id'],
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        onDelete: 'NO ACTION'
                    }
                ]
            })
        )
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropDatabase('coffee_sales')
    }

}
