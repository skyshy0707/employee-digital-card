/**
 * REST-маршрутизатор профиля.
 * Жизненный цикл: создаётся контейнером DI NestJS при загрузке модуля,
 * в котором объявлен (см. ApiModule). Не создаётся вручную.
 */

import { Controller, Get, Param } from '@nestjs/common';

import { ProfileService } from '@/domain/profile/service';
import { Profile } from '@/domain/profile/types/entities';


@Controller('profile')
export class Router {
  constructor(private readonly service: ProfileService) {}

  // Контракт: GET profile/:id -> Profile
  @Get(':id')
  async getProfile(@Param('id') id: string, uFields: string[]): Promise<Profile> {
    return this.service.getProfile(Number(id), uFields);
  }
}
