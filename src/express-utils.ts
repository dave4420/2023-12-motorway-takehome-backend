import { Request, Response } from "express";
import { Dependencies } from "./dependencies";

interface SmallResponse<Payload> {
  readonly status: number;
  readonly headers: { readonly [key: string]: string };
  readonly body: Payload;
}

interface JsonEndpoint<Input, Output> {
  readonly parseRequest: (req: Request, deps: Dependencies) => Input;
  readonly renderResponse: (
    output: Output,
    deps: Dependencies,
  ) => SmallResponse<object>;
  readonly defaultHeaders: { readonly [key: string]: string };
  readonly handler: (input: Input, deps: Dependencies) => Promise<Output>;
}

const errorFields = (error: any): any => {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
    };
  }
  return error;
};

export const jsonEndpoint =
  <Input, Output>(endpoint: JsonEndpoint<Input, Output>) =>
  (deps: Dependencies) =>
  async (req: Request, res: Response): Promise<void> => {
    const getResponseNoThrow = async () => {
      try {
        const input = endpoint.parseRequest(req, deps);
        const output = await endpoint.handler(input, deps);
        return endpoint.renderResponse(output, deps);
      } catch (error) {
        deps.log.error(
          { error: errorFields(error) },
          "Caught error in jsonEndpoint, returning internal server error",
        );
        return {
          status: 500,
          headers: {},
          body: { error: "Internal server error" },
        };
      }
    };
    const { status, headers, body } = await getResponseNoThrow();
    const actualHeaders = {
      ...endpoint.defaultHeaders,
      ...headers,
    };
    res.status(status);
    res.set(actualHeaders);
    res.json(body);
  };
