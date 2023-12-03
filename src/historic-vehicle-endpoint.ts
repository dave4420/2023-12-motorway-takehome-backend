import { jsonEndpoint } from "./express-utils";
import { Request } from "express";

interface Input {
  readonly vehicleId: number;
  readonly when: string;
}

type Output = null | {
  readonly vehicleId: number;
  readonly make: string;
  readonly model: string;
  readonly state: string | null;
};

export const parseRequest = (req: Request): Input => {
  throw Error("DAVE");
};

export const renderResponse = (output: Output) => {
  throw Error("DAVE");
};

export default jsonEndpoint<Input, Output>({
  parseRequest,
  renderResponse,
  defaultHeaders: {},
  handler: async () => {
    throw Error("DAVE");
  },
});
