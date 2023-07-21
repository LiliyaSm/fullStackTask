import http from "http";
import { setTimeout } from "node:timers/promises";
import express, { Request, Response} from "express";
import fs from "fs";
import { IUser } from "./types";
import { body, validationResult } from "express-validator";
import cors from "cors";

const clientURL = "http://localhost:3000";
const RESPONSE_DELAY = 5000;

const app = express();

const port = process.env.PORT || "3001";
app.set("port", port);
app.use(express.json());

app.use(
  cors({
    origin: clientURL,
  })
);

const errorHandler = (error: any): void => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    default:
      throw error;
  }
};

let jsonData: IUser[] = [];
fs.readFile("data.json", "utf-8", (err, data) => {
  if (err) throw err;
  jsonData = JSON.parse(data);
});

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);

app.post(
  "/search",
  body("email").trim().isEmail().normalizeEmail(),
  body("number")
    .trim()
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Only decimals allowed")
    .isLength({
      min: 6,
    })
    .withMessage("The min length should be 6"),
  async (request: Request, response: Response) => {
    await setTimeout(RESPONSE_DELAY);
    const { email: userEmail, number: userNumber }: IUser = request.body;
    const errors = validationResult(request);

    if (errors.isEmpty()) {
      const searchResult: IUser[] = jsonData.filter(({ email, number }: IUser) => {
        if (userNumber !== undefined) {
          return email === userEmail && number === userNumber;
        } else {
          return email === userEmail;
        }
      });
      return response.send(searchResult);
    }

    response.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
);
