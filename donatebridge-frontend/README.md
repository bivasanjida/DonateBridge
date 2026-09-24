# DonateBridge Frontend

## Setup

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` when the API is not running at `http://localhost:4000/api`.

## Routes

`/` landing page, `/browse` public item browsing, `/login`, `/register`, `/profile`, `/create-item`, `/edit-item/:id`, `/my-items`, and `/ngo-dashboard`.

The donor pages require the Donor role. Profile and NGO dashboard require authentication, while browse and landing are public.

## Components

`NavBar` provides navigation and profile actions, `ProtectedRoute` handles access control, and `Button` provides shared form actions.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
