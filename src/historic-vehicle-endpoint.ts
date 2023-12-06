import { ParsedRequest, jsonEndpoint } from "./express-utils";
import { Request } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

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

const schema = z.object({
  params: z.object({
    vehicleId: z.coerce.number(),
  }),
});

export const parseRequest = (req: Request): ParsedRequest<Input> => {
  const parsed = schema.safeParse(req);
  if (!parsed.success) {
    return {
      state: "skip",
      response: {
        status: 400,
        headers: {},
        body: {
          error: fromZodError(parsed.error).message,
        },
      },
    };
  }
  return {
    state: "proceed",
    input: {
      vehicleId: parsed.data.params.vehicleId,
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
