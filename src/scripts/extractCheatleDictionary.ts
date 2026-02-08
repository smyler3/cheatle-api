import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";

// Args
const [inputFilePath] = process.argv.slice(2);

if (!inputFilePath) {
  throw new Error(`Couldn't find input file path (Usage: node extractCheatleDictionary.ts <path to input file>)`);
}

// Read words line by line
async function readWords(filePath: string): Promise<string[]> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const words: string[] = [];
  for await (const line of rl) {
    const word = line.trim();
    if (!word) continue;

    const len = word.length;
    const wordLower = word.toLowerCase();

    const valid =
      ((len >= 3 && len <= 16 && /^[a-z]+$/.test(wordLower) && !/q(?!u)/.test(wordLower)) ||
      (wordLower.includes("qu") && len === 17));

    if (valid) words.push(word.toUpperCase());
  }

  return words;
}

// Write as TS file
async function writeTs(words: string[]) {
  // Ensure output directory exists
  const outDir = path.join("src", "data");
  const outFile = path.join(outDir, "dictionary.ts");
  fs.mkdirSync(outDir, { recursive: true });

  const content =
    "export const VALID_WORD_DICTIONARY: string[] = [\n" +
    words.map((w) => `  "${w}"`).join(",\n") +
    "\n];";

  fs.writeFileSync(outFile, content, "utf8");
}

async function main() {
  const words = await readWords(inputFilePath);
  await writeTs(words);
  console.log(`Saved ${words.length}`);
}

main().catch(console.error);