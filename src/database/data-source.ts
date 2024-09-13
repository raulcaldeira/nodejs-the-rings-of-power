// src/database/data-source.ts

import { Bearer } from '@/models/Bearer'
import { Ring } from '@/models/Ring'
import { RingBearer } from '@/models/RingBearer'
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
