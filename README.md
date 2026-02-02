# Food Hub — Frontend

This repository contains the Next.js frontend for Food Hub — a marketplace for providers to list meals and customers to browse and order.

## Requirements

- Node.js 18+ (LTS recommended)
- pnpm or npm

## Quick Start (development)

Install dependencies and run the dev server:

```bash
# using pnpm (recommended)
pnpm install
pnpm dev

# or using npm
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## Project Structure (high level)

```
app/               # Next.js App Router pages & layouts
components/        # UI components
lib/               # Utilities and helpers
public/            # Static assets
```

## Environment

Create a `.env.local` file for frontend config (example keys):

- `NEXT_PUBLIC_API_URL` — URL of the backend API (e.g. `http://localhost:4000/api/v1`)

Keep secrets out of the repository.

## Backend

This frontend expects the Food Hub backend API to be available. See the `food-hub-backend` folder for the backend implementation and API docs.

## Deployment

Build and serve the app:

```bash
npm run build
npm run start
```

Deploy to Vercel, Netlify, or any hosting that supports Next.js App Router.

## Contributing

Open issues or create pull requests. For local development, run both backend and frontend and point `NEXT_PUBLIC_API_URL` to your backend.