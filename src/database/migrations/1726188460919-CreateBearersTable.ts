import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBearersTable1726188460919 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "bearers" (
                "id" SERIAL NOT NULL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "species" VARCHAR(20) NOT NULL
            )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bearer"`)
  }
}
