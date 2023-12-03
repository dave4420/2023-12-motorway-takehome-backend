import { renderResponse, Output } from "./historic-vehicle-endpoint";

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
