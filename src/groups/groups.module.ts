import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller.js';
import { GroupsService } from './groups.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { DevicesModule } from '../devices/devices.module.js';

@Module({
  imports: [DatabaseModule, DevicesModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}