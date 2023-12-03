import express from "express";
import healthCheckEndpoint from "./health-check-endpoint";

console.log("Starting server...");

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

app.get("/health-check", healthCheckEndpoint);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

["SIGTERM", "SIGINT"].forEach((signal) => {
  process.on(signal, () => {
    console.log(`${signal} received: closing server`);
    server.close(() => {
      console.log("server closed");
    });
  });
});
