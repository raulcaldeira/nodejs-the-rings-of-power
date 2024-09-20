import { Bearer } from '@/database/entities/Bearer'
import { RingBearer } from '@/database/entities/RingBearer'

export type CreateRingBearerInput = Omit<RingBearer, 'id'>

export interface UpdateRingBearerInput {
  bearer?: Bearer
  startDate?: Date
  endDate?: Date
}

export interface RingBearersRepository {
  createRingBearer(data: CreateRingBearerInput): Promise<RingBearer | null>
  listAllRingBearers(): Promise<RingBearer[] | null>
  findByRing(ring: number): Promise<RingBearer | null>
  findByBearer(bearer: number): Promise<RingBearer[] | null>
  findByRingAndBearer(ring: number, bearer: number): Promise<RingBearer | null>
  findActiveRingBearersByStartDate(
    ringId: number,
    startDate: Date,
  ): Promise<RingBearer[]>
  setEndDate(ringBearerId: number, endDate: Date): Promise<void>
  updateRingBearer(
    ringBearerId: number,
    data: UpdateRingBearerInput,
  ): Promise<void>
  deleteRingBearer(ringBearerId: number): Promise<void>
  deleteAllByRingId(ringId: number): Promise<void>
}
