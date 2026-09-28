import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Group } from './group.model.js';
import { DevicesService } from '../devices/devices.service.js';

@Injectable()
export class GroupsService {

    private readonly path:string = '/groups';

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly devicesService: DevicesService,
    ) {}

    async getGroups(): Promise<Group[]> {
        return this.databaseService.get<Group[]>(this.path);
    }

    async getGroupById(id: number): Promise<Group | undefined> {
        const groups = await this.getGroups();

        const group = groups.find((group) => group.id === id);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return groups.find((group) => group.id === id);
    }

    async getGroupByName(name: string): Promise<Group | undefined> {

        const groups = await this.getGroups();

        const group = groups.find((group) => group.name === name);

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return groups.find((group) => group.name === name);
    }

    async addDeviceToGroup(
        deviceId: number,
        groupId?: number,
        groupName?: string,
    ): Promise<Group> {
        await this.devicesService.getDeviceById(deviceId);

        const groups = await this.getGroups();

        let group: Group | undefined;

        if (groupId !== undefined) {
            group = groups.find(
                (group) => group.id === groupId,
            );
        } else if (groupName !== undefined) {
            group = groups.find(
                (group) => group.name === groupName,
            );
        }

        if (!group) {
            const newGroupId =
                groups.length > 0
                    ? Math.max(...groups.map((group) => group.id)) + 1
                    : 1;

            const name = groupName ?? `group-${newGroupId}`;

            if (groups.some((group) => group.name === name)) {
                throw new ConflictException(`Group ${name} already exists`,);
            }

            group = {
                id: newGroupId,
                name,
                devices: [],
            };

            groups.push(group);
        }

        if (!group.devices.includes(deviceId)) {
            group.devices.push(deviceId);
        } else{
            throw new ConflictException(`This group-device connection already exists`,);
        }

        await this.databaseService.set('/groups', groups);

        return group;
    }

    async removeDeviceFromGroup(
        deviceId: number,
        groupId?: number,
        groupName?: string,
    ): Promise<Group> {
        const groups = await this.getGroups();

        let group: Group | undefined;

        if (groupId !== undefined) {
            group = groups.find(
                (group) => group.id === groupId,
            );
        } else if (groupName !== undefined) {
            group = groups.find(
                (group) => group.name === groupName,
            );
        }

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        group.devices = group.devices.filter(
            (id) => id !== deviceId,
        );

        if (group.devices.length === 0) {
            const updatedGroups = groups.filter(
                (currentGroup) => currentGroup.id !== group!.id,
            );

            await this.databaseService.set(
                '/groups',
                updatedGroups,
            );

            return group;
        }

        await this.databaseService.set('/groups', groups);

        return group;
    }

    async getFilesFromGroups(
        groupIds: number[],
    ): Promise<string[]> {
        const groups = await this.getGroups();

        const deviceIds = new Set<number>();

        for (const groupId of groupIds) {
            const group = groups.find(
                (group) => group.id === groupId,
            );

            if (!group) {
                continue;
            }

            for (const deviceId of group.devices) {
                deviceIds.add(deviceId);
            }
        }

        const files = new Set<string>();

        for (const deviceId of deviceIds) {
            const device = await this.devicesService.getDeviceById(deviceId);
            if (!device) {
                continue;
            }

            for (const file of (device).files) {
                files.add(file);
            }
        }

        return [...files];
    }
}