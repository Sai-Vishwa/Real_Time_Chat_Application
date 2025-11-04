import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import router from "./router/router.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: "*"
    }
));
app.use(router)

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the DB Server");
});

app.listen(4004, () => {
  console.log("DB Server is running on http://localhost:4004");
});