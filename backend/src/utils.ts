import { promises as fs } from "fs";
import { IUser } from "./types.ts";

export const getJsonData = async (): Promise<IUser[]> => {
  const data = await fs.readFile("src/data.json", "utf-8");
  return JSON.parse(data);
};