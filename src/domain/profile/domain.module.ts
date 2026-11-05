import { Module } from '@nestjs/common';
import { ProfileService } from '@/domain/profile/service';

/**
 * Доменный модуль.
 * Содержит сервис профиля. Сервис зависит от порта ProfileRepository;
 * реальная реализация подключается инфраструктурным модулем (через глобальный провайдер).
 * Маршрутизатор (REST entry point) находится в инфраструктурном слое (ApiModule).
 */
@Module({
  providers: [ProfileService],
  exports: [ProfileService],
})
export class DomainModule {}