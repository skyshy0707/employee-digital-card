/**
 * Доменный модуль.
 * Содержит сервисы доменных сущностей (профиль, ...) с зависимостями от репозиториев;
 * Реализации репозиториев подключаются инфраструктурным модулем (через глобальный провайдер).
 */

import { Module } from '@nestjs/common';

import { ProfileService } from '@/domain/profile/service';

@Module({
  providers: [ProfileService],
  exports: [ProfileService],
})
export class DomainModule {}