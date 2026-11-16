/**
 * Обёртка над PrismaClient.
 * Реализует OnModuleInit, чтобы подключение к СУБД устанавливалось при старте модуля.
 */

import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
