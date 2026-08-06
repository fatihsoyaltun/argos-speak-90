This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

## ElevenLabs Audio

The Listen module uses the internal `/api/tts` route for reliable audio playback.
Configure these server-side environment variables to enable ElevenLabs:

Copy `.env.example` to `.env.local`, replace the placeholders only in
`.env.local`, and keep that local file untracked:

```bash
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
ELEVENLABS_MODEL_ID=eleven_flash_v2_5
```

`ELEVENLABS_MODEL_ID` is optional and defaults to `eleven_flash_v2_5`.
If the API key or voice ID is missing, the app shows a safe Turkish fallback
instead of broken playback controls.

After changing any ElevenLabs env var, restart the Next.js dev server so the
server route can read the new values.

Quick checks:

- The API key must be an ElevenLabs server-side API key with text-to-speech
  access.
- The voice ID must belong to a voice that the API key can use.
- If `/api/tts` returns `upstream_account_restricted`,
  `upstream_unauthorized`, `upstream_voice_not_found`, or
  `upstream_model_error`, check the JSON response in development for the safe
  `devDetail` field. It includes the upstream status and message without
  exposing the API key.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
