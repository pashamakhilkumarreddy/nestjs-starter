import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/entities/roles.entity';
import { MasterRole } from 'src/entities';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [SequelizeModule.forFeature([Role, MasterRole])],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}
