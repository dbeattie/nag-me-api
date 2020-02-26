# Nag-Me.com

## Setup

Install dependencies with `npm install`.

## Run The Server

```sh
npm start
```

## Creating The DB

Use the `psql -U development` command to login to the PostgreSQL server with the username `development` and the password `development`. This command **MUST** be run in a vagrant terminal, we are using the PostgreSQL installation provided in the vagrant environment.

Create a database with the command `CREATE DATABASE nag_me_development;`.

Copy the `.env.example` file to `.env.development` and fill in the necessary PostgreSQL configuration. The `node-postgres` library uses these environment variables by default.

```
PGHOST=localhost
PGUSER=development
PGDATABASE=nag_me_development
PGPASSWORD=development
PGPORT=5432
```

## Seeding

Run a the development server with `npm start` in the Host environment. We are only using vagrant for `psql` this week.

Both of these achieve the same result.

- Make a `GET` request to `/api/debug/reset` with `curl http://localhost:8001/api/debug/reset`.
- Use the browser to navigate to `http://localhost:8001/api/debug/reset`.

## Api

### Users

`GET /api/users`

Response

```json
// [
//   {
//     "id": 1,
//     "user_name": "Don S",
//     "email": "don@example.com",
//     "phone_number": "+1416******"
//   },
//   {
//     "id": 2,
//     "user_name": "Darren B",
//     "email": "darren@example.com",
//     "phone_number": "+177*******"
//   },
//   {
//     "id": 3,
//     "user_name": "Kevin Z",
//     "email": "kevin@example.com",
//     "phone_number": "+1416******"
//   },
//   {
//     "id": 4,
//     "user_name": "dave jones",
//     "email": "dave@example.com",
//     "phone_number": "+1416******"
//   }
// ]
```

### Goals

`GET /api/goals`

Response:

```json
// { 
//   {
//   - 29: {
//         id: 29,
//         goal_name: "Read a novel",
//         user_id: 1,
//         start_date: "2020-02-26T05:00:00.000Z",
//         simple_start_date: "February 26th, 2020",
//         end_date: "2020-02-29T05:00:00.000Z",
//         simple_end_date: "February 29th, 2020",
//         cron: "everyday at 1000",
//         friend_1_phone_number: "+1416******",
//         friend_2_phone_number: "+1416******"
//          }
//   }
// }
```
