import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum Forgers {
  ELF = 'elfos',
  DWARF = 'anões',
  HUMAN = 'homens',
  SAURON = 'sauron',
}

@Entity({ name: 'rings' })
export class Ring {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 100 })
  power: string

  @Column({
    type: 'enum',
    enum: Forgers,
    name: 'forged_by',
  })
  forgedBy: Forgers

  @Column({ type: 'varchar', length: 255, name: 'image_url' })
  imageUrl: string
}
