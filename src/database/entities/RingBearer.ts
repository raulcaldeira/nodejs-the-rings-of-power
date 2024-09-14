import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Ring } from './Ring' // Ajuste o caminho conforme necessário
import { Bearer } from './Bearer' // Ajuste o caminho conforme necessário

@Entity({ name: 'ring_bearers' })
export class RingBearer {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Ring, { eager: true, nullable: false })
  ring: Ring

  @ManyToOne(() => Bearer, { eager: true, nullable: false })
  bearer: Bearer

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date

  @Column({ type: 'timestamp', name: 'end_date', nullable: true })
  endDate?: Date
}
