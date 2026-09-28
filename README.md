# Device Groups API

A REST API built with **NestJS** and **TypeScript** for managing devices, groups, and files stored on devices.

The application uses **node-json-db** as a lightweight JSON file database.

## Features

* Get all groups
* Get a group by ID
* Get a group by name
* Add a device to a group using its ID or name
* Remove a device from a group using its ID or name
* Automatically create a group when adding a device to a non-existing group
* Prevent duplicate group names
* Automatically remove empty groups
* Get a unique list of files from devices belonging to selected groups

## Tech Stack

* **Node.js**
* **NestJS**
* **TypeScript**
* **node-json-db**
* **class-validator / class-transformer**

## Project Structure

```text
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
├── .gitignore
├── nest-cli.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Running the Application

### Development

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

### Production

Build the application:

```bash
npm run build
```

Then start it:

```bash
npm run start:prod
```

## Database

The application uses `node-json-db` to store data in a local JSON file.

The database is located at:

```text
data/db.json
```

Example:

```json
{
  "devices": [
    {
      "id": 1,
      "files": [
        "notavirus.exe",
        "deathstarblueprint.pdf"
      ]
    },
    {
      "id": 2,
      "files": [
        "deathstarblueprint.pdf",
        "peterdinklagenudes.zip"
      ]
    }
  ],
  "groups": []
}
```

The database file is intended to be local application data and should not be committed to the repository.

## API Endpoints

### Groups

#### Get all groups

```http
GET /groups
```

Example:

```text
GET http://localhost:3000/groups
```

#### Get group by ID

```http
GET /groups/:id
```

Example:

```text
GET http://localhost:3000/groups/1
```

#### Get group by name

```http
GET /groups/by-name/:name
```

Example:

```text
GET http://localhost:3000/groups/by-name/group1
```

### Add Device to Group

A device can be added to a group using either the group's ID or name.

#### Using group ID

```http
POST /groups/device/:deviceId?groupId=:groupId
```

Example:

```text
POST http://localhost:3000/groups/device/1?groupId=2
```

#### Using group name

```http
POST /groups/device/:deviceId?groupName=:groupName
```

Example:

```text
POST http://localhost:3000/groups/device/1?groupName=group2
```

If the specified group does not exist, a new group is created automatically.

If no group name is provided, the generated name follows the format:

```text
group-{id}
```

A device cannot be added to the same group more than once.

### Remove Device from Group

A device can also be removed using either the group's ID or name.

#### Using group ID

```http
DELETE /groups/device/:deviceId?groupId=:groupId
```

Example:

```text
DELETE http://localhost:3000/groups/device/1?groupId=2
```

#### Using group name

```text
DELETE http://localhost:3000/groups/device/:deviceId?groupName=:groupName
```

Example:

```text
DELETE http://localhost:3000/groups/device/1?groupName=group2
```

If removing a device leaves the group empty, the group is automatically deleted.

### Get Files from Groups

Returns a unique list of files belonging to devices assigned to the specified groups.

```http
GET /groups/files?groupIds=:groupIds
```

Multiple group IDs can be provided as a comma-separated list.

Example:

```text
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

Duplicate files are removed from the result.

## Group Rules

The following rules are applied when managing groups:

1. Group names must be unique.
2. A device cannot appear more than once in the same group.
3. A group is automatically created when adding a device to a non-existing group.
4. Empty groups are automatically removed.
5. New group IDs are generated based on the highest existing group ID.

For example, if the existing group IDs are:

```text
1, 2, 7
```

the next group will receive:

```text
8
```

## Error Handling

The API uses standard NestJS HTTP exceptions.

Examples:

* `400 Bad Request` — invalid request parameters
* `404 Not Found` — requested device or group does not exist
* `409 Conflict` — attempting to create a group with an existing name

Example:

```json
{
  "statusCode": 409,
  "message": "Group with name \"group1\" already exists",
  "error": "Conflict"
}
```

## Scripts

Common npm scripts:

```bash
npm run start
npm run start:dev
npm run start:debug
npm run build
npm run start:prod
npm run test
```

## License

This project is for educational/development purposes.
