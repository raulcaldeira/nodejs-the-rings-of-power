import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateRingTable1726188289090 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "ring" (
                "id" SERIAL NOT NULL PRIMARY KEY,
                "name" VARCHAR(100) NOT NULL,
                "power" VARCHAR(100) NOT NULL,
                "bearer" VARCHAR(100) NOT NULL,
                "forged_by" VARCHAR(100) NOT NULL,
                "image_url" VARCHAR(255) NOT NULL
            )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ring"`)
  }
}
