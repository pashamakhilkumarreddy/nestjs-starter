import { Module } from '@nestjs/common';
import { KeyCloakService } from 'src/common/services';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/entities';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, KeyCloakService]
})
export class AuthModule {}
