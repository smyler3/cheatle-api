import express, { Request, Response } from 'express';
import { Game } from './structures/Game';
import cors from 'cors';
import path from 'path';
import cron from "node-cron";

const app = express();
const port = process.env.PORT || 3000;

/*
 * --------------------------------------------------
 * Logic for preparing game data
 * --------------------------------------------------
 */ 

const cheatle = new Game();

const dailyTaskString = '0 0 * * *';
const taskOptions = { timezone: 'Australia/Melbourne' };

cron.schedule(dailyTaskString, () => {
  cheatle.createNewGame();
}, taskOptions);

/*
 * --------------------------------------------------
 * Middleware
 * --------------------------------------------------
 */ 

// Serve static files
app.use(express.static(path.join(__dirname, "./static")));

const corsOptions = {
    origin: ['http://localhost:5173/', 'http://localhost:5173'],
    methods: ['GET'],
    allowedHeaders: ['application/json'],
};

app.use(cors(corsOptions));

/*
 * --------------------------------------------------
 * Set up routes
 * --------------------------------------------------
 */ 

app.get('/cheatle-api', (req: Request, res: Response) => {
    const resObject = {
        "board": cheatle.getBoard(),
        "validWords": cheatle.getValidWords(),
        "highestScoringWords": cheatle.getHighestScoringWords(),
    };
    res.json({
        "board": cheatle.getBoard(),
        "validWords": cheatle.getValidWords(),
        "highestScoringWords": cheatle.getHighestScoringWords(),
    });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});