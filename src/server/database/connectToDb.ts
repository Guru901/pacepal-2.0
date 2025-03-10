import { env } from "@/env";
import * as mongoose from "mongoose";

export async function connectToDB() {
  try {
    if (mongoose.connection.readyState) return;
    await mongoose.connect(env.DATABASE_URL);
    console.log(`Connected to database`);
  } catch (error: unknown) {
    console.error(`Error connecting to database: ${String(error)}`);
  }
}
