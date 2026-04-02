export type TileValue = 1 | 2 | 3 | 4 | 5;

export type Tile = {
    text: string,
    value: TileValue,
}

export interface Word {
    text: string,
    value: number,
}

export interface Hint extends Word {
    revealedText: string,
    isGuessed: boolean,
}

export type StatEntry = {
    gets: number;
    pushes: number;
};