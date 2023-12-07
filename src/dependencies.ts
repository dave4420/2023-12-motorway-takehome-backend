import pino, { Logger, LoggerOptions } from "pino";
import { Database, connectToPostgres } from "./postgres";

export interface Dependencies {
  readonly log: Logger<LoggerOptions>;
  readonly db: Database;
}

export const buildDependencies = (): Dependencies => {
  return {
    log: pino(),
    db: connectToPostgres(),
  };
};

export const shutdownDependencies = async (deps: Dependencies) => {
  await deps.db.shutdown();
};
