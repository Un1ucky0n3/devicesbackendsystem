import { Injectable } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';

@Injectable()
export class DatabaseService {
    private readonly db: JsonDB;

    constructor() {
        this.db = new JsonDB(
            new Config('./data/db', true, false, '/'),
        );
    }

    async get<T>(path: string): Promise<T> {
        return this.db.getData(path);
    }

    async set<T>(path: string, data: T): Promise<void> {
        await this.db.push(path, data);
    }
}