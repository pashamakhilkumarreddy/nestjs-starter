import {
  AllowNull,
  DataType,
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { User } from './users.entity';
import { TABLE_CONFIG } from '../common/constants';

@Table({
  modelName: 'address',
  ...TABLE_CONFIG
})
export class Address extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  addressLine1: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  addressLine2: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  state: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  zipCode: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  country: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  createdBy: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  modifiedBy: string;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  })
  user: User;
}
