npm version:

1. web-ui-components: npm init -y
2. web-ui-components/apps/solid-playground: npx degit solidjs/templates/ts .
3. web-ui-components/packages/ui-solid: npm create vite@latest . -- --template solid-ts
4. move .gitignore from web-ui-components/packages/ui-solid to web-ui-components
5. (is needed?) add `dist` to web-ui-components/.gitignore
6. web-ui-components/packages/ui-solid/src/components/HelloWorld.tsx: `import type { Component } from 'solid-js';export const HelloWorld: Component = () => {return <p>Hello from ui-solid!</p>;};`
7. web-ui-components/packages/ui-solid/src/index.ts: `export { HelloWorld } from './components/HelloWorld';`
8. add `import { HelloWorld } from 'ui-solid';`, `<HelloWorld />`, and `import "shared/styles/index.css";` to web-ui-components/apps/solid-playground/src/App.tsx
9. add empty web-ui-components/packages/shared/src/index.ts. It will get exports that exist, for example, `export * from './utils/utils'`.
10. add or change these files with contents from below:

- web-ui-components/tsconfig.base.json
- web-ui-components/packages/tsconfig.package.json
- web-ui-components/packages/ui-solid/package.json
- web-ui-components/packages/ui-solid/tsconfig.json
- web-ui-components/packages/ui-solid/tsconfig.app.json
- web-ui-components/packages/ui-solid/tsconfig.build.json
- web-ui-components/packages/ui-solid/vite.config.ts
- web-ui-components/packages/ui-solid/src/index.ts
- web-ui-components/packages/shared/package.json
- web-ui-components/packages/shared/tsconfig.build.json
- web-ui-components/packages/shared/build/prepare-css.mjs
- web-ui-components/apps/tsconfig.app.json
- web-ui-components/apps/solid-playground/tsconfig.json
- web-ui-components/apps/solid-playground/package.json
- web-ui-components/package.json
- web-ui-components/scripts/dev-solid-workspace.mjs

11. remove these files and directories:

- web-ui-components/packages/ui-solid/tsconfig.node.json
- web-ui-components/packages/ui-solid/src/App.css
- web-ui-components/packages/ui-solid/src/App.tsx
- web-ui-components/packages/ui-solid/src/index.css
- web-ui-components/packages/ui-solid/src/index.tsx
- web-ui-components/packages/ui-solid/src/assets/solid.svg
- web-ui-components/packages/ui-solid/src/assets
- web-ui-components/packages/ui-solid/src/vite-env.d.ts
- web-ui-components/packages/ui-solid/public/vite.svg
- web-ui-components/apps/solid-playground/.gitignore
- web-ui-components/apps/solid-playground/pnpm-lock.yaml
- web-ui-components/packages/ui-solid/index.html

12. add empty web-ui-components/packages/shared/styles/index.css
13. web-ui-components: npm install
14. web-ui-components: npm run build
15. web-ui-components: npm run dev:solid:workspace

Vite library mode configuration based on official guide: https://vitejs.dev/guide/build.html#library-mode<br>
web-ui-components/packages/ui-solid/vite.config.ts:

```
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [solid()],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UiSolid',
      fileName: 'ui-solid',
      formats: ['es', 'cjs']
    },
    outDir: 'dist/vite',
    rollupOptions: {
      external: ['solid-js'],
      output: {
        globals: {
          'solid-js': 'SolidJs',
        },
      },
    },
  },
})
```

web-ui-components/packages/ui-solid/package.json:

```
{
  "name": "ui-solid",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/tsc/index.d.ts",
      "import": "./dist/vite/ui-solid.js",
      "require": "./dist/vite/ui-solid.cjs"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json && vite build"
  },
  "dependencies": {
    "solid-js": "^1.9.5"
  },
  "devDependencies": {
    "vite-plugin-solid": "^2.11.6"
  }
}
```

web-ui-components/packages/shared/build/prepare-css.mjs:

```
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
```

web-ui-components/apps/solid-playground/package.json:

```
{
  "name": "solid-playground",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "vite-plugin-solid": "^2.11.6"
  },
  "dependencies": {
    "solid-js": "^1.9.5",
    "ui-solid": "*",
    "shared": "*"
  }
}
```

web-ui-components/tsconfig.base.json:

```
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "skipLibCheck": true,
    "useDefineForClassFields": true,
    "esModuleInterop": true,
    "isolatedModules": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

web-ui-components/packages/tsconfig.package.json:

```
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "declaration": true,
    "composite": true,

    /* Linting */
    "noUncheckedSideEffectImports": true
  }
}
```

web-ui-components/packages/ui-solid/tsconfig.json:

```
{
  "extends": "../tsconfig.package.json",
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

web-ui-components/packages/ui-solid/tsconfig.app.json:

```
{
  "extends": "../tsconfig.package.json",
  "compilerOptions": {
    /* Bundler mode */
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  },
  "include": ["src"]
}
```

web-ui-components/packages/ui-solid/tsconfig.build.json:

```
{
  "extends": "../tsconfig.package.json",
  "compilerOptions": {
    "outDir": "dist/tsc",
    "rootDir": "src",

    /* Bundler mode */
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  },
  "include": ["src"]
}
```

web-ui-components/apps/tsconfig.app.json:

```
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "DOM.Iterable"],

    /* Bundler mode */
    "noEmit": true
  }
}
```

web-ui-components/apps/solid-playground/tsconfig.json:

```
{
  "extends": "../tsconfig.app.json",
  "compilerOptions": {
    /* Bundler mode */
    "jsx": "preserve",
    "jsxImportSource": "solid-js",

    "types": ["vite/client"]
  }
}
```

web-ui-components/packages/shared/package.json:

```
{
  "name": "shared",
  "private": true,
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/tsc/index.d.ts",
      "default": "./dist/tsc/index.js"
    },
    "./styles/*": "./dist/styles/*"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json && node build/prepare-css.mjs",
    "dev": "node build/prepare-css.mjs --watch"
  }
}
```

web-ui-components/packages/shared/tsconfig.build.json:

```
{
  "extends": "../tsconfig.package.json",
  "compilerOptions": {
    "outDir": "dist/tsc",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*.ts"]
}
```

web-ui-components/package.json:

```
{
  "name": "web-ui-components",
  "version": "0.0.0",
  "description": "npm version:",
  "keywords": [],
  "author": "",
  "license": "MIT",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "npm run build -ws",
    "dev:solid": "npm run dev -w apps/solid-playground",
    "dev:solid:workspace": "node scripts/dev-solid-workspace.mjs"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "vite": "^6.0.0"
  }
}
```

web-ui-components/scripts/dev-solid-workspace.mjs:

```
import { spawn } from "node:child_process";

const nodePath = process.env.npm_node_execpath ?? process.execPath;
const processes = [];

function startWorkspaceDev(workspace) {
  processes.push(
    spawn(nodePath, [process.env.npm_execpath, "run", "dev", "-w", workspace], {
      stdio: "inherit",
    }),
  );
}

startWorkspaceDev("packages/shared");
startWorkspaceDev("apps/solid-playground");

let shuttingDown = false;

function shutdown(signal) {
  if (!shuttingDown) {
    shuttingDown = true;

    for (const p of processes) {
      p.kill(signal);
    }
  }
}

["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  process.on(signal, shutdown);
});
```
