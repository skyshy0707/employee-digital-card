/**
 * Инфраструктурный модуль доступа к данным.
 * Настраивает область видимости зависимостей.
 */

import { Module, Global } from '@nestjs/common';

import { ProfileRepository } from '@/domain/profile/types/contracts';
import { PrismaService } from '@/infrastructure/data-access/prisma/prisma.service';
import { PrismaProfileRepository } from '@/infrastructure/data-access/prisma/repository.impl';


@Global()
@Module({
  providers: [
    PrismaService, { 
      provide: ProfileRepository, 
      useClass: PrismaProfileRepository 
    }
  ],
  exports: [PrismaService, ProfileRepository],
})
export class DataAccessModule {}
