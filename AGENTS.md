# Agent Guidelines for Anki-Web

This document provides guidelines for AI agents working on this codebase.

## Project Overview

A React 19 + TypeScript flashcard application (SPA) for English language learning with study mode and card management. Uses Vite as build tool and connects to a local Node.js backend.

## Tech Stack

- React 19.2.0
- TypeScript 5.9.x
- Vite 7.3.x
- Bootstrap 5.3.x
- ESLint 9.39.x (with react-hooks, react-refresh, typescript-eslint)

## Commands

```bash
# Development
npm run dev          # Start Vite dev server at http://localhost:5173

# Build
npm run build        # Run TypeScript check (tsc -b) then Vite build
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint on entire project
npm run lint -- --fix # Auto-fix ESLint issues
```

No test framework is currently configured. Do not add tests unless explicitly requested.

## Code Style Guidelines

### General

- Use **function components** with hooks (useState, useEffect) - no class components
- Use **TypeScript** for all files - no plain JavaScript
- Prefer **const** over let; avoid var
- Use **early returns** to reduce nesting
- Keep components focused and reasonably sized (< 200 lines preferred)

### Imports

- Use **double quotes** for imports: `import React from "react"`
- Order imports logically: React imports → external libs → internal components/styles
- Use **absolute paths** from src (e.g., `import StudyMode from "./Studymode"`)
- Import CSS last: `import "./styles.css"`

```typescript
import React, { useState, useEffect } from "react";
import StudyMode from "./Studymode";
import "./styles.css";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `StudyMode`, `Agregar`)
- **Files**: PascalCase for components (e.g., `Studymode.tsx`), camelCase otherwise
- **Variables/functions**: camelCase
- **Types/interfaces**: PascalCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE for magic values

### TypeScript

- **Always type** function parameters and return values
- Use **interfaces** for object shapes
- Use **union types** for status/state variants
- Enable **strict null checks** - check for null/undefined explicitly

```typescript
export type Card = {
  id: number;
  status: "not-studied" | "learning" | "ready" | "mastered";
  word: string;
  translation: string;
};
```

### React Patterns

- Use **useState** for component-local state
- Use **useEffect** for side effects (data fetching on mount)
- **Destructure** props for cleaner component bodies
- Use **key** prop in lists (use unique id, not index)
- Keep useEffect dependencies accurate - include all used values

```typescript
const [cards, setCards] = useState<Card[]>([]);

useEffect(() => {
  fetch(`${API}/cartas`)
    .then((res) => res.json())
    .then((data) => setCards(data))
    .catch((err) => console.error("Error al cargar cartas:", err));
}, []);
```

### Error Handling

- Use **try/catch** with async/await for API calls
- Log errors with **console.error** (includes user-friendly message in Spanish)
- Show user feedback via **alert()** for critical events

```typescript
async function agregarCards(a: string, b: string) {
  try {
    const res = await fetch(`${API}/cartas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: a, translation: b }),
    });
    const newCard = await res.json();
    setCards([...cards, newCard]);
  } catch (err) {
    console.error("Error al agregar carta:", err);
  }
}
```

### CSS/Styling

- Use **Bootstrap classes** as primary styling (with Bootstrap 5 utility classes)
- Add custom styles in `src/styles.css`
- Use CSS custom properties for theme colors if needed

### API Communication

- Use **fetch** API (not axios)
- Use absolute API URL: `const API = "http://localhost:3000"`
- Set appropriate headers for JSON: `{ "Content-Type": "application/json" }`
- Handle response parsing explicitly: `await res.json()`

## ESLint Rules

The project uses flat ESLint config with these plugins:
- @eslint/js (recommended)
- typescript-eslint (recommended)
- eslint-plugin-react-hooks (recommended)
- eslint-plugin-react-refresh

Run `npm run lint` before committing. Fix errors with `npm run lint -- --fix`.

## File Structure

```
src/
├── main.tsx         # Entry point
├── App.tsx          # Main component with deck management
├── Studymode.tsx   # Flashcard study interface
├── Agregar.tsx     # Add new card form
└── styles.css      # Custom styles
```

## Backend API

Expected endpoints (Node.js backend on port 3000):
- `GET /cartas` - Fetch all cards
- `POST /cartas` - Create new card { word, translation }
- `DELETE /cartas/:id` - Delete card by ID

## Common Tasks

### Adding a new component
1. Create `src/NewComponent.tsx` with PascalCase name
2. Define types inline or in separate `types.ts` if reused
3. Export as default
4. Import in parent with relative path

### Making API calls
1. Use async/await with try/catch
2. Update state on success
3. Log errors with console.error
4. Show user feedback when appropriate

### Styling
1. Prefer Bootstrap classes first
2. Add custom classes in styles.css
3. Use semantic class names (e.g., `.card-item`, `.study-btn`)

## What NOT To Do

- Do not add testing frameworks (Vitest, Jest, etc.) without explicit request
- Do not change the ESLint configuration without justification
- Do not replace Bootstrap with other CSS frameworks
- Do not add routing (React Router) unless requested
- Do not add state management libraries (Redux, Zustand, etc.)
- Do not use console.log for production code (use console.error for errors)
- Do not use any for types - be explicit
