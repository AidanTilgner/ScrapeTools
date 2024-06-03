import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import puppeteer from "../node_modules/puppeteer/lib/types";

const argv = await yargs(hideBin(process.argv))
  .option("url", {
    alias: "u",
    type: "string",
    description: "The URL to process",
    demandOption: true,
  })
  .option("site", {
    alias: "s",
    type: "string",
    description: "The site to process",
    demandOption: true,
    options: ["substack"],
  })
  .help()
  .alias("help", "h").argv;

const url = argv.url;
const site = argv.site;

let content = "";

const browser = await puppeteer.launch();
const page = await browser.newPage();

switch (site) {
  case "substack":
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const articleContent = await page.evaluate(() => {
      // grab the text content of the article by reading what's inside the 'available-content' div
      return document.querySelector(".available-content")?.textContent?.trim();
    });
    if (!articleContent) {
      console.error("Error parsing article content");
      process.exit(1);
    }

    content = articleContent;

    await browser.close();
    break;
  default:
    console.error(`Unknown site: ${site}`);
    process.exit(1);
}

console.log(`
${url}
---
${content}
`);
