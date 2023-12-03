import { Request, Response } from "express";

interface SmallResponse<Payload> {
  readonly status: number;
  readonly headers: { readonly [key: string]: string };
  readonly body: Payload;
}

interface JsonEndpoint<Input, Output> {
  readonly parseRequest: (req: Request) => Input;
  readonly renderResponse: (output: Output) => SmallResponse<object>;
  readonly defaultHeaders: { readonly [key: string]: string };
  readonly handler: (input: Input) => Promise<Output>;
}

export const jsonEndpoint =
  <Input, Output>(endpoint: JsonEndpoint<Input, Output>) =>
  async (req: Request, res: Response): Promise<void> => {
    const getResponseNoThrow = async () => {
      try {
        const input = endpoint.parseRequest(req);
        const output = await endpoint.handler(input);
        return endpoint.renderResponse(output);
      } catch (error) {
        console.error(error);
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
