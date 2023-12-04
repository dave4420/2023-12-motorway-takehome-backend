import express from "express";
import healthCheckEndpoint from "./health-check-endpoint";
import historicVehicleEndpoint from "./historic-vehicle-endpoint";
import { buildDependencies } from "./dependencies";

const deps = buildDependencies();
const { log } = deps;

log.info("Starting server...");

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

app.get("/health-check", healthCheckEndpoint(deps));
app.get("/historic-vehicle", historicVehicleEndpoint(deps));

const server = app.listen(port, () => {
  log.info(`Server is running at http://localhost:${port}`);
});

["SIGTERM", "SIGINT"].forEach((signal) => {
  process.on(signal, () => {
    log.info(`${signal} received: closing server`);
    server.close(() => {
      log.info("server closed");
    });
  });
});
