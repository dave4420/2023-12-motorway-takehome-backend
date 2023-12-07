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
    const { rows } = await this.pool.query({
      text: `
            WITH
                params (vehicle_id, when_in_history) AS (
                    VALUES (
                        $1::integer,
                        TO_TIMESTAMP($2)
                    )
                ),
                events (vehicle_id, state) AS (
                    SELECT "vehicleId", state
                    FROM "stateLogs", params
                    WHERE timestamp <= params.when_in_history
                    ORDER BY timestamp DESC
                )
            SELECT v.make, v.model, e.state
            FROM vehicles v LEFT JOIN events e ON v.id = e.vehicle_id, params
            WHERE v.id = params.vehicle_id
            LIMIT 1
        `,
      values: [params.vehicleId, params.when.toEpochMilli() / 1000],
    });
    if (rows.length === 0) {
      return null;
    }
    const row = rows[0];
    return {
      vehicleId: params.vehicleId,
      make: row.make,
      model: row.model,
      state: row.state,
    };
  }
}

export const connectToPostgres = (): Database => new Postgres();
