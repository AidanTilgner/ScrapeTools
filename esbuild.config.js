import { fileURLToPath } from "url";
import { dirname } from "path";
import { build } from "esbuild";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the src directory
const srcDir = path.join(__dirname, "src");

// Read all files in the src directory
const files = fs
  .readdirSync(srcDir)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

// Create a build for each file
files.forEach((file) => {
  const filePath = path.join(srcDir, file);
  const outFilePath = path
    .join(__dirname, "dist", file)
    .replace(/\.ts$/, ".cjs");

  build({
    entryPoints: [filePath],
    bundle: true,
    platform: "node",
    outfile: outFilePath,
    minify: true, // Optional: Minifies the output for smaller file size
    loader: {
      ".ts": "ts",
      ".js": "js",
    },
  })
    .then(() => {
      // Add the shebang line
      const shebang = "#!/usr/bin/env node\n";
      const content = fs.readFileSync(outFilePath, "utf8");
      fs.writeFileSync(outFilePath, shebang + content);
      // Make the file executable
      fs.chmodSync(outFilePath, "755");
    })
    .catch(() => process.exit(1));
});
