import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'rings' })
export class Ring {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  power: string

  @Column({ type: 'varchar', length: 100, name: 'forged_by' })
  forgedBy: string

  @Column({ type: 'varchar', length: 255, name: 'image_url' })
  imageUrl: string
}
