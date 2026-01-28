import { NUMBER_OF_DICE, ADJACENT_LIST, NUMBER_OF_UNIQUE_TILES } from "../constants";
import { Tile, Word } from "../types/types";

class PrefixTreeNode {
    isTerminal: boolean;
    children: (PrefixTreeNode | null)[];

    constructor() {
        this.isTerminal = false;
        this.children = new Array(NUMBER_OF_UNIQUE_TILES).fill(null); 
    }
}

export class PrefixTree {
    root: PrefixTreeNode;

    constructor() {
        this.root = new PrefixTreeNode();
    };

    insertString(newString: string): void {
        let parent = this.root;

        for (let i = 0; i < newString.length; i += 1) {
            const childrenIndex = this.getCharacterIndex(newString[i])

            if (parent.children[childrenIndex] === null) {
                parent.children[childrenIndex] = new PrefixTreeNode();
            }

            parent = parent.children[childrenIndex];

            // Q only appears in the "QU" tile so we just assume the U is present 
            if (newString[i] === 'Q'){ i += 1 };
        };

        parent.isTerminal = true;
    };

    private getCharacterIndex(character: string): number {
         // Letters are derived from their index (A=0, B=1, C=2, ... Z=25)
        return character.charCodeAt(0) - 'A'.charCodeAt(0);
    };

    private depthFirstSearch(
        node: PrefixTreeNode, 
        board: Tile[], 
        visited: boolean[], 
        tileIndex: number, 
        runningWord: Word,
        wordsList: Map<string, number>,
    ) {
        visited[tileIndex] = true;

        const { text, value } = board[tileIndex];
        const charIndex = this.getCharacterIndex(text);
        const nextNode = node.children[charIndex];

        if (!nextNode) return;

        // Q only appears in the "QU" tile so we just assume the U is present 
        const newText = text === "Q" ? "QU" : text;

        const newWord = { 
            text: runningWord.text + newText,
            value: runningWord.value + value 
        };

        if (nextNode.isTerminal) {
            wordsList.set(newWord.text, newWord.value);
        }

        for (const neighbour of ADJACENT_LIST[tileIndex]) {
            if (!visited[neighbour]) {
                this.depthFirstSearch(nextNode, board, [...visited], neighbour, newWord, wordsList);
            }
        }
    }

    findValidWords(board: Tile[]): Word[] {
        const wordsList = new Map<string, number>();

        for (let i = 0; i < NUMBER_OF_DICE; i++) {
            const char = board[i];
            const charIndex = this.getCharacterIndex(char.text);
            const childNode = this.root.children[charIndex];

            if (childNode) {
                const runningWord = { text: "", value: 0 };
                const visited = new Array(NUMBER_OF_DICE).fill(false);
                this.depthFirstSearch(this.root, board, visited, i, runningWord, wordsList);
            }
        }

        return Array.from(wordsList, ([key, value]) => ({ text: key, value: value }));
    }
};