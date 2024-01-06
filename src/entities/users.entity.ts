import {
  AllowNull,
  DataType,
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasOne,
  Unique
} from 'sequelize-typescript';
import { UserProfile } from './user-profiles.entity';
import { Role } from './roles.entity';
import { Address } from './address.entity';
import { AuthTypes, UserStatus, TABLE_CONFIG } from '../common/constants';

@Table({
  modelName: 'users',
  ...TABLE_CONFIG
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @Unique
  @AllowNull(false)
  @Column({
    allowNull: false
  })
  keycloakId: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    allowNull: false,
    defaultValue: UserStatus.ACTIVE
  })
  status: UserStatus;

  @Column({
    type: DataType.ENUM(...Object.values(AuthTypes)),
    allowNull: false,
    defaultValue: AuthTypes.LOCAL
  })
  auth_type: AuthTypes;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  emailVerified!: boolean;

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

  @HasOne(() => Role, 'userId')
  role: Role;

  @HasOne(() => UserProfile, 'userId')
  profile: UserProfile;

  @HasOne(() => Address, 'userId')
  address: Address;

  @BelongsTo(() => User, 'createdBy')
  creator: User;

  @BelongsTo(() => User, 'modifiedBy')
  updater: User;
}
