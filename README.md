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
│   │   │   └── modules/
│   │   │       └── toasts/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── ui-solid/                   # SolidJS-based UI components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── buttons/
│   │   │   └── modules/
│   │   │       └── toasts/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── ui-core/                    # Shared styles and logic utilities
│   │   ├── src/
│   │   │   ├── monads/
│   │   │   │   └── either.ts
│   │   │   ├── utils/
│   │   │   │   └── errors.ts
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

## Naming Conventions

This section defines consistent naming standards for files, identifiers, component props, and event handlers to promote code clarity and maintainability.

### 1. File Naming

- **`.ts` files**: Use _kebab-case_ for TypeScript modules that do not contain JSX or define React components.  
  _Examples_: `data-utils.ts`, `api-service.ts`

- **`.tsx` files**: Use _PascalCase_ (also known as _UpperCamelCase_) for files that define React components or include JSX content.  
  _Examples_: `UserProfile.tsx`, `LoginForm.tsx`

This distinction enhances readability and clearly separates utility modules from UI components.

### 2. Identifier Naming

Use clear and descriptive terms for naming functions, variables, and constants. The following terms are recommended to reflect common behaviors and states:

- **selected** – An item that has been chosen or is currently active.
- **show** – An action that makes an element visible.
- **previous**, **current**, **next** – Denote position or sequence, particularly in navigation or state transitions.
- **update** – Indicates data or state modification.

Consistent use of these terms improves code readability and semantic understanding.

If a function type is used in multiple places, consider defining a separate type for it to improve clarity and reusability. In such cases, name the type the same as the function, but with the first letter capitalized. This should be done when it adds meaningful structure to the codebase and avoids unnecessary duplication.

### 3. Component Prop Naming

Component properties that accept callbacks should follow a standardized prefix based on the nature of the interaction:

- Use the **`onChange`** prefix for passive updates (e.g., selection or data changes).
- Use the **`onPress`** prefix for user-triggered actions such as button clicks or taps.

This naming convention communicates the intent and interaction model of the component API.

### 4. Event Handler Naming

Event handler functions—typically passed to `onChange`, `onPress`, and similar props—should be named with the `handler` prefix:

- Use `const handlerX = () => {}` syntax, where `X` describes the specific interaction.
- For example: `handlerSelectedRows`, `handlerPress`.

This pattern makes it explicit that the function handles a specific UI event, enhancing maintainability and traceability within the component structure.

## CSS Style Guide

- **Use CSS classes exclusively for all styling purposes.** Reserve IDs strictly for JavaScript-related behavior, such as DOM manipulation and event handling. This separation of concerns reduces CSS specificity issues and supports a maintainable, scalable codebase.

- **Do not use CSS margins.** Margins can introduce unpredictable layout behavior due to issues such as margin collapse, overflow clipping, and inconsistent spacing. Instead, use layout mechanisms like padding, the `gap` property (in Flexbox or Grid), or standardized spacing utilities.  
  References: [Max Stoiber](https://mxstbr.com/thoughts/margin), [Josh Comeau](https://www.joshwcomeau.com/css/rules-of-margin-collapse/)

- **Prefer `mousedown` over `click` for event handling.** Using `mousedown` provides more immediate feedback and improves responsiveness, particularly in performance-sensitive contexts such as games or interactive interfaces.  
  Reference: [John Carmack](https://x.com/id_aa_carmack/status/1787850053912064005)
