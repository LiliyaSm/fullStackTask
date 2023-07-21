import { setTimeout } from "node:timers/promises";
import express, { Request, Response } from "express";
import { IUser } from "./types.ts";
import { body, validationResult } from "express-validator";
import cors from "cors";
import { port, clientURL } from "./constants.ts";
import { getJsonData } from "./utils.ts";
import { createServer } from "./handlers.ts";

const RESPONSE_DELAY = 5000;

export const app = express();

createServer(app);

app.set("port", port);
app.use(express.json());

app.use(
  cors({
    origin: clientURL,
  })
);

let jsonData: IUser[] = getJsonData();

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
      const searchResult: IUser[] = jsonData.filter(
        ({ email, number }: IUser) => {
          if (userNumber !== undefined) {
            return email === userEmail && number === userNumber;
          } else {
            return email === userEmail;
          }
        }
      );
      return response.send(searchResult);
    }

    response.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
);
