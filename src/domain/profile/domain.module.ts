/**
 * Доменный модуль.
 * Содержит сервис профиля. Сервис зависит от порта ProfileRepository;
 * Реальная реализация подключается инфраструктурным модулем (через глобальный провайдер).
 * Маршрутизатор (REST entry point) находится в инфраструктурном слое (ApiModule).
 */

import { Module } from '@nestjs/common';

import { ProfileService } from '@/domain/profile/service';

@Module({
  providers: [ProfileService],
  exports: [ProfileService],
})
export class DomainModule {}