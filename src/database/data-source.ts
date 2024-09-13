// src/database/data-source.ts

import { Bearer } from '@/entities/Bearer'
import { Ring } from '@/entities/Ring'
import { RingBearer } from '@/entities/RingBearer'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'docker',
  password: 'docker',
  database: 'api-rings-of-power',
  synchronize: true,
  logging: true,
  entities: [Ring, Bearer, RingBearer],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
})
