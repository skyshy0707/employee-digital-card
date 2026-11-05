import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/data-access/prisma/prisma.service';
import { PrismaProfileRepository } from '@/infrastructure/data-access/prisma/repository.impl';
import { ProfileRepository } from '@/domain/profile/types/contracts';

/**
 * Инфраструктурный модуль доступа к данным.
 * Глобальный:提供т PrismaService и реализацию ProfileRepository всем остальным модулям.
 */
@Global()
@Module({
  providers: [PrismaService, { provide: ProfileRepository, useClass: PrismaProfileRepository }],
  exports: [PrismaService, ProfileRepository],
})
export class DataAccessModule {}
