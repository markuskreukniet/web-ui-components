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
12. add `import { HelloWorld } from 'ui-solid';`, `<HelloWorld />`, and `import 'ui-solid/styles.css'` to web-ui-components/apps/solid-playground/src/App.tsx
13. change the web-ui-components/packages/ui-solid/vite.config.ts with the content from below

14. add or change these files with contents from below:

- web-ui-components/tsconfig.base.json
- web-ui-components/packages/tsconfig.package.json
- web-ui-components/packages/ui-solid/tsconfig.json
- web-ui-components/packages/ui-solid/tsconfig.app.json
- web-ui-components/packages/ui-solid/tsconfig.build.json
- web-ui-components/apps/tsconfig.app.json
- web-ui-components/apps/solid-playground/tsconfig.json

15. remove these files:

- web-ui-components/packages/ui-solid/tsconfig.node.json
- web-ui-components/packages/ui-solid/App.css
- web-ui-components/packages/ui-solid/App.tsx
- web-ui-components/packages/ui-solid/index.css
- web-ui-components/packages/ui-solid/index.tsx

16. change web-ui-components/packages/ui-solid/package.json with the content from below
17. add web-ui-components/packages/ui-solid/build/prepare-css.js with the content from below
18. web-ui-components: npm install
19. web-ui-components/packages/ui-solid: npm run build
20. remove web-ui-components/packages/ui-solid/index.html
21. change web-ui-components/apps/solid-playground/package.json with the content from below

pnpm version:

1. web-ui-components: pnpm init
2. add `"private": true,` to web-ui-components/package.json
3. add the web-ui-components/pnpm-workspace.yaml with the content from below
4. web-ui-components/apps/solid-playground: pnpx degit solidjs/templates/ts .
5. same as the npm version
6. web-ui-components/packages/ui-solid: pnpm create vite . --template solid-ts
7. same as the npm version
8. same as the npm version
9. same as the npm version
10. same as the npm version
11. add `"dependencies": {"ui-solid": "workspace:*"}` to web-ui-components/apps/solid-playground/package.json
12. same as the npm version
13. same as the npm version
14. same as the npm version
15. same as the npm version
16. same as the npm version
17. same as the npm version
18. web-ui-components: pnpm install
19. web-ui-components/packages/ui-solid: pnpm build
20. same as the npm version
21. same as the npm version

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
    "emitDeclarationOnly": true,
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
