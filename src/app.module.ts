import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import {GroupsModule} from "./groups/groups.module.js";
import {DevicesModule} from "./devices/devices.module.js";

@Module({
  imports: [DatabaseModule, GroupsModule, DevicesModule],
})
export class AppModule {}