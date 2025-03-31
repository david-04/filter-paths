import { readFileSync, writeFileSync } from "fs";
import { convert } from "html-to-text";
import showdown from "showdown";

const INPUT = "../README.md";
const OUTPUT = "../src/utils/manual.ts";
const LINE_LENGTH = 80;
const SEPARATOR = "".padEnd(LINE_LENGTH, "-");
const INDENT = "    ";

const markdown = readFileSync(INPUT)
    .toString()
    .replace(/(^|\n)#+\s*(.*)/g, "$1HEADER.START::$2::HEADER.END");

const html = new showdown.Converter().makeHtml(markdown);

const text = convert(html, { wordwrap: LINE_LENGTH, itemPrefix: "- " })
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n\n")
    .replaceAll("HEADER.START::", `${SEPARATOR}\n`)
    .replaceAll("::HEADER.END", `\n${SEPARATOR}`);

const lines = text.split("\n").map(line => `${INDENT}${JSON.stringify(line.padEnd(LINE_LENGTH))}, // NOSONAR`);

writeFileSync(OUTPUT, `export const MANUAL = [\n${lines.join("\n")}\n];`);
