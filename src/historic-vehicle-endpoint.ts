import { ParsedRequest, jsonEndpoint } from "./express-utils";
import { Request } from "express";

export interface Input {
  readonly vehicleId: number;
  readonly when: string;
}

export type Output = null | {
  readonly vehicleId: number;
  readonly make: string;
  readonly model: string;
  readonly state: string | null;
};

export const parseRequest = (req: Request): ParsedRequest<Input> => {
  const vehicleId = parseInt(req.params.vehicleId, 10);
  if (typeof vehicleId !== "number" || isNaN(vehicleId)) {
    return {
      state: "skip",
      response: {
        status: 400,
        headers: {},
        body: { error: "Vehicle ID was not supplied" },
      },
    };
  }
  return {
    state: "proceed",
    input: {
      vehicleId,
      when: "DAVE",
    },
  };
};

export const renderResponse = (output: Output) => {
  if (output === null) {
    return {
      status: 410,
      headers: {},
      body: { error: "Vehicle not found" },
    };
  }
  return {
    status: 200,
    headers: {},
    body: output,
  };
};

export default jsonEndpoint<Input, Output>({
  parseRequest,
  renderResponse,
  defaultHeaders: {
    "Cache-Control": "public, max-age=60",
  },
  handler: async () => {
    throw Error("DAVE");
  },
});
