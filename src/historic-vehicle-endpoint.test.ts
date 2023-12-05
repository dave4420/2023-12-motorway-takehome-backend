import {
  parseRequest,
  renderResponse,
  Output,
} from "./historic-vehicle-endpoint";
import { Request } from "express";

describe("parseRequest", () => {
  describe("the vehicleId path parameter", () => {
    it("is extracted", () => {
      // given
      const req = {
        params: {
          vehicleId: "123",
          when: "2021-01-01T00:00:00Z",
        },
      } as unknown as Request;

      // when
      const parsed = parseRequest(req);

      // then
      expect(parsed).toEqual({
        state: "proceed",
        input: expect.objectContaining({
          vehicleId: 123,
        }),
      });
    });

    it("is required", () => {
      // given
      const req = {
        params: {
          when: "2021-01-01T00:00:00Z",
        },
      } as unknown as Request;

      // when
      const parsed = parseRequest(req);

      // then
      expect(parsed).toEqual({
        state: "skip",
        response: expect.objectContaining({
          status: 400,
        }),
      });
    });

    it("must parse as a number", () => {
      // given
      const req = {
        params: {
          vehicleId: "bob",
          when: "2021-01-01T00:00:00Z",
        },
      } as unknown as Request;

      // when
      const parsed = parseRequest(req);

      // then
      expect(parsed).toEqual({
        state: "skip",
        response: expect.objectContaining({
          status: 400,
        }),
      });
    });
  });

  describe("the when path parameter", () => {
    it.todo("is extracted when the T is present");
    it.todo("is extracted when the T is not present");
    it.todo("is required");
    it.todo("is an error if it doesn’t parse");
  });
});

describe("renderResponse", () => {
  it("renders null as a 410", () => {
    // given
    const output: Output = null;

    // when
    const response = renderResponse(output);

    // then
    expect(response).toEqual({
      status: 410,
      headers: {},
      body: { error: "Vehicle not found" },
    });
  });

  it("renders an object as a 200", () => {
    // given
    const output: Output = {
      vehicleId: 123,
      make: "Ford",
      model: "Fiesta",
      state: "quoted",
    };

    // when
    const response = renderResponse(output);

    // then
    expect(response).toEqual({
      status: 200,
      headers: {},
      body: output,
    });
  });
});
