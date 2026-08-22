# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


Comments
Use the single-line block comments for major section/logic grouping.

Use JSDoc-style comments (/** ... */) for functions, methods, and lifecycle hooks.

| Location                | Comment Style                     |
| ----------------------- | --------------------------------- |
| Section/block/group     | `// --- Section: description ---` |
| Functions/methods/hooks | `/** JSDoc block comment */`      |


sudo apt update
sudo apt install -y build-essential python3 make g++ libsqlite3-dev

## Commit Messages

Use **Conventional Commits** for local commits and PR titles that merge to `main`.

Format:

```text
<type>(<scope>): <subject>
```

Examples:
- `feat(users): add login`
- `fix(auth): prevent refresh loop on 401`
- `chore(ci): add semantic-release workflow`

Version impact:
- `fix(...)` -> patch
- `feat(...)` -> minor
- `feat!(...)`, `fix!(...)`, or `BREAKING CHANGE:` -> major

Recommended rule:
- use **Squash merge** into `main`
- make the **PR title** follow the same conventional format, because it becomes the final commit on `main`
