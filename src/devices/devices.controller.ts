import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query
} from '@nestjs/common';
import {DevicesService} from "./devices.service.js";
import {DevicesModule} from "./devices.module.js";

@Controller('devices')
export class DevicesController {
    constructor(
        private readonly devicesService: DevicesService
    ) {}

    @Get()
    async GetDevices(): Promise<DevicesModule> {
        return this.devicesService.getDevices();
    }

    @Get(":id")
    async GetDevice(@Param('id', ParseIntPipe) id: number): Promise<DevicesModule> {
        return this.devicesService.getDeviceById(id);
    }
}
