import pino, { Logger, LoggerOptions } from "pino";

export interface Dependencies {
  readonly log: Logger<LoggerOptions>;
}

export const buildDependencies = (): Dependencies => {
  return {
    log: pino(),
  };
};
