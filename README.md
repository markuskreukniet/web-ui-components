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

## Naming Conventions

// TODO: check with AI

### File Naming

- `.ts` files: Use _kebab-case_ for all TypeScript modules that do not contain JSX or define React components. Examples: `data-utils.ts`, `api-service.ts`.

- `.tsx` files: Use _PascalCase_ (also known as _UpperCamelCase_) for all files that define React components or include JSX content. Examples: `UserProfile.tsx`, `LoginForm.tsx`.

This convention enhances code readability and enforces a clear distinction between utility modules and React components, thereby supporting a maintainable and scalable codebase.

// TODO: WIP and check with AI

### Identifier Naming

When naming functions, variables, and related identifiers, use clear and descriptive terms that reflect their purpose and behavior. The following words are recommended for consistent and meaningful naming across the codebase:

- selected – Indicates an item that has been chosen or is currently active.

- show – Suggests an action that makes an element visible.

- previous, current, next – Denote position or sequence, particularly in navigation or state management contexts.

- update – Refers to an operation that modifies or refreshes data or state.

Consistent use of these terms promotes code readability and facilitates long-term maintenance.

## CSS Style Guide

- Use CSS classes exclusively for all styling purposes. Reserve IDs solely for JavaScript-related behavior, such as DOM manipulation and event handling. This practice enforces a strict separation of concerns, mitigates CSS specificity issues, and promotes a maintainable, scalable codebase.
