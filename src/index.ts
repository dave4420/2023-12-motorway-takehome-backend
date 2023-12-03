import express, { Request, Response } from "express";

console.log("Starting server...");

const app = express();
const port = parseInt(process.env.PORT ?? "3000", 10);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
