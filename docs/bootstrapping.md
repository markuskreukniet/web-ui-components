npm version:

1. web-ui-components: npm init -y
2. remove `"main": "index.js",` and `"scripts": {"test": "echo \"Error: no test specified\" && exit 1"},` from web-ui-components/package.json
3. add `"private": true,"workspaces": ["packages/*","apps/*"]` to web-ui-components/package.json
4. web-ui-components/apps/solid-playground: npx degit solidjs/templates/ts .
5. remove .gitignore and pnpm-lock.yaml from web-ui-components/apps/solid-playground
6. web-ui-components/packages/ui-solid: npm create vite@latest . -- --template solid-ts
7. move .gitignore from web-ui-components/packages/ui-solid to web-ui-components
8. (is needed?) add `dist` to web-ui-components/.gitignore
9. web-ui-components/packages/ui-solid/src/components/HelloWorld.tsx: `import type { Component } from 'solid-js';export const HelloWorld: Component = () => {return <p>Hello from ui-solid!</p>;};`
10. web-ui-components/packages/ui-solid/src/index.ts: `export { HelloWorld } from './components/HelloWorld';`
11. add `"dependencies": {"ui-solid": "*"}` to web-ui-components/apps/solid-playground/package.json
12. add `import { HelloWorld } from 'ui-solid';` and `<HelloWorld />` to web-ui-components/apps/solid-playground/src/App.tsx
13. change the web-ui-components/packages/ui-solid/vite.config.ts with the content from below
14. add web-ui-components/packages/ui-solid/tsconfig.build.json with the content from below
15. change web-ui-components/packages/ui-solid/package.json with the content from below
16. web-ui-components: npm install
17. web-ui-components/packages/ui-solid: npm run build

18. (untested) (between bullet 15 and 16, new 16) add web-ui-components/packages/ui-solid/build/prepare-css.js with the content from below
19. (untested) (change bullet 12) add `import { HelloWorld } from 'ui-solid';`, `<HelloWorld />`, and `import 'ui-solid/styles.css'` to web-ui-components/apps/solid-playground/src/App.tsx
20. (untested) remove web-ui-components/packages/ui-solid/index.html
21. (untested) change web-ui-components/apps/solid-playground/package.json with the content from below

pnpm version:

1. web-ui-components: pnpm init
2. add `"private": true,` to web-ui-components/package.json
3. add the web-ui-components/pnpm-workspace.yaml with the content from below
4. web-ui-components/apps/solid-playground: pnpx degit solidjs/templates/ts .
5. remove .gitignore and pnpm-lock.yaml from web-ui-components/apps/solid-playground
6. web-ui-components/packages/ui-solid: pnpm create vite . --template solid-ts
7. move .gitignore from web-ui-components/packages/ui-solid to web-ui-components
8. (is needed?) add `dist` to web-ui-components/.gitignore
9. web-ui-components/packages/ui-solid/src/components/HelloWorld.tsx: `import type { Component } from 'solid-js';export const HelloWorld: Component = () => {return <p>Hello from ui-solid!</p>;};`
10. web-ui-components/packages/ui-solid/src/index.ts: `export { HelloWorld } from './components/HelloWorld';`
11. add `"dependencies": {"ui-solid": "workspace:*"}` to web-ui-components/apps/solid-playground/package.json
12. add `import { HelloWorld } from 'ui-solid';` and `<HelloWorld />` to web-ui-components/apps/solid-playground/src/App.tsx
13. change the web-ui-components/packages/ui-solid/vite.config.ts with the content from below
14. add web-ui-components/packages/ui-solid/tsconfig.build.json with the content from below
15. change web-ui-components/packages/ui-solid/package.json with the content from below
16. web-ui-components: pnpm install
17. web-ui-components/packages/ui-solid: pnpm build

18. (untested) (between bullet 15 and 16, new 16) add web-ui-components/packages/ui-solid/build/prepare-css.js with the content from below
19. (untested) (change bullet 12) add `import { HelloWorld } from 'ui-solid';`, `<HelloWorld />`, and `import 'ui-solid/styles.css'` to web-ui-components/apps/solid-playground/src/App.tsx
20. (untested) remove web-ui-components/packages/ui-solid/index.html
21. (untested) change web-ui-components/apps/solid-playground/package.json with the content from below

web-ui-components/pnpm-workspace.yaml:

```
packages:
  - "packages/*"
  - "apps/*"
```

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
});
```

web-ui-components/packages/ui-solid/tsconfig.build.json:

```
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist/tsc",
    "rootDir": "src",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "moduleResolution": "node"
  },
  "include": ["src"]
}
```

web-ui-components/packages/ui-solid/package.json (new):

```
{
  "name": "ui-solid",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "types": "dist/tsc/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/vite/ui-solid.js",
      "require": "./dist/vite/ui-solid.cjs"
    },
    "./styles.css": "./dist/styles/index.css"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -p tsconfig.build.json && vite build && node build/prepare-css.js",
    "preview": "vite preview"
  },
  "dependencies": {
    "solid-js": "^1.9.5"
  },
  "devDependencies": {
    "typescript": "~5.7.2",
    "vite": "^6.3.1",
    "vite-plugin-solid": "^2.11.6"
  }
}
```

web-ui-components/packages/ui-solid/package.json (old):

```
{
  "name": "ui-solid",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "types": "dist/tsc/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/vite/ui-solid.js",
      "require": "./dist/vite/ui-solid.cjs"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -p tsconfig.build.json && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "solid-js": "^1.9.5"
  },
  "devDependencies": {
    "typescript": "~5.7.2",
    "vite": "^6.3.1",
    "vite-plugin-solid": "^2.11.6"
  }
}
```

web-ui-components/packages/ui-solid/build/prepare-css.js:

```
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const sourceDirectory = "./src/styles";
const targetDirectory = "./dist/styles";

// The `recursive` option ensures the directory is created if it doesn't exist,
// does nothing if it already exists, and creates any necessary parent directories.
mkdirSync(targetDirectory, { recursive: true });

for (const filename of readdirSync(sourceDirectory)) {
  copyFileSync(
    join(sourceDirectory, filename),
    join(targetDirectory, filename)
  );
}
```

web-ui-components/apps/solid-playground/package.json:

```
{
  "name": "vite-template-solid",
  "version": "0.0.0",
  "description": "",
  "type": "module",
  "scripts": {
    "start": "npm run --prefix ../../packages/ui-solid build && npm install && npm run dev",
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
  "license": "MIT",
  "devDependencies": {
    "typescript": "^5.7.2",
    "vite": "^6.0.0",
    "vite-plugin-solid": "^2.11.6"
  },
  "dependencies": {
    "solid-js": "^1.9.5",
    "ui-solid": "*"
  }
}
```
