import fs from "fs";
import readline from "readline";

// Args
const [inputFilePath, outputFilePath] = process.argv.slice(2);

if (!inputFilePath || !outputFilePath) {
  throw new Error("Usage: ts-node script.ts <input.csv> <output.ts>");
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
async function writeTs(words: string[], outputFilePath: string) {
  const content =
    "export const VALID_WORD_DICTIONARY: string[] = [\n" +
    words.map((w) => `  "${w}"`).join(",\n") +
    "\n];";

  fs.writeFileSync(outputFilePath, content, "utf8");
}

async function main() {
  const words = await readWords(inputFilePath);
  await writeTs(words, outputFilePath);
  console.log(`Saved ${words.length} words to ${outputFilePath}`);
}

main().catch(console.error);