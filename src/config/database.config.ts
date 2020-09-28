import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
} from './constants.config';

const databaseConfig: ConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [__dirname + '../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '../../database/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
  },
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export = databaseConfig;
