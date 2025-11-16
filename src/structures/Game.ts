import { PrefixTree } from "./PrefixTree";
import { VALID_WORD_DICTIONARY } from "../data/dictionary";
import { DICE, NUMBER_OF_DICE, REQUIRED_TOP_WORDS } from "../constants";
import { Tile, Word } from "../types/types";


export class Game {
    board: Tile[];
    private tree: PrefixTree;
    validWords: Word[];
    highestScoringWords: Word[];

    constructor() {
        this.board = this.createRandomBoard();
        this.tree = new PrefixTree();
        VALID_WORD_DICTIONARY.forEach(word => this.tree.insertString(word));
        this.validWords = this.tree.findValidWords(this.board);
        this.highestScoringWords = this.findBestWords();
    }

    private createRandomBoard(): Tile[] {
        // TODO: Add dice rolling logic
        const rolledDice = DICE;
        const board = [];
    
        // TODO: Add dice rolling logic
        for (let i = 0; i < NUMBER_OF_DICE; i += 1) {
            board[i] = rolledDice[i][0]
        };
    
        return board;
    };

    // TODO: write own quickSelect and compare to heap as potentially much better
    private findBestWords(): Word[] {
        function quickSelectByIndex(words: Word[], k: number): number {
            let left = 0
            let right = words.length - 1;

            while (true) {
                if (left === right) {
                    return words[left].value;
                }

                const pivotIndex = left + Math.floor(Math.random() * (right - left + 1));
                const pivot = words[pivotIndex].value;

                [words[pivotIndex], words[right]] = [words[right], words[pivotIndex]];

                let storeIndex = left;

                for (let i = left; i < right; i += 1) {
                    if (words[i].value > pivot) { // descending order
                        [words[storeIndex], words[i]] = [words[i], words[storeIndex]];
                        storeIndex++;
                    }
                }
                [words[storeIndex], words[right]] = [words[right], words[storeIndex]];

                if (storeIndex === k) {
                    return words[storeIndex].value;
                }
                else if (storeIndex > k) {
                    right = storeIndex - 1;
                } 
                else {
                    left = storeIndex + 1;
                } 
            }
        }

        const fifthLargestScore = quickSelectByIndex(this.validWords, REQUIRED_TOP_WORDS - 1);
        const highestScoringWords = this.validWords.filter((word) => word.value >= fifthLargestScore);
        const sortedHighestScoringWords = highestScoringWords.sort((a, b) => b.value - a.value);

        return sortedHighestScoringWords;
    };

    createNewGame() {
        this.board = this.createRandomBoard();
        this.validWords = this.tree.findValidWords(this.board);
        this.highestScoringWords = this.findBestWords();
    };

    getBoard() {
        return this.board;
    };

    getValidWords() {
        return this.validWords;
    };

    getHighestScoringWords() {
        return this.highestScoringWords;
    };
};

const chealte = new Game();

console.log(chealte.validWords);
console.log("---------------------------------");
console.log(chealte.highestScoringWords);