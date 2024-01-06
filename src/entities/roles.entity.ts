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
import { RoleTypes, TABLE_CONFIG } from '../common/constants';

@Table({
  modelName: 'roles',
  ...TABLE_CONFIG
})
export class Role extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(RoleTypes)),
    allowNull: false
  })
  name: RoleTypes;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  createdBy: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  modifiedBy: string;

  @BelongsTo(() => User, {
    foreignKey: 'userId'
  })
  user: User;
}
