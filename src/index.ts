import express from "express";
import healthCheckEndpoint from "./health-check-endpoint";
import historicVehicleEndpoint from "./historic-vehicle-endpoint";

console.log("Starting server...");

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

app.get("/health-check", healthCheckEndpoint);
app.get("/historic-vehicle", historicVehicleEndpoint);

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
