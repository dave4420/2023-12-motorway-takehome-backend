FROM postgres:14 as motorway-test-backend
WORKDIR /app
COPY ./scripts/init.sh /docker-entrypoint-initdb.d
COPY ./scripts/dump.sql ./scripts/motorway-test-backend/dump.sql


FROM node:20-alpine as build
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./tsconfig.json ./
COPY ./src ./src
RUN npm run build


FROM node:20-alpine as motorway-test-app-server
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./tsconfig.json ./
COPY --from=build /app/dist ./dist
CMD ["node", "dist/index.js"]
USER node
