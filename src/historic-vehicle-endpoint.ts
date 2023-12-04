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
  throw Error("DAVE");
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
  defaultHeaders: {},
  handler: async () => {
    throw Error("DAVE");
  },
});
