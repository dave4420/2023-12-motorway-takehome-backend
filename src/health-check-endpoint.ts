import { jsonEndpoint } from "./express-utils";

export const renderResponse = () => ({
  status: 200,
  headers: {},
  body: { status: "ok" },
});

export default jsonEndpoint<null, null>({
  parseRequest: () => null,
  renderResponse,
  defaultHeaders: {},
  handler: () => Promise.resolve(null),
});
