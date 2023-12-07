import { Pool } from "pg";
import { Instant } from "@js-joda/core";

export interface Database {
  shutdown(): Promise<void>;

  getHistoricVehicle(params: {
    readonly vehicleId: number;
    readonly when: Instant;
  }): Promise<null | {
    readonly vehicleId: number;
    readonly make: string;
    readonly model: string;
    readonly state: string | null;
  }>;
}

class Postgres implements Database {
  private readonly pool: Pool = new Pool({});

  async shutdown(): Promise<void> {
    await this.pool.end();
  }

  async getHistoricVehicle(params: {
    readonly vehicleId: number;
    readonly when: Instant;
  }): Promise<null | {
    readonly vehicleId: number;
    readonly make: string;
    readonly model: string;
    readonly state: string | null;
  }> {
    return null;
  }
}

export const connectToPostgres = (): Database => new Postgres();
