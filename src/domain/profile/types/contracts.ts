/**
 * Порт репозитория профиля (принадлежит домену).
 * Инфраструктурный слой реализует этот абстрактный класс через Prisma.
 * Это контракт, он ничего не делает сам — только declares метод, который должен быть реализован.
 */

import { Profile } from './entities';
import { SQLMetadata } from './interfaces';



export abstract class ProfileRepository {
  abstract findById(id: number, uFields: string[]): Promise<Profile | null>;
  metaSql: SQLMetadata
}
