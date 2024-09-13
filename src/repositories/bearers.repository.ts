import { Bearer } from '@/database/entities/Bearer'

export type CreateBearerInput = Omit<Bearer, 'id'>

export interface BearersRepository {
  createBearer(data: CreateBearerInput): Promise<Bearer | null>
  findBearerById(id: number): Promise<Bearer | null>
  updateBearer(
    id: number,
    data: Partial<CreateBearerInput>,
  ): Promise<Bearer | null>
  deleteBearer(id: number): Promise<void>
}
