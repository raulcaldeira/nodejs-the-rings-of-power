// src/database/data-source.ts

import { DataSource } from 'typeorm'
import { Ring } from './entities/Ring'
import { Bearer } from './entities/Bearer'
import { RingBearer } from './entities/RingBearer'

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
