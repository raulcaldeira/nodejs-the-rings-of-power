import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateRingBearersTable1726188493372 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "ring_bearer" (
                "id" SERIAL NOT NULL PRIMARY KEY,
                "ring_id" INT NOT NULL,
                "bearer_id" INT NOT NULL,
                "start_date" TIMESTAMP NOT NULL,
                "end_date" TIMESTAMP,
                FOREIGN KEY ("ring_id") REFERENCES "ring"("id") ON DELETE CASCADE,
                FOREIGN KEY ("bearer_id") REFERENCES "bearer"("id") ON DELETE CASCADE
            )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ring_bearer"`)
  }
}
