import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Device } from './device.model.js';

@Injectable()
export class DevicesService {

    private readonly path:string = '/devices';

    constructor(
        private readonly databaseService: DatabaseService,
    ) {}

    async getDevices(): Promise<Device[]> {
        return this.databaseService.get<Device[]>(this.path);
    }

    async getDeviceById(id: number): Promise<Device> {
        const devices = await this.getDevices();

        const device = devices.find(
            (device) => device.id === id,
        );

        if (!device) {
            throw new NotFoundException(
                `Device with id ${id} not found`,
            );
        }

        return device;
    }
}