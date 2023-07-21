import * as dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || "3001";

export const clientURL = "http://localhost:3000";
