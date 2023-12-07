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

  it("returns the state the vehicle was in at the given time", async () => {
    // given
    const vehicleId = 3;
    const when = Instant.parse("2022-09-12T09:00:00Z");

    const expectedState = "selling";

    // when
    const promise = db.getHistoricVehicle({ vehicleId, when });

    // then
    await expect(promise).resolves.toEqual(
      expect.objectContaining({
        state: expectedState,
      }),
    );
  });

  it("returns the make, model and id of the vehicle", async () => {
    // given
    const vehicleId = 3;
    const when = Instant.parse("2022-09-12T09:00:00Z");

    const expectedMake = "VW";
    const expectedModel = "GOLF";

    // when
    const promise = db.getHistoricVehicle({ vehicleId, when });

    // then
    await expect(promise).resolves.toEqual(
      expect.objectContaining({
        vehicleId,
        make: expectedMake,
        model: expectedModel,
      }),
    );
  });

  it("returns a null state if we query for a time before the vehicle’s first event", async () => {
    // given
    const vehicleId = 3;
    const when = Instant.parse("2022-09-01T09:00:00Z");

    const expectedState = null;

    // when
    const promise = db.getHistoricVehicle({ vehicleId, when });

    // then
    await expect(promise).resolves.toEqual(
      expect.objectContaining({
        state: expectedState,
      }),
    );
  });
});
