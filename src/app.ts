import { Logger, LoggerOptions } from "pino";
import { buildDependencies, shutdownDependencies } from "./dependencies";
import express from "express";
import healthCheckEndpoint from "./health-check-endpoint";
import historicVehicleEndpoint from "./historic-vehicle-endpoint";

export interface App {
  shutdown(): void;
}

export const startApp = (log: Logger<LoggerOptions>): App => {
  const deps = buildDependencies(log);

  log.info("Starting server...");

  const routes = express();
  const port = parseInt(process.env.PORT ?? "3000", 10);

  routes.get("/health-check", healthCheckEndpoint(deps));
  routes.get(
    "/historic-vehicle/:vehicleId/:when",
    historicVehicleEndpoint(deps),
  );

  const server = routes.listen(port, () => {
    log.info(`Server is running at http://localhost:${port}`);
  });

  return {
    shutdown: () => {
      server.close(async () => {
        log.info("server closed");
        await shutdownDependencies(deps);
      });
    },
  };
};
