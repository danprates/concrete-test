import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhones1601298770029 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      SELECT uuid_generate_v4();

      CREATE TABLE IF NOT EXISTS "phones" (
        id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        value varchar(255) NULL,
        ddd varchar(255) NULL,
        user_id uuid NOT NULL REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "phones"');
  }
}
