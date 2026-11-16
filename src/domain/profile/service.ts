/**
 * Оркестратор/сервис профиля.
 * Содержит бизнес-логику: получение профиля - через делегирование 
 * инфраструтурному слою через инверсию зависимостей.
 * Зависит только от порта ProfileRepository.
 */

import { Injectable, NotFoundException } from '@nestjs/common';

import { ProfileRepository } from '@/domain/profile/types/contracts';
import { Profile } from '@/domain/profile/types/entities';


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
