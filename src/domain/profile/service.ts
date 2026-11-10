import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@/domain/profile/types/entities';
import { ProfileRepository } from '@/domain/profile/types/contracts';

/**
 * Оркестратор/сервис профиля.
 * Содержит бизнес-логику: получение профиля, вычисление полей (например, Link.provider),
 * преобразование записей БД в доменные сущности.
 * Зависит только от порта ProfileRepository, реализация подключается из инфраструктуры.
 */
@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfile(id: number, uFields: string[]): Promise<Profile> {
    const profile = await this.repository.findById(id, uFields);
    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return profile;
  }
}
