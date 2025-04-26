import { copyFileSync, mkdirSync, readdirSync, watch } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const name = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = join(name, "../src/styles");
const targetDirectory = join(name, "../dist/styles");

let isScheduled = false;

// Editors and the OS may create temporary or metadata files in this directory;
// this build step establishes a fail-closed filesystem trust boundary for the output
// by deliberately enforcing a CSS-only invariant,
// ensuring deterministic builds where only CSS originating from the source directory reaches `dist/`.
function isCss(fileName) {
  return fileName.endsWith(".css");
}

function build() {
  // The `recursive` option ensures the directory is created if it doesn't exist,
  // does nothing if it already exists, and creates any necessary parent directories.
  mkdirSync(targetDirectory, { recursive: true });

  for (const fileName of readdirSync(sourceDirectory)) {
    if (isCss(fileName)) {
      copyFileSync(
        join(sourceDirectory, fileName),
        join(targetDirectory, fileName),
      );
    }
  }
}

build();

if (process.argv.includes("--watch")) {
  watch(sourceDirectory, { recursive: true }, (_, fileName) => {
    if (fileName && isCss(fileName) && !isScheduled) {
      isScheduled = true;

      setImmediate(() => {
        isScheduled = false;
        build();
      });
    }
  });
}
