# Cheatle API
The backend for [Cheatle](https://github.com/smyler3/Cheatle).

## How to run locally
### 1. Fork this repo

### 2. Install dependencies
```bash
npm install
```

### 3. Add a .env with the following keys
```bash
PORT=<your port to serve from>
FRONTEND_URL=<your frontend url, uses http://localhost:5173 by default in development mode>
```

### 4. (Optional) Configure your own dictionary
Replace the `dictionary.txt` file in the `/static` folder. This file should consist of a list of words to create the final valid words from 

### 5. Create the dictionary to be used for the game
```bash
npm run prepare:dictionary
```

### 6. Start the app
```bash
npm run dev
```

## Credit
Dictionary: https://github.com/redbo/scrabble/blob/master/dictionary.txt