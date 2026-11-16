/**
 * Инфраструктурный API-модуль.
 */

import { Module } from '@nestjs/common';

import { DomainModule } from '@/domain/profile/domain.module';


@Module({
  imports: [DomainModule],
})
export class ApiModule {}
