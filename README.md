# web-ui-components

```
web-ui-components/
├── docs/
│   └── bootstrapping.md            # Initial project setup notes
├── packages/
│   ├── ui-react/                   # React-based UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── buttons/
│   │   │   ├── modules/
│   │   │   │   └── toasts/
│   │   │   ├── internal/           # Internal-only code for development; excluded from the public API
│   │   │   │   ├── components/
│   │   │   │   └── modules/
│   │   │   └── index.ts            # Module entry point: re-exports public TypeScript modules and components only; no side-effect imports (e.g., global CSS)
│   │   ├── build/                  # TODO: comment
│   │   │       └── prepare-css.js  # TODO: comment. Also comment why it is a js file, to keep it simpler. Changing to ts is not ideal since it mixes implementation code with tooling.
│   │   ├── dist/                   # Generated build outputs excluded from source control.
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── ui-solid/                   # SolidJS-based UI components, mirroring the structure of the ui-react/ directory.
│   ├── ui-core/                    # Shared styles and logic utilities
│   │   ├── src/
│   │   │   ├── monads/
│   │   │   │   └── either.ts
│   │   │   ├── utils/              # Framework-agnostic utility modules organized under ui-core, rather than modules/, to reflect their shared use across UI implementations.
│   │   │   │   └── errors.ts
│   │   │   ├── types/              # Framework-agnostic type definitions in ui-core, rather than modules/, to reflect their shared use across UI implementations.
│   │   │   └── styles/
│   │   │       ├── index.css       # Entry point (e.g. @import './base.css')
│   │   │       └── base.css
│   │   ├── package.json
│   │   └── vite.config.ts
├── apps/
│   ├── react-playground/
│   └── solid-playground/
├── package-lock.json
├── package.json                    # Root workspace configuration
├── pnpm-lock.yaml                  # Generated lockfile (only present in a pnpm-managed project)
├── pnpm-workspace.yaml             # Workspace configuration (only present in a pnpm-managed project)
├── tsconfig.json                   # Shared TypeScript settings
├── .gitignore
└── README.md
```

// TODO: WIP check with AI

# Codebase Standards

This document outlines conventions and patterns used in this codebase to ensure consistency, clarity, and maintainability.

---

## 🧩 Component and Module Architecture

### 🔷 Component Definition

A **component** is any function that **returns JSX**. Components represent UI elements or structures and are intended to be rendered within the application's view hierarchy.

> **Rule:** If a function returns JSX, it is a component.

#### Characteristics:

- Returns JSX or HTML-like structure.
- May accept `props` to configure behavior or appearance.
- Can manage local state, lifecycle, or event handling.
- Is composable with other components.

#### Naming Convention:

- Functions that return JSX should be prefixed with `render`.  
  _Examples_: `renderPanel`, `renderHeader`, `renderListItem`.

---

### 📦 Module Definition

A **module** is a TypeScript file (or group of files) that encapsulates **logic, behavior, or shared state**. Modules do not return JSX and are not responsible for rendering UI directly. Instead, they support components or other modules.

> **Rule:** If a file does **not** return JSX and exists to handle logic, state, or utilities, it is a module.

#### Characteristics:

- Does **not** return JSX.
- May define functions, stores, hooks, contexts, or utility logic.
- Can support one or more components.
- Should be grouped logically within a feature-specific or domain-oriented folder.

Modules form the **behavioral and architectural foundation** of an application. They may exist independently or in support of one or more components.

---

> A module can consist of a single `.ts` file or a cohesive group of `.ts` and `.tsx` files. Grouping should be based on functionality, not file count or nesting structure.

---

## 📦 TypeScript Import Style

We enable `verbatimModuleSyntax: true` in our TypeScript configuration to enforce explicit separation of type-only imports.

As a result, **do not** mix runtime and type imports in a single statement like:

```ts
// ❌ Not allowed
import { runtimeA, runtimeB, type TypeA } from "module";
```

Use separate import declarations instead:

```ts
// ✅ Correct
import { runtimeA, runtimeB } from "module";
import type { TypeA } from "module";
```

### 📏 Line Length

All code lines must not exceed **120 characters** in length.

> **Rule:** Each line of code should be kept within a maximum of 120 characters to maintain readability and facilitate side-by-side editing, code review, and consistent formatting across tools.

This limit applies to all source files, including TypeScript, JavaScript, JSX, and CSS. Use line breaks and extraction to maintain this constraint where necessary.

## 🔤 Naming Conventions

This section defines consistent naming standards for files, identifiers, component props, and event handlers to promote code clarity and maintainability.

### 1. File Naming

- **`.ts` files**: Use _kebab-case_ for TypeScript modules that do not contain JSX or define React components.
  _Examples_: `data-utils.ts`, `api-service.ts`

- **`.tsx` files**: Use _PascalCase_ (also known as _UpperCamelCase_) for files that define React components or include JSX content.
  _Examples_: `UserProfile.tsx`, `LoginForm.tsx`

This distinction enhances readability and clearly separates utility modules from UI components.

---

### 2. Identifier Naming

Use clear and descriptive terms for naming functions, variables, and constants. The following terms are recommended to reflect common behaviors and states:

- **selected** – An item that has been chosen or is currently active.
- **show** – An action that makes an element visible.
- **previous**, **current**, **next** – Denote position or sequence, particularly in navigation or state transitions.
- **update** – Indicates data or state modification.
- **render** – Prefix for functions that return JSX. Use `render` to clearly indicate that a function produces a UI element.

Consistent use of these terms improves code readability and semantic understanding.

If a function type is used in multiple places, consider defining a separate type for it to improve clarity and reusability. In such cases, name the type the same as the function, but with the first letter capitalized. This should be done when it adds meaningful structure to the codebase and avoids unnecessary duplication.

---

### 🧾 Function Result Naming

If a function returns a **unique result structure specific to that function**, name the result using the function name with a `Result` suffix.

> **Rule:** When a function’s return type is uniquely tied to its purpose, append `Result` to the function name to form the name of the result type or object.

#### Example:

```ts
function detectDuplicateFiles(...): DetectDuplicateFilesResult { ... }
```

This improves clarity, reinforces semantic ties between functions and their outputs, and reduces ambiguity when dealing with multiple result types.

---

### 3. Component Prop Naming

Component properties that accept callbacks should follow a standardized prefix based on the nature of the interaction:

- Use the **`onChange`** prefix for passive updates (e.g., selection or data changes).
- Use the **`onPress`** prefix for user-triggered actions such as button clicks or taps.

This naming convention communicates the intent and interaction model of the component API.

---

### 4. Event Handler Naming

Event handler functions—typically passed to `onChange`, `onPress`, and similar props—should be named with the `handler` prefix:

- Use `const handlerX = () => {}` syntax, where `X` describes the specific interaction.
- For example: `handlerSelectedRows`, `handlerPress`.

This pattern makes it explicit that the function handles a specific UI event, enhancing maintainability and traceability within the component structure.

---

## 🎨 CSS Style Guide

- **Use CSS classes exclusively for all styling purposes.** Reserve IDs strictly for JavaScript-related behavior, such as DOM manipulation and event handling. This separation of concerns reduces CSS specificity issues and supports a maintainable, scalable codebase.

- **Do not use CSS margins.** Margins can introduce unpredictable layout behavior due to issues such as margin collapse, overflow clipping, and inconsistent spacing. Instead, use layout mechanisms like padding, the `gap` property (in Flexbox or Grid), or standardized spacing utilities.
  References: [Max Stoiber](https://mxstbr.com/thoughts/margin), [Josh Comeau](https://www.joshwcomeau.com/css/rules-of-margin-collapse/)

- **Prefer `mousedown` over `click` for event handling.** Using `mousedown` provides more immediate feedback and improves responsiveness, particularly in performance-sensitive contexts such as games or interactive interfaces.
  Reference: [John Carmack](https://x.com/id_aa_carmack/status/1787850053912064005)

---

> These conventions support consistency across UI, logic, and state layers, and are foundational to a maintainable codebase.

## TODO

- add function return types
- Is the project naming still correct since there are modules and components?
- check naming in all files
- make UI core project
- Add a toggle to make it possible to remove all rows in a group?
- Add a toggle to show removed rows
- Use context instead of prop down drilling? Also update README then
- if too many error in error toast, show scrollbar
- fix/check tsconfig files and use extending of files
- add dependency "@types/node"?
- change dist-tsc, dist-vite, en dist-styles to dist with sub folders? Then also update gitignore
- update bootstrapping.md with styles, possible when there is the UI core project
- remove all useless files from ui-solid
- check for ARIA and role=
- add to solid-playground .gitignore?
