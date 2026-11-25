// Fails while any "[EDIT]" placeholder is still present in the portfolio content.
import { readFileSync } from "node:fs";

const file = new URL("../src/data/portfolio.ts", import.meta.url);
const lines = readFileSync(file, "utf8").split("\n");
const found = [];
lines.forEach((line, i) => {
  if (line.includes("[EDIT]") && !line.trim().startsWith("*") && !line.trim().startsWith("//") && !line.trim().startsWith("/*")) {
    found.push(`  line ${i + 1}: ${line.trim().slice(0, 100)}`);
  }
});

if (found.length) {
  console.error(`\n✖ ${found.length} placeholder(s) still need your own words in src/data/portfolio.ts:\n`);
  console.error(found.join("\n"));
  console.error("\nReplace each [EDIT] text, then run this check again.\n");
  process.exit(1);
}
console.log("✔ No [EDIT] placeholders left in portfolio content.");
