import { Bearer } from '@/database/entities/Bearer'

export type CreateBearerInput = Omit<Bearer, 'id'>

export interface BearersRepository {
  createBearer(data: CreateBearerInput): Promise<Bearer | null>
}
