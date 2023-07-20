import http from "http";
import { setTimeout } from "node:timers/promises";
import express from "express";
import fs from "fs";
import { IUser } from "./types";
import { body, validationResult } from "express-validator";

const app = express();

const port = process.env.PORT || "3001";
app.set("port", port);
app.use(express.json());

const errorHandler = (error: any) => {
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
    .isNumeric()
    .withMessage("Only Decimals allowed")
    .isLength({
      min: 6,
    })
    .withMessage("The min length should be 6"),
  async (request, response) => {
    // await setTimeout(5000);
    const { email: userEmail, number: userNumber } = request.body;
    const errors = validationResult(request);
    
    if (errors.isEmpty()) {
      const searchResult = jsonData.filter(
        ({ email, number }: IUser) =>
          email === userEmail && number === userNumber
      );
      return response.send(searchResult);
    }

    response.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
);
