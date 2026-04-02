import express, { Request, Response } from 'express';
import { Game } from './structures/Game';
import { statsMiddleware, flushDailyStats } from './scripts/statsCounter';
import cors from 'cors';
import path from 'path';
import cron from "node-cron";
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const isDev = process.env.NODE_ENV === "development";

/*
 * --------------------------------------------------
 * Logic for preparing game data
 * --------------------------------------------------
 */ 

const cheatle = new Game();

const dailyTaskString = '0 0 * * *';
const taskOptions = { timezone: 'Australia/Melbourne' };

cron.schedule(dailyTaskString, () => {
    flushDailyStats()
    cheatle.createNewGame();
}, taskOptions);

process.on('SIGINT', () => {
    console.log('SIGINT → flushing stats');
    flushDailyStats();
});

process.on('SIGTERM', () => {
    console.log('SIGTERM → flushing stats');
    flushDailyStats();
});

/*
 * --------------------------------------------------
 * Middleware
 * --------------------------------------------------
 */ 

// Serve static files
app.use(express.static(path.join(__dirname, "./static")));

const corsOptions = {
    origin: isDev ? 'http://localhost:5173' : process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

app.use('/cheatle-api', statsMiddleware);

/*
 * --------------------------------------------------
 * Set up routes
 * --------------------------------------------------
 */ 

app.get('/cheatle-api', (req: Request, res: Response) => {
    res.json({
        "board": cheatle.getBoard(),
        "validWords": cheatle.getValidWords(),
        "topWords": Object.fromEntries(cheatle.getTopWords()),
    });
});

app.post('/cheatle-api', (req: Request, res: Response) => {
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});