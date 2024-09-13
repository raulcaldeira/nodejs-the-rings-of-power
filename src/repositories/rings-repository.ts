import { Forgers, Ring } from '@/database/entities/Ring'

export type CreateRingInput = Omit<Ring, 'id' | 'createdAt'>

export interface RingsRepository {
  createRing(data: CreateRingInput): Promise<Ring | null>
  countRingsForgedBy(forger: Forgers): Promise<number>
}
