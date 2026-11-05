/**
 * Порт репозитория профиля (принадлежит домену).
 * Инфраструктурный слой реализует этот абстрактный класс через Prisma.
 * Это контракт, он ничего не делает сам — только declares метод, который должен быть реализован.
 */
import { Profile } from './entities';

export abstract class ProfileRepository {
  abstract findById(id: number): Promise<Profile | null>;
}
