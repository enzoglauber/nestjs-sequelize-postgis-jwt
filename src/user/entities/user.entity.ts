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

  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken: string

  @Column({ type: DataType.STRING, allowNull: false })
  password: string

  @Column({
    type: DataType.ARRAY(DataType.ENUM('ADMIN', 'USER', 'MANAGER')),
    allowNull: false,
    defaultValue: ['USER']
  })
  roles: string[]

  @HasMany(() => Address)
  addresses: Address[]
}
