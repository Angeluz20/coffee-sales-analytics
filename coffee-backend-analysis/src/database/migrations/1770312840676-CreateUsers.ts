import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1770312840676 implements MigrationInterface {
    name = 'CreateUsers1770312840676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '100',
                        isUnique: false,
                        isNullable: false
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '150',
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'datetime2',
                        isNullable: false,
                        default: 'GETDATE()'
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime2',
                        isNullable: false,
                        default: 'GETDATE()'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
