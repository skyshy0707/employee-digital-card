import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from '@/domain/profile/service';
import { Profile } from '@/domain/profile/types/entities';

/**
 * REST-маршрутизатор профиля.
 * Жизненный цикл: создаётся контейнером DI NestJS при загрузке модуля,
 * в котором объявлен (см. ApiModule). Не создаётся вручную.
 *
 * Контракт: GET profile/:id -> Profile
 */
@Controller('profile')
export class Router {
  constructor(private readonly service: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string, uFields: string[]): Promise<Profile> {
    return this.service.getProfile(Number(id), uFields);
  }
}
