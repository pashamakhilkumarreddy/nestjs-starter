import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, UserProfile, Role } from 'src/entities';
import { HelperService, DBService, KeyCloakService } from 'src/common/services';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, UserProfile, Role])],
  controllers: [UsersController],
  providers: [UsersService, HelperService, DBService, KeyCloakService],
  exports: [UsersService]
})
export class UsersModule {}
