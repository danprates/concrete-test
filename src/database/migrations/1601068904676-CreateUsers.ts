import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1601068904676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      SELECT uuid_generate_v4();

      CREATE TABLE IF NOT EXISTS "users" (
        id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL UNIQUE,
        password varchar(255) NOT NULL,
        token varchar(255) NULL,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_email ON users (email)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS idx_email');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}
