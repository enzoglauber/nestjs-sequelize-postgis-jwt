import { Exclude } from 'class-transformer'
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import { Address } from 'src/address/entities/address.entity'

@Table({
  tableName: 'user',
  timestamps: true
})
export class User extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string

  @Exclude()
  @Column({ type: DataType.STRING, allowNull: false })
  password: string

  @HasMany(() => Address)
  addresses: Address[]
}
