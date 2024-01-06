import {
  AllowNull,
  DataType,
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  Unique
} from 'sequelize-typescript';
import { User } from './users.entity';
import { RoleTypes, TABLE_CONFIG } from '../common/constants';

@Table({
  modelName: 'master_roles',
  ...TABLE_CONFIG
})
export class MasterRole extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @AllowNull(false)
  @Unique
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
  createdBy!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  modifiedBy!: string;
}
