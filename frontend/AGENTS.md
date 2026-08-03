<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Required file documentation

This file is the source of truth for the frontend structure. Every AI agent working in this directory must follow these rules:

1. Whenever you create, copy, rename, move, or delete a project file, update the **Project file map** below in the same change.
2. Record the relative file path and a short, accurate description of its responsibility.
3. Do not list generated or dependency files such as `.next/`, `node_modules/`, or build output.
4. If a file's responsibility changes substantially, update its description.
5. Before finishing a task, verify that the file map matches the actual project structure.

# Project conventions

- The frontend uses Next.js `16.2.12`, React `19.2.4`, and the App Router.
- Application code uses JavaScript and JSX under `src/`.
- Use the `@/*` alias for imports from `src/*`.
- Keep backend communication centralized in `src/lib/api.js` and domain-specific calls in `src/services/`.
- Keep route files small; place reusable interface logic in `src/components/`.
- Do not add a favicon or application icon unless the user explicitly requests one.
- Run `npm.cmd run lint` and `npm.cmd run build` after meaningful frontend changes.

# Project file map

## Application routes

- `src/app/layout.jsx` — Root layout and global metadata.
- `src/app/page.jsx` — Redirects the root route to `/login`.
- `src/app/login/page.jsx` — Login route and authenticated-user redirect.
- `src/app/dashboard/page.jsx` — Authenticated dashboard shell and module navigation state.
- `src/app/globals.css` — Tailwind import and global styles.

## Components

- `src/components/auth/LoginPage.jsx` — Complete login interface and password-reset dialog.
- `src/components/common/ComingSoonView.jsx` — Placeholder view for unfinished POS modules.
- `src/components/dashboard/DashboardView.jsx` — Dashboard metrics, charts, tables, and alerts.
- `src/components/layout/Sidebar.jsx` — Main dashboard navigation sidebar.
- `src/components/layout/TopHeaderBar.jsx` — Dashboard header actions, language selector, and calculator trigger.
- `src/components/modals/CalculatorModal.jsx` — Billing calculator modal.
- `src/components/ui/FormField.jsx` — Reusable labelled form-field wrapper.
- `src/components/ui/InputIcon.jsx` — Reusable leading input icon wrapper.

## Data, API, and services

- `src/data/mockData.js` — Temporary dashboard demonstration data.
- `src/lib/api.js` — Central HTTP client for the Laravel backend.
- `src/lib/auth-storage.js` — Browser token and authenticated-user storage.
- `src/services/auth.service.js` — Login, logout, and password-reset operations.

## Static assets

- `public/images/pharmadesk_logo_1785561988066.jpg` — PharmaDesk logo used on the login page.
- `public/images/pharmacy_hero_banner_1785561974272.jpg` — Login-page pharmacy hero image.
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — Default Next.js public assets retained by the project.

## Configuration and documentation

- `.env.example` — Example frontend environment variables for mock authentication and Laravel API access.
- `.gitignore` — Frontend Git ignore rules.
- `AGENTS.md` — AI instructions and maintained project file map.
- `CLAUDE.md` — Additional repository guidance.
- `eslint.config.mjs` — ESLint configuration.
- `jsconfig.json` — JavaScript import alias configuration.
- `next.config.mjs` — Next.js configuration.
- `package.json` — Scripts, dependencies, and supported Node.js version.
- `package-lock.json` — Locked npm dependency graph.
- `postcss.config.mjs` — Tailwind CSS PostCSS configuration.
- `README.md` — Frontend setup and usage documentation.
