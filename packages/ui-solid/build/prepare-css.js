import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const sourceDirectory = "./src/styles";
const targetDirectory = "./dist-styles";

// The `recursive` option ensures the directory is created if it doesn't exist,
// does nothing if it already exists, and creates any necessary parent directories.
mkdirSync(targetDirectory, { recursive: true });

for (const filename of readdirSync(sourceDirectory)) {
  copyFileSync(
    join(sourceDirectory, filename),
    join(targetDirectory, filename)
  );
}

// TODO: Prettier? Then also update bootstrapping.md
