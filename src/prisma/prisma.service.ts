import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({ url: process.env.DATABASE_URL });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({ adapter });
  }
}
