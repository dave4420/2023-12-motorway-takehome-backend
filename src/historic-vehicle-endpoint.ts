import { ParsedRequest, jsonEndpoint } from "./express-utils";
import { Request } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { Instant } from "@js-joda/core";
import { zj } from "zod-joda";

export interface Input {
  readonly vehicleId: number;
  readonly when: Instant;
}

export type Output = null | {
  readonly vehicleId: number;
  readonly make: string;
  readonly model: string;
  readonly state: string | null;
};

const zonedDateTime = z.preprocess((val) => {
  // change first ' ' to 'T', if present
  if (typeof val !== "string") {
    return val;
  }
  const index = val.indexOf(" ");
  if (index === -1) {
    return val;
  }
  return val.substring(0, index) + "T" + val.substring(index + 1);
}, zj.zonedDateTime());

const schema = z.object({
  params: z.object({
    vehicleId: z.coerce.number(),
    when: zonedDateTime,
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
      when: parsed.data.params.when.toInstant(),
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
