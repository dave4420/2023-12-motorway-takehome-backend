import { SkipHandler, jsonEndpoint } from "./express-utils";

export const renderResponse = () => ({
  status: 200,
  headers: {},
  body: { status: "ok" },
});

export const parseRequest = (): SkipHandler => ({
  state: "skip",
  response: renderResponse(),
});

export default jsonEndpoint<never, never>({
  parseRequest,
  renderResponse,
  defaultHeaders: {},
  handler: (input) => Promise.resolve(input),
});
