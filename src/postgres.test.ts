import { Database, connectToPostgres } from "./postgres";
import { Instant } from "@js-joda/core";

let db: Database;

beforeAll(() => {
  db = connectToPostgres();
});

afterAll(async () => {
  await db.shutdown();
});

describe("getHistoricVehicle()", () => {
  it("returns null when the vehicle does not exist", async () => {
    // given
    const vehicleId = 123;
    const when = Instant.now();

    // when
    const promise = db.getHistoricVehicle({ vehicleId, when });

    // then
    await expect(promise).resolves.toBeNull();
  });
});
