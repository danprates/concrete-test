import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import * as databaseConfig from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
