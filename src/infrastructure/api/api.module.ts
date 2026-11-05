import { Module } from '@nestjs/common';
import { DomainModule } from '@/domain/profile/domain.module';
import { Router } from './router';

/**
 * Инфраструктурный API-модуль.
 * Содержит транспортные entry points (REST-маршрутизаторы).
 * Зависит от доменного модуля — направление зависимости: инфраструктура -> домен.
 */
@Module({
  imports: [DomainModule],
  controllers: [Router],
})
export class ApiModule {}
