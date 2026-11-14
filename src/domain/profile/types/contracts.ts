/*
 * Инфраструктурный слой реализует этот абстрактный класс через Prisma.
 */

import { Profile } from './entities';

export abstract class ProfileRepository {
  abstract findById(id: number, uFields: string[]): Promise<Profile | null>;
}
