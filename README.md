# Device Groups API

A REST API built with **NestJS** and **TypeScript** for managing devices, groups, and the files stored on devices. It is a mock of a device/group management service exposed over HTTP, using **node-json-db** as a lightweight JSON file database.

This project was created as a recruitment task. The section below describes how each requirement from the assignment has been fulfilled.

## Assignment Requirements & How They Are Met

### Technology

| Requirement | Status | Implementation |
| --- | --- | --- |
| Node.js with any npm packages | Done | Node.js + NestJS, `class-validator`, `class-transformer` |
| TypeScript with `strict` enabled | Done | Whole codebase is written in TypeScript with strict mode (see `tsconfig.json`) |
| Mock database: `node-json-db` | Done | Wrapped in a dedicated `DatabaseModule` / `DatabaseService`, data stored in `data/db.json` |

### Behaviour

| Requirement | Status | Implementation |
| --- | --- | --- |
| Database initially contains 3 devices | Done | `data/db.json` is seeded with the 3 devices from the assignment and an empty `groups` list |
| Add a device to a group by **name or ID** and return the group object | Done | `POST /groups/device/:deviceId?groupId=` or `?groupName=` |
| Create the group if it does not exist; group names must be unique | Done | Missing groups are created automatically; duplicate names are rejected with `409 Conflict` |
| Remove a device from a group by **name or ID** and return the group object | Done | `DELETE /groups/device/:deviceId?groupId=` or `?groupName=` |
| Delete the group when it has no more devices | Done | Empty groups are removed automatically after a device is removed |
| Get the list of files from devices belonging to given groups, without duplicates | Done | `GET /groups/files?groupIds=1,2,3` returns a unique list of files |
| Endpoints exchange `application/json` and operate on the database | Done | All endpoints read from / write to the JSON database and respond with JSON |

### Models

```ts
Device { id: number; files: string[] }
Group  { id: number; name: string; devices: number[] } // devices = list of device IDs
```

### Beyond the Requirements

In addition to the three required operations, the API also provides read endpoints for convenience:

- `GET /groups` – list all groups
- `GET /groups/:id` – get a group by ID
- `GET /groups/by-name/:name` – get a group by name

Other extras: request validation, standard HTTP error responses (400 / 404 / 409) Linting and formatting are handled by **oxlint** and **Prettier**.

## Tech Stack

- **Node.js**
- **NestJS**
- **TypeScript** (strict mode)
- **node-json-db**
- **class-validator / class-transformer**

## Project Structure

```
.
├── data/
│   └── db.json
├── src/
│   ├── database/
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── devices/
│   │   ├── devices.controller.ts
│   │   ├── devices.module.ts
│   │   ├── devices.service.ts
│   │   └── device.model.ts
│   ├── groups/
│   │   ├── groups.controller.ts
│   │   ├── groups.module.ts
│   │   ├── groups.service.ts
│   │   └── group.model.ts
│   └── app.module.ts
├── test/
├── .gitignore
├── nest-cli.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Production

```bash
npm run build
npm run start:prod
```

### Tests

```bash
npm run test
```

### Available Scripts

```bash
npm run start
npm run start:dev
npm run start:debug
npm run build
npm run start:prod
npm run test
```

## Database

Data is stored in a local JSON file via `node-json-db`:

```
data/db.json
```

Initial (seed) contents:

```json
{
  "devices": [
    { "id": 1, "files": ["notavirus.exe", "deathstarblueprint.pdf"] },
    { "id": 2, "files": ["deathstarblueprint.pdf", "peterdinklagenudes.zip"] },
    { "id": 3, "files": ["peterdinklagenudes.zip", "keyboardcat.mp4"] }
  ],
  "groups": []
}
```

## API Reference

### Groups

#### Get all groups

```
GET /groups
```

#### Get group by ID

```
GET /groups/:id
```

Example: `GET http://localhost:3000/groups/1`

#### Get group by name

```
GET /groups/by-name/:name
```

Example: `GET http://localhost:3000/groups/by-name/group1`

### Add a Device to a Group

A device can be added using either the group's ID or its name. The updated group object is returned.

```
POST /groups/device/:deviceId?groupId=:groupId
POST /groups/device/:deviceId?groupName=:groupName
```

Examples:

```
POST http://localhost:3000/groups/device/1?groupId=2
POST http://localhost:3000/groups/device/1?groupName=group2
```

- If the group does not exist, it is created automatically.
- If no group name is provided for a new group, the generated name follows the format `group-{id}`.
- A device cannot be added to the same group more than once.

### Remove a Device from a Group

A device can be removed using either the group's ID or its name.

```
DELETE /groups/device/:deviceId?groupId=:groupId
DELETE /groups/device/:deviceId?groupName=:groupName
```

Examples:

```
DELETE http://localhost:3000/groups/device/1?groupId=2
DELETE http://localhost:3000/groups/device/1?groupName=group2
```

If removing the device leaves the group empty, the group is automatically deleted.

### Get Files from Groups

Returns a unique list of files belonging to devices assigned to the specified groups.

```
GET /groups/files?groupIds=:groupIds
```

Multiple group IDs can be passed as a comma-separated list.

Example:

```
GET http://localhost:3000/groups/files?groupIds=1,2,3
```

Example response:

```json
[
  "notavirus.exe",
  "deathstarblueprint.pdf",
  "peterdinklagenudes.zip",
  "keyboardcat.mp4"
]
```

## Group Rules

1. Group names must be unique.
2. A device cannot appear more than once in the same group.
3. A group is automatically created when a device is added to a non-existing group.
4. Empty groups are automatically removed.
5. New group IDs are generated based on the highest existing group ID.

For example, if the existing group IDs are `1, 2, 7`, the next group receives ID `8`.

## Error Handling

The API uses standard NestJS HTTP exceptions:

- `400 Bad Request` – invalid request parameters
- `404 Not Found` – requested device or group does not exist
- `409 Conflict` – attempting to create a group with an existing name

Example:

```json
{
  "statusCode": 409,
  "message": "Group with name \"group1\" already exists",
  "error": "Conflict"
}
```

## License

This project was created for educational and recruitment purposes.