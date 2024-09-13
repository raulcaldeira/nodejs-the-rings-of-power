import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

enum Species {
  ELF = 'elfo',
  DWARF = 'anão',
  HUMAN = 'homem',
}

@Entity({ name: 'bearers' })
export class Bearer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({
    type: 'enum',
    enum: Species,
    default: Species.HUMAN,
  })
  species: Species
}
