import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

let stats = {
    gets: 0,
    pushes: 0
};

const STATS_DIR = path.join(__dirname, '../../stats');

export const statsMiddleware: RequestHandler = (req, res, next) => {
    if (req.method === 'GET') {
        stats.gets += 1;
    }
    if (req.method === 'POST') {
        stats.pushes += 1;
    } 
    next();
};

export function flushDailyStats() {
    if (process.env.NODE_ENV === "development") {
        console.log("Saving stats: gets:", stats.gets, "pushes:", stats.pushes);
    };
    
    const now = new Date();

    const filename = now.toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0];

    if (!fs.existsSync(STATS_DIR)) {
        fs.mkdirSync(STATS_DIR)
    };

    fs.writeFileSync(
        path.join(STATS_DIR, `${filename}.json`),
        JSON.stringify(stats)
    );

    stats = { gets: 0, pushes: 0 };
};