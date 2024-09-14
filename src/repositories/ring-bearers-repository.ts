// export type CreateRingInput = Omit<Ring, 'id' | 'createdAt'>

import { RingBearer } from '@/database/entities/RingBearer'

export type CreateRingBearerInput = Omit<RingBearer, 'id'>

export type UpdateRingBearerInput = Omit<RingBearer, 'id' | 'ring'>

export interface RingBearersRepository {
  createRingBearer(data: CreateRingBearerInput): Promise<RingBearer | null>
  findByRingAndBearer(ring: number, bearer: number): Promise<RingBearer | null>
  findByRing(ring: number): Promise<RingBearer | null>
  setEndDate(ringBearerId: number, endDate: Date): Promise<void>
  updateRingBearer(
    ringBearerId: number,
    data: UpdateRingBearerInput,
  ): Promise<void>
  deleteRingBearer(ringBearerId: number): Promise<void>
}
