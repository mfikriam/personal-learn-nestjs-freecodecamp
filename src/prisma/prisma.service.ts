import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    // const url = process.env.DATABASE_URL;
    const url = config.get('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL is not defined');
    }

    // 1. Create the pg Pool
    const pool = new Pool({ connectionString: url });

    // 2. Initialize the adapter with the pool
    const adapter = new PrismaPg(pool);

    // 3. Pass the adapter to the super constructor
    super({ adapter });
  }

  async onModuleInit() {
    // Explicitly connect when the module initializes
    await this.$connect();
  }
}
