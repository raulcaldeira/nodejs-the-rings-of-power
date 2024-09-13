import { Forgers, Ring } from '@/database/entities/Ring'

export type CreateRingInput = Omit<Ring, 'id' | 'createdAt'>

export interface RingsRepository {
  createRing(data: CreateRingInput): Promise<Ring | null>
  getAllRings(): Promise<Ring[]>
  findRingById(id: number): Promise<Ring | null>
  countRingsForgedBy(forger: Forgers): Promise<number>
  updateRing(id: number, data: Partial<CreateRingInput>): Promise<Ring | null>
}
