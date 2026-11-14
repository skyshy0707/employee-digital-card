/**
 * Инфраструктурный API-модуль.
 * Содержит транспортные entry points (REST-маршрутизаторы).
 * Зависит от доменного модуля — направление зависимости: инфраструктура -> домен.
 */

import { Module } from '@nestjs/common';

import { DomainModule } from '@/domain/profile/domain.module';
import { Router } from '@/infrastructure/api/router';


@Module({
  imports: [DomainModule],
  controllers: [Router],
})
export class ApiModule {}
