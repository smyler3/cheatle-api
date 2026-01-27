import express, { Request, Response } from 'express';
import { Game } from './structures/Game';
import cors from 'cors';
import path from 'path';
import cron from "node-cron";

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
    origin: isDev ? 'http://localhost:5173/' : process.env.FRONTEND_URL,
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
        "topWords": cheatle.getTopWords(),
    };
    res.json({
        "board": cheatle.getBoard(),
        "validWords": cheatle.getValidWords(),
        "topWords": Object.fromEntries(cheatle.getTopWords()),
    });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});