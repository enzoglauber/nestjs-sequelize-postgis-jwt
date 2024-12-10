import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Fn } from 'sequelize/types/utils'
import { User } from 'src/user/entities/user.entity'
@Table({ timestamps: true })
export class Address extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  name: string

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number

  @BelongsTo(() => User)
  user: User

  @Column({ type: DataType.GEOMETRY('POINT', 4326), allowNull: true })
  location?: string | Fn
}

// const Address = sequelize.define('Address', {
//   location: {
//     type: DataTypes.GEOMETRY('POINT'),
//     get() {
//       const rawLocation = this.getDataValue('location')
//       return rawLocation?.coordinates
//     }
//   }
// })
