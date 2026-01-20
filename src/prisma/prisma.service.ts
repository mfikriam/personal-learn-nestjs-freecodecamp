import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor(config: ConfigService) {
    const url = config.get('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL is not defined');
    }

    // 1. Create the pool as a local constant first
    const pool = new Pool({ connectionString: url });

    // 2. Create the adapter
    const adapter = new PrismaPg(pool);

    // 3. Call super first (this is mandatory)
    super({ adapter });

    // 4. NOW you can use 'this' to store the pool for later cleanup
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async cleanDb() {
    // Note: Use $transaction for safety, and check if order matters (delete bookmarks first)
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
