import { port } from "./constants.ts";
import http from "http";
import express from 'express'

export const createServer = (app: express.Application) => {
  const server = http.createServer(app);

  const errorHandler = (error:any): void => {
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

  server.on("error", errorHandler);
  server.on("listening", () => {
    const address = server.address();
    const bind =
      typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
  });

  server.listen(port);
};
