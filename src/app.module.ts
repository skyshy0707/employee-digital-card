import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from '@/infrastructure/api/api.module';
import { DataAccessModule } from '@/infrastructure/data-access/data-access.module';
import { GraphqlModule } from '@/graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DataAccessModule,
    ApiModule,
    GraphqlModule,
  ],
})
export class AppModule {}
