**GeniusEngine** – A prompt optimizer that turns raw ideas into expert-level prompts using 20 domain mindsets (Photo, Video, Marketing, Developer, etc.) and optional AI backends (Claude, GPT-4o mini).

## Getting Started

### Environment & API keys

1. Copy the example env file: `cp .env.example .env.local`
2. Add at least one API key (or both):
   - **OpenAI:** [API keys](https://platform.openai.com/api-keys) → set `OPENAI_API_KEY`
   - **Anthropic:** [Console](https://console.anthropic.com/) → set `ANTHROPIC_API_KEY`
3. In the app sidebar, choose **AI Provider** (Claude or GPT-4o mini). Generation will use the selected provider.

### Run locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Push the project to GitHub.
2. In [Vercel](https://vercel.com/new), import the repo and deploy.
3. In the project **Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` (if using OpenAI)
   - `ANTHROPIC_API_KEY` (if using Anthropic)
4. Redeploy so the new env vars are applied.
