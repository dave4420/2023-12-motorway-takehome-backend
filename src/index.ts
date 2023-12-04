import express from "express";
import pino from "pino";
import healthCheckEndpoint from "./health-check-endpoint";
import historicVehicleEndpoint from "./historic-vehicle-endpoint";

const log = pino();

log.info("Starting server...");

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

app.get("/health-check", healthCheckEndpoint);
app.get("/historic-vehicle", historicVehicleEndpoint);

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
