// export type CreateRingInput = Omit<Ring, 'id' | 'createdAt'>

import { RingBearer } from '@/database/entities/RingBearer'

export type CreateRingBearerInput = Omit<RingBearer, 'id'>

export interface RingBearersRepository {
  createRingBearer(data: CreateRingBearerInput): Promise<RingBearer | null>
  findByRingAndBearer(ring: number, bearer: number): Promise<RingBearer | null>
  setEndDate(id: number, endDate: Date): Promise<void>
}
