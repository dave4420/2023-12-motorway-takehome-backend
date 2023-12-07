Install requirements:

- docker (https://docs.docker.com/get-docker/)

To initialize this project, run `docker compose up` from the root of this project. This will build and seed the database. By default the database runs on port `5432` and is also exposed on `5432`, if you want to change this you can update `docker-compose.yml`.

---

This project defines a `motorway-test-app-server` docker container that implements the API.

If we were deploying to production, we’d expect it to be running behind a reverse proxy that terminates TLS and caches responses respecting the `Cache-Control` header.

You should set these environment variables in the container:

- `PGPASSWORD`
- `PGUSER`
- `PGDATABASE`
- `PGHOST`
- `PGPORT` (optional)

Logs are written to stdout in jsonlines format.

To run locally via docker-compose:

- run `docker-compose up` in one shell window
- access localhost:3000 from another shell window or Postman or whatever
- run `docker-compose down` when you’re done

# Developing locally

You should have `nvm` installed and configured to respect `./.nvmrc`.

`npm run test:watch` spins up the database container, then runs tests whenever you save a file (by default, only running tests/code that has changed since the last commit). When you exit, it terminates the database container.

`npm run dev` spins up the database container, then runs the app server. It will restart the server whenever you update the code. When you `^C` out, it terminates the database container.

# Endpoints

- `/health-check` — returns a 200 if the server is accepting connections. TODO in a tech debt ticket: return a 500 if we can’t access the database
- `/historic-vehicle/:vehicleId/:when` - the API endpoint you asked for
