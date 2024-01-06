import {
  AllowNull,
  DataType,
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Unique
} from 'sequelize-typescript';
import { User } from './users.entity';
import { TABLE_CONFIG } from '../common/constants';

@Table({
  modelName: 'user_profiles',
  ...TABLE_CONFIG
})
export class UserProfile extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @AllowNull(true)
  @Column({
    type: DataType.BLOB('long'),
    allowNull: true,
    set(this: UserProfile, val: string | Buffer) {
      if (typeof val === 'string') {
        this.setDataValue(
          'image',
          val
            ? Buffer.from(
                val.replace(/^data:image\/[a-z]+;base64,/, ''),
                'base64'
              )
            : val
        );
      } else {
        this.setDataValue('image', val);
      }
    },
    get(this: UserProfile): string | Buffer {
      const image = this.getDataValue('image');
      return image instanceof Buffer ? image.toString('base64') : image;
    }
  })
  image!: Buffer;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  firstName: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  lastName: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  countryCode: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phone: string;

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
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  })
  user: User;
}
