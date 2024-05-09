import express, { Application, Request, Response } from "express";
import router from "./routes";
const app: Application = express();

//app router
app.use("/api/v1", router);

//server response
app.get("/", (req: Request, res: Response) => {
  res.send(
    "<h1 style='font-family: Arial, sans-serif;text-align:center;color:#12354E'>Hey! I m front man of dentist, how can i assist you!</h1>"
  );
});

export default app;
