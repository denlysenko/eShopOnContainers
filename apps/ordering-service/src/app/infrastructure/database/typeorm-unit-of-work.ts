import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UnitOfWork } from '../../domain';

@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(private readonly connection: Connection) {}

  async withTransaction(work: () => Promise<void>): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
