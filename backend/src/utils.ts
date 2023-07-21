import fs from "fs";
import { IUser } from "./types.ts";

export const getJsonData = (): IUser[] => {
  let jsonData: IUser[] = [];
  fs.readFile("src/data.json", "utf-8", (err, data) => {
    if (err) throw err;
    jsonData = JSON.parse(data);
  });
  return jsonData;
};
