
import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query
} from '@nestjs/common';

import { GroupsService } from './groups.service.js';

@Controller('groups')
export class GroupsController {
    constructor(
        private readonly groupsService: GroupsService,
    ) {}

    @Get()
    async getGroups() {
        return this.groupsService.getGroups();
    }

    @Get('files')
    async getFilesFromGroups(
        @Query('groupIds') groupIds: string,
    ) {
        const ids = groupIds
            .split(',')
            .map((id) => Number(id));

        return this.groupsService.getFilesFromGroups(ids);
    }

    @Get(':id')
    async getGroupById(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.groupsService.getGroupById(id);
    }

    @Get('by-name/:name')
    async getGroupByName(
        @Param('name') name: string,
    ) {
        return this.groupsService.getGroupByName(name);
    }

    @Post('device/:deviceId')
    async addDeviceToGroup(
        @Param('deviceId', ParseIntPipe) deviceId: number,
        @Query('groupId') groupId?: string,
        @Query('groupName') groupName?: string,
    ) {
        return this.groupsService.addDeviceToGroup(
            deviceId,
            groupId !== undefined ? Number(groupId) : undefined,
            groupName,
        );
    }

    @Delete('device/:deviceId')
    async removeDeviceFromGroup(
        @Param('deviceId', ParseIntPipe) deviceId: number,
        @Query('groupId') groupId?: string,
        @Query('groupName') groupName?: string,
    ) {
        return this.groupsService.removeDeviceFromGroup(
            deviceId,
            groupId !== undefined ? Number(groupId) : undefined,
            groupName,
        );
    }
}
