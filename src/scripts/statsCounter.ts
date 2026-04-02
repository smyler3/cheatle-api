import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { StatEntry } from "../types/types";

let stats = {
  gets: 0,
  pushes: 0
};

const STATS_DIR = path.join(__dirname, "../../stats");
const STATS_FILE = path.join(STATS_DIR, `/playStats.json`);

export const statsMiddleware: RequestHandler = (req, res, next) => {
  if (req.method === "GET") {
    stats.gets += 1;
  }
  if (req.method === "POST") {
    stats.pushes += 1;
  }
  next();
};

export function flushDailyStats() {
    if (process.env.NODE_ENV === "development") {
        console.log("Saving stats: gets:", stats.gets, "pushes:", stats.pushes);
    };

    if (!fs.existsSync(STATS_DIR)) {
        fs.mkdirSync(STATS_DIR, { recursive: true });
    };

    if (!fs.existsSync(STATS_FILE)) {
        fs.writeFileSync(STATS_FILE, "{}");
    };

    const existingData: Record<string, StatEntry> = fs.existsSync(STATS_FILE) ? JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8')) : {}; 

    if (!existingData) {
        console.error("Unable to read state data");
        console.log("failed", existingData);
        return;
    };

    const dateTime = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace("T", "-")
        .split(".")[0];

    existingData[dateTime] = { gets: stats.gets, pushes: stats.pushes };

    fs.writeFileSync(STATS_FILE, JSON.stringify(existingData, null, 2));

    stats = { gets: 0, pushes: 0 };
}
