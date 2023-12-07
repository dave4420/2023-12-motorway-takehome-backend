import { App, startApp } from "./app";
import pino from "pino";

let app: App;

beforeAll(() => {
  app = startApp(pino({ level: "silent" }));
});

afterAll(() => {
  app.shutdown();
});

describe("GET /health-check", () => {
  it("returns 200 OK", async () => {
    // given
    const expectedStatus = 200;

    // when
    const response = await fetch("http://localhost:3000/health-check");

    // then
    expect(response.status).toEqual(expectedStatus);
  });
});

describe("GET /historic-vehicle/:vehicleId/:when", () => {
  it("returns a vehicle as it was at that point in time", async () => {
    // given
    const vehicleId = 3;
    const when = "2022-09-12T09:00:00Z";

    const expectedMake = "VW";
    const expectedModel = "GOLF";
    const expectedState = "selling";

    // when
    const response = await fetch(
      `http://localhost:3000/historic-vehicle/${vehicleId}/${when}`,
    );

    // then
    expect(response.status).toEqual(200);

    const body = await response.json();

    expect(body).toEqual(
      expect.objectContaining({
        vehicleId,
        make: expectedMake,
        model: expectedModel,
        state: expectedState,
      }),
    );
  });
});
