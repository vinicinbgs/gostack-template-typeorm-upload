import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForeignKeyTransactionsCategories1587499942367
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE transactions ADD COLUMN category_id varchar',
    );

    await queryRunner.query(
      'ALTER TABLE transactions ADD CONSTRAINT FK_CATEGORIES_TRANSACTIONS FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE RESTRICT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE transactions DROP CONSTRAINT FK_CATEGORIES_TRANSACTIONS',
    );
  }
}
