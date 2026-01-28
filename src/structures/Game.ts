import { PrefixTree } from "./PrefixTree";
import { VALID_WORD_DICTIONARY } from "../data/dictionary";
import { DICE, NUMBER_OF_DICE, REQUIRED_TOP_WORDS, SIDES_PER_DICE } from "../constants";
import { Hint, Tile, Word } from "../types/types";

export class Game {
    private tree: PrefixTree;
    board!: Tile[];
    validWords!: Word[];
    topWords!: Map<number, Hint[]>;

    constructor() {
        // Populate prefix tree with dictionary words
        this.tree = new PrefixTree();
        VALID_WORD_DICTIONARY.forEach(word => this.tree.insertString(word));

        this.createNewGame();
    }

    private createRandomBoard(): Tile[] {
        const rolledDice = DICE;

        for (let i = 0; i < NUMBER_OF_DICE; i += 1) {
            const maxIndex = NUMBER_OF_DICE - 1 - i;
            const randomIndex = Math.floor(Math.random() * maxIndex);

            [rolledDice[randomIndex], rolledDice[maxIndex]] = [rolledDice[maxIndex], rolledDice[randomIndex]];
        };

        const board = rolledDice.map((die) => {
            return die[Math.floor(Math.random() * SIDES_PER_DICE)]
        });
    
        return board;
    };

    // TODO: write own quickSelect and compare to heap as potentially much better
    private findTopWords(): Map<number, Hint[]> {
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
        const topWordsByValue = new Map<number, Hint[]>();

        for (let i = 0; i < sortedHighestScoringWords.length; i++) {
            const word = { ...sortedHighestScoringWords[i], revealedText: "", isGuessed: false };

            const existing = topWordsByValue.get(word.value) ?? [];
            topWordsByValue.set(word.value, [...existing, word]);
        };

        return topWordsByValue;
    };

    createNewGame() {
        this.board = this.createRandomBoard();
        this.validWords = this.tree.findValidWords(this.board);
        this.topWords = this.findTopWords();

        console.log(this.validWords);
        console.log("---------------------------------");
        console.log(this.topWords);
    };

    getBoard() {
        return this.board;
    };

    getValidWords() {
        return this.validWords;
    };

    getTopWords() {
        return this.topWords;
    };
};